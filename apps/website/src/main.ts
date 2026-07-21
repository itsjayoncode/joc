const brand = document.getElementById("brand-hero");

if (brand && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  brand.animate(
    [
      { letterSpacing: "-0.02em", opacity: 0.85 },
      { letterSpacing: "-0.04em", opacity: 1 },
    ],
    { duration: 900, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" },
  );
}
