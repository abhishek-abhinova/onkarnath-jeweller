import ScrollReveal from './ScrollReveal';
import SectionHeading from './SectionHeading';
import { ShieldIcon, GemIcon, ScaleIcon, SparkleIcon } from './icons';

const FEATURES = [
  {
    icon: ScaleIcon,
    title: 'Guaranteed Purity',
    desc: 'BIS hallmarked 916 gold, 999 fine silver — purity you can verify and trust.',
  },
  {
    icon: GemIcon,
    title: 'Quality Craftsmanship',
    desc: 'हर आभूषण सावधानीपूर्वक कारीगरी के साथ, पीढ़ियों की शिल्पकला से।',
  },
  {
    icon: SparkleIcon,
    title: 'Fair & Transparent',
    desc: 'साफ-सुथरा हिसाब, उचित मेकिंग चार्ज और पूरे देश में प्रचलित बेंचमार्क रेट।',
  },
  {
    icon: ShieldIcon,
    title: 'Service You Can Trust',
    desc: 'अटारा, बांदा एवं आसपास के परिवारों की विश्वसनीय सर्राफ दुकान।',
  },
];

export default function AboutTeaser() {
  return (
    <section className="section-pad bg-white">
      <div className="container-x">
        <SectionHeading
          eyebrow="Why ओंकार नाथ अग्रवाल सर्राफ"
          hindi
          title="शुद्धता की पहचान, भरोसे की धरोहर"
          sub="सरल नियम: जो दिखता है, वही मिलता है। शुद्ध सोना-चांदी, सही वजन और निष्ठापूर्ण सेवा।"
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 80}>
              <div className="card group h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold-300/60 hover:shadow-soft">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-gold-100 to-gold-200 text-gold-700 ring-1 ring-gold-300/50 transition group-hover:from-gold-200 group-hover:to-gold-300">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-charcoal-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-500">{f.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}