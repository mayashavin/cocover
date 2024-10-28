import TelemetryReporter from "@vscode/extension-telemetry";

const connectionString = process.env.TELEMETRY;

let reporter: TelemetryReporter | null = null;

export const initTelemetry = () => {
  if (!connectionString) {
    console.log("No telemetry connection string found.");
    return;
  }

  if (reporter) {
    return reporter;
  }

  reporter = new TelemetryReporter(connectionString);

  return reporter;
};
