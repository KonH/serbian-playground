export type TestEntry = {
  questions: Record<string, TestEntryElement>
};

export type TestEntryElement = {
  question: string,
  inlineHint: string,
  answers: Record<string, boolean>
};