import { useEffect, useState } from 'react';

export function FloatingElements() {
  const [items, setItems] = useState<any[]>([]);

  // The icons that represent your brand
  const icons = ['💅', '🎀', '🌸', '💎', '✨', '💖', '📱'];

  useEffect(() => {
    // Create 12 elements with random properties
    const newItems = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      icon: icons[Math.floor(Math.random() * icons.length)],
      left: Math.random() * 100, // Random horizontal position
      delay: Math.random() * 5,  // Random start time
      duration: 15 + Math.random() * 10, // Slow, elegant speed (15-25s)
      size: 1 + Math.random() * 2, // Random size (1rem to 3rem)
      blur: Math.random() > 0.5 ? 'blur-[1px]' : 'blur-none', // Some are blurry for depth
      opacity: 0.3 + Math.random() * 0.4 // Random transparency
    }));
    setItems(newItems);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {items.map((item) => (
        <div
          key={item.id}
          className={`absolute animate-float-chic ${item.blur}`}
          style={{
            left: `${item.left}%`,
            top: '100%', // Start below screen
            fontSize: `${item.size}rem`,
            opacity: item.opacity,
            animationDelay: `-${item.delay}s`, // Negative delay starts animation immediately at different points
            animationDuration: `${item.duration}s`,
          }}
        >
          {item.icon}
        </div>
      ))}
      
      {/* Optional: A subtle pink gradient overlay to blend everything */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFF0F5]/20 to-[#FFF0F5]/50 z-0"></div>
    </div>
  );
}