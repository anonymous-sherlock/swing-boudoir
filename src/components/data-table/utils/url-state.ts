import { useLocation, useRouter, useSearch } from "@tanstack/react-router";
import { useCallback, useState, useEffect, useRef, useMemo } from "react";
import { isDeepEqual } from "./deep-utils";

// Batch update state management with instance tracking to prevent race conditions
interface BatchUpdateState {
  isInBatchUpdate: boolean;
  batchId: number;
  pendingUpdates: Map<string, PendingUpdateEntry>;
}

interface PendingUpdateEntry<T = unknown> {
  value: T;
  defaultValue: T;
  serialize: (value: T) => string;
  areEqual: (a: T, b: T) => boolean;
}

// Global state with proper isolation
const batchUpdateState: BatchUpdateState = {
  isInBatchUpdate: false,
  batchId: 0,
  pendingUpdates: new Map<string, PendingUpdateEntry>(),
};

// Timeout to prevent stuck batch updates
let batchTimeoutId: NodeJS.Timeout | null = null;
const BATCH_TIMEOUT = 100; // 100ms timeout for batch updates

// Track the last URL update to ensure it's properly applied
const lastUrlUpdate = {
  timestamp: 0,
  params: new URLSearchParams(),
};

/**
 * Custom hook for managing URL-based state
 */
