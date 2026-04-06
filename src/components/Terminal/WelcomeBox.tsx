import { AsciiPortrait } from "./AsciiPortrait";

export function WelcomeBox() {
	return (
		<div className="relative border border-coral rounded mb-4 max-w-5xl">
			<span className="absolute -top-3 left-4 bg-base px-2 text-secondary text-sm font-mono">
				~/francescoalbanese.dev <span className="text-muted">›</span> portfolio
			</span>
			<div className="flex flex-col md:flex-row">
				<div className="p-4 shrink-0 flex flex-col items-center">
					<p className="text-primary font-bold text-lg mb-3">
						Welcome visitor!
					</p>
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
					<div className="mt-3 font-mono text-xs text-center">
						<p className="text-cyan font-semibold">Francesco Albanese</p>
						<p className="text-coral mt-0.5">Lead AI Engineer</p>
						<p className="text-muted mt-0.5">Python · TypeScript · AI · AWS</p>
					</div>
				</div>
				<div className="md:hidden h-px bg-coral/30 mx-4" />
				<div className="hidden md:block w-px bg-coral/30 my-4" />
				<div className="p-4 font-mono text-sm">
					<p className="text-coral font-semibold">Getting started</p>
					<p className="text-muted text-xs mt-1">
						Run <span className="text-primary">/help</span> to explore my
						experience, projects, and skills
					</p>
					<div className="my-3 h-px bg-coral/30" />
					<AsciiPortrait />
				</div>
			</div>
		</div>
	);
}
