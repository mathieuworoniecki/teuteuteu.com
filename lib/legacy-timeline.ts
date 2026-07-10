export type LegacyShakeEvent = {
  frame: number;
  at: number;
  axis: "x" | "xy";
  amplitude: 1 | 2 | 5;
};

export const LEGACY_FPS = 60;
export const LEGACY_START_FRAME = 5;
export const LEGACY_TOTAL_FRAMES = 4494;
export const LEGACY_DURATION_SECONDS = LEGACY_TOTAL_FRAMES / LEGACY_FPS;

const XY_1_FRAMES = [
  23, 48, 73, 98, 111, 123, 149, 174, 212, 224, 249, 274, 300, 312,
  325, 350, 375,
] as const;

const X_2_FRAMES = [
  425, 450, 475, 499, 512, 525, 545, 574, 826, 851, 877, 901, 915, 926,
  951,
] as const;

const XY_2_FRAMES = [
  626, 651, 676, 700, 727, 752, 777, 976, 1029, 1054, 1079, 1105, 1129, 1155,
  1180, 1230, 1255, 1280, 1305, 1324, 1355, 1380, 1431, 1457, 1482, 1508, 1532, 1557,
  1582, 1632, 1658, 1682, 1708, 1733, 1757, 1783, 1833, 1858, 1883, 1909, 1935, 1959,
  1984, 2034, 2059, 2085, 2110, 2130, 2160, 2186, 2236, 2262, 2286, 2311, 2337, 2361,
  2387, 2437, 2462, 2488, 2512, 2537, 2562, 2587, 2637, 2664, 2689, 2714, 2738, 2764,
  2788, 2840, 2864, 2889, 2914, 2940, 2965, 3015, 3040, 3065, 3090, 3115, 3141, 3166,
  3191, 3216, 3241, 3267, 3291, 3317, 3342, 3367, 3392, 3417, 3442, 3467, 3493, 3518,
  3543, 3568, 3593, 3617, 3643, 3669, 3694, 3719, 3745, 3769, 3795, 3819, 3845, 3870,
  3895, 3920, 3945, 3971, 3995, 4021, 4046, 4071, 4096, 4121, 4147, 4172, 4197, 4223,
  4247, 4272, 4298, 4322, 4348, 4373, 4398,
] as const;

const XY_5_FRAMES = [
  4423,
] as const;

function eventsFor(
  frames: readonly number[],
  axis: LegacyShakeEvent["axis"],
  amplitude: LegacyShakeEvent["amplitude"],
): LegacyShakeEvent[] {
  return frames.map((frame) => ({
    frame,
    at: (frame - LEGACY_START_FRAME) / LEGACY_FPS,
    axis,
    amplitude,
  }));
}

export const LEGACY_SHAKE_EVENTS: LegacyShakeEvent[] = [
  ...eventsFor(XY_1_FRAMES, "xy", 1),
  ...eventsFor(X_2_FRAMES, "x", 2),
  ...eventsFor(XY_2_FRAMES, "xy", 2),
  ...eventsFor(XY_5_FRAMES, "xy", 5),
].sort((left, right) => left.frame - right.frame);