export function useUrlState<T>(
  key: string,
  defaultValue: T,
  options: {
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
  } = {}
) {
  const router = useRouter();
  const pathname = useLocation().pathname;
  const searchParams = useMemo(() => new URLSearchParams(window.location.search), []);

  const isUpdatingUrl = useRef(false);
  const lastSetValue = useRef<T>(defaultValue);

  // Serialization / deserialization
  const serialize = useMemo(
    () => options.serialize ||
    ((value: T) =>
      typeof value === "object" ? JSON.stringify(value) : String(value)),
    [options.serialize]
  );

  const deserialize = useMemo(
    () => options.deserialize ||
    ((value: string) => {
      try {
        if (typeof defaultValue === "number") {
          // Remove quotes if they exist (fix for double-encoded URL params)
          const cleanValue = value.replace(/^"(.*)"$/, '$1');
          const num = Number(cleanValue);
          return Number.isNaN(num) ? defaultValue : (num as unknown as T);
        }
        if (typeof defaultValue === "boolean") {
          return (value === "true") as unknown as T;
        }
        if (typeof defaultValue === "object") {
          try {
            const parsed = JSON.parse(value) as T;
            if (parsed && typeof parsed === "object") {
              if (key === "dateRange") {
                const dr = parsed as { from_date?: string; to_date?: string };
                if (!dr.from_date || !dr.to_date) {
                  console.warn(`Invalid dateRange format in URL: ${value}`);
                  return defaultValue;
                }
              }
              return parsed;
            }
            return defaultValue;
          } catch (e) {
            console.warn(`Error parsing JSON param ${key}: ${e}`);
            return defaultValue;
          }
        }
        return value as unknown as T;
      } catch (e) {
        console.warn(`Error deserializing param ${key}: ${e}`);
        return defaultValue;
      }
    }),
    [options.deserialize, defaultValue, key]
  );

  // Get initial value
  const getValueFromUrl = useCallback(() => {
    if (batchUpdateState.pendingUpdates.has(key)) {
      return batchUpdateState.pendingUpdates.get(key)?.value as T;
    }
    const paramValue = searchParams.get(key);
    if (paramValue === null) return defaultValue;
    if (key === "search" && typeof defaultValue === "string") {
      return decodeURIComponent(paramValue) as unknown as T;
    }
    
    
    return deserialize(paramValue);
  }, [searchParams, key, deserialize, defaultValue]);

  const [value, setValue] = useState<T>(getValueFromUrl);
  const prevSearchParamsRef = useRef<URLSearchParams | null>(null);

  const areEqual = useMemo(() => {
    return (a: T, b: T) => {
      if (typeof a === "object" && typeof b === "object") {
        return isDeepEqual(a, b);
      }
      return a === b;
    };
  }, []);

  const currentValueRef = useRef<T>(value);
  useEffect(() => {
    currentValueRef.current = value;
  }, [value]);

  // React to search param changes
  useEffect(() => {
    if (isUpdatingUrl.current) {
      isUpdatingUrl.current = false;
      return;
    }

    const searchParamsString = searchParams.toString();
    if (
      prevSearchParamsRef.current &&
      prevSearchParamsRef.current.toString() === searchParamsString
    ) {
      return;
    }

    prevSearchParamsRef.current = new URLSearchParams(searchParamsString);
    const newValue = getValueFromUrl();

    if (
      !areEqual(lastSetValue.current, newValue) &&
      !areEqual(currentValueRef.current, newValue)
    ) {
      lastSetValue.current = newValue;
      setValue(newValue);
    } else if (
      batchUpdateState.pendingUpdates.has(key) &&
      areEqual(
        batchUpdateState.pendingUpdates.get(key)?.value as unknown as T,
        newValue
      )
    ) {
      batchUpdateState.pendingUpdates.delete(key);
    }
  }, [searchParams, getValueFromUrl, key, areEqual]);

  // ✅ Update URL immediately (TanStack Router way)
  const updateUrlNow = useCallback(
    async (params: URLSearchParams) => {
      const now = Date.now();
      lastUrlUpdate.timestamp = now;
      lastUrlUpdate.params = params;

      await router.navigate({
        to: pathname,
        search: Object.fromEntries(params.entries()),
        replace: true,
      });

      isUpdatingUrl.current = false;
      return params;
    },
    [router, pathname]
  );

  // Update value & batch updates
  const updateValue = useCallback(
    (newValue: T | ((prevValue: T) => T)) => {
      const resolvedValue =
        typeof newValue === "function"
          ? (newValue as (prev: T) => T)(value)
          : newValue;

      if (areEqual(value, resolvedValue)) {
        return Promise.resolve(new URLSearchParams(searchParams.toString()));
      }

      lastSetValue.current = resolvedValue;

      batchUpdateState.pendingUpdates.set(key, {
        value: resolvedValue,
        defaultValue,
        serialize: serialize as (value: unknown) => string,
        areEqual: areEqual as (a: unknown, b: unknown) => boolean,
      });

      setValue(resolvedValue);
      isUpdatingUrl.current = true;

      if (key === "pageSize") {
        const pageEntry = (batchUpdateState.pendingUpdates.get("page") as PendingUpdateEntry<unknown>) || {
          value: 1,
          defaultValue: 1,
          serialize: (v: unknown) => String(v),
          areEqual: (a: unknown, b: unknown) => a === b,
        };
        batchUpdateState.pendingUpdates.set("page", {
          ...pageEntry,
          value: 1,
        });
      }

      if (batchUpdateState.isInBatchUpdate) {
        return Promise.resolve(new URLSearchParams(searchParams.toString()));
      }

      batchUpdateState.isInBatchUpdate = true;
      batchUpdateState.batchId++;
      const currentBatchId = batchUpdateState.batchId;

      if (batchTimeoutId) clearTimeout(batchTimeoutId);

      return new Promise<URLSearchParams>((resolve) => {
        const processBatch = () => {
          if (currentBatchId !== batchUpdateState.batchId) return;

          const params = new URLSearchParams(searchParams.toString());
          let pageSizeChangedInBatch = false;
          let sortByInBatch = false;
          let sortOrderInBatch = false;

          const sortByInURL = params.has("sortBy");
          const defaultSortOrder = "desc";

          for (const [updateKey] of batchUpdateState.pendingUpdates.entries()) {
            if (updateKey === "sortBy") sortByInBatch = true;
            if (updateKey === "sortOrder") sortOrderInBatch = true;
          }

          for (const [updateKey, entry] of batchUpdateState.pendingUpdates) {
            const { value: updateValue, defaultValue, serialize, areEqual } =
              entry;

            if (updateKey === "sortBy") {
              params.set(updateKey, serialize(updateValue));
              if (!sortOrderInBatch) {
                params.set("sortOrder", params.get("sortOrder") || defaultSortOrder);
              }
            } else if (updateKey === "sortOrder") {
              if (sortByInURL || sortByInBatch) {
                params.set(updateKey, serialize(updateValue));
              } else if (areEqual(updateValue, defaultValue)) {
                params.delete(updateKey);
              } else {
                params.set(updateKey, serialize(updateValue));
              }
            } else if (areEqual(updateValue, defaultValue)) {
              params.delete(updateKey);
            } else {
              if (updateKey === "search" && typeof updateValue === "string") {
                params.set(updateKey, encodeURIComponent(updateValue));
              } else {
                params.set(updateKey, serialize(updateValue));
              }
            }

            if (updateKey === "pageSize") {
              pageSizeChangedInBatch = true;
            }
          }

          if (pageSizeChangedInBatch) {
            params.set("page", "1");
          }

          batchUpdateState.pendingUpdates.clear();
          batchUpdateState.isInBatchUpdate = false;

          if (batchTimeoutId) {
            clearTimeout(batchTimeoutId);
            batchTimeoutId = null;
          }

          updateUrlNow(params).then(resolve);
        };

        queueMicrotask(processBatch);
        batchTimeoutId = setTimeout(processBatch, BATCH_TIMEOUT);
      });
    },
    [searchParams, key, serialize, value, defaultValue, updateUrlNow, areEqual]
  );

  return [value, updateValue] as const;
}

// --- Helpers ---
export function formatDateForUrl(date: Date | undefined): string {
  if (!date) return "";
  return date.toISOString().split("T")[0];
}

export function validateDateString(dateString: string): boolean {
  if (!dateString) return false;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) return false;
  const date = new Date(dateString);
  return !Number.isNaN(date.getTime());
}

export function parseDateFromUrl(dateString: string): Date | undefined {
  if (!validateDateString(dateString)) return undefined;
  return new Date(dateString);
}
