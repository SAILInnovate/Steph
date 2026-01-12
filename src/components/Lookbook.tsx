import { Calendar, Palette, Flower, ExternalLink } from 'lucide-react';

// We define that this component expects a function called 'onOpenBooking'
export function Lookbook({ onOpenBooking }: { onOpenBooking: () => void }) {
  
  const items = [
    {
      title: "Nails & Lashes",
      subtitle: "Steph's Beauty Clinic",
      // CHANGED: Added "Droylsden" and "Manchester" here naturally
      desc: "Gel extensions, BIAB, and Volume Lashes in Manchester.", 
      img: "/images/nailsclean.jpg", 
      action: "BOOK APPOINTMENT",
      link: "https://www.instagram.com/stephsbeautyclinic/",
      icon: Calendar,
      bgColor: "bg-white",
      isBooking: true 
    },
    {
      title: "Luxe Cases",
      subtitle: "Custom Decoden UK", // CHANGED: Added "UK"
      // CHANGED: Added "Shipped from Manchester"
      desc: "Handmade, sparkle-packed decoden cases. Shipped from Manchester.",
      img: "/images/case.jpg",
      action: "ORDER CUSTOM CASE",
      link: "https://www.instagram.com/stephsluxecreations/",
      icon: Palette,
      bgColor: "bg-[#FFF0F5]",
      isBooking: false
    },
    {
      title: "Everlasting Flowers",
      subtitle: "Floral Garden",
      desc: "Ribbon roses that last forever. The perfect keepsake gift.",
      img: "/images/flowers-pink.jpg", 
      action: "SHOP BOUQUETS",
      link: "https://www.instagram.com/stephsfloralgarden/#",
      icon: Flower,
      bgColor: "bg-white",
      isBooking: false
    }
  ];

  return (
    <section className="py-12 px-4 max-w-lg mx-auto relative z-10 space-y-12">
      {items.map((item, idx) => {
        const Icon = item.icon;

        // This function decides what to do based on which item was clicked
        const handleAction = () => {
            if (item.isBooking) {
                // If it's the nails item, run the function passed from App.tsx
                onOpenBooking();
            } else {
                // Otherwise, open the link in a new tab
                window.open(item.link, '_blank');
            }
        };

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
            {/* We attach handleAction here so tapping the image works too */}
            <div className="aspect-square w-full relative group cursor-pointer" onClick={handleAction}>
              <img 
                src={item.img} 
                // CHANGED: Dynamic alt text with keywords
                alt={`${item.title} - Steph's World Manchester`} 
                className="w-full h-full object-cover"
              />
              {/* Tap hint overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="bg-white px-3 py-1 rounded-full font-bold text-xs border-2 border-black opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    {item.isBooking ? "TAP TO BOOK" : "TAP TO VISIT"}
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
                onClick={handleAction}
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