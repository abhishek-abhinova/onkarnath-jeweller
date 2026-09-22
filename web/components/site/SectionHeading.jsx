export default function SectionHeading({
  eyebrow,
  title,
  hindi = false,
  sub,
  align = 'center',
  className = '',
}) {
  const alignCls = align === 'center' ? 'items-center text-center' : 'items-start text-left';
  return (
    <div className={`flex flex-col gap-3 ${alignCls} ${className}`}>
      {eyebrow && <span className="eyebrow"><span className="h-px w-6 bg-gold-500/60" />{eyebrow}<span className="h-px w-6 bg-gold-500/60" /></span>}
      <h2 className={`${hindi ? 'heading-hindi' : 'heading-serif'} text-3xl sm:text-4xl lg:text-[42px] text-balance`}>
        {title}
      </h2>
      {sub && <p className={`max-w-2xl text-[15px] leading-relaxed text-charcoal-500 ${align === 'center' ? 'mx-auto' : ''}`}>{sub}</p>}
    </div>
  );
}