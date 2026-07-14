import type { HistoryChapterId } from "@/lib/history-chapters";

type HistoryPixelSceneProps = {
  scene: HistoryChapterId;
};

export function HistoryPixelScene({ scene }: HistoryPixelSceneProps) {
  return (
    <svg
      aria-hidden="true"
      className={`history-pixel-scene history-pixel-scene--${scene}`}
      focusable="false"
      shapeRendering="crispEdges"
      viewBox="0 0 320 200"
    >
      <rect className="px-paper" height="200" width="320" />
      {scene === "birth" && <BirthScene />}
      {scene === "viral" && <ViralScene />}
      {scene === "silence" && <SilenceScene />}
      {scene === "afterlives" && <AfterlivesScene />}
      {scene === "restoration" && <RestorationScene />}
    </svg>
  );
}

function BrowserWindow({
  x,
  y,
  width = 184,
  height = 126,
}: {
  x: number;
  y: number;
  width?: number;
  height?: number;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect
        className="px-window-shadow"
        height={height}
        width={width}
        x="5"
        y="5"
      />
      <rect className="px-window" height={height} width={width} />
      <rect className="px-titlebar" height="15" width={width - 4} x="2" y="2" />
      <rect
        className="px-title-dot"
        height="7"
        width="7"
        x={width - 12}
        y="6"
      />
      <rect
        className="px-window-body"
        height={height - 22}
        width={width - 8}
        x="4"
        y="19"
      />
    </g>
  );
}

function BirthScene() {
  return (
    <g className="px-birth-window">
      <BrowserWindow height={132} width={190} x={65} y={28} />
      <rect className="px-copy" height="6" width="88" x="116" y="65" />
      <rect
        className="px-button-shadow"
        height="46"
        width="54"
        x="137"
        y="91"
      />
      <rect className="px-button" height="42" width="50" x="135" y="87" />
      <rect className="px-button-light" height="8" width="34" x="143" y="93" />
      <path
        className="px-shake"
        d="M42 72h12v-8h8v72h-8v-8H42M278 72h-12v-8h-8v72h8v-8h12"
      />
      <rect className="px-monitor" height="8" width="84" x="118" y="169" />
      <rect className="px-monitor" height="8" width="42" x="139" y="161" />
    </g>
  );
}

function ViralScene() {
  return (
    <g>
      <g className="px-forum px-forum--one">
        <BrowserWindow height={82} width={126} x={18} y={24} />
        <rect className="px-link" height="5" width="76" x="35" y="58" />
        <rect className="px-copy" height="4" width="90" x="35" y="71" />
      </g>
      <g className="px-forum px-forum--two">
        <BrowserWindow height={82} width={126} x={176} y={94} />
        <rect className="px-link" height="5" width="76" x="193" y="128" />
        <rect className="px-copy" height="4" width="90" x="193" y="141" />
      </g>
      <path className="px-network" d="M142 75h22v12h18M176 129h-22v-12h-18" />
      <rect
        className="px-packet px-packet--one"
        height="8"
        width="8"
        x="154"
        y="71"
      />
      <rect
        className="px-packet px-packet--two"
        height="8"
        width="8"
        x="154"
        y="125"
      />
      <text className="px-teu" x="130" y="108">
        TEU
      </text>
    </g>
  );
}

function SilenceScene() {
  return (
    <g>
      <BrowserWindow height={126} width={210} x={55} y={30} />
      <rect className="px-muted" height="10" width="120" x="100" y="72" />
      <rect className="px-muted" height="6" width="78" x="121" y="92" />
      <rect className="px-sale" height="24" width="104" x="108" y="113" />
      <text className="px-sale-text" x="126" y="130">
        PARKED
      </text>
      <path
        className="px-sleep"
        d="M243 20h20v7h-11v7h11v7h-20M270 5h15v6h-8v6h8v6h-15"
      />
    </g>
  );
}

function AfterlivesScene() {
  return (
    <g>
      <rect className="px-disk-shadow" height="142" width="166" x="82" y="34" />
      <rect className="px-disk" height="142" width="166" x="76" y="28" />
      <rect className="px-disk-label" height="56" width="118" x="100" y="44" />
      <rect className="px-copy" height="6" width="86" x="116" y="58" />
      <rect className="px-link" height="6" width="62" x="116" y="73" />
      <rect className="px-disk-slot" height="46" width="92" x="113" y="113" />
      <rect className="px-disk-metal" height="34" width="26" x="160" y="119" />
      <path
        className="px-rewrite"
        d="M46 84h18V70l18 18-18 18V92H46M272 84h-18V70l-18 18 18 18V92h18"
      />
    </g>
  );
}

function RestorationScene() {
  return (
    <g>
      <BrowserWindow height={144} width={212} x={54} y={24} />
      <rect className="px-blueprint" height="92" width="88" x="70" y="56" />
      <rect className="px-button-shadow" height="42" width="50" x="89" y="85" />
      <rect className="px-button" height="38" width="46" x="87" y="81" />
      <path
        className="px-circuit"
        d="M174 65h54v10h-24v16h24v10h-38v16h38v10h-54M178 59v74"
      />
      <rect
        className="px-node px-node--one"
        height="8"
        width="8"
        x="224"
        y="61"
      />
      <rect
        className="px-node px-node--two"
        height="8"
        width="8"
        x="224"
        y="97"
      />
      <rect
        className="px-node px-node--three"
        height="8"
        width="8"
        x="224"
        y="123"
      />
      <text className="px-166" x="174" y="147">
        166×
      </text>
    </g>
  );
}
