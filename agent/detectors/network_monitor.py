"""
network_monitor.py — Module 3: Suspicious Network Activity Detection

Every 10 seconds, reads active TCP connections via `ss -tnp` (or `netstat`)
and compares destination IPs against a blacklist.txt file.
If a connection to a blacklisted IP is found, an alert is triggered.
"""

import os
import re
import time
import uuid
import subprocess
import logging
from datetime import datetime, timezone

from responder import respond
from sender import send_alert

logger = logging.getLogger("detector.network_monitor")

SCAN_INTERVAL = 10  # seconds

# Path to the blacklist file (one IP per line)
BLACKLIST_PATH = os.path.join(os.path.dirname(__file__), "..", "blacklist.txt")

# Regex to extract destination IP:port from ss output
# ss output format: "ESTAB  0  0  10.0.0.5:43210  93.184.216.34:4444"
SS_DEST_RE = re.compile(
    r"(\d+\.\d+\.\d+\.\d+):(\d+)\s*$"
)


def _load_blacklist():
    """
    Load blacklisted IPs from blacklist.txt.
    Returns a set of IP strings. Ignores blank lines and comments (#).
    """
    blacklist = set()
    resolved_path = os.path.abspath(BLACKLIST_PATH)

    try:
        with open(resolved_path, "r") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#"):
                    blacklist.add(line)
        logger.info("Loaded %d IPs from blacklist (%s)", len(blacklist), resolved_path)
    except FileNotFoundError:
        logger.warning(
            "Blacklist file not found at %s — detector will run but match nothing.",
            resolved_path,
        )

    return blacklist


def _get_active_connections():
    """
    Run `ss -tnp` to get active TCP connections.
    Falls back to `netstat -tnp` if ss is not available.
    Returns a list of (dest_ip, dest_port, line) tuples.
    """
    connections = []

    try:
        result = subprocess.run(
            ["ss", "-tnp"],
            capture_output=True, text=True, timeout=10,
        )
        output = result.stdout
    except FileNotFoundError:
        # ss not available, try netstat
        try:
            result = subprocess.run(
                ["netstat", "-tnp"],
                capture_output=True, text=True, timeout=10,
            )
            output = result.stdout
        except FileNotFoundError:
            logger.error("Neither 'ss' nor 'netstat' is available on this system.")
            return connections

    for line in output.splitlines():
        # Look for ESTABLISHED connections
        if "ESTAB" not in line and "ESTABLISHED" not in line:
            continue

        match = SS_DEST_RE.search(line)
        if match:
            dest_ip = match.group(1)
            dest_port = int(match.group(2))
            connections.append((dest_ip, dest_port, line.strip()))

    return connections


def start_network_monitor(config):
    """
    Entry point called by main.py in its own thread.

    Every SCAN_INTERVAL seconds, reads active TCP connections and
    checks destination IPs against the blacklist. If a match is found,
    fires an alert.

    Args:
        config: dict with keys
            - demo_mode (bool): simulate or execute responses
            - backend_url (str): backend API base URL
    """
    logger.info("Network monitor started (interval=%ds)", SCAN_INTERVAL)

    # Load the blacklist once at startup
    blacklist = _load_blacklist()

    # Track IPs already alerted to avoid alert floods
    alerted_ips = set()

    while True:
        # Reload the blacklist periodically so updates are picked up
        blacklist = _load_blacklist()

        try:
            connections = _get_active_connections()

            for dest_ip, dest_port, raw_line in connections:
                if dest_ip in blacklist and dest_ip not in alerted_ips:
                    alerted_ips.add(dest_ip)

                    alert = {
                        "id": str(uuid.uuid4()),
                        "type": "network_anomaly",
                        "severity": "MEDIUM",
                        "ip": dest_ip,
                        "process": None,
                        "action": None,        # Will be set by responder
                        "reason": (
                            f"Connection to blacklisted IP detected: "
                            f"{dest_ip}:{dest_port} (matched blacklist.txt)"
                        ),
                        "timestamp": datetime.now(timezone.utc).isoformat(),
                    }

                    logger.warning("🚨 ALERT — %s", alert["reason"])

                    # Respond (block IP or simulate)
                    respond(alert, config)

                    # Send alert to backend
                    send_alert(alert, config)

        except Exception as exc:
            logger.error("Network monitor scan error: %s", exc)

        # Reset alerted IPs every cycle so new connections get flagged
        # (keeps one alert per IP per scan cycle, not per lifetime)
        alerted_ips.clear()

        time.sleep(SCAN_INTERVAL)
