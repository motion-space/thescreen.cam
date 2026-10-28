import assert from "node:assert/strict";
import { test } from "node:test";
import { selectChangelogRange } from "../../src/lib/windows-changelog-range.ts";

const versions = ["1.0.17", "1.0.16", "1.0.15", "1.0.14", "1.0.13"];
test("diff excludes installed and future releases, includes every intermediate release", () => {
  assert.deepEqual(selectChangelogRange("?from=1.0.13.0&to=1.0.16.0", versions), {
    status: "ready", from: "1.0.13", to: "1.0.16", versions: ["1.0.16", "1.0.15", "1.0.14"],
  });
});
test("a missing upper release cannot look like a complete diff", () => {
  assert.deepEqual(selectChangelogRange("?from=1.0.14&to=1.0.18", versions), {
    status: "missing", from: "1.0.14", to: "1.0.18", versions: [],
  });
});
test("invalid, reversed, equal and duplicate query bounds are rejected", () => {
  for (const query of ["?from=x&to=1.0.16", "?from=1.0.16&to=1.0.15", "?from=1.0.16&to=1.0.16.0",
    "?from=1.0.14", "?from=1.0.14&from=1.0.15&to=1.0.16", "?from=1.0.14&to=999999.0"]) {
    assert.deepEqual(selectChangelogRange(query, versions), { status: "invalid" });
  }
  assert.deepEqual(selectChangelogRange("", versions), { status: "all" });
});
