/**
 * Utility for enforcing exhaustiveness checks in the type system.
 *
 * @see https://basarat.gitbook.io/typescript/type-system/discriminated-unions#throw-in-exhaustive-checks
 *
 * @param value The variable with no remaining values
 */
export const assertNever = (value: never): never => {
  throw new Error(`Unexpected value should never occur: ${value}`);
};

/**
 * Utility for picking specific keys from an object.
 *
 * @param base The object to pick keys from.
 * @param keys The keys to pick from the object.
 * @returns A new object containing only the picked keys.
 */
type AllKeys<T> = T extends unknown ? keyof T : never;

/**
 * Utility for picking specific keys from an object.
 *
 * @param base The object to pick keys from.
 * @param keys The keys to pick from the object.
 * @returns A new object containing only the picked keys.
 */
export const pick = <O, K extends AllKeys<O>>(
  base: O,
  keys: readonly K[]
): Pick<O, K> => {
  const entries = keys
    .map((key) => [key, base?.[key]])
    .filter(([_, value]) => value !== undefined);
  return Object.fromEntries(entries);
};

/**
 * Utility for checking if a value is an object.
 *
 * @param o The value to check.
 * @returns True if the value is an object, false otherwise.
 */
export const isObject = (o: unknown): o is Record<PropertyKey, unknown> => {
  return typeof o === "object" && o !== null;
};
