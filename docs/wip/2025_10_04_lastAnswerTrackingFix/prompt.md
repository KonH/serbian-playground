# Last Answer Tracking Bug Fix

## Overview
Fix bug where the last question in a test session is not tracked if the user fails it and clicks "Finish" without answering correctly. This causes incorrect statistics showing fewer total questions than actually attempted.

## Bug Description

### Current Behavior
Questions are only added to `questionHistory` when answered correctly (in `onRightClick()`). If a user fails a question and moves on (by clicking "Finish"), that question is never recorded.

### User Story
As a user taking a test, when I fail the last question and finish the session, I expect all attempted questions to be counted in the statistics, not just the ones I answered correctly.

### Reproduction Steps
1. Start a test session
2. Fail on first question once, then answer correctly
3. Answer second question correctly
4. Fail on third question
5. Click "Finish" button

**Expected Result:**
- Total questions: 3
- Right answers: 1 (33%)
- testResultsStorage contains 3 question records

**Actual Result:**
- Total questions: 2
- Right answers: 1 (50%)
- testResultsStorage contains 2 question records (third question missing)

### Root Cause
In `TestForm.vue`:
- `questionHistory` is only populated in `onRightClick()` (line 188)
- `onWrongClick()` only increments attempt counter but never creates a question result
- `finish()` method saves whatever is in `questionHistory` without checking for incomplete questions
- The current question being attempted is never tracked unless answered correctly

## Requirements

### Functional Requirements
1. **Track all attempted questions**, not just correctly answered ones
2. **Include failed questions** in statistics and storage
3. **Update question results** as attempts are made (not just on success)
4. **Capture the current question** when user clicks "Finish" if it hasn't been completed
5. **Maintain backward compatibility** with existing test flow and UI

### Data Requirements
- Modify tracking approach to capture questions on first attempt, not just on success
- Store failed questions with `successOnFirstTry: false` and final `attemptsCount`
- Ensure `totalCounter` reflects all questions attempted, not just successful ones

### Edge Cases
- User answers question correctly on first try → Track normally
- User fails multiple times then succeeds → Track with correct attempt count
- User fails and clicks "Finish" without succeeding → Track as incomplete with attempts made
- User starts question (fails once) and immediately clicks "Finish" → Track with 1 attempt, not successful

## Technical Design

### Affected Components

#### `src/components/TestForm.vue`
**Current approach (broken):**
- Track question result only in `onRightClick()`
- `totalCounter` only counts successful answers

