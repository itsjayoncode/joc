import { useContext } from "react";

import { PlaygroundUiContext } from "../contexts/PlaygroundUiContext.js";

export function usePlaygroundUi() {
  const context = useContext(PlaygroundUiContext);

  if (!context) {
    throw new Error("usePlaygroundUi must be used within PlaygroundUiProvider.");
  }

  return context;
}
