import twemoji from "twemoji";

export function parseEmoji(text) {
  return {
    __html: twemoji.parse(text, {
      folder: "svg",
      ext: ".svg",
      className: "inline-emoji", // optional, for styling
    }),
  };
}