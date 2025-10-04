# Implementation Checklist: Test Results Storage

## Phase 1: Preparation
- [ ] Review existing test flow in `TestForm.vue`
- [ ] Review existing store structure in `src/store.ts`
- [ ] Design TypeScript interfaces for storage structure
- [ ] Plan related words extraction strategy

## Phase 2: Core Implementation

### Step 1: Create Storage Module
- [ ] Create `src/logic/testResultsStorage.ts`
- [ ] Define TypeScript interfaces:
  - [ ] `QuestionResult` interface
  - [ ] `CategorySummary` interface
  - [ ] `TestSession` interface
  - [ ] `TestResultsStorage` interface
- [ ] Implement core functions:
  - [ ] `saveTestSession()` - Save session to localStorage
  - [ ] `loadTestSessions()` - Load all sessions from localStorage
  - [ ] `clearTestSessions()` - Clear all stored data
  - [ ] `getStorageKey()` - Return consistent key name
  - [ ] `generateSessionId()` - Generate unique session ID

### Step 2: Implement Related Words Extraction
- [ ] Create helper function `extractRelatedWords(questionText: string): string[]`
- [ ] Add regex patterns for common question formats
- [ ] Test with sample questions from different categories
- [ ] Handle edge cases (return empty array if extraction fails)

### Step 3: Modify TestForm.vue
- [ ] Add data property: `questionHistory: QuestionResult[]` to track questions
- [ ] Add data property: `attemptCounts: Map<string, number>` to track attempts per question
- [ ] Modify `generateNewQuestion()` to initialize attempt counter
- [ ] Modify `checkAnswer()` to increment attempt counter
- [ ] Modify `onRightClick()` to:
  - [ ] Create `QuestionResult` object
  - [ ] Extract related words from current question
  - [ ] Record success status (check if first attempt)
  - [ ] Add to `questionHistory` array
- [ ] Modify `onWrongClick()` to:
  - [ ] Increment attempt counter for current question
- [ ] Modify `finish()` method to:
  - [ ] Build complete `TestSession` object
  - [ ] Include session metadata (ID, datetime, version)
  - [ ] Calculate overall success ratio
  - [ ] Build category summaries from `categoryStats`
  - [ ] Call `saveTestSession()` with complete data
  - [ ] Keep existing `updateLastTestResults()` call (for backward compatibility)

### Step 4: Store Integration (Optional)
- [ ] Consider adding store action `saveTestSessionToStorage()` if centralized storage management preferred
- [ ] Or call storage module directly from TestForm.vue (simpler approach)
- [ ] Ensure app version is accessible from component

### Step 5: Add Error Handling
- [ ] Wrap localStorage operations in try-catch blocks
- [ ] Handle JSON parse errors gracefully in `loadTestSessions()`
- [ ] Handle localStorage quota exceeded errors (log to console, don't break app)
- [ ] Add validation for loaded data structure

## Phase 3: Testing

### Unit Tests (Optional but Recommended)
- [ ] Create `src/logic/testResultsStorage.test.ts`
- [ ] Test `saveTestSession()` writes correct data
- [ ] Test `loadTestSessions()` reads data correctly
- [ ] Test `clearTestSessions()` removes data
- [ ] Test related words extraction with various question formats
- [ ] Test error handling with corrupted JSON

### Verification
- [ ] Complete a test session and verify data in localStorage using DevTools
- [ ] Verify data structure matches specification from prompt.md

## Phase 4: Documentation
- [ ] Update `docs/architecture.md`
  - [ ] Add testResultsStorage.ts to logic modules section
  - [ ] Document localStorage usage for test results
  - [ ] Update state management section if store modified
  - [ ] Add section about test results persistence
- [ ] Add new version to `docs/version-history.md`
  - Version: `## 0.30`
  - Entry: `- Test Results Storage [docs/wip/2025_10_04_testResultsStorage/prompt.md]`
- [ ] Update `src/store.ts` version number to `'0.30'`
- [ ] Add inline code comments for complex logic (related words extraction)
- [ ] Add JSDoc comments for exported functions in testResultsStorage.ts

## Phase 5: Quality Assurance
- [ ] Run linter: `npm run lint`
- [ ] Fix any linting errors
- [ ] Run all existing tests: `npm test`
- [ ] Ensure no regressions in test functionality
- [ ] Test in both Latin and Cyrillic modes
- [ ] Build successfully: `npm run build`
- [ ] Test built version in `dist/` directory
- [ ] Verify PWA still works offline (test results saved in offline mode)

## Phase 6: Cleanup & Polish
- [ ] Remove any console.log statements added during development
- [ ] Ensure TypeScript types are properly defined (no `any` types)
- [ ] Verify localStorage key naming follows convention
- [ ] Check storage format version is set correctly
- [ ] Ensure backward compatibility with existing test flow

## Phase 7: Deployment Preparation
- [ ] Verify all checklist items completed
- [ ] Final manual test: Complete full test session and verify all data
- [ ] Verify DevTools inspection instructions are accurate
- [ ] Commit changes with descriptive message: "Add test results storage to localStorage"

## Notes During Implementation

### Decision Log
- **Storage location**: Direct localStorage (not Vuex) - simpler and appropriate for this use case
- **Related words extraction**: Basic regex patterns for v1, can be enhanced later
- **Session ID format**: `timestamp-randomString` for uniqueness
- **Storage key**: `serbianPlayground_testResults` (consistent with app naming)

### Issues Encountered
(Document any issues and solutions here during implementation)

### Future Improvements Ideas
- Add session limit (e.g., keep only last 100 sessions)
- Implement localStorage quota monitoring
- Add data export functionality
- Create UI component to view history
- Add analytics calculations (weak areas, progress trends)
- Implement data migration for future format changes

