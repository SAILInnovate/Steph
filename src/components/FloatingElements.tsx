export function FloatingElements() {
  const elements = Array.from({ length: 15 }, (_, i) => i);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((i) => (
        <div
          key={i}
          className="absolute animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${8 + Math.random() * 4}s`,
          }}
        >
          {i % 3 === 0 ? (
            <div className="text-2xl">✨</div>
          ) : (
            <div className="text-xl text-[#FF69B4]">♥</div>
          )}
        </div>
      ))}
    </div>
  );
}
