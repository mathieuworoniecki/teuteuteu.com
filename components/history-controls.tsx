"use client";

import { useEffect, useState } from "react";

type HistoryControlsProps = { linkCopied: string };

export function HistoryControls({ linkCopied }: HistoryControlsProps) {
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    const revealHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      const archive = target.closest("details");
      if (archive instanceof HTMLDetailsElement) archive.open = true;
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      target.scrollIntoView({ behavior: "smooth", block: "start" });
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

    const chapters = Array.from(
      document.querySelectorAll<HTMLElement>("[data-history-chapter]"),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        const active = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!active) return;
        document
          .querySelectorAll<HTMLElement>("[data-history-nav]")
          .forEach((link) => {
            if (link.getAttribute("href") === `#${active.target.id}`)
              link.setAttribute("aria-current", "step");
            else link.removeAttribute("aria-current");
          });
      },
      { rootMargin: "-35% 0px -50%", threshold: [0, 0.2, 0.5] },
    );

    revealHash();
    chapters.forEach((chapter) => observer.observe(chapter));
    window.addEventListener("hashchange", revealHash);
    document.addEventListener("click", copyEventLink);
    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", revealHash);
      document.removeEventListener("click", copyEventLink);
    };
  }, [linkCopied]);

  return (
    <span aria-atomic="true" aria-live="polite" className="sr-only">
      {announcement}
    </span>
  );
}
