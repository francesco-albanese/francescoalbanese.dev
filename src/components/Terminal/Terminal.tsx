import { useCallback, useRef, useState } from "react";
import type { ReactNode } from "react";
import { HeaderBar } from "./HeaderBar";
import { TerminalInput } from "./TerminalInput";
import { StatusBar } from "./StatusBar";
import { dispatch } from "@/components/commands/registry";

type OutputEntry = {
	id: number;
	prompt: string;
	node: ReactNode;
};

let nextId = 0;

export function Terminal() {
	const [entries, setEntries] = useState<OutputEntry[]>([]);
	const [history, setHistory] = useState<string[]>([]);
	const mainRef = useRef<HTMLElement>(null);

	const executeCommand = useCallback((input: string) => {
		const trimmed = input.trim();
		if (!trimmed) return;

		setHistory((prev) => [...prev, trimmed]);

		const result = dispatch(trimmed, { onExecuteCommand: executeCommand });

		if (!result) return;

		if (result.type === "clear") {
			setEntries([]);
			return;
		}

		setEntries((prev) => [
			...prev,
			{ id: nextId++, prompt: trimmed, node: result.node },
		]);

		requestAnimationFrame(() => {
			mainRef.current?.scrollTo({ top: mainRef.current.scrollHeight });
		});
	}, []);

	return (
		<div className="flex flex-col h-[100dvh] bg-base">
			<HeaderBar />
			<main
				ref={mainRef}
				className="flex-1 overflow-y-auto px-4 py-2 font-mono text-sm"
			>
				{entries.map((entry) => (
					<div key={entry.id} className="mb-3">
						<div className="text-muted">
							<span className="text-secondary">
								visitor@francescoalbanese.dev
							</span>
							<span className="text-muted">:</span>
							<span className="text-blue">~</span>
							<span className="text-muted">$ </span>
							<span className="text-primary">{entry.prompt}</span>
						</div>
						<div className="mt-1 ml-1">{entry.node}</div>
					</div>
				))}
			</main>
			<TerminalInput
				onSubmit={executeCommand}
				onShowCompletions={(matches) => {
					setEntries((prev) => [
						...prev,
						{
							id: nextId++,
							prompt: "",
							node: <p className="text-muted">{matches.join("  ")}</p>,
						},
					]);
					requestAnimationFrame(() => {
						mainRef.current?.scrollTo({
							top: mainRef.current?.scrollHeight,
						});
					});
				}}
				history={history}
			/>
			<StatusBar />
		</div>
	);
}
