import { commands } from "@/content/data";

type HelpOutputProps = {
	onExecuteCommand: (command: string) => void;
};

export function HelpOutput({ onExecuteCommand }: HelpOutputProps) {
	return (
		<div className="space-y-1">
			<p className="text-secondary">Available commands:</p>
			<div className="ml-2 space-y-0.5">
				{Object.entries(commands).map(([name, def]) => (
					<div key={name} className="flex gap-4">
						<button
							type="button"
							onClick={() => onExecuteCommand(name)}
							className="text-coral hover:underline cursor-pointer text-left min-w-[16ch]"
						>
							{name}
						</button>
						<span className="text-muted">{def.description}</span>
					</div>
				))}
			</div>
		</div>
	);
}
