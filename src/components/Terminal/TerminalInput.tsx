import { useState } from "react";

export function TerminalInput() {
	const [value, setValue] = useState("");

	return (
		<div className="flex items-center gap-2 px-4 py-2 font-mono">
			<span className="text-coral text-lg" aria-hidden="true">
				›
			</span>
			<input
				type="text"
				value={value}
				onChange={(e) => setValue(e.target.value)}
				placeholder="type /help for commands"
				aria-label="Terminal input"
				className="flex-1 bg-transparent text-primary outline-none placeholder:text-faint"
				autoComplete="off"
				spellCheck={false}
			/>
		</div>
	);
}
