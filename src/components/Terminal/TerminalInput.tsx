import { useState, useRef } from "react";
import { commands } from "@/content/data";

type TerminalInputProps = {
	onSubmit: (value: string) => void;
	onShowCompletions: (matches: string[]) => void;
	history: string[];
	autoTypedText?: string;
	disabled?: boolean;
};

const commandNames = Object.keys(commands);

export function TerminalInput({
	onSubmit,
	onShowCompletions,
	history,
	autoTypedText = "",
	disabled = false,
}: TerminalInputProps) {
	const [value, setValue] = useState("");
	const [historyIndex, setHistoryIndex] = useState(-1);
	const draftRef = useRef("");

	const displayValue = autoTypedText || value;

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Tab") {
			e.preventDefault();
			const input = value.trim();
			if (!input) return;
			const matches = commandNames.filter((cmd) => cmd.startsWith(input));
			if (matches.length === 1 && matches[0]) {
				setValue(matches[0]);
			} else if (matches.length > 1) {
				onShowCompletions(matches);
			}
			return;
		}

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
			<div className="relative flex-1">
				<input
					type="text"
					value={displayValue}
					onChange={(e) => {
						if (disabled) return;
						setValue(e.target.value);
						setHistoryIndex(-1);
					}}
					onKeyDown={disabled ? undefined : handleKeyDown}
					placeholder={disabled ? "" : "type /help for commands"}
					aria-label="Terminal input"
					className="w-full bg-transparent text-primary outline-none placeholder:text-faint focus-visible:ring-1 focus-visible:ring-coral"
					autoComplete="off"
					autoFocus
					spellCheck={false}
					readOnly={disabled}
				/>
				{!displayValue && (
					<span
						className="animate-blink pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-coral"
						aria-hidden="true"
					>
						▊
					</span>
				)}
			</div>
		</div>
	);
}
