import { useCallback, useRef } from "react";

export interface NullabilityMiddlewareOptions {
  readonly publicValue: any;
  readonly publicHandleChange: (path: string, value: any) => void;
  readonly path: string;
  readonly isNullable: boolean;
}

export interface NullabilityMiddlewareOutput {
  readonly privateValue: any;
  readonly privateHandleChange: (path: string, value: any) => void;
  readonly isNull: boolean;

  /**
   * Sets the value to null if true provided or
   * from null back to the last cached value if false provided.
   */
  readonly setNull: (toNull: boolean) => void;
}

/**
 * Stores the control value when it becomes null
 */
export function useNullabilityMiddleware(
  options: NullabilityMiddlewareOptions,
): NullabilityMiddlewareOutput {
  // === public end of the middleware ===

  const { publicValue, publicHandleChange, path, isNullable } = options;

  // non-nullable middleware bypass
  if (!isNullable) {
    return {
      privateValue: publicValue,
      privateHandleChange: publicHandleChange,
      isNull: publicValue === null,
      setNull: (_: boolean) => {},
    };
  }

  // makes sure we won't store null in cache
  // (this would make the field get stuck in the null position)
  function sanitizeCacheValue(v: any): any {
    return v === null ? undefined : v;
  }

  const setPublicValue = useCallback(
    (v: any) => {
      publicHandleChange(path, v);
    },
    [publicHandleChange, path],
  );

  // === middleware logic ===

  const isNull = publicValue === null;

  // cache remembers the value when null
  const cache = useRef<any>(sanitizeCacheValue(publicValue));

  // keep cache synced with the public value when not null
  // (public value changes with external updates but also with internal)
  if (!isNull && publicValue !== cache.current) {
    cache.current = sanitizeCacheValue(publicValue);
  }

  let privateValue = isNull ? cache.current : publicValue;

  const setPrivateValue = useCallback(
    (v: any) => {
      if (isNull) {
        // keep cache synced with the private value when null
        cache.current = sanitizeCacheValue(v);
      } else {
        setPublicValue(v); // propagate to public value when not null
      }
    },
    [isNull, setPublicValue],
  );

  const setNull = useCallback(
    (toNull: boolean) => {
      if (toNull) {
        // cache value & set null
        cache.current = sanitizeCacheValue(publicValue);
        setPublicValue(null);
      } else {
        // restore value
        setPublicValue(cache.current);
      }
    },
    [publicValue, setPublicValue],
  );

  // === private end of the middleware ===

  const privateHandleChange = useCallback(
    (p: string, v: any) => {
      if (p === path) {
        setPrivateValue(v);
      } else {
        publicHandleChange(p, v);
      }
    },
    [setPrivateValue, publicHandleChange],
  );

  return {
    privateValue,
    privateHandleChange,
    isNull,
    setNull,
  };
}
