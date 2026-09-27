from __future__ import annotations

import argparse
import concurrent.futures
import datetime as dt
import hashlib
import json
import shutil
import sys
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ARCHIVE = ROOT.parent / "天工创世-发布" / "01-整合包" / "天工创世-1.1.1-CurseForge.zip"
RESOLVED = ROOT / "_excluded" / "curseforge_resolved.json"
LOCAL_MODS = ROOT / "mods"
REPORT_DIR = ROOT / "_excluded"
USER_AGENT = "TianGongReleaseValidator/1.0"
URL_SAFE = "-_.!~*'()"
RETRIES = 4


def load_inputs():
    with zipfile.ZipFile(ARCHIVE) as zf:
        manifest = json.loads(zf.read("manifest.json").decode("utf-8"))
        bundled = sorted(
            Path(name).name
            for name in zf.namelist()
            if name.lower().startswith("overrides/mods/") and name.lower().endswith(".jar")
        )
    resolved = json.loads(RESOLVED.read_text(encoding="utf-8"))
    by_file_id = {str(meta["fileID"]): (name, meta) for name, meta in resolved.items()}
    entries = []
    for item in manifest["files"]:
        file_id = str(item["fileID"])
        if file_id not in by_file_id:
            raise RuntimeError(f"manifest fileID {file_id} is absent from resolved mapping")
        name, meta = by_file_id[file_id]
        entries.append(
            {
                "name": name,
                "project_id": item["projectID"],
                "file_id": item["fileID"],
                "required": item.get("required", False),
                "url": (
                    "https://mediafilez.forgecdn.net/files/"
                    f"{item['fileID'] // 1000}/{item['fileID'] % 1000}/"
                    f"{urllib.parse.quote(name, safe=URL_SAFE)}"
                ),
            }
        )
    if len(entries) != len({e["file_id"] for e in entries}):
        raise RuntimeError("duplicate fileID in manifest")
    if len(bundled) != len(set(bundled)):
        raise RuntimeError("duplicate bundled mod filename in archive")
    return manifest, entries, bundled


