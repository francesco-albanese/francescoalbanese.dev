import { HeaderBar } from "./HeaderBar";
import { TerminalInput } from "./TerminalInput";
import { StatusBar } from "./StatusBar";

export function Terminal() {
	return (
		<div className="flex flex-col h-[100dvh] bg-base">
			<HeaderBar />
			<main className="flex-1 overflow-y-auto px-4 py-2" />
			<TerminalInput />
			<StatusBar />
		</div>
	);
}
