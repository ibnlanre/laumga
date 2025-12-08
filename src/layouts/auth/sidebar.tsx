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
    <div className="absolute inset-0 flex flex-col">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      />
      <div className="absolute inset-0 bg-linear-to-t from-deep-forest/95 via-deep-forest/75 to-deep-forest/40" />

      {/* Content - relative positioning */}
      <div className="relative z-10 flex h-full flex-col justify-between p-8 md:p-12">
        {/* Logo at top */}
        <div className="flex">
          <img
            alt="LAUMGA Crest"
            className="size-16 object-scale-down"
            src="/laumga-logo.jpeg"
          />
        </div>

        {/* Title and description - centered */}
        <div className="flex flex-col gap-2 text-center md:text-left">
          <h1 className="text-white tracking-light text-2xl md:text-[32px] font-bold leading-tight font-display">
            {title}
          </h1>
          <p className="text-white/80 text-sm md:text-base font-normal leading-normal font-sans">
            {description}
          </p>
        </div>

        {/* Bottom content or login link */}
        <div className="shrink-0 text-center md:text-left">
          {bottomContent ? (
            bottomContent
          ) : (
            <p className="text-white/80 text-sm">
              Already a member?
              <a
                className="font-semibold text-vibrant-lime underline hover:text-white ml-1"
                href="/login"
              >
                Log in here.
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
