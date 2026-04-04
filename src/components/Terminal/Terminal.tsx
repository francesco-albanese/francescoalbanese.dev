import { useCallback, useRef, useState } from "react";
import type { ReactNode } from "react";
import { HeaderBar } from "./HeaderBar";
import { TerminalInput } from "./TerminalInput";
import { StatusBar } from "./StatusBar";
import { ScrollIndicator } from "./ScrollIndicator";
import { dispatch } from "@/components/commands/registry";
import { useGreeting } from "@/hooks/useGreeting";
import { useAutoScroll } from "@/hooks/useAutoScroll";

type OutputEntry = {
	id: number;
	prompt: string;
	node: ReactNode;
};

export function Terminal() {
	const [entries, setEntries] = useState<OutputEntry[]>([]);
	const [history, setHistory] = useState<string[]>([]);
	const nextIdRef = useRef(0);

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
			{ id: nextIdRef.current++, prompt: trimmed, node: result.node },
		]);
	}, []);

	const { welcomeVisible, typedText, isAutoTyping, inputDisabled } =
		useGreeting(executeCommand);

	const {
		containerRef,
		showIndicator,
		handleScroll,
		scrollToBottom,
		forceScrollToBottom,
	} = useAutoScroll([entries.length, welcomeVisible]);

	return (
		<div className="flex flex-col h-[100dvh] bg-base">
			<HeaderBar />
			<div className="relative flex-1 overflow-hidden">
				<main
					ref={containerRef}
					onScroll={handleScroll}
					className="h-full overflow-y-auto px-4 py-2 font-mono text-sm"
					role="log"
				>
					{welcomeVisible && (
						<div className="mb-3">
							<p className="text-muted">Welcome to francescoalbanese.dev</p>
							<p className="text-faint text-xs">
								Type /help for available commands.
							</p>
						</div>
					)}
					{entries.map((entry) => (
						<div key={entry.id} className="mb-3">
							{entry.prompt && (
								<div className="text-muted">
									<span className="text-teal">visitor</span>
									<span className="text-muted">@francescoalbanese.dev</span>
									<span className="text-muted">:</span>
									<span className="text-blue">~</span>
									<span className="text-muted">$ </span>
									<span className="text-primary">{entry.prompt}</span>
								</div>
							)}
							<div className="mt-1 ml-1">{entry.node}</div>
						</div>
					))}
				</main>
				{showIndicator && <ScrollIndicator onClick={scrollToBottom} />}
			</div>
			<TerminalInput
				onSubmit={(input) => {
					forceScrollToBottom();
					executeCommand(input);
				}}
				onShowCompletions={(matches) => {
					setEntries((prev) => [
						...prev,
						{
							id: nextIdRef.current++,
							prompt: "",
							node: <p className="text-muted">{matches.join("  ")}</p>,
						},
					]);
				}}
				history={history}
				autoTypedText={isAutoTyping ? typedText : ""}
				disabled={inputDisabled}
			/>
			<StatusBar />
		</div>
	);
}
