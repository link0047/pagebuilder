/**
 * Deeply merges two objects, with source properties overwriting target properties.
 * Arrays are treated as primitive values and will be completely replaced.
 * 
 * @param target - The target object to merge into
 * @param source - The source object to merge from
 * @returns A new object with merged properties
 */
export function deepMerge<T extends Record<string, any>>(
  target: T, 
  source: Partial<T>
): T {
  const result = { ...target } as any;
  
  for (const key of Object.keys(source)) {
    const sourceValue = source[key];
    
    if (sourceValue !== null && 
        typeof sourceValue === "object" && 
        !Array.isArray(sourceValue)) {
      result[key] = deepMerge(result[key] || {}, sourceValue);
    } else {
      result[key] = sourceValue;
    }
  }
  
  return result;
}