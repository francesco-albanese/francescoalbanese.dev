export function HeaderBar() {
	return (
		<div className="flex items-center gap-2 px-4 py-2 bg-surface text-muted text-sm font-mono">
			<div className="flex gap-1.5">
				<span className="w-3 h-3 rounded-full bg-red" />
				<span className="w-3 h-3 rounded-full bg-yellow" />
				<span className="w-3 h-3 rounded-full bg-teal" />
			</div>
			<span className="ml-2 text-secondary">
				~/francescoalbanese.dev <span className="text-muted">›</span> portfolio
			</span>
		</div>
	);
}
