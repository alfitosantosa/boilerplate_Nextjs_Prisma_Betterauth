/**
 * Gradien latar seluruh landing page, mengikuti referensi mesh pastel:
 * alas putih dengan cucian biru SantosaTechID (#3858e8, dari logo) di
 * kiri-atas dan mint di kanan-tengah, memudar ke putih. Satu lapisan `fixed`
 * pointer-events-none, statis — tidak dianimasikan supaya tidak repaint
 * sepanjang scroll.
 */
export function PageGradient() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 select-none"
    >
      <div className="absolute inset-0 bg-[linear-gradient(160deg,#e9f0fc_0%,#fbfdfe_30%,#eef8f4_58%,#f7fafc_80%,#eaf1fb_100%)]" />
      <div className="absolute -top-48 -left-40 h-[56rem] w-[56rem] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,#3858e8_20%,transparent),transparent)] blur-3xl" />
      <div className="absolute top-[4rem] right-[-16rem] h-[46rem] w-[46rem] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,#8fdcc0_30%,transparent),transparent)] blur-3xl" />
      <div className="absolute top-[50%] left-[-12rem] h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,#7ec8f0_18%,transparent),transparent)] blur-3xl" />
      <div className="absolute bottom-[-18rem] right-[-8rem] h-[44rem] w-[44rem] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,#3858e8_12%,transparent),transparent)] blur-3xl" />
    </div>
  );
}
