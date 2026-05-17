export const STATUS_SEVERITIES = {
  available: "var(--status-available)",
  busy: "var(--status-busy)",
};

export const statusConfig = {
  indicatorSeverity: "busy",
  lines: [
    { message: "Full-Stack SWE at Intropic.io", severity: "available" },
    { message: "Pursuing MSc in Applied Data Science.", severity: "available" },
  ],
};

export function getIndicatorColor() {
  return (
    STATUS_SEVERITIES[statusConfig.indicatorSeverity] ??
    STATUS_SEVERITIES.available
  );
}
