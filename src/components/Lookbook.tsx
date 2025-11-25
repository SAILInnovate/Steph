import { Calendar, Palette, Flower, ExternalLink } from 'lucide-react';

export function Lookbook() {
  const items = [
    {
      title: "Nails & Lashes",
      subtitle: "Steph's Beauty Clinic",
      desc: "Gel extensions, BIAB, Art & Volume Lashes.",
      img: "/images/nails-pink.jpg", // The nail pic
      action: "BOOK APPOINTMENT",
      link: "https://www.instagram.com/stephsbeautyclinic/",
      icon: Calendar,
      bgColor: "bg-white"
    },
    {
      title: "Luxe Cases",
      subtitle: "Custom Decoden",
      desc: "Handmade, sparkle-packed, and totally you.",
      img: "/images/case.jpg", // YOUR NEW PHONE CASE PIC
      action: "ORDER CUSTOM CASE",
      link: "https://www.instagram.com/stephsluxecreations/",
      icon: Palette,
      bgColor: "bg-[#FFF0F5]" // Light pink bg for distinction
    },
    {
      title: "Everlasting Flowers",
      subtitle: "Floral Garden",
      desc: "Ribbon roses that last forever. Perfect for gifts.",
      img: "/images/flowers-pink.jpg", // The bouquet pic
      action: "SHOP BOUQUETS",
      link: "https://www.instagram.com/stephsfloralgarden/#",
      icon: Flower,
      bgColor: "bg-white"
    }
  ];

  return (
    <section className="py-12 px-4 max-w-lg mx-auto relative z-10 space-y-12">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div key={idx} className={`${item.bgColor} border-4 border-black rounded-3xl overflow-hidden shadow-[8px_8px_0px_#333]`}>
            
            {/* Header */}
            <div className="p-4 border-b-4 border-black flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-black"></div>
                <h3 className="font-['Montserrat'] font-bold text-sm uppercase tracking-widest">{item.subtitle}</h3>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </div>

            {/* The Image (The Star of the show) */}
            <div className="aspect-square w-full relative group cursor-pointer" onClick={() => window.open(item.link, '_blank')}>
              <img 
                src={item.img} 
                alt={item.title} 
                className="w-full h-full object-cover"
              />
              {/* Tap hint overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="bg-white px-3 py-1 rounded-full font-bold text-xs border-2 border-black opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    TAP TO VISIT
                </span>
              </div>
            </div>

            {/* The Action Area */}
            <div className="p-6 text-center">
              <h2 className="font-['Pacifico'] text-3xl text-[#FF69B4] mb-2">{item.title}</h2>
              <p className="font-['Montserrat'] text-gray-600 text-sm mb-6 font-medium px-4">
                {item.desc}
              </p>
              
              <button 
                onClick={() => window.open(item.link, '_blank')}
                className="w-full py-4 bg-black text-white font-['Montserrat'] font-black text-lg uppercase rounded-xl hover:bg-[#FF69B4] hover:shadow-[4px_4px_0px_#000] active:translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                <Icon size={20} /> {item.action}
              </button>
            </div>
          </div>
        );
      })}
    </section>
  );
}