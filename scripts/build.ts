import type { BuildConfig } from "bun"

const banner = "// Copyright (c) 2014 Takuya Asano All Rights Reserved.\n// rewrite by @f1w3_ | 2024\n"

const option: BuildConfig = {
    entrypoints: ["./doublearray.ts"],
    outdir: "./dist",
    sourcemap: "linked",
    banner: banner
}

await Bun.build({
    ...option,
    minify: true,
    naming: "[dir]/[name].min.[ext]"
})

await Bun.build({
    ...option,
    naming: "[dir]/[name].[ext]"
})

await Bun.build({
    ...option,
    format: "cjs",
    naming: "[dir]/[name].c[ext]"
})

await Bun.build({
    ...option,
    format: "cjs",
    minify: true,
    naming: "[dir]/[name].min.c[ext]"
})

await Bun.build({
    ...option,
    target: "browser",
    naming: "[dir]/[name].browser.[ext]"
})

await Bun.build({
    ...option,
    target: "browser",
    minify: true,
    naming: "[dir]/[name].browser.min.[ext]"
})

await Bun.build({
    ...option,
    format: "iife",
    naming: "[dir]/[name].iife.[ext]"
})

await Bun.build({
    ...option,
    format: "iife",
    minify: true,
    naming: "[dir]/[name].iife.min.[ext]"
})
