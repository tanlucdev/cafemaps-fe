export function acceptsMarkdown(accept: string | null) {
  return (
    accept?.split(",").some((part) => {
      const [mediaType, ...parameters] = part.trim().toLowerCase().split(";");
      if (mediaType !== "text/markdown") return false;
      const quality = parameters.find((parameter) => parameter.trim().startsWith("q="));
      return !quality || Number(quality.trim().slice(2)) > 0;
    }) ?? false
  );
}
