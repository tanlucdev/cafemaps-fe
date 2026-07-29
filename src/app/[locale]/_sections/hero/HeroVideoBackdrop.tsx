const VIDEO_URL = "/background-hero.mp4";

type HeroVideoBackdropProps = {
  poster: string;
};

export function HeroVideoBackdrop({ poster }: HeroVideoBackdropProps) {
  return (
    <video
      className="absolute inset-0 z-0 h-full w-full object-cover"
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      poster={poster}
      aria-hidden="true"
    >
      <source src={VIDEO_URL} type="video/mp4" />
    </video>
  );
}
