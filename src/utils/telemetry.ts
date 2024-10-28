import TelemetryReporter from "@vscode/extension-telemetry";

const connectionString =
  "InstrumentationKey=51d85845-531b-4bc4-8de9-c71c67549782;IngestionEndpoint=https://centralus-2.in.applicationinsights.azure.com/;LiveEndpoint=https://centralus.livediagnostics.monitor.azure.com/;ApplicationId=d03de407-6132-4bbd-8c92-f8c68059c894";

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
