import React from "react";

/**
 * Utilidades para optimización de rendimiento
 */

// Debounce function para optimizar llamadas frecuentes
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function para limitar la frecuencia de ejecución
export const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Memoización simple para funciones costosas
export const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
};

// Hook personalizado para evitar re-renderizaciones innecesarias
export const usePrevious = (value) => {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

// Función para limpiar timeouts e intervals
export const clearTimers = (timers) => {
  if (Array.isArray(timers)) {
    timers.forEach((timer) => {
      if (timer) {
        clearTimeout(timer);
        clearInterval(timer);
      }
    });
  }
};

// Función para validar si un componente debe re-renderizar
export const shouldComponentUpdate = (prevProps, nextProps, keys = []) => {
  if (keys.length === 0) {
    return JSON.stringify(prevProps) !== JSON.stringify(nextProps);
  }

  return keys.some((key) => {
    const prevValue = prevProps[key];
    const nextValue = nextProps[key];

    if (typeof prevValue === "object" && typeof nextValue === "object") {
      return JSON.stringify(prevValue) !== JSON.stringify(nextValue);
    }

    return prevValue !== nextValue;
  });
};

// Función para optimizar listas grandes
export const chunkArray = (array, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

// Función para detectar si el dispositivo es móvil
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

// Función para optimizar imágenes
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Función para optimizar el scroll
export const smoothScroll = (element, to, duration) => {
  const start = element.scrollTop;
  const change = to - start;
  const increment = 20;
  let currentTime = 0;

  const animateScroll = () => {
    currentTime += increment;
    const val = Math.easeInOutQuad(currentTime, start, change, duration);
    element.scrollTop = val;
    if (currentTime < duration) {
      setTimeout(animateScroll, increment);
    }
  };

  Math.easeInOutQuad = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  animateScroll();
};

export default {
  debounce,
  throttle,
  memoize,
  usePrevious,
  clearTimers,
  shouldComponentUpdate,
  chunkArray,
  isMobileDevice,
  preloadImage,
  smoothScroll,
};
