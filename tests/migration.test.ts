import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("sharded counter migration", () => {
  const migration = readFileSync(
    new URL("../supabase/migrations/20260711061500_fix_sharded_counter_ambiguity.sql", import.meta.url),
    "utf8",
  );

  it("qualifies the output-column name inside the shard update", () => {
    expect(migration).toContain("update public.click_counter_shards as shards");
    expect(migration).toContain("set total_clicks = shards.total_clicks + 1");
    expect(migration).toContain("where shards.shard_id = selected_shard");
  });
});
