import { z } from "zod";
import { MEETUP_PURPOSES, REPORT_REASONS } from "./constants";

const dateTime = (date: string, time: string) => new Date(`${date}T${time}:00+07:00`);

export const createMeetupSchema = z
  .object({
    cafeId: z.string().trim().min(1),
    purpose: z.enum(MEETUP_PURPOSES),
    title: z.string().trim().min(4).max(100),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    startsAt: z.string().regex(/^\d{2}:\d{2}$/),
    endsAt: z.string().regex(/^\d{2}:\d{2}$/),
    maxParticipants: z.coerce.number().int().min(2).max(10),
    description: z.string().trim().max(500).optional().default(""),
  })
  .superRefine((value, ctx) => {
    const start = dateTime(value.date, value.startsAt);
    const end = dateTime(value.date, value.endsAt);
    if (start <= new Date()) ctx.addIssue({ code: "custom", path: ["date"], message: "past" });
    if (end <= start)
      ctx.addIssue({ code: "custom", path: ["endsAt"], message: "end_before_start" });
  });

export const joinMeetupSchema = z.object({
  message: z.string().trim().max(200).optional().default(""),
});

export const reportMeetupSchema = z.object({
  reason: z.enum(REPORT_REASONS),
  note: z.string().trim().max(300).optional().default(""),
});
