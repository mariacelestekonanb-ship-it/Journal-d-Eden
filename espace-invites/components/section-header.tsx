export function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="px-6.5 pt-8 pb-1.5 text-center">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">
        {title}
      </h1>
      <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">
        {description}
      </p>
    </div>
  );
}
