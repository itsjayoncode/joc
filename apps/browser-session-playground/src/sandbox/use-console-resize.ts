import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

const DEFAULT_HEIGHT = 160;
const MIN_HEIGHT = 96;
const COLLAPSED_HEIGHT = 42;

function maxHeight(): number {
  if (typeof window === "undefined") {
    return 420;
  }
  return Math.round(window.innerHeight * 0.55);
}

/** Drag-to-resize height for the sandbox console dock. */
export function useConsoleResize(open: boolean) {
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [resizing, setResizing] = useState(false);
  const dragRef = useRef<{ readonly startY: number; readonly startHeight: number } | null>(null);

  const onHandlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!open) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      dragRef.current = { startY: event.clientY, startHeight: height };
      setResizing(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [height, open],
  );

  const onHandlePointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) {
      return;
    }
    const next = drag.startHeight + (drag.startY - event.clientY);
    setHeight(Math.min(maxHeight(), Math.max(MIN_HEIGHT, Math.round(next))));
  }, []);

  const endDrag = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) {
      return;
    }
    dragRef.current = null;
    setResizing(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }
    setHeight((current) => Math.min(maxHeight(), Math.max(MIN_HEIGHT, current)));
  }, [open]);

  return {
    height: open ? height : COLLAPSED_HEIGHT,
    resizing,
    onHandlePointerDown,
    onHandlePointerMove,
    onHandlePointerUp: endDrag,
    onHandlePointerCancel: endDrag,
  };
}
