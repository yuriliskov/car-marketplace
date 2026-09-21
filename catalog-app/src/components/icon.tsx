export type IconName =
  | "phone"
  | "arrow"
  | "check"
  | "camera"
  | "cube"
  | "route"
  | "shield"
  | "doc"
  | "stages"
  | "photo"
  | "clock"
  | "support"
  | "resale"
  | "pin"
  | "telegram"
  | "max"
  | "mail"
  | "play";

const paths: Record<IconName, string | string[]> = {
  phone:
    "M6.6 10.8c1.8 3.5 4.6 6.3 8.1 8.1l2.7-2.7c.4-.4 1-.5 1.5-.3 1.4.5 2.8.8 4.3.8.8 0 1.4.6 1.4 1.4v4.2c0 .8-.6 1.4-1.4 1.4C11 23.7 1 13.7 1 1.4 1 .6 1.6 0 2.4 0h4.3c.8 0 1.4.6 1.4 1.4 0 1.5.2 2.9.7 4.3.2.5.1 1.1-.3 1.5l-1.9 3.6Z",
  arrow: "m9 18 6-6-6-6",
  check: "m5 12 4 4L19 6",
  camera:
    "M4 7h3l2-3h6l2 3h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Zm8 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  cube: "m12 2 9 5-9 5-9-5 9-5Zm9 5v10l-9 5-9-5V7m9 5v10",
  route:
    "M5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm14-10a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM7 17h3a2 2 0 0 0 2-2V9a2 2 0 0 1 2-2h3",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Zm-3-10 2 2 4-4",
  doc: [
    "M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z",
    "M14 3v5h5",
    "M9 13h6M9 17h4",
  ],
  stages: ["M4 7h10M4 12h10M4 17h10", "m17 6 1.6 1.6L21 5", "m17 16 1.6 1.6L21 15"],
  photo: [
    "M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z",
    "m4 16 4.5-4.5 3 3L15 11l5 5",
    "M15.5 8.5h.01",
  ],
  clock: ["M12 3a8 8 0 1 1 0 16 8 8 0 0 1 0-16Z", "M12 7.5V12l3 2", "M3 21h18"],
  support: [
    "M12 3a7 7 0 0 1 7 7v4a5 5 0 0 1-5 5h-2",
    "M5 14v-4a7 7 0 0 1 2-4.9",
    "M3 12h2.5v5H4a1 1 0 0 1-1-1v-4Zm15.5 0H21v4a1 1 0 0 1-1 1h-1.5v-5Z",
  ],
  resale: [
    "M12 20s-6-3.2-8-7c-1.3-2.5.1-5.6 3-6 1.9-.3 3.6.7 5 2.6 1.4-1.9 3.1-2.9 5-2.6 2.9.4 4.3 3.5 3 6",
    "M9 14h6",
  ],
  pin: [
    "M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z",
    "M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  ],
  telegram: ["M21 4 3 11l5 2 2 6 3-4 5 4 3-15Z", "m8 13 9-6-6 8"],
  max: [
    "M12 3.2c4.9 0 8.8 3.6 8.8 8s-3.9 8-8.8 8c-1.1 0-2.2-.2-3.2-.5L4 20.5l1.4-3.6a7.7 7.7 0 0 1-2.2-5.7c0-4.4 3.9-8 8.8-8Z",
    "m8.6 14.2 1.2-4.6 2.2 2.8 2.2-2.8 1.2 4.6",
  ],
  mail: ["M3 6h18v12H3z", "m3 7 9 6 9-6"],
  play: "M8 5v14l11-7Z",
};

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const shapes = paths[name];
  const filled = name === "phone" || name === "play";

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox={name === "phone" ? "0 0 26 26" : "0 0 24 24"}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {(Array.isArray(shapes) ? shapes : [shapes]).map((shape) => (
        <path key={shape} d={shape} />
      ))}
    </svg>
  );
}
