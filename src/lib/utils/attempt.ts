/**
 * Safely tries an async operation, returning a tuple of [error, result]
 * @template T The expected return type of the promise
 * @param {Promise<T>} promise Promise to be executed
 * @returns {Promise<[Error, null] | [null, T]>} Tuple of [error, result]
 */

export async function attempt<T>(
  promise: Promise<T>
): Promise<[Error, null] | [null, T]> {
  try {
    const value = await promise;
    return [null, value];
  } catch (error) {
    return [error instanceof Error ? error : new Error(String(error)), null];
  }
}