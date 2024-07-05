import { TestCategory } from "@/store";

export type TestEntry = {
  questions: Record<string, TestEntryElement>
};

export type TestEntryElement = {
  category?: TestCategory,
  question: string,
  inlineHint: string,
  answers: Record<string, boolean>
};