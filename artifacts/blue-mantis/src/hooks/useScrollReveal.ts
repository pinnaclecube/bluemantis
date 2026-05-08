import { useInView } from 'react-intersection-observer';

export function useScrollReveal(delay = 0) {
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true });
  return {
    ref,
    style: {
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(24px)',
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
    },
  };
}
