const pills = [
	"Lead AI Engineer",
	"francescoalbanese.dev",
	"London, UK",
] as const;

export function StatusBar() {
	return (
		<div className="flex flex-wrap items-center justify-between gap-2 px-4 py-1.5 bg-statusbar font-mono text-xs">
			<div className="flex flex-wrap gap-2">
				{pills.map((label) => (
					<span
						key={label}
						className="px-2 py-0.5 rounded bg-overlay text-muted"
					>
						{label}
					</span>
				))}
			</div>
			<span className="text-faint">
				&copy; {new Date().getFullYear()} Francesco Albanese
			</span>
		</div>
	);
}
