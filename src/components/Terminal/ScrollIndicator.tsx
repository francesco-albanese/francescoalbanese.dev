type ScrollIndicatorProps = {
	onClick: () => void;
};

export function ScrollIndicator({ onClick }: ScrollIndicatorProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="absolute bottom-2 right-4 rounded-full bg-overlay px-3 py-1 text-xs text-muted hover:text-primary transition-colors cursor-pointer"
			aria-label="Scroll to bottom"
		>
			↓ new content
		</button>
	);
}
