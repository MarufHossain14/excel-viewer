import { Fragment } from "react";

export function SearchHighlight({ text, query }: { text: string; query: string }) {
  const normalized = query.trim();
  if (!normalized) return text;

  const safeQuery = normalized.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pieces = text.split(new RegExp(`(${safeQuery})`, "gi"));
  return pieces.map((piece, index) =>
    piece.toLocaleLowerCase() === normalized.toLocaleLowerCase() ? (
      <mark key={`${piece}-${index}`} className="rounded bg-[#f2d879]/60 px-0.5 text-inherit dark:bg-[#a07b28]/55">
        {piece}
      </mark>
    ) : (
      <Fragment key={`${piece}-${index}`}>{piece}</Fragment>
    ),
  );
}
