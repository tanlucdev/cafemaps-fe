import { Star } from "lucide-react";

export default function RatingStars({ rating }: { rating: number }) {
  const roundedRating = Math.round(rating);

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-[#f5c777]/22 bg-[#fff4dc]/36 px-2.5 py-1 text-[11.5px] font-bold backdrop-blur-md dark:border-[#ffe3b7]/12 dark:bg-[#fff1d6]/6"
      aria-label={`${rating.toFixed(1)} sao`}
    >
      <span className="inline-flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={13}
            className={
              star <= roundedRating
                ? "fill-[#F0A830] text-[#F0A830]"
                : "fill-[#E0D3C0] text-[#E0D3C0] dark:fill-[#4A3A2C] dark:text-[#4A3A2C]"
            }
          />
        ))}
      </span>
      <span className="font-black text-[#8a551b] dark:text-[#ffd58a]">
        {rating.toFixed(1)}
      </span>
    </span>
  );
}
