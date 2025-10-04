# Implementation Checklist: Last Answer Tracking Bug Fix

## Phase 1: Preparation
- [ ] Create feature branch: `pr/fix-last-answer-tracking`
- [ ] Review current implementation in `TestForm.vue`
- [ ] Understand question tracking flow
- [ ] Plan testing scenarios

## Phase 2: Core Implementation

### Step 1: Add Helper Method
- [ ] Add `getQuestionTextInLatin()` helper method to `TestForm.vue`
- [ ] Use this method consistently throughout tracking logic

### Step 2: Refactor `onWrongClick()` Method
- [ ] Check if current question already exists in `questionHistory`
- [ ] If not in history (first attempt):
  - [ ] Create new `QuestionResult` with `successOnFirstTry: false`
  - [ ] Add to `questionHistory`
  - [ ] Increment `totalCounter`
  - [ ] Call `updateCategoryStats(category, false)`
- [ ] If already in history:
  - [ ] Update existing result's `attemptsCount`
- [ ] Keep existing functionality (reset streak, set `isFirstClick = false`)

### Step 3: Refactor `onRightClick()` Method
- [ ] Check if current question already exists in `questionHistory`
- [ ] If already in history (user got it wrong before):
  - [ ] Update existing result's `attemptsCount` with final count
  - [ ] Keep `successOnFirstTry: false` (already set)
  - [ ] Update category stats appropriately
- [ ] If not in history (correct on first try):
  - [ ] Create new `QuestionResult` with `successOnFirstTry: true`
  - [ ] Add to `questionHistory`
  - [ ] Increment `totalCounter`
  - [ ] Increment `firstTimeRightCounter`
  - [ ] Call `updateCategoryStats(category, true)`
- [ ] Keep existing functionality (increment streak, generate new question)

### Step 4: Update Category Stats Logic
- [ ] Review `updateCategoryStats()` calls to ensure consistency
- [ ] Ensure category stats are only incremented once per question
- [ ] Fix double-counting issues if any arise

### Step 5: Add Finalization in `finish()` (Optional Safety Check)
- [ ] Before building `TestSession`, verify current question is tracked
- [ ] If current question not in history (edge case), add it
- [ ] This serves as safety net for any edge cases

## Phase 3: Testing

### Manual Testing
- [ ] Test Scenario 1: Correct on first try
  - [ ] Verify: 1 question, 100% success, 1 attempt in storage
- [ ] Test Scenario 2: Fail once, then correct
  - [ ] Verify: 1 question, 0% success (not first try), 2 attempts
- [ ] Test Scenario 3: Fail multiple times, then correct
  - [ ] Verify: 1 question, 0% success, N attempts (N > 1)
- [ ] Test Scenario 4: Fail and finish without answering
  - [ ] Verify: 1 question, 0% success, N attempts (N >= 1)
- [ ] Test Scenario 5: Original bug scenario
  - [ ] Fail on Q1, answer Q1 correctly
  - [ ] Answer Q2 correctly
  - [ ] Fail on Q3
  - [ ] Click Finish
  - [ ] Verify: 3 questions total, statistics correct
- [ ] Test with both Latin and Cyrillic scripts
- [ ] Verify localStorage data structure is correct

### Automated Testing
- [ ] Run existing unit tests: `npm test`
- [ ] Ensure all tests pass (no regressions)

## Phase 4: Documentation
- [ ] Update `docs/architecture.md` if needed (likely minor or no changes)
- [ ] Add new version to `docs/version-history.md`
  - Version: `## 0.31`
  - Entry: `- Fix: Last answer tracking bug [docs/wip/2025_10_04_lastAnswerTrackingFix/prompt.md]`
- [ ] Update `src/store.ts` version number to `'0.31'`
- [ ] Add code comments explaining tracking logic changes

## Phase 5: Quality Assurance
- [ ] Run linter: `npm run lint`
- [ ] Fix any linting errors
- [ ] Run all tests: `npm test`
- [ ] Verify no console errors in browser
- [ ] Build successfully: `npm run build`
- [ ] Test built version in `dist/` directory
- [ ] Verify PWA still works correctly

## Phase 6: Verification
- [ ] Clear localStorage before testing
- [ ] Complete full test session with multiple questions
- [ ] Verify statistics in UI match actual attempts
- [ ] Inspect localStorage data in DevTools
- [ ] Confirm all questions present in storage
- [ ] Verify attempt counts are accurate
- [ ] Test the exact scenario from bug report

## Phase 7: Deployment Preparation
- [ ] All checklist items completed
- [ ] No console errors or warnings
- [ ] All tests passing
- [ ] Ready to commit with message: "Fix: Track all attempted questions including last failed answer"

## Notes During Implementation

### Decision Log
- Track questions on first wrong attempt OR first right attempt (whichever comes first)
- Use `findIndex()` to check if question already tracked
- Compare Latin question text for consistency

### Issues Encountered
(Document any issues and solutions here during implementation)

### Edge Cases Handled
- Question answered correctly on first try
- Question failed multiple times then answered correctly
- Question failed and session finished without success
- Multiple questions in one session with mixed results

## Success Verification Checklist
- [ ] Original bug scenario produces expected results
- [ ] Total questions count matches actual attempts
- [ ] Success ratio calculations are correct
- [ ] Category stats are accurate
- [ ] localStorage contains all attempted questions
- [ ] No duplicate questions in history
- [ ] Attempt counts are accurate
- [ ] Both Latin and Cyrillic modes work correctly

