/**
 * The hero's gradient field: two blurred washes drifting on a long cycle.
 *
 * No canvas and no JavaScript — it is two radial gradients on a fixed layer
 * that sits behind the hero's content and never receives a pointer event. The
 * global `prefers-reduced-motion` block in `globals.css` stops the drift.
 *
 * Kept low-opacity on purpose: the washes hint at depth behind the register
 * without tinting the white canvas the rest of the page reads on.
 */
export function MeshGradient() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
    >
      <div className="animate-mesh absolute -top-1/3 -left-1/4 h-[46rem] w-[46rem] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--primary)_38%,transparent),transparent)] blur-3xl" />
      <div className="animate-mesh-slow absolute -top-1/4 right-[-12%] h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--navy-accent)_30%,transparent),transparent)] blur-3xl" />
      <div className="animate-mesh-slow absolute top-1/2 left-1/3 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--interactive)_14%,transparent),transparent)] blur-3xl" />
    </div>
  );
}
