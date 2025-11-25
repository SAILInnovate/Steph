import { useEffect, useState, useRef } from 'react';
import { MessageCircleHeart, CreditCard, Wand2, ArrowDown } from 'lucide-react';

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
            }, step * 400); // Slightly slower for dramatic effect
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
      icon: MessageCircleHeart,
      title: 'The Inspo',
      subtitle: 'Dream It',
      description: 'Slide into my DMs! Send me your inspo pics, color schemes, and favorite charms. Let’s vibe on the design together.',
      bgColor: 'bg-[#FFF0F5]' // Light pink
    },
    {
      icon: CreditCard,
      title: 'The Deposit',
      subtitle: 'Secure It',
      description: 'Once we agree on the design, full payment is required to secure your slot. This lets me buy your specific materials!',
      bgColor: 'bg-white'
    },
    {
      icon: Wand2,
      title: 'The Creation',
      subtitle: 'Make Magic',
      description: 'Allow 1-2 weeks for production. I hand-place every crystal and flower with love, care, and a little bit of sparkle.',
      bgColor: 'bg-[#FFF0F5]'
    },
  ];

  return (
    <section ref={sectionRef} className="py-24 px-6 relative z-10">
      <div
        className={`max-w-4xl mx-auto transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Header */}
        <div className="text-center mb-16">
            <span className="inline-block py-1 px-4 border-2 border-black rounded-full bg-white font-['Montserrat'] font-bold text-xs tracking-widest mb-4 shadow-[4px_4px_0px_#FF69B4]">
                CUSTOM ORDERS
            </span>
            <h2 className="text-5xl md:text-6xl font-['Pacifico'] text-[#FF69B4] text-shadow-barbie">
            How It Works
            </h2>
        </div>

        <div className="space-y-0 relative">
            {/* Vertical dashed line running through the center (visual connector) */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 border-l-4 border-dashed border-[#FF69B4]/30 -translate-x-1/2 z-0 hidden md:block"></div>

            {steps.map((step, index) => {
                const Icon = step.icon;
                const isEven = index % 2 === 0;
                
                return (
                <div key={index} className="relative z-10">
                    <div
                        className={`flex flex-col md:flex-row items-center gap-6 md:gap-12 mb-8 md:mb-16 transition-all duration-700 ${
                            visibleSteps.includes(index) 
                            ? 'opacity-100 translate-y-0 scale-100' 
                            : 'opacity-0 translate-y-20 scale-95'
                        } ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                    >
                        
                        {/* The Number/Icon Badge */}
                        <div className="flex-shrink-0 relative group">
                            <div className="w-24 h-24 bg-[#FF69B4] border-4 border-black rounded-full shadow-[8px_8px_0px_#333] flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                                <Icon className="w-10 h-10 text-white" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-black rounded-full flex items-center justify-center font-black font-['Montserrat'] z-20">
                                {index + 1}
                            </div>
                        </div>

                        {/* The Content Card */}
                        <div className={`flex-1 ${step.bgColor} border-4 border-black p-6 md:p-8 rounded-3xl shadow-[8px_8px_0px_#333] hover:shadow-[12px_12px_0px_#FF69B4] transition-shadow duration-300 relative`}>
                            {/* Little triangle pointer for desktop */}
                            <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-4 h-4 border-4 border-black bg-white rotate-45 ${isEven ? '-left-2.5 border-r-0 border-t-0' : '-right-2.5 border-l-0 border-b-0'}`}></div>
                            
                            <h4 className="font-['Montserrat'] font-bold text-[#FF69B4] uppercase tracking-widest text-xs mb-1">
                                {step.subtitle}
                            </h4>
                            <h3 className="text-3xl font-['Pacifico'] text-[#333] mb-3">
                                {step.title}
                            </h3>
                            <p className="font-['Montserrat'] text-base md:text-lg text-[#333] font-medium leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    </div>

                    {/* Arrow between steps (except last) */}
                    {index !== steps.length - 1 && (
                        <div className={`flex justify-center mb-8 md:mb-16 transition-opacity duration-500 delay-500 ${visibleSteps.includes(index) ? 'opacity-100' : 'opacity-0'}`}>
                            <ArrowDown className="w-8 h-8 text-[#FF69B4] animate-bounce" />
                        </div>
                    )}
                </div>
                );
            })}
        </div>
      </div>
    </section>
  );
}