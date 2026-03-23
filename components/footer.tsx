"use client";

import { useEffect, useState } from "react";

type NativeStatusResponse = {
	nativeLoaded: boolean;
	addonExists: boolean;
	addonPath: string;
};

export default function Footer() {
	const [status, setStatus] = useState<NativeStatusResponse | null>(null);

	useEffect(() => {
		let mounted = true;

		const loadStatus = async () => {
			try {
				const response = await fetch("/api/native-status", { cache: "no-store" });
				if (!response.ok) {
					return;
				}
				const payload = (await response.json()) as NativeStatusResponse;
				if (mounted) {
					setStatus(payload);
				}
			} catch {
				// Keep footer resilient if the endpoint is unavailable.
			}
		};

		loadStatus();
		return () => {
			mounted = false;
		};
	}, []);

	const nativeOn = Boolean(status?.nativeLoaded);

	return (
		<footer className="w-full border-t py-3 px-4 text-xs text-muted-foreground">
			<div className="mx-auto flex max-w-6xl items-center justify-between">
				<span>Scheduling Algorithm Simulator</span>
				<span
					className={`rounded px-2 py-1 font-medium ${
						nativeOn
							? "bg-emerald-100 text-emerald-700"
							: "bg-amber-100 text-amber-700"
					}`}
					title={
						nativeOn
							? "Native C++ addon is loaded."
							: status?.addonExists
							? "Addon exists but is not loaded in runtime."
							: "Addon binary not found. Using TypeScript fallback."
					}
				>
					Native: {nativeOn ? "ON" : "OFF"}
				</span>
			</div>
		</footer>
	);
}
