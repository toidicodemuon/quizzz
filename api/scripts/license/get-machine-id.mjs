import machineIdPackage from "node-machine-id";

const { machineIdSync } = machineIdPackage;

try {
  const id = machineIdSync();
  console.log(id);
} catch (err) {
  console.error(`Failed to read machine id: ${String(err)}`);
  process.exit(1);
}
