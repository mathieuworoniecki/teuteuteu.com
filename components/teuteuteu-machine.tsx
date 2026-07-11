"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { SupportExperience } from "@/components/support-experience";
import { formatClicks, formatClicksDisplay, incrementClicks, maxClicks } from "@/lib/format";
import { interpolate, type Messages, type SupportedLocale, type TextDirection } from "@/lib/i18n";
import { LEGACY_DURATION_SECONDS, LEGACY_SHAKE_EVENTS, type LegacyShakeEvent } from "@/lib/legacy-timeline";
import type { SupportMessages } from "@/lib/support-i18n";
import type { SiteState } from "@/lib/types";

type PlaybackMode = "paused" | "playing" | "loading";
type AudioEngine = "web-audio" | "media" | null;

const AUDIO_URL = "/teuteuteu.mp3";
const FADE_SECONDS = 0.075;
const MAX_EVENT_LATENCY_SECONDS = 0.15;
const PRESS_FEEDBACK_MS = 420;
const COUNTER_REFRESH_MS = 2_500;
const COUNTER_JITTER_MS = 300;
const RETRY_DELAYS_MS = [3_000, 6_000, 12_000, 30_000, 60_000] as const;

type TeuteuteuMachineProps = {
  direction: TextDirection;
  historyHref: string;
  historyLabel: string;
  initialState: SiteState;
  locale: SupportedLocale;
  messages: Messages;
  supportMessages: SupportMessages;
};

