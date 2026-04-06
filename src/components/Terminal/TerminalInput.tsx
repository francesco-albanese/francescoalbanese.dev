import { useState, useRef } from "react";
import { commands } from "@/content/data";

type TerminalInputProps = {
	onSubmit: (value: string) => void;
	onShowCompletions: (matches: string[]) => void;
	history: string[];
	disabled?: boolean;
};

const commandNames = Object.keys(commands);
const PLACEHOLDER = "type /help for commands";

export function TerminalInput({
	onSubmit,
	onShowCompletions,
	history,
	disabled = false,
}: TerminalInputProps) {
	const [value, setValue] = useState("");
	const [historyIndex, setHistoryIndex] = useState(-1);
	const draftRef = useRef("");

	const displayValue = value;

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
		<div className="flex items-center gap-2 border-y border-teal/40 px-3 py-3 font-mono text-sm">
			<span className="text-coral" aria-hidden="true">
				❯
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
					placeholder={disabled ? "" : PLACEHOLDER}
					aria-label="Terminal input"
					className="w-full bg-transparent text-transparent caret-transparent outline-none p-0 placeholder:text-transparent"
					autoComplete="off"
					autoFocus
					spellCheck={false}
					readOnly={disabled}
				/>
				<div className="pointer-events-none absolute inset-0 flex items-center overflow-hidden">
					{displayValue ? (
						<>
							<span className="text-primary whitespace-pre">
								{displayValue}
							</span>
							<span className="animate-blink text-coral">▊</span>
						</>
					) : (
						<>
							<span className="animate-blink text-coral">▊</span>
							<span className="text-muted ml-1">{PLACEHOLDER}</span>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
