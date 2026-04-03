import { useState, useRef } from "react";

type TerminalInputProps = {
	onSubmit: (value: string) => void;
	history: string[];
};

export function TerminalInput({ onSubmit, history }: TerminalInputProps) {
	const [value, setValue] = useState("");
	const [historyIndex, setHistoryIndex] = useState(-1);
	const draftRef = useRef("");

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter") {
			e.preventDefault();
			onSubmit(value);
			setValue("");
			setHistoryIndex(-1);
			draftRef.current = "";
			return;
		}

		if (e.key === "ArrowUp") {
			e.preventDefault();
			if (history.length === 0) return;
			const next =
				historyIndex === -1
					? history.length - 1
					: Math.max(0, historyIndex - 1);
			if (historyIndex === -1) draftRef.current = value;
			setHistoryIndex(next);
			setValue(history[next] ?? "");
			return;
		}

		if (e.key === "ArrowDown") {
			e.preventDefault();
			if (historyIndex === -1) return;
			const next = historyIndex + 1;
			if (next >= history.length) {
				setHistoryIndex(-1);
				setValue(draftRef.current);
			} else {
				setHistoryIndex(next);
				setValue(history[next] ?? "");
			}
		}
	}

	return (
		<div className="flex items-center gap-2 px-4 py-2 font-mono">
			<span className="text-coral text-lg" aria-hidden="true">
				›
			</span>
			<input
				type="text"
				value={value}
				onChange={(e) => {
					setValue(e.target.value);
					setHistoryIndex(-1);
				}}
				onKeyDown={handleKeyDown}
				placeholder="type /help for commands"
				aria-label="Terminal input"
				className="flex-1 bg-transparent text-primary outline-none placeholder:text-faint"
				autoComplete="off"
				spellCheck={false}
			/>
		</div>
	);
}
