'use client';

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react';

type Direction = 'left' | 'right' | 'up';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
  direction?: Direction;
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  as: Component = 'div',
  direction = 'up',
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <Component
      ref={ref as never}
      data-reveal
      data-direction={direction}
      data-visible={visible ? 'true' : 'false'}
      className={className}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </Component>
  );
}
