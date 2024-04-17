const log2 = (message, type = 'log') => {
  if (type === 'error') {
    if (console && typeof console.error === 'function') { console.error(message); }
  } else {
    if (console && typeof console.log === 'function') { console.log(message); }
  }
};

const error = message => log2(message, 'error');

const isGamepadSupported = () =>
  (navigator.getGamepads && typeof navigator.getGamepads === 'function') ||
  (navigator.getGamepads && typeof (navigator as any).webkitGetGamepads === 'function') ||
  false;

const emptyEvents = () => ({ action: () => {}, after: () => {}, before: () => {} });

export { isGamepadSupported, log2, error, emptyEvents };
