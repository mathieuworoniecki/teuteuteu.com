"use client";

import { useEffect, useState } from "react";

type HistoryControlsProps = {
  closeAll: string;
  linkCopied: string;
  openAll: string;
};

const detailsSelector = "details[data-history-event]";

export function HistoryControls({
  closeAll,
  linkCopied,
  openAll,
}: HistoryControlsProps) {
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    const revealHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const event = document.getElementById(id);
      if (!(event instanceof HTMLDetailsElement)) return;
      event.open = true;
      event.querySelector("summary")?.focus({ preventScroll: true });
      event.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const copyEventLink = async (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>(
        "[data-copy-history]",
      );
      if (!target) return;
      const id = target.dataset.copyHistory;
      if (!id) return;
      const url = new URL(window.location.href);
      url.hash = id;
      try {
        await navigator.clipboard.writeText(url.toString());
      } catch {
        const input = document.createElement("textarea");
        input.value = url.toString();
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.append(input);
        input.select();
        document.execCommand("copy");
        input.remove();
      }
      setAnnouncement("");
      window.setTimeout(() => setAnnouncement(linkCopied), 10);
    };

    revealHash();
    window.addEventListener("hashchange", revealHash);
    document.addEventListener("click", copyEventLink);
    return () => {
      window.removeEventListener("hashchange", revealHash);
      document.removeEventListener("click", copyEventLink);
    };
  }, [linkCopied]);

  const setAll = (open: boolean) => {
    document
      .querySelectorAll<HTMLDetailsElement>(detailsSelector)
      .forEach((details) => {
        details.open = open;
      });
  };

  return (
    <div className="history-controls">
      <button onClick={() => setAll(true)} type="button">
        {openAll}
      </button>
      <span aria-hidden="true">·</span>
      <button onClick={() => setAll(false)} type="button">
        {closeAll}
      </button>
      <span aria-atomic="true" aria-live="polite" className="sr-only">
        {announcement}
      </span>
    </div>
  );
}
