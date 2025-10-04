# Test Results Storage in localStorage

## Overview
Implement persistent storage of test session results in browser's localStorage. This feature will track individual test sessions with detailed question-level data, allowing for future analytics and progress tracking features.

## User Story
As a Serbian language learner, I want my test results to be saved so that I can track my progress over time and identify areas that need improvement.

## Requirements
- Store each test session when user clicks "Finish" button
- No UI required for this iteration (backend/logic only)
- Support for manual inspection via browser DevTools
- Data structure must be extensible for future analytics features

### Data to Store Per Session:
1. **Session metadata**:
   - Session datetime (ISO 8601 format)
   - Session ID (unique identifier)
   - App version (for future compatibility)

2. **Overall session statistics**:
   - Total questions answered
   - Total correct on first try (success count)
   - Success ratio (percentage)

3. **Per-question results**:
   - Test category (e.g., "PluralFormsTest")
   - Question text (in Latin script for consistency)
   - Question inline hint (if available)
   - Success flag (boolean: was answer correct on first try?)
   - Related words/data (to identify the specific word/verb being tested)
   - Number of attempts before correct answer

4. **Per-category statistics**:
   - Category name
   - Questions answered in this category
   - Correct answers in this category
   - Success ratio for this category

## Technical Design

### Affected Components

#### TestForm.vue (modifications)
- Track per-question results during test session
- Build detailed question history as user progresses
- Pass detailed data to store when finishing test
- Extract "related words" from question context

### New/Modified Logic Modules

#### New: `src/logic/testResultsStorage.ts`
Core module for managing test results persistence:

**Key interfaces**:
```typescript
// Single question result
interface QuestionResult {
  category: string;              // TestCategory as string
  questionText: string;          // Question text in Latin
  inlineHint: string;           // Hint text (empty if none)
  relatedWords: string[];       // Words being tested (extracted from question)
  successOnFirstTry: boolean;   // True if correct on first attempt
  attemptsCount: number;        // Number of attempts before success
}

// Per-category summary
interface CategorySummary {
  category: string;
  totalQuestions: number;
  correctAnswers: number;
  successRatio: number;         // Percentage 0-100
}

// Complete test session
interface TestSession {
  sessionId: string;            // UUID or timestamp-based ID
  sessionDate: string;          // ISO 8601 datetime
  appVersion: string;           // From store
  totalQuestions: number;
  successCount: number;         // Correct on first try
  successRatio: number;         // Percentage 0-100
  categories: CategorySummary[];
  questions: QuestionResult[];
}

// Storage container (array of sessions)
interface TestResultsStorage {
  version: string;              // Storage format version
  sessions: TestSession[];
}
```

**Key functions**:
```typescript
// Save new test session to localStorage
function saveTestSession(session: TestSession): void

// Load all sessions from localStorage
function loadTestSessions(): TestSession[]

// Clear all stored sessions (for testing/reset)
function clearTestSessions(): void

// Get storage key name
function getStorageKey(): string  // Returns 'serbianPlayground_testResults'
```

#### Modified: `src/store.ts`
- Update `TestData` type to include question-level details
- Or create new action for saving detailed results
- Add app version getter (already exists)

#### Modified: `src/components/TestForm.vue`
- Add data property: `questionHistory: QuestionResult[]`
- Track each question's result in `onRightClick()` and `onWrongClick()`
- Extract related words from question text (e.g., word being tested)
- Build complete session data in `finish()` method
- Call new storage function when finishing test

### Data Requirements

#### No new CSV files needed

#### TypeScript Interfaces
All defined in `src/logic/testResultsStorage.ts` (see above)

#### LocalStorage Structure
```json
{
  "version": "1.0",
  "sessions": [
    {
      "sessionId": "1728048000000-abc123",
      "sessionDate": "2025-10-04T11:30:00.000Z",
      "appVersion": "0.30",
      "totalQuestions": 15,
      "successCount": 12,
      "successRatio": 80.0,
      "categories": [
        {
          "category": "PluralFormsTest",
          "totalQuestions": 10,
          "correctAnswers": 8,
          "successRatio": 80.0
        },
        {
          "category": "VerbConjugationTest",
          "totalQuestions": 5,
          "correctAnswers": 4,
          "successRatio": 80.0
        }
      ],
      "questions": [
        {
          "category": "PluralFormsTest",
          "questionText": "What is the plural of 'knjiga'?",
          "inlineHint": "Feminine noun ending in -a",
          "relatedWords": ["knjiga", "knjige"],
          "successOnFirstTry": true,
          "attemptsCount": 1
        },
        {
          "category": "VerbConjugationTest",
          "questionText": "Conjugate 'govoriti' for 'ja'",
          "inlineHint": "",
          "relatedWords": ["govoriti", "govorim"],
          "successOnFirstTry": false,
          "attemptsCount": 2
        }
      ]
    }
  ]
}
```

#### localStorage Key
`serbianPlayground_testResults`

### State Management

#### Store Changes
Option A (simpler): Keep existing `updateLastTestResults` action, add separate action for persistence:
- Add action: `saveTestSessionToStorage(sessionData: TestSession)`

Option B (comprehensive): Extend existing TestData type with question details

**Recommendation**: Use Option A for this iteration to maintain backward compatibility.

### Related Words Extraction Strategy

