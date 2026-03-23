import { NextResponse } from "next/server";
import { existsSync } from "node:fs";
import path from "node:path";
import { isNativeAddonLoaded } from "@/lib/scheduling-native";

export const runtime = "nodejs";

export async function GET() {
  const addonPath = path.join(
    process.cwd(),
    "build",
    "Release",
    "scheduling_algorithms.node"
  );

  return NextResponse.json({
    nativeLoaded: isNativeAddonLoaded(),
    addonExists: existsSync(addonPath),
    addonPath,
  });
}