import { useState, useEffect } from 'react';

const NUM_STARS = 50;
const getRandom = (max) => Math.random() * max;

export default function Background() {
  const [stars, setStars] = useState(() => {
    const initStars = [];
    for (let i = 0; i < NUM_STARS; i++) {
      const shouldTwinkle = Math.random() < 0.3;
      initStars.push({
        id: i,
        top: getRandom(100),
        left: getRandom(100),
        size: 1 + Math.random() * 2,
        baseOpacity: 0.3 + Math.random() * 0.5,
        twinkleDelay: Math.random() * 3000,
        twinkleDuration: 1000 + Math.random() * 1000,
        opacity: 0.3 + Math.random() * 0.5,
        twinkles: shouldTwinkle,
      });
    }
    return initStars;
  });

  useEffect(() => {
    let animationFrameId;

    const animate = (time = 0) => {
      setStars((stars) =>
        stars.map((star) => {
          if (!star.twinkles) return star;

          const elapsed = (time + star.twinkleDelay) % star.twinkleDuration;
          const progress = elapsed / star.twinkleDuration;
          const opacity =
            star.baseOpacity + 0.5 * Math.sin(progress * Math.PI * 2);

          return { ...star, opacity: Math.min(Math.max(opacity, 0), 1) };
        })
      );

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <>
      <div
        className="fixed bottom-0 left-[-25vw] w-[150vw] h-[15vh] z-[1] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, hsl(var(--accent)), transparent)',
          opacity: 0.6,
          filter: 'blur(100px)',
        }}
      />
      <div className="fixed top-0 left-0 w-screen h-screen overflow-hidden pointer-events-none z-0">
        {stars.map(({ id, top, left, size, opacity }) => (
          <div
            key={id}
            className="absolute rounded-full bg-primary"
            style={{
              top: `${top}vh`,
              left: `${left}vw`,
              width: `${size}px`,
              height: `${size}px`,
              opacity,
              transition: 'opacity 0.1s linear',
            }}
          />
        ))}
      </div>
    </>
  );
}