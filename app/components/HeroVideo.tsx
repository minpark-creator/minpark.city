type Props = {
  url?: string;
  fileUrl?: string | null;
};

function toEmbed(url?: string) {
  if (!url) return null;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo)
    return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1&loop=1&muted=1&background=1&title=0&byline=0&portrait=0`;
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/
  );
  if (yt)
    return `https://www.youtube.com/embed/${yt[1]}?autoplay=1&mute=1&loop=1&playlist=${yt[1]}&controls=0&modestbranding=1&playsinline=1`;
  return null;
}

export default function HeroVideo({ url, fileUrl }: Props) {
  const embed = toEmbed(url);
  const direct = fileUrl || (url && !embed ? url : null);

  return (
    <section className="pb-12">
      <div className="relative w-full aspect-video overflow-hidden bg-black">
        {embed ? (
          <iframe
            src={embed}
            className="absolute inset-0 w-full h-full pointer-events-none"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title="Hero video"
          />
        ) : direct ? (
          <video
            src={direct}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: "#efeae2" }}
          >
            <span className="text-[13px] text-muted">
              Add a hero video in Studio → Site Settings
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
