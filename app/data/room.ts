import type { RoomKey } from "./employee";

export type RoomRule = {
  minLevel: number;
  open: string;   
  close: string;  
  cooldownMin: number;
};

export const ROOMS: Record<RoomKey, RoomRule> = {
  ServerRoom: { minLevel: 2, open: "09:00", close: "11:00", cooldownMin: 15 },
  Vault:      { minLevel: 3, open: "09:00", close: "10:00", cooldownMin: 30 },
  "R&D Lab":  { minLevel: 1, open: "08:00", close: "12:00", cooldownMin: 10 },
};
