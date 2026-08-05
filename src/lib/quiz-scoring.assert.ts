import assert from "node:assert/strict";
import { QUIZ_QUESTIONS } from "./quiz-data";
import type { QuizOption, QuizProfileId } from "@/types/quiz";

function pick(ids: string[]) {
  return ids.map((id) => {
    const option = QUIZ_QUESTIONS.flatMap((question) => question.options).find(
      (item) => item.id === id,
    );
    assert.ok(option, `Missing quiz option: ${id}`);
    return option;
  });
}

function winner(answers: QuizOption[]) {
  const scores = new Map<QuizProfileId, number>();
  for (const answer of answers) {
    for (const target of answer.scores) {
      scores.set(target.profile, (scores.get(target.profile) ?? 0) + target.weight);
    }
  }
  return [...scores.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

assert.equal(
  winner(
    pick([
      "city-buzz",
      "camera-cake",
      "friends-laughing",
      "photo-booth",
      "rain-group",
      "friends-shot",
      "big-table",
      "split-table",
    ]),
  ),
  "creative-hangout",
);
assert.equal(
  winner(
    pick([
      "warm-lamp",
      "small-talk",
      "rain-date",
      "mood-drink",
      "sofa-seat",
      "golden-hour",
      "worth-splurge",
    ]),
  ),
  "date-glow",
);
assert.equal(
  winner(
    pick([
      "green-window",
      "plant-sun",
      "leaves-glass",
      "walk-after",
      "rain-window",
      "iced-tea",
      "leaf-shot",
      "garden-seat",
      "late-morning",
      "stay-long",
    ]),
  ),
  "garden-reset",
);
assert.equal(
  winner(pick(["quiet-corner", "keyboard-soft", "rain-work", "corner-seat", "student-friendly"])),
  "quiet-work-nook",
);
