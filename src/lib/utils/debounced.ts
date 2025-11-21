/**
 * Creates a debounced function that delays invoking fn until after wait milliseconds have elapsed
 * since the last time the debounced function was invoked.
 * 
 * @template T - The function type being debounced
 * @param {T} fn - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @param {Object} [options] - Configuration options
 * @param {boolean} [options.leading=false] - Invoke on the leading edge of the timeout
 * @param {boolean} [options.trailing=true] - Invoke on the trailing edge of the timeout
 * @returns {Function} The debounced function with cancel and flush methods attached
 * 
 * @example
 * const handleSearch = debounce((query) => fetchResults(query), 300);
 * input.addEventListener('input', (e) => handleSearch(e.target.value));
 * 
 * @example
 * const handleSubmit = debounce(submitForm, 1000, { leading: true, trailing: false });
 * button.addEventListener('click', handleSubmit);
 */
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number,
  options: { leading?: boolean; trailing?: boolean } = {}
) {
  const { leading = false, trailing = true } = options;
  
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: ThisParameterType<T> | null = null;
  
  // Use a timestamp to track if we are within the wait period
  let lastCallTime: number | null = null;

  const invokeFunc = (time: number) => {
    const args = lastArgs;
    const thisArg = lastThis;

    lastArgs = null;
    lastThis = null;
    lastCallTime = time;

    if (args) {
      fn.apply(thisArg, args);
    }
  };

  const trailingEdge = () => {
    timeoutId = null;
    // Only invoke if trailing is enabled and we have args to process
    if (trailing && lastArgs) {
      invokeFunc(Date.now());
    } else {
      // Reset args if we aren't invoking to prevent stale data
      lastArgs = null;
      lastThis = null;
    }
  };

  const cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = null;
    lastArgs = null;
    lastThis = null;
    lastCallTime = null;
  };

  const flush = () => {
    if (timeoutId) {
      trailingEdge();
      cancel();
    }
  };

  function debounced(this: ThisParameterType<T>, ...args: Parameters<T>) {
    const now = Date.now();
    const isInvoking = !timeoutId;

    lastArgs = args;
    lastThis = this;
    lastCallTime = now;

    if (isInvoking) {
      if (leading) {
        // Leading: Execute immediately, then wait
        invokeFunc(now); 
        // Set timer only to handle the debounce cooldown
        timeoutId = setTimeout(trailingEdge, wait);
        return;
      }
    }

    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(trailingEdge, wait);
  }

  debounced.cancel = cancel;
  debounced.flush = flush;

  return debounced as typeof debounced & { cancel: typeof cancel; flush: typeof flush };
}

export default debounce;