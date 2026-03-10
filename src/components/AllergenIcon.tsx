interface AllergenIconProps {
  number: number;
  label: string;
  size?: number;
  compact?: boolean;
}

export const AllergenIcon = ({ number, label, size = 48, compact = false }: AllergenIconProps) => (
  <div className={`flex flex-col items-center ${compact ? "gap-0" : "gap-2"}`}>
    <div
      className="flex shrink-0 items-center justify-center rounded-full border border-border bg-card shadow-card-hover transition-shadow duration-300 hover:shadow-luxury"
      style={{ width: size, height: size }}
      title={label}
    >
      <span className={`font-display font-semibold text-foreground ${compact ? "text-[10px]" : "text-sm"}`}>{number}</span>
    </div>
    {!compact && (
      <span className="text-center text-xs font-medium text-muted-foreground leading-tight max-w-[4.5rem]">
        {label}
      </span>
    )}
  </div>
);
