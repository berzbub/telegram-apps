import { signal, DestroyRef, inject } from '@angular/core';

/**
 * Returns an Angular readonly signal that stays in sync with the given telegram-apps signal,
 * automatically unsubscribing when the current injection context is destroyed.
 * @param sig - a telegram-apps signal.
 */
export function useSignal<T>(sig: {
  (): T;
  sub(fn: (v: T) => void): VoidFunction;
}): () => T {
  const angularSignal = signal<T>(sig());
  const unsub = sig.sub((value) => {
    angularSignal.set(value);
  });
  inject(DestroyRef).onDestroy(unsub);
  return angularSignal.asReadonly();
}
