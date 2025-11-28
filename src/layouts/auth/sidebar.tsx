interface AuthSidebarProps {
  title: string;
  description: string;
  backgroundImage: string;
  bottomContent?: React.ReactNode;
}

export function AuthSidebar({
  title,
  description,
  backgroundImage,
  bottomContent,
}: AuthSidebarProps) {
  return (
    <>
      <div
        className="absolute inset-0 bg-cover bg-center"
        data-alt="LAUMGA background"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      />
      <div className="absolute inset-0 bg-linear-to-t from-deep-forest/90 via-deep-forest/70 to-deep-forest/40" />
      <div className="relative z-10 flex h-full flex-col justify-between p-12">
        <div className="flex">
          <img
            alt="LAUMGA Crest"
            className="h-16 w-16"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHBTD3WgPQvsf3uqULVrorUrr4lRZ1wX7rNNKYdG3dWqUMCm45rLyh8gkiJdQ2dnomhyD_rBtOSqRgkaviI7rmYI3pQ-wx6P4LFg_cYOMehn7-IL4-UiDo_polBKtShxwoCMfoZ_Tmw6SSZkFsBShKrxO8gp9u7gyKEr7PoUDU6kWPBN1VGk-kqlkJQ0YB_nnjeafLfAkW8VCzbTBEbmKDlQ8l2lFmSzsyfOkT8S9vy5nXC02fK4gfBNbVCE-THvhQMrixligYdI0"
          />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-white tracking-light text-[32px] font-bold leading-tight font-display">
            {title}
          </h1>
          <p className="text-white/80 text-base font-normal leading-normal font-sans">
            {description}
          </p>
        </div>
        {bottomContent && <div className="shrink-0">{bottomContent}</div>}
      </div>
    </>
  );
}
