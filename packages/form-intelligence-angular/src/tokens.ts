import { InjectionToken } from "@angular/core";

import type { FormIntelligentHandle } from "./types.js";

export const FORM_INTELLIGENT_FORM = new InjectionToken<
  FormIntelligentHandle<Record<string, unknown>>
>("FORM_INTELLIGENT_FORM");
