import { EMPLOYEES, type EmployeeReq, type RoomKey } from "../data/employee";
import { ROOMS } from "../data/room";
import { inWindow, toMin, minToHHMM } from "./time";

export type Decision = {
  id: string;
  time: string;
  room: RoomKey;
  granted: boolean;
  reason: string;
};

export const getSortedRequests = (arr: EmployeeReq[] = EMPLOYEES) =>
  [...arr].sort((a, b) => toMin(a.request_time) - toMin(b.request_time));

export const simulateAccess = (requests = getSortedRequests()): Decision[] => {
  const lastAccess: Record<string, Partial<Record<RoomKey, number>>> = {};
  const out: Decision[] = [];

  for (const req of requests) {
    const rule = ROOMS[req.room];
    const t = toMin(req.request_time);

    // 1) access level
    if (req.access_level < rule.minLevel) {
      out.push({ id: req.id, time: req.request_time, room: req.room, granted: false,
        reason: `Denied: level ${req.access_level} < required ${rule.minLevel}` });
      continue;
    }

    // 2) open/close
    if (!inWindow(t, rule.open, rule.close)) {
      out.push({ id: req.id, time: req.request_time, room: req.room, granted: false,
        reason: `Denied: ${req.room} closed at ${req.request_time}` });
      continue;
    }

    // 3) cooldown
    const prev = lastAccess[req.id]?.[req.room];
    if (prev !== undefined && t - prev < rule.cooldownMin) {
      out.push({ id: req.id, time: req.request_time, room: req.room, granted: false,
        reason: `Denied: cooldown ${rule.cooldownMin}m not met (last at ${minToHHMM(prev)})` });
      continue;
    }

    // grant
    if (!lastAccess[req.id]) lastAccess[req.id] = {};
    lastAccess[req.id]![req.room] = t;
    out.push({ id: req.id, time: req.request_time, room: req.room, granted: true,
      reason: `Granted: ${req.room}` });
  }

  return out;
};
