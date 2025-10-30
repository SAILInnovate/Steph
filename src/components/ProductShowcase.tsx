import { useState, useRef, useEffect } from 'react';

export function ProductShowcase() {
  const [activeTab, setActiveTab] = useState<'cases' | 'florals'>('cases');
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

  const phoneCaseImages = ['📱✨', '💎📱', '🌟📱', '💖📱', '🎀📱'];
  const floralImages = ['🌸💐', '🌹🌺', '🌷🌼', '💐🌻', '🌺🌹'];

  const currentImages = activeTab === 'cases' ? phoneCaseImages : floralImages;

  return (
    <section ref={sectionRef} className="py-20 px-6 relative z-10">
      <div
        className={`max-w-6xl mx-auto transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <h2 className="text-4xl md:text-5xl font-['Pacifico'] text-[#FF69B4] text-center mb-12">
          My Creations
        </h2>

        <div className="flex gap-4 justify-center mb-8">
          <button
            onClick={() => setActiveTab('cases')}
            className={`px-8 py-4 font-['Montserrat'] font-bold text-lg border-4 border-[#333333] transition-all duration-200 ${
              activeTab === 'cases'
                ? 'bg-[#FF69B4] text-white shadow-[6px_6px_0px_#333333]'
                : 'bg-white text-[#FF69B4] shadow-[4px_4px_0px_#333333] hover:shadow-[6px_6px_0px_#333333]'
            }`}
          >
            Phone Cases
          </button>
          <button
            onClick={() => setActiveTab('florals')}
            className={`px-8 py-4 font-['Montserrat'] font-bold text-lg border-4 border-[#333333] transition-all duration-200 ${
              activeTab === 'florals'
                ? 'bg-[#FF69B4] text-white shadow-[6px_6px_0px_#333333]'
                : 'bg-white text-[#FF69B4] shadow-[4px_4px_0px_#333333] hover:shadow-[6px_6px_0px_#333333]'
            }`}
          >
            Floral Bouquets
          </button>
        </div>

        <div className="overflow-x-auto pb-8 scrollbar-hide">
          <div className="flex gap-6 px-4" style={{ scrollSnapType: 'x mandatory' }}>
            {currentImages.map((img, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-64 h-64 md:w-80 md:h-80 bg-white border-4 border-[#333333] shadow-[8px_8px_0px_#333333] transition-all duration-300 hover:scale-105 hover:shadow-[12px_12px_0px_#333333] cursor-pointer"
                style={{ scrollSnapAlign: 'center' }}
              >
                <div className="w-full h-full flex items-center justify-center text-8xl bg-gradient-to-br from-[#FFF0F5] to-[#FFC2E2]">
                  {img}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
