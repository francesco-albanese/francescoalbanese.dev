const pills = ["Lead AI Engineer", "francescoalbanese.dev", "London, UK"] as const;

export function StatusBar() {
	const year = new Date().getFullYear();
	return (
		<div className="bg-statusbar font-mono text-xs border-t border-faint/30">
			<div
				data-testid="footer-desktop"
				className="hidden sm:flex flex-wrap items-center justify-between gap-2 px-4 py-1.5"
			>
				<div className="flex flex-wrap gap-2">
					{pills.map((label) => (
						<span key={label} className="px-2 py-0.5 rounded bg-overlay text-secondary">
							{label}
						</span>
					))}
				</div>
				<span className="text-secondary">&copy; {year} Francesco Albanese</span>
			</div>
			<div
				data-testid="footer-mobile"
				className="sm:hidden flex items-center justify-center gap-2 px-3 py-1.5 text-secondary truncate"
			>
				<span>Lead AI Engineer</span>
				<span className="text-muted">·</span>
				<span>London</span>
				<span className="text-muted">·</span>
				<span>&copy; {year}</span>
			</div>
		</div>
	);
}
