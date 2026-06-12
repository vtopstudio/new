"use client";

export function CopyButton({ text }: { text: string }) {
  return <button className="btn btn-secondary py-2" onClick={() => navigator.clipboard.writeText(text)}>Скопировать промт</button>;
}