**New approach:**
1. **Track question on first attempt** (in `onWrongClick()` if it's the first wrong click)
2. **Update question result** as user makes attempts
3. **Finalize question result** when answered correctly in `onRightClick()`
4. **Capture incomplete question** in `finish()` before saving

**Changes needed:**
1. Modify `onWrongClick()`:
   - If this is the first attempt on a question (check if question exists in `questionHistory`)
   - Create initial `QuestionResult` and add to `questionHistory`
   - Otherwise, update existing result's `attemptsCount`

2. Modify `onRightClick()`:
   - Check if question already exists in `questionHistory`
   - If yes: Update existing result (set `successOnFirstTry` based on attempts, mark as successful)
   - If no: Create new result (this handles correct on first try)
   - Increment `totalCounter` as before

3. Modify `finish()`:
   - Before building `TestSession`, check if current question is tracked
   - If current question exists but not in `questionHistory` (edge case), add it
   - If current question is in history but not marked successful, finalize it with current attempts

### Data Flow Changes

#### Before (Broken):
```
generateNewQuestion() → user clicks answer
  ↓
onWrongClick() → increment attemptCounts only, NO tracking
  ↓
user clicks finish → finish() → save 0 questions
```

#### After (Fixed):
```
generateNewQuestion() → user clicks answer
  ↓
onWrongClick() → increment attemptCounts + ADD to questionHistory if first attempt
  ↓
user clicks finish → finish() → finalize current question → save all attempted questions
```

### Algorithm for Question Tracking

```typescript
// On wrong answer
onWrongClick() {
  const currentAttempts = this.attemptCounts.get(this.question) || 0;
  this.attemptCounts.set(this.question, currentAttempts + 1);
  
  // Check if this question is already tracked
  const existingQuestionIndex = this.questionHistory.findIndex(
    q => q.questionText === this.getQuestionTextInLatin()
  );
  
  if (existingQuestionIndex === -1) {
    // First attempt on this question - track it
    const questionResult: QuestionResult = {
      category: this.category,
      questionText: this.getQuestionTextInLatin(),
      inlineHint: this.inlineHint,
      relatedWords: extractRelatedWords(this.getQuestionTextInLatin()),
      successOnFirstTry: false,
      attemptsCount: currentAttempts + 1
    };
    this.questionHistory.push(questionResult);
    this.totalCounter++; // Count this question as attempted
    this.updateCategoryStats(this.category, false); // Not first-time right
  } else {
    // Update existing question's attempt count
    this.questionHistory[existingQuestionIndex].attemptsCount = currentAttempts + 1;
  }
  
  this.resetStreakCounter();
  this.isFirstClick = false;
}

// On right answer
onRightClick() {
  const currentAttempts = this.attemptCounts.get(this.question) || 0;
  const attemptsCount = currentAttempts + 1;
  
  const questionTextLatin = this.getQuestionTextInLatin();
  
  // Check if already tracked (from wrong attempts)
  const existingQuestionIndex = this.questionHistory.findIndex(
    q => q.questionText === questionTextLatin
  );
  
  if (existingQuestionIndex !== -1) {
    // Update existing result - user eventually got it right
    this.questionHistory[existingQuestionIndex].attemptsCount = attemptsCount;
    // successOnFirstTry already set to false, leave it
  } else {
    // First try correct - track new result
    const questionResult: QuestionResult = {
      category: this.category,
      questionText: questionTextLatin,
      inlineHint: this.inlineHint,
      relatedWords: extractRelatedWords(questionTextLatin),
      successOnFirstTry: true,
      attemptsCount: 1
    };
    this.questionHistory.push(questionResult);
    this.totalCounter++;
    this.updateCategoryStats(this.category, true);
    this.firstTimeRightCounter++;
  }
  
  if (this.isFirstClick) {
    // This was correct on first try
    this.firstTimeRightCounter++;
    this.updateCategoryStats(this.category, true);
  } else {
    // User eventually got it right after wrong attempts
    this.updateCategoryStats(this.category, false);
  }
  
  this.rightStreakCounter++;
  this.generateNewQuestion();
}
```

### Helper Method
Add helper method to get question text in Latin consistently:

```typescript
getQuestionTextInLatin(): string {
  return this.langStyle === 'cyrillic' 
    ? cyrillicToLatin(this.question) 
    : this.question;
}
```

## Testing Strategy

### Manual Testing Scenarios
1. **Correct on first try**
   - Expected: 1 question, 100% success, 1 attempt
   
2. **Fail once, then correct**
   - Expected: 1 question, 0% success (not first try), 2 attempts
   
3. **Fail twice, then correct**
   - Expected: 1 question, 0% success, 3 attempts
   
4. **Fail and finish without answering**
   - Expected: 1 question, 0% success, N attempts (where N = number of failed attempts)
   
5. **Original bug scenario**
   - Fail on Q1, answer Q1 correctly, answer Q2 correctly, fail on Q3, finish
   - Expected: 3 questions total, 2 correct (66%), proper tracking

### Unit Testing
- No new unit tests needed (logic is in component)
- Existing tests should still pass
- Consider adding integration test if time permits

## Success Criteria
- [ ] All attempted questions counted in `totalCounter`
- [ ] All attempted questions in `questionHistory`
- [ ] All attempted questions in saved `TestSession`
- [ ] Statistics show correct totals (match actual attempts)
- [ ] Original bug scenario produces expected result
- [ ] Backward compatibility maintained (existing test flow works)
- [ ] No console errors or warnings
- [ ] All existing tests pass

## Risks & Mitigation
- **Risk**: Breaking existing test functionality
  - **Mitigation**: Careful incremental changes, test after each modification
  
- **Risk**: Duplicate question tracking
  - **Mitigation**: Check for existing question in history before adding
  
- **Risk**: Incorrect attempt counts
  - **Mitigation**: Use existing `attemptCounts` Map as source of truth

## Future Improvements
- Consider tracking abandoned questions separately in UI (show "incomplete")
- Add visual indicator for questions user gave up on
- Track time spent per question (out of scope for this fix)

