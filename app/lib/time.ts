export const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export const inWindow = (t: number, open: string, close: string) => {
  const o = toMin(open), c = toMin(close);
  return t >= o && t <= c;
};

export const minToHHMM = (m: number) =>
  `${Math.floor(m / 60).toString().padStart(2, "0")}:${(m % 60)
    .toString()
    .padStart(2, "0")}`;
