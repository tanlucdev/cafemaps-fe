export default function AboutSection({ paragraphs }: { paragraphs: string[] }) {
  if (paragraphs.length === 0) return null;

  return (
    <div className="rounded-[22px] border border-[#ffe3b7]/34 bg-white/54 px-4 py-4 shadow-[var(--shadow-sm)] backdrop-blur-md dark:border-[#ffe3b7]/14 dark:bg-[#fff1d6]/7">
      <div className="space-y-4 border-l-[3px] border-[#e4ad58]/44 pl-4 text-[15px] leading-[1.85] font-[var(--font-lora)] text-[var(--foreground-muted)] italic">
        {paragraphs.map((paragraph, index) => (
          <p key={`${paragraph.slice(0, 24)}-${index}`}>
            {index === 0 && <>&ldquo;</>}
            {paragraph}
            {index === paragraphs.length - 1 && <>&rdquo;</>}
          </p>
        ))}
      </div>
    </div>
  );
}
