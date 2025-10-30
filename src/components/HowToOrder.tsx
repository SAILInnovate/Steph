import { useEffect, useState, useRef } from 'react';
import { Lightbulb, CreditCard, Palette } from 'lucide-react';

export function HowToOrder() {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          [0, 1, 2].forEach((step) => {
            setTimeout(() => {
              setVisibleSteps((prev) => [...prev, step]);
            }, step * 300);
          });
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      icon: Lightbulb,
      title: 'Dream It',
      description: 'Start with your inspiration. Send me your ideas, color schemes, and any specific charms or flowers you love.',
    },
    {
      icon: CreditCard,
      title: 'Design & Pay',
      description: "We'll confirm the design. Full payment is required upfront before I begin crafting your unique order.",
    },
    {
      icon: Palette,
      title: 'Create & Deliver',
      description: 'Please allow 1-2 weeks for me to bring your creation to life. I pour my heart into every detail!',
    },
  ];

  return (
    <section ref={sectionRef} className="py-20 px-6 max-w-4xl mx-auto relative z-10">
      <div
        className={`transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <h2 className="text-4xl md:text-5xl font-['Pacifico'] text-[#FF69B4] text-center mb-16">
          Create Your Custom Piece
        </h2>

        <div className="space-y-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className={`flex gap-6 items-start transition-all duration-700 ${
                  visibleSteps.includes(index) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                }`}
              >
                <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-[#FF69B4] border-4 border-[#333333] shadow-[6px_6px_0px_#333333] flex items-center justify-center">
                  <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-['Pacifico'] text-[#FF69B4] mb-2">
                    {index + 1}. {step.title}
                  </h3>
                  <p className="font-['Montserrat'] text-base md:text-lg text-[#333333] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
