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
 * @returns {(this: ThisParameterType<T>, ...args: Parameters<T>) => void}
 * The debounced function with cancel and flush methods attached
 *   - cancel(): Cancels any pending invocation and clears internal state
 *   - flush(): Immediately invokes any pending trailing call and cancels the timer
 *
 * @example
 * const handleSearch = debounce((query) => fetchResults(query), 300);
 * input.addEventListener('input', (e) => handleSearch(e.target.value));
 *
 * @example
 * const handleSubmit = debounce(submitForm, 1000, { leading: true, trailing: false });
 * button.addEventListener('click', handleSubmit);
 *
 * @example
 * // Cleanup on unmount
 * const debouncedFn = debounce(fn, 300);
 * debouncedFn.flush(); // force invoke immediately
 * debouncedFn.cancel(); // or discard pending call
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

   const invokeFunc = () => {
     const args = lastArgs;
     const thisArg = lastThis;
     lastArgs = null;
     lastThis = null;
     if (args) fn.apply(thisArg, args);
   };

   const trailingEdge = () => {
     timeoutId = null;
     if (trailing && lastArgs) {
       invokeFunc();
     } else {
       lastArgs = null;
       lastThis = null;
     }
   };

   const cancel = () => {
     if (timeoutId) clearTimeout(timeoutId);
     timeoutId = null;
     lastArgs = null;
     lastThis = null;
   };

   // Flush: immediately invoke if a call is pending, then cancel the timer
   const flush = () => {
     if (timeoutId) {
       clearTimeout(timeoutId);
       timeoutId = null;
       trailingEdge(); // invoke with current lastArgs if trailing
     }
   };

   function debounced(this: ThisParameterType<T>, ...args: Parameters<T>) {
     lastArgs = args;
     lastThis = this;

     const shouldInvokeLeading = leading && !timeoutId;

     // Always reset the timer
     if (timeoutId) clearTimeout(timeoutId);
     timeoutId = setTimeout(trailingEdge, wait);

     // Leading edge: invoke immediately (after saving args, before clearing them)
     if (shouldInvokeLeading) invokeFunc();
   }

   debounced.cancel = cancel;
   debounced.flush = flush;
   return debounced as typeof debounced & { cancel: typeof cancel; flush: typeof flush };
 }

 export default debounce;
