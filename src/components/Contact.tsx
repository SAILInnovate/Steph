import { useEffect, useState, useRef } from 'react';
import { Instagram } from 'lucide-react';

export function Contact() {
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

  const handleOrderClick = () => {
    window.open('https://www.instagram.com/stephsluxecreations?igsh=MWJtcXZhMXlqcHkwZw==', '_blank', 'noopener,noreferrer');
  };

  return (
    <section ref={sectionRef} className="py-20 px-6 max-w-4xl mx-auto relative z-10">
      <div
        className={`transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <h2 className="text-4xl md:text-5xl font-['Pacifico'] text-[#FF69B4] text-center mb-8">
          Let's Create Together!
        </h2>

        <p className="font-['Montserrat'] text-lg md:text-xl text-[#333333] text-center mb-12 leading-relaxed">
          Ready to get your custom piece or have a question? I'd love to hear from you!
        </p>

        <div className="flex justify-center mb-12">
          <button
            onClick={handleOrderClick}
            className="group px-8 py-5 bg-[#FF69B4] text-white font-['Montserrat'] font-bold text-lg md:text-xl border-4 border-[#333333] shadow-[8px_8px_0px_#333333] hover:shadow-[12px_12px_0px_#333333] active:shadow-[4px_4px_0px_#333333] transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-3"
          >
            <Instagram className="w-6 h-6" />
            START YOUR CUSTOM ORDER
          </button>
        </div>

        <div className="bg-white border-4 border-[#333333] shadow-[6px_6px_0px_#333333] p-6 md:p-8">
          <p className="font-['Montserrat'] text-base md:text-lg text-[#333333] text-center leading-relaxed">
            Remember you can shop after or before your stephsbeautyclinic appointment.
            Thank you for your support! 💖
          </p>
        </div>

        <footer className="mt-16 text-center">
          <p className="font-['Montserrat'] text-sm text-[#333333] opacity-75">
            © 2025 Steph's Creations. All rights reserved.
          </p>
        </footer>
      </div>
    </section>
  );
}