The "related words" should identify what's being tested. Extraction logic:

1. **For noun/verb tests**: Extract base word and answer from question text
   - Question: "What is the plural of 'knjiga'?"
   - Related words: `["knjiga"]`
   
2. **For conjugation tests**: Extract verb and form
   - Question: "Conjugate 'govoriti' for 'ja'"
   - Related words: `["govoriti", "ja"]`

3. **Implementation approach**:
   - Parse question text with regex patterns
   - Extract words in single quotes or specific patterns
   - Fall back to empty array if extraction fails
   - Can be enhanced later without breaking storage format

## Manual Testing Instructions

### How to Check Results in Browser DevTools

#### Step 1: Open DevTools
1. Open the app in browser (Chrome/Edge recommended)
2. Press `F12` or `Right-click → Inspect`
3. Go to **Application** tab (Chrome/Edge) or **Storage** tab (Firefox)

#### Step 2: View localStorage
1. In left sidebar, expand **Local Storage**
2. Click on your app's origin (e.g., `http://localhost:8080`)
3. Look for key: `serbianPlayground_testResults`

#### Step 3: Inspect Stored Data
**In DevTools Console** (easier for JSON viewing):
```javascript
// View all stored sessions
JSON.parse(localStorage.getItem('serbianPlayground_testResults'))

// Pretty print
console.log(JSON.stringify(
  JSON.parse(localStorage.getItem('serbianPlayground_testResults')),
  null, 
  2
))

// Get session count
JSON.parse(localStorage.getItem('serbianPlayground_testResults')).sessions.length

// Get latest session
const data = JSON.parse(localStorage.getItem('serbianPlayground_testResults'));
data.sessions[data.sessions.length - 1]

// View latest session's questions
const data = JSON.parse(localStorage.getItem('serbianPlayground_testResults'));
data.sessions[data.sessions.length - 1].questions
```

#### Step 4: Verify Data Integrity
After completing a test session, check:
1. ✅ New session added to `sessions` array
2. ✅ `sessionDate` is valid ISO 8601 format
3. ✅ `totalQuestions` matches questions answered
4. ✅ `successCount` matches number of correct first-try answers
5. ✅ `successRatio` is calculated correctly (successCount / totalQuestions * 100)
6. ✅ Each question has all required fields
7. ✅ Category summaries match question-level data

#### Step 5: Test Clear Function
```javascript
// Clear all stored sessions (for testing)
localStorage.removeItem('serbianPlayground_testResults')

// Verify cleared
localStorage.getItem('serbianPlayground_testResults')  // Should return null
```

### Test Scenarios

#### Scenario 1: Basic Session Storage
1. Start a new test (select any categories)
2. Answer 5+ questions (mix of correct/incorrect on first try)
3. Click "Finish"
4. Check localStorage - should have 1 session with correct data

#### Scenario 2: Multiple Sessions
1. Complete test session (Scenario 1)
2. Start another test
3. Answer different number of questions
4. Click "Finish"
5. Check localStorage - should have 2 sessions
6. Verify both sessions preserved correctly

#### Scenario 3: Success Ratio Calculation
1. Start test
2. Answer 4 questions correctly on first try
3. Answer 1 question incorrectly (then correctly on second try)
4. Click "Finish"
5. Check: `successRatio` should be 80.0 (4/5 * 100)

#### Scenario 4: Category Breakdown
1. Select multiple test categories (e.g., Plural Forms + Verb Conjugation)
2. Complete test with questions from both categories
3. Check localStorage
4. Verify `categories` array has entries for both categories
5. Verify category stats match individual questions

#### Scenario 5: Related Words Extraction
1. Complete a test session
2. Check `questions[0].relatedWords` 
3. Verify it contains relevant words from the question
4. If empty array, extraction logic needs refinement (acceptable for v1)

## Implementation Notes

### Phase 1 Scope (This Feature)
- ✅ Core storage infrastructure
- ✅ Question-level tracking
- ✅ localStorage persistence
- ✅ Manual inspection capability
- ❌ No UI for viewing history
- ❌ No analytics/charts
- ❌ No export functionality

### Future Enhancements (Out of Scope)
- Test history viewer component
- Progress charts and analytics
- Export to CSV/JSON
- Compare sessions over time
- Weak area identification
- Study recommendations
- Cloud sync (requires backend)

### Edge Cases to Consider
1. **localStorage full**: Not handled in v1 (rare for this use case)
2. **Old format migration**: version field allows future migration
3. **Corrupted data**: Load function should handle parse errors gracefully
4. **Very long sessions**: No limit on questions array size in v1

## Success Criteria

Feature is complete when:
1. ✅ Test sessions saved to localStorage on "Finish"
2. ✅ All required fields present in stored data
3. ✅ Success ratio calculated correctly
4. ✅ Multiple sessions can be stored and retrieved
5. ✅ Data structure matches specification
6. ✅ Manual testing via DevTools works as documented
7. ✅ No breaking changes to existing functionality
8. ✅ Tests pass (if unit tests added)

## Notes

- Keep question text in Latin script for consistency (convert from Cyrillic if needed)
- Related words extraction can be basic in v1, enhanced later
- Storage format version allows future schema changes
- Session ID should be unique (timestamp + random component is sufficient)
- Consider adding size limit on sessions array in future (e.g., keep last 100 sessions)

