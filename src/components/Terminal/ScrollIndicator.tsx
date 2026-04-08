type ScrollIndicatorProps = {
	onClick: () => void;
};

export function ScrollIndicator({ onClick }: ScrollIndicatorProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="absolute bottom-3 right-4 rounded-full border border-coral/60 bg-base/90 backdrop-blur px-3 py-1.5 text-xs font-mono text-coral shadow-lg shadow-coral/20 hover:bg-coral hover:text-base transition-colors cursor-pointer"
			aria-label="Scroll to bottom"
		>
			↓ new content
		</button>
	);
}
