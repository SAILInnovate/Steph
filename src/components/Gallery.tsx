import { Heart } from 'lucide-react';

export function Gallery() {
  const images = [
    { src: '/images/nails-pink.jpg', rotate: '-rotate-2', caption: 'Custom Sets' },
    { src: '/images/lashes-close.jpg', rotate: 'rotate-3', caption: 'Volume Lashes' },
    { src: '/images/flowers-red.jpg', rotate: '-rotate-1', caption: '18th Birthday' },
    { src: '/images/flowers-mixed.jpg', rotate: 'rotate-2', caption: 'Anniversaries' },
  ];

  return (
    <section className="py-24 px-6 relative z-10 bg-[#FF69B4] border-y-8 border-black overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]"></div>

      <div className="max-w-7xl mx-auto relative">
        <div className="flex flex-col items-center mb-16">
            <div className="bg-white p-4 rounded-full border-4 border-black shadow-[4px_4px_0px_#333] mb-6">
                <Heart fill="#FF69B4" className="w-8 h-8 text-[#FF69B4]" />
            </div>
            <h2 className="text-4xl md:text-6xl font-['Pacifico'] text-white text-center text-shadow-barbie">
            Made with Love
            </h2>
        </div>

        {/* Masonry/Polaroid Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4">
          {images.map((img, index) => (
            <div 
                key={index} 
                className={`bg-white p-3 pb-12 border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,0.3)] transform ${img.rotate} hover:scale-105 hover:rotate-0 hover:z-10 transition-all duration-300 ease-out cursor-pointer`}
            >
              <div className="aspect-square w-full overflow-hidden border-2 border-gray-200 mb-4 bg-gray-100">
                <img 
                    src={img.src} 
                    alt={img.caption} 
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="text-center">
                <p className="font-['Pacifico'] text-2xl text-[#333]">{img.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}