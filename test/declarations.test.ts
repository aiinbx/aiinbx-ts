import { expect, test } from "bun:test"
import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"

// The SDK has no dependencies, so its published types must compile with
// nothing installed (`react` broke this in 3.0.0).
test("published types compile with nothing installed", async () => {
  const outDir = await mkdtemp(join(tmpdir(), "aiinbx-dts-"))
  try {
    const emit = Bun.spawnSync(
      [
        "bunx",
        "tsc",
        "-p",
        "tsconfig.build.json",
        "--emitDeclarationOnly",
        "--declarationMap",
        "false",
        "--outDir",
        outDir,
      ],
      { cwd: join(import.meta.dir, "..") }
    )
    expect(emit.stdout.toString()).toBe("")
    expect(emit.exitCode).toBe(0)

    await writeFile(
      join(outDir, "tsconfig.json"),
      JSON.stringify({
        compilerOptions: {
          strict: true,
          noEmit: true,
          types: [],
          lib: ["ES2022", "DOM"],
          module: "nodenext",
        },
        include: ["**/*.d.ts"],
      })
    )
    await writeFile(join(outDir, "package.json"), '{"type":"module"}')
    const check = Bun.spawnSync(
      ["bunx", "tsc", "-p", join(outDir, "tsconfig.json")],
      { cwd: join(import.meta.dir, "..") }
    )
    expect(check.stdout.toString()).toBe("")
    expect(check.exitCode).toBe(0)
  } finally {
    await rm(outDir, { recursive: true, force: true })
  }
}, 60_000)
