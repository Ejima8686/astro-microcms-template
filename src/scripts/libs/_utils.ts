export function sleep(time = 1000) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function lerp(start: number, end: number, multiplier: number) {
  return (1 - multiplier) * start + multiplier * end;
}

// Returns a range-limited number {n} between {min} and {max}
// @param {number} n - Current Value
// @param {number} min - Minimum Value
// @param {number} max - Maximum Value
// @returns {number}
export function clamp(n: number, min = 0, max = 1) {
  return Math.min(Math.max(n, min), max);
}

export function normalizeRange(value: number, start: number, end: number, shouldClamp = true) {
  if (start === end) return 0;
  const normalized = (value - start) / (end - start);
  return shouldClamp ? clamp(normalized, 0, 1) : normalized;
}

export function throttle(func: () => void, delay: number) {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;

  return () => {
    const currentTime = Date.now();

    if (currentTime - lastExecTime > delay) {
      func();
      lastExecTime = currentTime;
      timeoutId = null;
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(
        () => {
          func();
          lastExecTime = Date.now();
          timeoutId = null;
        },
        delay - (currentTime - lastExecTime),
      );
    }
    return timeoutId;
  };
}
