// src/hooks/useDebouncedValue.ts
import { useEffect, useState } from 'react';

/**
 * ✅ P2: отложенное значение — используется, чтобы не дёргать поиск
 * на каждое нажатие клавиши.
 */
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
