"use client";

import type { CSSProperties, FocusEvent, MouseEvent, PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { PixelCat } from "@/components/pixel-cat";
import type { Messages, TextDirection } from "@/lib/i18n";
import { currentCostSummary, SUPPORT_URL, supportCosts } from "@/lib/support-costs";
import type { SupportMessages } from "@/lib/support-i18n";
import {
  beginEvasion,
  beginReturn,
  closedSupport,
  finishReturn,
  openFollowing,
  openStable,
  type SupportMachine,
} from "@/lib/support-machine";

const EDGE_GAP = 10;
const POINTER_GAP = 22;
const HOVER_DELAY_MS = 2_500;
const RETURN_DELAY_MS = 900;
const RETURN_SETTLE_MS = 280;

type Position = { x: number; y: number };
type SupportExperienceProps = {
  direction: TextDirection;
  messages: Messages;
  supportMessages: SupportMessages;
};

export function SupportExperience({ direction, messages, supportMessages }: SupportExperienceProps) {
  const [machine, setMachine] = useState<SupportMachine>(closedSupport);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [coarsePointer, setCoarsePointer] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const panelRef = useRef<HTMLElement | null>(null);
  const pointerRef = useRef<Position>({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);

  const clearAnimationFrame = useCallback(() => {
    if (animationFrameRef.current !== null) window.cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = null;
  }, []);

  const close = useCallback(() => {
    clearAnimationFrame();
    setMachine(closedSupport);
  }, [clearAnimationFrame]);

  const clampToViewport = useCallback((pointer: Position): Position => {
    const width = panelRef.current?.offsetWidth ?? Math.min(330, window.innerWidth - EDGE_GAP * 2);
    const height = panelRef.current?.offsetHeight ?? 300;
    const maxX = Math.max(EDGE_GAP, window.innerWidth - width - EDGE_GAP);
    const maxY = Math.max(EDGE_GAP, window.innerHeight - height - EDGE_GAP);
    const preferredY = pointer.y - height - POINTER_GAP;
    return {
      x: Math.min(Math.max(pointer.x + POINTER_GAP, EDGE_GAP), maxX),
      y: Math.min(Math.max(preferredY >= EDGE_GAP ? preferredY : pointer.y + POINTER_GAP, EDGE_GAP), maxY),
    };
  }, []);

  const moveFromPointer = useCallback(
    (pointer: Position) => {
      pointerRef.current = pointer;
      if (animationFrameRef.current !== null) return;
      animationFrameRef.current = window.requestAnimationFrame(() => {
        setPosition(clampToViewport(pointerRef.current));
        animationFrameRef.current = null;
      });
    },
    [clampToViewport],
  );

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const refresh = () => {
      setCoarsePointer(coarse.matches);
      setReducedMotion(reduced.matches);
    };
    refresh();
    coarse.addEventListener("change", refresh);
    reduced.addEventListener("change", refresh);
    return () => {
      coarse.removeEventListener("change", refresh);
      reduced.removeEventListener("change", refresh);
    };
  }, []);

  useEffect(() => {
    if (machine.phase !== "following" || coarsePointer || reducedMotion) return;
    const onPointerMove = (event: globalThis.PointerEvent) => moveFromPointer({ x: event.clientX, y: event.clientY });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [coarsePointer, machine.phase, moveFromPointer, reducedMotion]);

  useEffect(() => {
    if (machine.phase !== "following" || coarsePointer || reducedMotion) return;
    const timer = window.setTimeout(() => setMachine((state) => beginEvasion(state)), HOVER_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [coarsePointer, machine.evasions, machine.phase, reducedMotion]);

  useEffect(() => {
    if (machine.phase !== "evading") return;
    setPosition((current) => {
      const width = panelRef.current?.offsetWidth ?? 330;
      const directionX = current.x + width / 2 < window.innerWidth / 2 ? 72 : -72;
      return clampToViewport({ x: pointerRef.current.x + directionX, y: pointerRef.current.y + 48 });
    });
    const timer = window.setTimeout(() => setMachine((state) => beginReturn(state)), RETURN_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [clampToViewport, machine.phase]);

  useEffect(() => {
    if (machine.phase !== "returning") return;
    setPosition(clampToViewport(pointerRef.current));
    const timer = window.setTimeout(() => setMachine((state) => finishReturn(state)), RETURN_SETTLE_MS);
    return () => window.clearTimeout(timer);
  }, [clampToViewport, machine.phase]);

  useEffect(() => {
    if (machine.phase === "closed") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close, machine.phase]);

  useEffect(() => () => clearAnimationFrame(), [clearAnimationFrame]);

  const openFromPointer = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    if (coarsePointer) return;
    moveFromPointer({ x: event.clientX, y: event.clientY });
    setMachine((state) => (reducedMotion ? openStable(state) : openFollowing(state)));
  };

  const openFromKeyboard = (event: FocusEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerRef.current = { x: rect.left + rect.width / 2, y: rect.top };
    setPosition(clampToViewport(pointerRef.current));
    setMachine((state) => openStable(state));
  };

  const handleSupportClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (coarsePointer && machine.phase === "closed") {
      event.preventDefault();
      const rect = event.currentTarget.getBoundingClientRect();
      pointerRef.current = { x: rect.left + rect.width / 2, y: rect.top };
      setPosition(clampToViewport(pointerRef.current));
      setMachine((state) => openStable(state));
      return;
    }
    close();
  };

  const isVisible = machine.phase !== "closed";
  const isInteractive = machine.phase === "stable";
  const prompt = machine.evasions === 1 ? supportMessages.surePrompt : machine.evasions === 2 ? supportMessages.kibblePrompt : null;
  const panelStyle = {
    "--support-x": `${position.x}px`,
    "--support-y": `${position.y}px`,
  } as CSSProperties;

  return (
    <>
      <a
        className="support-link"
        href={SUPPORT_URL}
        onClick={handleSupportClick}
        onFocus={openFromKeyboard}
        onPointerEnter={openFromPointer}
        rel="noopener noreferrer"
        target="_blank"
      >
        {messages.support}
      </a>
      <section
        aria-hidden={!isInteractive}
        aria-label={supportMessages.title}
        className={`support-panel${isVisible ? " is-visible" : ""}${isInteractive ? " is-interactive" : ""}`}
        data-evasions={machine.evasions}
        data-state={machine.phase}
        dir={direction}
        ref={panelRef}
        style={panelStyle}
      >
        <div className="support-panel__titlebar">
          <span>{supportMessages.title}</span>
          <button aria-label={supportMessages.close} onClick={close} tabIndex={isInteractive ? 0 : -1} type="button">
            ×
          </button>
        </div>
        {prompt ? (
          <div className="support-panel__cat-line">
            <PixelCat />
            <strong>{prompt}</strong>
          </div>
        ) : null}
        <table>
          <tbody>
            {supportCosts.map((cost) => (
              <tr className={cost.optional ? "is-optional" : undefined} key={cost.name}>
                <th scope="row">
                  {cost.name === "Domain" ? supportMessages.domain : cost.name}
                  {cost.optional ? <span> ({supportMessages.optionalUpgrade})</span> : null}
                </th>
                <td>
                  {cost.price} / {cost.period === "month" ? supportMessages.month : supportMessages.year}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">{supportMessages.estimatedTotal}</th>
              <td>{currentCostSummary.replace("month", supportMessages.month).replace("year", supportMessages.year)}</td>
            </tr>
          </tfoot>
        </table>
        <p>{supportMessages.estimateNote}</p>
        <a
          className="support-panel__cta"
          href={SUPPORT_URL}
          onClick={close}
          rel="noopener noreferrer"
          tabIndex={isInteractive ? 0 : -1}
          target="_blank"
        >
          {messages.support}
        </a>
      </section>
    </>
  );
}
