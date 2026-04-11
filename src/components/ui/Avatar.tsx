export function Avatar({
  name,
  avatarUrl,
  size = 36,
  className = "",
  bgColor = "rgba(45,106,79,0.1)",
  textColor = "var(--forest)",
}: {
  name: string;
  avatarUrl?: string | null;
  size?: number;
  className?: string;
  bgColor?: string;
  textColor?: string;
}) {
  const fontSize = size < 28 ? "text-[10px]" : size < 40 ? "text-xs" : size < 60 ? "text-sm" : "text-2xl";

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={`rounded-full object-cover flex-shrink-0 ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold flex-shrink-0 ${fontSize} ${className}`}
      style={{ width: size, height: size, background: bgColor, color: textColor, fontFamily: "var(--font-display)" }}
    >
      {name?.[0]?.toUpperCase() ?? "?"}
    </div>
  );
}
