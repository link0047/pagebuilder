/**
 * A Map to store the current ID count for each signature.
 */
const uidMap = new Map();

/**
 * Generates a unique ID for a given signature.
 * If the signature doesn't exist, it initializes it with 0.
 * If it exists, it increments the current value by 1.
 * 
 * @param {string} [signature="uid"] - The signature for which to generate an ID.
 * @returns {number} The generated ID.
 */
export function generateId(signature = "uid") {
  (!uidMap.has(signature)) 
		? uidMap.set(signature, 0)
		: uidMap.set(signature, uidMap.get(signature) + 1);
	
  return uidMap.get(signature);
}

/**
 * Resets the ID counter for a given signature to 0.
 * If the signature doesn't exist in the map, this function does nothing.
 * 
 * @param {string} [signature="uid"] - The signature for which to reset the ID counter.
 */
export function resetId(signature = "uid") {
  if (uidMap.has(signature)) {
    uidMap.set(signature, 0);
  }
}