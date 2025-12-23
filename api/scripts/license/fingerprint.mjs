import crypto from "crypto";
import os from "os";
import { execSync } from "child_process";
import machineIdPackage from "node-machine-id";

export const DEFAULT_FINGERPRINT_KEYS = [
  "machineId",
  "machineGuid",
  "biosUuid",
  "baseboardSerial",
  "cpuId",
  "diskSerials",
];

const INVALID_VALUES = new Set([
  "",
  "to be filled by o.e.m.",
  "default string",
  "none",
  "not specified",
  "n/a",
  "unknown",
]);

function normalizeValue(raw) {
  if (!raw) return null;
  const cleaned = String(raw).trim();
  if (!cleaned) return null;
  if (INVALID_VALUES.has(cleaned.toLowerCase())) return null;
  return cleaned;
}

function safeExec(command) {
  try {
    return execSync(command, {
      stdio: ["ignore", "pipe", "ignore"],
      windowsHide: true,
    })
      .toString()
      .trim();
  } catch {
    return "";
  }
}

function readWmicValues(command, key) {
  const output = safeExec(command);
  if (!output) return [];
  const lines = output.split(/\r?\n/).map((line) => line.trim());
  const keyLower = key.toLowerCase();
  const values = [];
  for (const line of lines) {
    if (!line || !line.includes("=")) continue;
    const [k, v] = line.split("=").map((part) => part.trim());
    if (k.toLowerCase() !== keyLower) continue;
    const normalized = normalizeValue(v);
    if (normalized) values.push(normalized);
  }
  return values;
}

function readSingleValue(wmicCommand, wmicKey, psCommand) {
  const wmicValues = readWmicValues(wmicCommand, wmicKey);
  if (wmicValues.length) return wmicValues[0];
  if (!psCommand) return null;
  const psOutput = safeExec(psCommand);
  return normalizeValue(psOutput.split(/\r?\n/)[0]);
}

function readMachineGuid() {
  const output = safeExec(
    'reg query "HKLM\\SOFTWARE\\Microsoft\\Cryptography" /v MachineGuid'
  );
  const match = output.match(/MachineGuid\\s+REG_SZ\\s+([^\\s]+)/i);
  return normalizeValue(match?.[1]);
}

function readDiskSerials() {
  const wmicValues = readWmicValues(
    "wmic diskdrive get serialnumber /value",
    "SerialNumber"
  );
  const normalized = wmicValues
    .map((value) => normalizeValue(value))
    .filter(Boolean);
  const unique = Array.from(new Set(normalized));
  return unique.sort();
}

function readMacs() {
  const interfaces = os.networkInterfaces();
  const macs = [];
  for (const entries of Object.values(interfaces)) {
    for (const entry of entries || []) {
      if (!entry || entry.internal) continue;
      const mac = normalizeValue(entry.mac);
      if (!mac || mac === "00:00:00:00:00:00") continue;
      macs.push(mac.toLowerCase());
    }
  }
  const unique = Array.from(new Set(macs));
  return unique.sort();
}

export function collectFingerprintParts() {
  const parts = {};
  const { machineIdSync } = machineIdPackage;

  try {
    const machineId = normalizeValue(machineIdSync());
    if (machineId) parts.machineId = machineId;
  } catch {
    // ignore machineId failures
  }

  const machineGuid = readMachineGuid();
  if (machineGuid) parts.machineGuid = machineGuid;

  const biosUuid = readSingleValue(
    "wmic csproduct get uuid /value",
    "UUID",
    'powershell -NoProfile -Command "(Get-CimInstance -ClassName Win32_ComputerSystemProduct).UUID"'
  );
  if (biosUuid) parts.biosUuid = biosUuid;

  const baseboardSerial = readSingleValue(
    "wmic baseboard get serialnumber /value",
    "SerialNumber",
    'powershell -NoProfile -Command "(Get-CimInstance -ClassName Win32_BaseBoard).SerialNumber"'
  );
  if (baseboardSerial) parts.baseboardSerial = baseboardSerial;

  const cpuId = readSingleValue(
    "wmic cpu get processorid /value",
    "ProcessorId",
    'powershell -NoProfile -Command "(Get-CimInstance -ClassName Win32_Processor).ProcessorId"'
  );
  if (cpuId) parts.cpuId = cpuId;

  const diskSerials = readDiskSerials();
  if (diskSerials.length) parts.diskSerials = diskSerials.join("|");

  const macs = readMacs();
  if (macs.length) parts.macs = macs.join("|");

  return parts;
}

export function getFingerprint(keys = DEFAULT_FINGERPRINT_KEYS) {
  const parts = collectFingerprintParts();
  const uniqueKeys = Array.from(
    new Set(keys.map((key) => String(key).trim()).filter(Boolean))
  );
  const availableKeys = uniqueKeys.filter((key) => Boolean(parts[key]));
  availableKeys.sort();
  if (!availableKeys.length) {
    throw new Error("No fingerprint sources available on this machine.");
  }
  const payload = availableKeys.map((key) => `${key}=${parts[key]}`).join("|");
  const fingerprint = crypto
    .createHash("sha256")
    .update(payload, "utf8")
    .digest("hex");
  return { fingerprint, parts, keys: availableKeys };
}
