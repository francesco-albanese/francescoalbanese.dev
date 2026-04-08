import { useEffect, useRef, useState } from "react";
import { commands } from "@/content/data";

type TerminalInputProps = {
	onSubmit: (value: string) => void;
	onShowCompletions: (matches: string[]) => void;
	onValueChange?: (value: string) => void;
	history: string[];
	disabled?: boolean;
};

const commandNames = Object.keys(commands);
const CURATED_ORDER = [
	"/help",
	"/whoami",
	"/skills",
	"/projects",
	"/experience",
	"/links",
	"/clear",
] as const;
const CURATED_CHIPS = CURATED_ORDER.filter((cmd) => commandNames.includes(cmd));
const PLACEHOLDER = "type help or tap a suggestion";

// Chips use substring match (`includes`) for discovery — typing any letter
// surfaces every command containing it. Tab autocomplete below uses prefix
// match instead, because Tab's contract is "complete the unique candidate"
// and substring would be ambiguous.
function getMatches(value: string): string[] {
	if (value === "") return [...CURATED_CHIPS];
	const trimmed = value.trim().toLowerCase();
	if (!trimmed) return [];
	const needle = trimmed.startsWith("/") ? trimmed.slice(1) : trimmed;
	if (!needle) return [...CURATED_CHIPS];
	return CURATED_CHIPS.filter((cmd) => {
		const bare = cmd.slice(1);
		return bare.includes(needle) && bare !== needle;
	});
}

export function TerminalInput({
	onSubmit,
	onShowCompletions,
	onValueChange,
	history,
	disabled = false,
}: TerminalInputProps) {
	const [value, setValue] = useState("");
	const [historyIndex, setHistoryIndex] = useState(-1);
	const draftRef = useRef("");
	const inputRef = useRef<HTMLInputElement>(null);
	const didMountRef = useRef(false);
	const lastChipTapRef = useRef(0);

	useEffect(() => {
		if (!didMountRef.current) {
			didMountRef.current = true;
			return;
		}
		onValueChange?.(value);
	}, [value, onValueChange]);

	const matches = getMatches(value);

	function updateValue(next: string) {
		setValue(next);
		setHistoryIndex(-1);
	}

	function submit() {
		if (!value.trim()) return;
		onSubmit(value);
		setValue("");
		setHistoryIndex(-1);
		draftRef.current = "";
		if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
			inputRef.current?.blur();
		}
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Tab") {
			e.preventDefault();
			const trimmed = value.trim().toLowerCase();
			if (!trimmed) return;
			const needle = trimmed.startsWith("/") ? trimmed.slice(1) : trimmed;
			if (!needle) {
				onShowCompletions([...commandNames]);
				return;
			}
			const tabMatches = commandNames.filter((cmd) => cmd.slice(1).startsWith(needle));
			if (tabMatches.length === 1 && tabMatches[0]) {
				setValue(tabMatches[0]);
			} else if (tabMatches.length > 1) {
				onShowCompletions(tabMatches);
			}
			return;
		}

		if (e.key === "Enter") {
			e.preventDefault();
			submit();
			return;
		}

		if (e.key === "ArrowUp") {
			e.preventDefault();
			if (history.length === 0) return;
			const next = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
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

	function handleChipTap(cmd: string) {
		if (disabled) return;
		const now = performance.now();
		if (now - lastChipTapRef.current < 300) return;
		lastChipTapRef.current = now;
		setHistoryIndex(-1);
		onSubmit(cmd);
		setValue("");
		draftRef.current = "";
	}

	const showChips = !disabled && matches.length > 0;

	const suggestionAnnouncement = showChips
		? `${matches.length} suggestion${matches.length === 1 ? "" : "s"} available`
		: "";

	return (
		<div className="border-y border-teal/40 font-mono text-sm">
			<div className="sr-only" aria-live="polite" aria-atomic="true">
				{suggestionAnnouncement}
			</div>
			{showChips && (
				<div
					data-testid="command-suggestions"
					className="flex gap-2 overflow-x-auto px-3 pt-1 pb-0.5 sm:pt-2 sm:pb-1 scrollbar-none"
				>
					{matches.map((cmd) => (
						<button
							key={cmd}
							type="button"
							onClick={() => handleChipTap(cmd)}
							className="shrink-0 rounded border border-teal/40 bg-overlay px-2 py-0.5 text-xs text-teal hover:border-teal hover:text-primary focus:outline-none focus:border-coral"
						>
							{cmd}
						</button>
					))}
				</div>
			)}
			<div className="flex items-center gap-2 px-3 py-2 sm:py-3">
				<span className="text-coral" aria-hidden="true">
					❯
				</span>
				<div className="relative flex-1 min-w-0">
					<input
						ref={inputRef}
						type="text"
						value={value}
						onChange={(e) => {
							if (disabled) return;
							updateValue(e.target.value);
						}}
						onKeyDown={disabled ? undefined : handleKeyDown}
						placeholder={disabled ? "" : PLACEHOLDER}
						aria-label="Terminal input"
						className="w-full bg-transparent text-transparent caret-transparent outline-none p-0 placeholder:text-transparent text-[16px]"
						autoComplete="off"
						autoCapitalize="off"
						autoCorrect="off"
						spellCheck={false}
						readOnly={disabled}
						enterKeyHint="send"
					/>
					<div className="pointer-events-none absolute inset-0 flex items-center overflow-hidden">
						{value ? (
							<>
								<span className="text-primary whitespace-pre truncate">{value}</span>
								<span className="animate-blink text-coral">▊</span>
							</>
						) : (
							<>
								<span className="animate-blink text-coral">▊</span>
								<span className="text-muted ml-1 truncate">{PLACEHOLDER}</span>
							</>
						)}
					</div>
				</div>
				<button
					type="button"
					onClick={submit}
					disabled={disabled || !value.trim()}
					aria-label="Run command"
					className="hidden [@media(pointer:coarse)]:flex shrink-0 items-center justify-center w-9 h-9 rounded border border-coral/60 text-coral disabled:opacity-30 disabled:border-muted disabled:text-muted active:bg-coral/20"
				>
					<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
						<path d="M2 2 L12 7 L2 12 Z" fill="currentColor" />
					</svg>
				</button>
			</div>
		</div>
	);
}
