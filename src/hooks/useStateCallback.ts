import { useState, useEffect, useCallback, useRef } from "react";

export function useStateCallback<T>(
  initialState: T,
  forceUpdate: boolean = true
): [T, (state: T, cb?: (state: T) => void) => void] {
  const [state, setState] = useState(initialState);
  const cbRef = useRef<((state: T) => void) | undefined>(undefined); // init mutable ref container for callbacks

  const setStateCallback = useCallback((newState: T, cb?: (newState: T) => void) => {
    cbRef.current = cb; // store current, passed callback in ref

    setState((state) => {
      if (forceUpdate && cbRef.current && newState === state) {
        cbRef.current(newState);
        cbRef.current = undefined;
      }
      return typeof newState === "function" ? newState(state) : newState;
    });
  }, []); // keep object reference stable, exactly like `useState`

  useEffect(() => {
    // cb.current is `undefined` on initial render,
    // so we only invoke callback on state updates
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = undefined; // reset callback after execution
    }
  }, [state]);

  return [state, setStateCallback];
}
