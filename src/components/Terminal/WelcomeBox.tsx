import { AsciiPortrait } from "./AsciiPortrait";

export function WelcomeBox() {
	return (
		<div className="relative border border-coral rounded mb-4">
			<span className="absolute -top-3 left-4 bg-base px-2 text-secondary text-sm font-mono">
				~/francescoalbanese.dev <span className="text-muted">›</span> portfolio
			</span>
			<div className="flex flex-col md:flex-row">
				<div className="p-4 md:border-r md:border-coral shrink-0">
					<pre className="font-mono text-xs text-cyan leading-none whitespace-pre">
						{`    ______
   / ____/________ _____  ________  ______________
  / /_  / ___/ __ \`/ __ \\/ ___/ _ \\/ ___/ ___/ __ \\
 / __/ / /  / /_/ / / / / /__/  __(__  ) /__/ /_/ /
/_/   /_/   \\__,_/_/ /_/\\___/\\___/____/\\___/\\____/
    ___    ____
   /   |  / / /_  ____ _____  ___  ________
  / /| | / / __ \\/ __ \`/ __ \\/ _ \\/ ___/ _ \\
 / ___ |/ / /_/ / /_/ / / / /  __(__  )  __/
/_/  |_/_/_.___/\\__,_/_/ /_/\\___/____/\\___/`}
					</pre>
					<div className="mt-3 font-mono text-xs">
						<p>
							<span className="text-teal">visitor</span>
							<span className="text-muted">@francescoalbanese.dev</span>
							<span className="text-muted">:</span>
							<span className="text-blue">~</span>
							<span className="text-muted">$ </span>
							<span className="text-primary">/whoami</span>
						</p>
						<p className="text-cyan font-semibold mt-1">Francesco Albanese</p>
						<p className="text-coral mt-0.5">Lead AI Engineer</p>
					</div>
				</div>
				<div className="p-4 font-mono text-sm">
					<p className="text-coral font-semibold">Available commands</p>
					<p className="text-muted text-xs mt-1">
						Run /help for a list of commands
					</p>
					<div className="mt-3">
						<AsciiPortrait />
					</div>
				</div>
			</div>
		</div>
	);
}
