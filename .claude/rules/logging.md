# Feature-change logging (always on)

Whenever you (or a subagent) finish creating or changing a feature/section/component, BEFORE reporting "done":

1. Append a log file to `logs/feature-changes/` named `YYYY-MM-DD-<short-slug>.md`, using `logs/feature-changes/TEMPLATE.md`. Run `/log-change` to do this in one step.
2. The log is for **history only** — what changed, why, files touched, follow-ups. It is not project knowledge; do not read logs to make design decisions (use agent memory for that).
3. `logs/feature-changes/` is committed to VCS (runtime `*.log` files are still ignored). Include the log in the same commit as the change it describes.

Do not skip this for "small" changes — every feature create/change gets a log entry.
