import { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronDown, ShoppingBag, Sparkles, HeartHandshake, CreditCard, ClipboardList } from 'lucide-react';

interface PolicyItem {
  title: string;
  content: string;
  icon: any;
}

export function Policies() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Default first one open
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
      icon: ShoppingBag
    },
    {
      title: 'Custom Orders',
      content: 'Custom orders are non-refundable and cannot be cancelled once production begins. No returns or exchanges on personalized items.',
      icon: Sparkles
    },
    {
      title: 'Care & Use',
      content: 'Please handle all handmade pieces with care. Phone cases should be cleaned gently with a soft cloth. Keep floral arrangements away from direct sunlight.',
      icon: HeartHandshake
    },
    {
      title: 'Payment Policy',
      content: 'Payment is due at the studio/appointment. We accept cash and bank transfer. Full payment is required before starting custom orders.',
      icon: CreditCard
    },
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section ref={sectionRef} className="py-20 px-6 max-w-5xl mx-auto relative z-10">
      <div
        className={`transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Header with Icon */}
        <div className="flex items-center justify-center gap-4 mb-12">
            <div className="bg-white p-3 border-4 border-black shadow-[4px_4px_0px_#000] rounded-full">
                <ClipboardList className="w-8 h-8 text-[#FF69B4]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-['Pacifico'] text-[#FF69B4] text-center text-shadow-barbie">
            The Fine Print
            </h2>
        </div>

        {/* The Card Container */}
        <div className="bg-white p-2 md:p-4 border-4 border-black shadow-[12px_12px_0px_#333] rounded-3xl relative">
            
            {/* Decorative "Paper Clip" at top */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-[#333] rounded-full border-4 border-white z-20"></div>

            <div className="mt-6 space-y-3">
            {policies.map((policy, index) => {
                const Icon = policy.icon;
                const isOpen = openIndex === index;

                return (
                <div
                    key={index}
                    className={`border-4 border-black rounded-xl overflow-hidden transition-all duration-300 ${
                        isOpen ? 'shadow-[6px_6px_0px_#FF69B4] -translate-y-1' : 'shadow-none'
                    }`}
                >
                    <button
                    onClick={() => toggleAccordion(index)}
                    className={`w-full px-6 py-5 flex items-center justify-between text-left transition-colors duration-300 ${
                        isOpen ? 'bg-[#FF69B4] text-white' : 'bg-white text-[#333] hover:bg-[#FFF0F5]'
                    }`}
                    >
                    <div className="flex items-center gap-4">
                        <Icon className={`w-6 h-6 ${isOpen ? 'text-white' : 'text-[#FF69B4]'}`} />
                        <span className="font-['Montserrat'] font-bold text-lg md:text-xl tracking-wide">
                        {policy.title}
                        </span>
                    </div>
                    <div className="flex-shrink-0">
                        {isOpen ? (
                        <ChevronDown className="w-6 h-6 text-white" />
                        ) : (
                        <ChevronRight className="w-6 h-6 text-[#FF69B4]" />
                        )}
                    </div>
                    </button>
                    
                    <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden bg-white ${
                        isOpen ? 'max-h-96' : 'max-h-0'
                    }`}
                    >
                    <div className="px-6 py-6 border-t-4 border-black bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]">
                        <p className="font-['Montserrat'] font-medium text-base md:text-lg text-[#333] leading-relaxed">
                        {policy.content}
                        </p>
                    </div>
                    </div>
                </div>
                );
            })}
            </div>
        </div>
      </div>
    </section>
  );
}