import { useEffect, useState, useRef } from 'react';

export function About() {
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

  return (
    <section ref={sectionRef} className="py-20 px-6 max-w-4xl mx-auto relative z-10">
      <div
        className={`transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <h2 className="text-4xl md:text-5xl font-['Pacifico'] text-[#FF69B4] text-center mb-12">
          Handmade with Love, Care & Creativity
        </h2>

        <div className="flex justify-center mb-8">
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-3xl bg-white border-4 border-[#333333] shadow-[8px_8px_0px_#333333] overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-[#FFC2E2] to-[#FF69B4] flex items-center justify-center text-8xl">
              👩‍🎨
            </div>
          </div>
        </div>

        <p className="font-['Montserrat'] text-lg text-[#333333] text-center leading-relaxed">
          Welcome. I'm Steph, the founder and creator behind my luxe creations and floral garden.
          Every piece you will find here is handmade with love, care, and creativity.
        </p>
      </div>
    </section>
  );
}
