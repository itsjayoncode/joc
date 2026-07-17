import { useCallback, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

const DEFAULT_WIDTH = 260;
const MIN_WIDTH = 200;
const MAX_WIDTH = 520;

/** Drag-to-resize width for the sandbox left config column. */
export function useColumnResize(options?: {
  readonly defaultWidth?: number;
  readonly minWidth?: number;
  readonly maxWidth?: number;
}) {
  const minWidth = options?.minWidth ?? MIN_WIDTH;
  const maxWidth = options?.maxWidth ?? MAX_WIDTH;
  const [width, setWidth] = useState(options?.defaultWidth ?? DEFAULT_WIDTH);
  const [resizing, setResizing] = useState(false);
  const dragRef = useRef<{ readonly startX: number; readonly startWidth: number } | null>(null);

  const onHandlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      dragRef.current = { startX: event.clientX, startWidth: width };
      setResizing(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [width],
  );

  const onHandlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag) {
        return;
      }
      const next = drag.startWidth + (event.clientX - drag.startX);
      setWidth(Math.min(maxWidth, Math.max(minWidth, Math.round(next))));
    },
    [maxWidth, minWidth],
  );

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

  return {
    width,
    resizing,
    onHandlePointerDown,
    onHandlePointerMove,
    onHandlePointerUp: endDrag,
    onHandlePointerCancel: endDrag,
  };
}
