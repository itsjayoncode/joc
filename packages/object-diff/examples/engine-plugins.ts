/**
 * Optional plugin host — only when you need matchers / formatters / hooks.
 */
import { createEngine } from "@jayoncode/object-diff/plugins";

const engine = createEngine({
  plugins: [
    {
      name: "case-insensitive",
      matchers: [
        (a, b) => {
          if (typeof a === "string" && typeof b === "string") {
            return a.toLowerCase() === b.toLowerCase();
          }

          return undefined;
        },
      ],
    },
  ],
});

console.log("equal ignoring case:", engine.compare("Ada", "ada"));
console.log("changes:", engine.diff({ name: "Ada" }, { name: "Grace" }).changes);
