import { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface PolicyItem {
  title: string;
  content: string;
}

export function Policies() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const policies: PolicyItem[] = [
    {
      title: 'Ready-Made Items',
      content: 'All ready-made items are final sale. No refunds, returns, or exchanges. Each piece is crafted with care and attention to detail.',
    },
    {
      title: 'Custom Orders',
      content: 'Custom orders are non-refundable and cannot be cancelled once production begins. No returns or exchanges on personalized items.',
    },
    {
      title: 'Care & Use',
      content: 'Please handle all handmade pieces with care. Phone cases should be cleaned gently with a soft cloth. Keep floral arrangements away from direct sunlight and extreme temperatures.',
    },
    {
      title: 'Payment',
      content: 'Payment is due at the studio/appointment. We accept cash and bank transfer. Full payment is required before starting custom orders.',
    },
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section ref={sectionRef} className="py-20 px-6 max-w-4xl mx-auto relative z-10">
      <div
        className={`transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <h2 className="text-4xl md:text-5xl font-['Pacifico'] text-[#FF69B4] text-center mb-12">
          Good to Know
        </h2>

        <div className="space-y-4">
          {policies.map((policy, index) => (
            <div
              key={index}
              className="bg-white border-4 border-[#333333] shadow-[6px_6px_0px_#333333] overflow-hidden"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#FFF0F5] transition-colors duration-200"
              >
                <span className="font-['Montserrat'] font-bold text-lg md:text-xl text-[#333333]">
                  {policy.title}
                </span>
                <div className="flex-shrink-0 transition-transform duration-300">
                  {openIndex === index ? (
                    <ChevronDown className="w-6 h-6 text-[#FF69B4]" />
                  ) : (
                    <ChevronRight className="w-6 h-6 text-[#FF69B4]" />
                  )}
                </div>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 py-4 bg-[#FFF0F5] border-t-4 border-[#333333]">
                  <p className="font-['Montserrat'] text-base md:text-lg text-[#333333] leading-relaxed">
                    {policy.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