export function TeuteuteuMachine({
  direction,
  historyHref,
  historyLabel,
  initialState,
  locale,
  messages,
  supportMessages,
}: TeuteuteuMachineProps) {
  const [clicks, setClicks] = useState(initialState.clicks);
  const [hasCounterValue, setHasCounterValue] = useState(initialState.configured);
  const [mode, setMode] = useState<PlaybackMode>("paused");
  const [audioError, setAudioError] = useState(false);
  const [isVisuallyPressed, setIsVisuallyPressed] = useState(false);
  const [supportResetToken, setSupportResetToken] = useState(0);

  const contextRef = useRef<AudioContext | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const startedAtRef = useRef(0);
  const offsetRef = useRef(0);
  const mediaRef = useRef<HTMLAudioElement | null>(null);
  const engineRef = useRef<AudioEngine>(null);
  const animationFrameRef = useRef<number | null>(null);
  const eventIndexRef = useRef(0);
  const lastTimelinePositionRef = useRef(0);
  const pressFeedbackTimerRef = useRef<number | null>(null);
  const refreshTimerRef = useRef<number | null>(null);
  const refreshAbortRef = useRef<AbortController | null>(null);
  const refreshFailuresRef = useRef(0);

  const refreshState = useCallback(async (signal?: AbortSignal) => {
    try {
      const response = await fetch("/api/counter", { signal });
      if (!response.ok) return false;
      const state = (await response.json()) as Pick<SiteState, "clicks">;
      setClicks((current) => maxClicks(current, state.clicks));
      setHasCounterValue(true);
      return true;
    } catch {
      // A stale count is less disruptive than an error surface on this page.
      return false;
    }
  }, []);

  useEffect(() => {
    let disposed = false;

    const clearRefresh = () => {
      if (refreshTimerRef.current !== null) window.clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
      refreshAbortRef.current?.abort();
      refreshAbortRef.current = null;
    };

    const schedule = (delay: number) => {
      if (disposed || document.visibilityState !== "visible") return;
      refreshTimerRef.current = window.setTimeout(runRefresh, delay);
    };

    const runRefresh = async () => {
      if (disposed || document.visibilityState !== "visible") return;
      const controller = new AbortController();
      refreshAbortRef.current = controller;
      const succeeded = await refreshState(controller.signal);
      if (disposed || controller.signal.aborted) return;
      refreshAbortRef.current = null;

      if (succeeded) {
        refreshFailuresRef.current = 0;
        const jitter = Math.round((Math.random() * 2 - 1) * COUNTER_JITTER_MS);
        schedule(COUNTER_REFRESH_MS + jitter);
      } else {
        const failure = Math.min(refreshFailuresRef.current, RETRY_DELAYS_MS.length - 1);
        refreshFailuresRef.current += 1;
        schedule(RETRY_DELAYS_MS[failure]);
      }
    };

    const refreshWhenVisible = () => {
      clearRefresh();
      if (document.visibilityState === "visible") {
        refreshFailuresRef.current = 0;
        void runRefresh();
      }
    };

    document.addEventListener("visibilitychange", refreshWhenVisible);
    void runRefresh();
    return () => {
      disposed = true;
      clearRefresh();
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [refreshState]);

  useEffect(
    () => () => {
      if (animationFrameRef.current !== null) window.cancelAnimationFrame(animationFrameRef.current);
      if (pressFeedbackTimerRef.current !== null) window.clearTimeout(pressFeedbackTimerRef.current);
      sourceRef.current?.stop();
      void contextRef.current?.close();
    },
    [],
  );

  const countPress = useCallback(async () => {
    setClicks((current) => incrementClicks(current));
    setHasCounterValue(true);
    try {
      const response = await fetch("/api/click", { method: "POST" });
      if (!response.ok) {
        void refreshState();
        return;
      }
      const body = (await response.json()) as { clicks?: string };
      if (typeof body.clicks === "string") setClicks(body.clicks);
    } catch {
      void refreshState();
    }
  }, [refreshState]);

  const showPressFeedback = useCallback(() => {
    setIsVisuallyPressed(true);
    if (pressFeedbackTimerRef.current !== null) window.clearTimeout(pressFeedbackTimerRef.current);
    pressFeedbackTimerRef.current = window.setTimeout(() => {
      setIsVisuallyPressed(false);
      pressFeedbackTimerRef.current = null;
    }, PRESS_FEEDBACK_MS);
  }, []);

  const initialiseWebAudio = useCallback(async () => {
    const context = contextRef.current ?? new AudioContext();
    contextRef.current = context;
    await context.resume();

    if (!bufferRef.current) {
      const response = await fetch(AUDIO_URL);
      if (!response.ok) throw new Error("Audio asset could not be loaded.");
      bufferRef.current = await context.decodeAudioData(await response.arrayBuffer());
    }
    engineRef.current = "web-audio";
  }, []);

  const startMediaFallback = useCallback(async () => {
    const media = mediaRef.current ?? new Audio(AUDIO_URL);
    media.loop = false;
    media.preload = "auto";
    media.volume = 0.85;
    mediaRef.current = media;
    await media.play();
    engineRef.current = "media";
  }, []);

  const triggerShake = useCallback((event: LegacyShakeEvent) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const shell = document.querySelector<HTMLElement>(".site-shell");
    if (!shell) return;

    const amplitude = event.amplitude;
    const vertical = event.axis === "xy" ? amplitude : 0;
    shell.animate(
      [
        { transform: "translate3d(0, 0, 0)" },
        { transform: `translate3d(${-amplitude}px, ${vertical}px, 0)` },
        { transform: `translate3d(${amplitude}px, ${-vertical}px, 0)` },
        { transform: `translate3d(${-amplitude}px, ${-vertical}px, 0)` },
        { transform: `translate3d(${amplitude}px, ${vertical}px, 0)` },
        { transform: "translate3d(0, 0, 0)" },
      ],
      { duration: event.amplitude === 5 ? 150 : 105, easing: "linear" },
    );
  }, []);

  const playbackPosition = useCallback(() => {
    if (engineRef.current === "web-audio") {
      const context = contextRef.current;
      const buffer = bufferRef.current;
      if (!context || !buffer) return offsetRef.current;
      return (offsetRef.current + context.currentTime - startedAtRef.current) % buffer.duration;
    }

    const media = mediaRef.current;
    return media && Number.isFinite(media.currentTime) ? media.currentTime : offsetRef.current;
  }, []);

  const stopLegacyTimeline = useCallback(() => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const startLegacyTimeline = useCallback(() => {
    stopLegacyTimeline();
    const initialPosition = playbackPosition();
    lastTimelinePositionRef.current = initialPosition;
    eventIndexRef.current = LEGACY_SHAKE_EVENTS.findIndex((event) => event.at > initialPosition);
    if (eventIndexRef.current < 0) eventIndexRef.current = LEGACY_SHAKE_EVENTS.length;

    const tick = () => {
      const position = playbackPosition();
      const looped = position + 0.25 < lastTimelinePositionRef.current;
      if (looped) {
        eventIndexRef.current = 0;
        lastTimelinePositionRef.current = 0;
      }

      while (
        eventIndexRef.current < LEGACY_SHAKE_EVENTS.length &&
        LEGACY_SHAKE_EVENTS[eventIndexRef.current].at <= position
      ) {
        const event = LEGACY_SHAKE_EVENTS[eventIndexRef.current];
        if (
          event.at > lastTimelinePositionRef.current &&
          position - event.at <= MAX_EVENT_LATENCY_SECONDS
        ) {
          triggerShake(event);
        }
        eventIndexRef.current += 1;
      }

      lastTimelinePositionRef.current = Math.min(position, LEGACY_DURATION_SECONDS);
      animationFrameRef.current = window.requestAnimationFrame(tick);
    };

    animationFrameRef.current = window.requestAnimationFrame(tick);
  }, [playbackPosition, stopLegacyTimeline, triggerShake]);

  const startWebAudio = useCallback(() => {
    const context = contextRef.current;
    const buffer = bufferRef.current;
    if (!context || !buffer) throw new Error("Audio engine is unavailable.");

    const source = context.createBufferSource();
    const gain = context.createGain();
    source.buffer = buffer;
    source.loop = false;
    source.connect(gain).connect(context.destination);
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(1, context.currentTime + FADE_SECONDS);
    source.start(0, offsetRef.current % buffer.duration);
    sourceRef.current = source;
    gainRef.current = gain;
    startedAtRef.current = context.currentTime;
    source.onended = () => {
      if (sourceRef.current !== source) return;
      sourceRef.current = null;
      gainRef.current = null;
      offsetRef.current = 0;
      stopLegacyTimeline();
      setMode("paused");
    };
  }, [stopLegacyTimeline]);

  const play = useCallback(async () => {
    setMode("loading");
    setAudioError(false);
    try {
      await initialiseWebAudio();
      startWebAudio();
      setMode("playing");
      startLegacyTimeline();
    } catch {
      try {
        await startMediaFallback();
        setMode("playing");
        startLegacyTimeline();
        if (mediaRef.current) {
          mediaRef.current.onended = () => {
            offsetRef.current = 0;
            stopLegacyTimeline();
            setMode("paused");
          };
        }
      } catch {
        setAudioError(true);
        setMode("paused");
      }
    }
  }, [initialiseWebAudio, startLegacyTimeline, startMediaFallback, startWebAudio, stopLegacyTimeline]);

  const pause = useCallback(() => {
    stopLegacyTimeline();
    if (engineRef.current === "web-audio") {
      const context = contextRef.current;
      const buffer = bufferRef.current;
      const source = sourceRef.current;
      const gain = gainRef.current;
      if (context && buffer && source) {
        offsetRef.current = (offsetRef.current + context.currentTime - startedAtRef.current) % buffer.duration;
        if (gain) {
          gain.gain.cancelScheduledValues(context.currentTime);
          gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), context.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + FADE_SECONDS);
        }
        source.stop(context.currentTime + FADE_SECONDS);
      }
      sourceRef.current = null;
      gainRef.current = null;
    } else {
      mediaRef.current?.pause();
    }
    setMode("paused");
  }, [stopLegacyTimeline]);

  const toggle = useCallback(() => {
    showPressFeedback();
    setSupportResetToken((token) => token + 1);
    void countPress();
    if (mode === "playing") {
      pause();
    } else if (mode === "paused") {
      void play();
    }
  }, [countPress, mode, pause, play, showPressFeedback]);

  const isPlaying = mode === "playing";
  const instruction = mode === "loading" ? messages.loading : messages.instruction;
  const exactCounter = interpolate(messages.counter, {
    count: hasCounterValue ? formatClicks(clicks, locale) : messages.loading,
  });
  const displayCounter = interpolate(messages.counter, {
    count: hasCounterValue ? formatClicksDisplay(clicks, locale) : messages.loading,
  });

  return (
    <section aria-label={messages.machineLabel} className="machine" dir={direction} lang={locale}>
      <p className="machine__instruction">{instruction}</p>
      <button
        aria-label={isPlaying ? messages.pauseAction : messages.playAction}
        aria-pressed={isPlaying}
        className={`teu-button${isVisuallyPressed ? " is-pressed" : ""}`}
        onClick={toggle}
        type="button"
      >
        <span className="sr-only">{isPlaying ? messages.pauseAction : messages.playAction}</span>
      </button>
      <p
        aria-label={exactCounter}
        aria-live="polite"
        className="machine__counter"
        title={exactCounter}
      >
        {displayCounter}
      </p>
      <p className="sr-only" role="status">
        {audioError ? messages.statusError : isPlaying ? messages.statusPlaying : messages.statusPaused}
      </p>
      <nav aria-label={historyLabel} className="site-links">
        <SupportExperience
          direction={direction}
          key={supportResetToken}
          messages={messages}
          supportMessages={supportMessages}
        />
        <a className="history-link" href={historyHref}>
          {historyLabel}
        </a>
      </nav>
    </section>
  );
}