def sha256_path(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest().upper()


def open_with_retry(request: urllib.request.Request, timeout: int = 45):
    last_error = None
    for attempt in range(RETRIES):
        try:
            return urllib.request.urlopen(request, timeout=timeout)
        except urllib.error.HTTPError as exc:
            last_error = exc
            if exc.code not in (403, 408, 425, 429, 500, 502, 503, 504):
                raise
        except (urllib.error.URLError, TimeoutError) as exc:
            last_error = exc
        if attempt + 1 < RETRIES:
            time.sleep(1.5 * (attempt + 1))
    raise last_error


def validate_range(entry: dict) -> dict:
    request = urllib.request.Request(
        entry["url"],
        headers={"User-Agent": USER_AGENT, "Range": "bytes=0-0", "Accept-Encoding": "identity"},
    )
    started = time.monotonic()
    with open_with_retry(request) as response:
        first = response.read(1)
        status = response.status
        content_range = response.headers.get("Content-Range", "")
        content_length = response.headers.get("Content-Length")
    if status not in (200, 206) or not first:
        raise RuntimeError(f"unexpected status={status}, first_byte={first!r}")
    return {
        **entry,
        "status": status,
        "content_range": content_range,
        "content_length": content_length,
        "seconds": round(time.monotonic() - started, 3),
    }


def validate_full(entry: dict, temp_root: Path) -> dict:
    destination = temp_root / entry["name"]
    request = urllib.request.Request(
        entry["url"],
        headers={"User-Agent": USER_AGENT, "Accept-Encoding": "identity"},
    )
    started = time.monotonic()
    digest = hashlib.sha256()
    downloaded = 0
    with open_with_retry(request) as response, destination.open("wb") as output:
        if response.status != 200:
            raise RuntimeError(f"unexpected full-download status={response.status}")
        while True:
            chunk = response.read(1024 * 1024)
            if not chunk:
                break
            output.write(chunk)
            digest.update(chunk)
            downloaded += len(chunk)
    expected_length = response.headers.get("Content-Length")
    if expected_length is not None and downloaded != int(expected_length):
        raise RuntimeError(f"short download: got {downloaded}, expected {expected_length}")

    local = LOCAL_MODS / entry["name"]
    if not local.is_file():
        raise RuntimeError("matching local mod is missing")
    local_size = local.stat().st_size
    local_hash = sha256_path(local)
    remote_hash = digest.hexdigest().upper()
    if local_size != downloaded:
        raise RuntimeError(f"size mismatch: local={local_size}, remote={downloaded}")
    if local_hash != remote_hash:
        raise RuntimeError(f"hash mismatch: local={local_hash}, remote={remote_hash}")
    return {
        **entry,
        "status": response.status,
        "bytes": downloaded,
        "sha256": remote_hash,
        "seconds": round(time.monotonic() - started, 3),
    }


def write_report(report: dict) -> Path:
    stamp = dt.datetime.now().strftime("%Y%m%d_%H%M%S")
    path = REPORT_DIR / f"release_download_audit_{stamp}.json"
    path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    return path


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--full", action="store_true", help="download every remote file and compare SHA-256")
    parser.add_argument("--workers", type=int, default=8)
    args = parser.parse_args()

    manifest, entries, bundled = load_inputs()
    expected_bundled = 57
    if len(entries) != 175:
        raise RuntimeError(f"expected 175 remote files, found {len(entries)}")
    if len(bundled) != expected_bundled:
        raise RuntimeError(f"expected {expected_bundled} bundled jars, found {len(bundled)}")

    temp_root = None
    failures = []
    results = []
    try:
        if args.full:
            temp_root = Path(tempfile.mkdtemp(prefix="release_download_audit_", dir=REPORT_DIR))
        worker = validate_full if args.full else validate_range
        with concurrent.futures.ThreadPoolExecutor(max_workers=max(1, args.workers)) as pool:
            futures = {
                pool.submit(worker, entry, temp_root) if args.full else pool.submit(worker, entry): entry
                for entry in entries
            }
            completed = 0
            for future in concurrent.futures.as_completed(futures):
                entry = futures[future]
                completed += 1
                try:
                    results.append(future.result())
                except Exception as exc:
                    failures.append({**entry, "error": f"{type(exc).__name__}: {exc}"})
                if completed % 20 == 0 or completed == len(entries):
                    print(f"checked {completed}/{len(entries)}; failures={len(failures)}", flush=True)
    finally:
        if temp_root is not None and temp_root.exists():
            resolved = temp_root.resolve()
            allowed = REPORT_DIR.resolve()
            if resolved.is_relative_to(allowed):
                shutil.rmtree(resolved)
            else:
                raise RuntimeError(f"refusing to remove unexpected temp path: {resolved}")

    report = {
        "generated_at": dt.datetime.now().astimezone().isoformat(timespec="seconds"),
        "archive": str(ARCHIVE),
        "archive_sha256": sha256_path(ARCHIVE),
        "pack": manifest.get("name"),
        "version": manifest.get("version"),
        "mode": "full" if args.full else "range",
        "remote_expected": len(entries),
        "remote_passed": len(results),
        "remote_failed": len(failures),
        "bundled_expected": expected_bundled,
        "bundled_found": len(bundled),
        "total_remote_bytes": sum(item.get("bytes", 0) for item in results),
        "results": sorted(results, key=lambda item: item["name"].lower()),
        "failures": sorted(failures, key=lambda item: item["name"].lower()),
        "bundled_mods": bundled,
    }
    output = write_report(report)
    print(json.dumps({k: v for k, v in report.items() if k not in ("results", "bundled_mods")}, ensure_ascii=False, indent=2))
    print(f"report={output}")
    if failures:
        for failure in failures:
            print(f"FAIL {failure['name']}: {failure['error']}")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())