export type AttemptPrintMode = "student" | "teacher";

export type AttemptPrintParams = {
  attemptId: number;
  mode?: AttemptPrintMode;
};

export function buildAttemptPrintUrl(params: AttemptPrintParams): string {
  const base = window.location.href.split("#")[0];
  const mode = params.mode === "teacher" ? "teacher" : "student";
  const qs = new URLSearchParams({
    attemptId: String(params.attemptId),
    mode,
  });
  return `${base}#/print/attempt?${qs.toString()}`;
}

export function openAttemptPrintTab(
  params: AttemptPrintParams
): Window | null {
  const url = buildAttemptPrintUrl(params);
  return window.open(url, "_blank");
}

export function openBlankPrintTab(): Window | null {
  return window.open("", "_blank");
}

export function navigateAttemptPrintTab(
  win: Window | null,
  params: AttemptPrintParams
): void {
  if (!win) return;
  win.location.href = buildAttemptPrintUrl(params);
  win.focus();
}
