# Serbian Playground - Architecture Documentation

## Project Overview

**Serbian Playground** is a Progressive Web Application (PWA) for learning Serbian language. It provides interactive tests for various Serbian grammar topics and a Latin-Cyrillic script translator.

**Live URL**: https://konh.github.io/custom/serbian-playground/

## Technology Stack

### Core Framework
- **Vue 3** (v3.5.12) - Progressive JavaScript framework with Composition API
- **TypeScript** (v5.6.3) - Type-safe JavaScript
- **Vuex 4** - Centralized state management
- **Vue I18n** (v10.0.4) - Internationalization support

### UI Framework
- **Bootstrap 5** (v5.3.3) - CSS framework
- **Bootstrap-Vue-3** (v0.5.1) - Vue 3 components for Bootstrap

### Data Processing
- **PapaCSV** (v5.4.1) - CSV parsing for vocabulary and localization data

### Build & Development Tools
- **Vue CLI** (v5.0.8) - Build tooling
- **Jest** (v29.7.0) - Testing framework
- **ESLint** - Code linting
- **Concurrently** - Running tests in watch mode alongside dev server

### PWA Support
- **@vue/cli-plugin-pwa** - Service worker registration and PWA features

## Application Architecture

### 1. State Management (Vuex Store)

**Location**: `src/store.ts`

The application uses a single centralized Vuex store with the following state:

```typescript
{
  appVersion: string,           // Current app version
  langStyle: 'latin' | 'cyrillic',  // Script preference
  appState: AppState,           // Current view/screen
  selectedTestCategories: TestCategory[],  // Selected test types
  lastTestResults: TestData | null  // Recent test performance
}
```

**State Persistence**: Uses `localStorage` for:
- `langStyle` - Script preference (Latin/Cyrillic)
- `selectedTestCategories` - User's test selection
- `appLocale` - UI language preference
- `serbianPlayground_testResults` - Test session history (see Test Results Persistence below)

**App States** (Navigation):
- `mainMenu` - Main menu screen
- `translator` - Latin-Cyrillic translator
- `genericTestSelector` - Test category selection
- `genericTest` - Active test session
- `testResults` - Test results display (dynamically mapped)

### 2. Component Architecture

**Location**: `src/components/`

#### Component Organization

The application uses a **state-based component system** instead of traditional routing:

```typescript
// src/components/index.ts
stateToComponentMap = {
  'mainMenu': MainMenu.vue,
  'translator': TranslatorForm.vue,
  'genericTestSelector': GenericTestSelector.vue,
  'genericTest': GenericTest.vue,
  'testResults': TestResults.vue
}
```

Components are loaded asynchronously using Vue's `defineAsyncComponent` for code splitting.

#### Core Components

1. **App.vue** - Root component that renders the current state component
2. **MainMenu.vue** - Entry point with language/script selection
3. **GenericTestSelector.vue** - Test category multi-select
4. **GenericTest.vue** - Test container that uses TestForm
5. **TestForm.vue** - Reusable test UI with question/answer logic
6. **TestResults.vue** - Results display with category breakdown
7. **TranslatorForm.vue** - Latin-Cyrillic text converter
8. **AppFooter.vue** - Footer with links and app version

### 3. Business Logic Layer

**Location**: `src/logic/`

#### Test Categories

The application supports 7 test types:

1. **BitiVerbFormsTest** - "to be" verb conjugation (ja → sam)
2. **BitiVerbFormsTestInvert** - Reverse (sam → ja)
3. **PluralFormsTest** - Noun pluralization (word → plural)
4. **VerbConjugationTest** - General verb conjugation
5. **NounCaseTest** - Serbian noun cases (7 cases)
6. **ComparativeAdjectiveTest** - Comparative adjectives
7. **SuperlativeAdjectiveTest** - Superlative adjectives

#### Logic Module Structure

Each test category has dedicated utilities:

- **genericTestUtils.ts** - Factory for creating test mappings based on selected categories
- **pluralFormUtils.ts** - Plural form generation rules and noun loading
- **verbConjugationUtils.ts** - Verb conjugation logic and verb loading
- **nounCaseUtils.ts** - Seven Serbian cases (nominativ, genitiv, dativ, akuzativ, instrumental, lokativ, vokativ)
- **adjectiveUtils.ts** - Comparative and superlative forms
- **translatorLogic.ts** - Bidirectional Latin-Cyrillic conversion
- **localizationUtils.ts** - CSV-based i18n setup
- **testResultsStorage.ts** - Persistent storage of test session results in localStorage

#### Test Entry Data Model

```typescript
TestEntry = {
  questions: {
    [questionKey: string]: {
      category?: TestCategory,
      question: string,
      inlineHint: string,
      answers: {
        [answerOption: string]: boolean  // true = correct
      }
    }
  }
}
```

### 4. Data Layer

**Location**: `src/assets/*.csv`

#### CSV Data Files

1. **localization.csv** - UI translations (en, ru, sr-Latn, sr-Cyrl)
2. **nouns.csv** - Serbian nouns with gender, cases, plural forms
3. **verbs.csv** - Serbian verbs with conjugation patterns
4. **adjectives.csv** - Serbian adjectives with comparative/superlative forms

#### Data Loading Pattern

CSV files are loaded at build time using webpack's `raw-loader`:

```typescript
import nounsCsv from '!!raw-loader!@/assets/nouns.csv';
```

PapaCSV parses the raw CSV strings into typed objects.

### 5. Internationalization (i18n)

**Implementation**: Vue I18n with CSV-based translations

**Supported Languages**:
- English (en)
- Russian (ru)
- Serbian Latin (sr-Latn)
- Serbian Cyrillic (sr-Cyrl)

**Translation Loading**:
1. CSV parsed at app initialization in `main.ts`
2. i18n instance created with parsed messages
3. Language stored in localStorage
4. Components use `useI18n()` hook for translations

### 6. Test Results Persistence

**Feature**: Test session results are automatically saved to localStorage for future analysis

**Location**: `src/logic/testResultsStorage.ts`

**Storage Key**: `serbianPlayground_testResults`

**Data Structure**:
```typescript
{
  version: "1.0",              // Storage format version
  sessions: [
    {
      sessionId: string,       // Unique session identifier
      sessionDate: string,     // ISO 8601 datetime
      appVersion: string,      // App version at time of test
      totalQuestions: number,
      successCount: number,    // Correct on first try
      successRatio: number,    // Percentage (0-100)
      categories: [            // Per-category breakdown
        {
          category: string,
          totalQuestions: number,
          correctAnswers: number,
          successRatio: number
        }
      ],
      questions: [             // Individual question results
        {
          category: string,
          questionText: string,
          inlineHint: string,
          relatedWords: string[],
          successOnFirstTry: boolean,
          attemptsCount: number
        }
      ]
    }
  ]
}
```

**How It Works**:
1. `TestForm.vue` tracks each question result during test session
2. On "Finish", complete session data is built with metadata
3. Session saved to localStorage via `saveTestSession()`
4. Data can be viewed in browser DevTools → Application → Local Storage
5. Future features will use this data for analytics and progress tracking

**Related Words Extraction**: Question text is parsed to identify the words being tested (e.g., "What is the plural of 'knjiga'?" → `["knjiga"]`)

### 7. Script Switching (Latin ↔ Cyrillic)

**Feature**: Users can view Serbian content in either Latin or Cyrillic script

**Implementation**:
- `langStyle` state in Vuex ('latin' | 'cyrillic')
- `translatorLogic.ts` provides conversion functions
- Components apply conversion in computed properties
- UI updates reactively when script changes

**Conversion Approach**:
- Character-by-character mapping with special handling for digraphs (lj→љ, nj→њ, dž→џ)
- Applied to questions, answers, and hints in test forms

### 7. Testing Strategy

**Framework**: Jest with TypeScript support

**Test Files**: `*.test.ts` co-located with logic files

**Testing Focus**:
- Grammar rule correctness (plural forms, conjugations, cases)
- Data loading and parsing
- Answer validation logic

**Example**: `verbConjugationUtils.test.ts` tests verb forms from CSV data

### 8. Build & Deployment

**Build Tool**: Vue CLI with webpack

**Configuration** (`vue.config.js`):
- Public path: '' (for GitHub Pages subdirectory)
- Performance hints disabled
- Large bundle size limits (512KB)

**Deployment**:
```bash
npm run build
# Outputs to dist/
# Manual copy to ../konh.github.io/custom/serbian-playground/
```

**Development**:
```bash
npm run serve
# Runs dev server + Jest in watch mode concurrently
```

### 9. PWA Features

**Service Worker**: Registered via `registerServiceWorker.ts`

**Manifest**: `public/manifest.json` with app metadata

**Benefits**:
- Offline access to learned content
- Install as standalone app
- Fast loading with caching

## Key Architectural Decisions

### 1. No Router, State-Based Navigation
- **Decision**: Use Vuex state instead of Vue Router
- **Rationale**: Simple linear navigation flow, no need for URL-based routing
- **Trade-off**: No deep linking, but simpler state management

### 2. CSV-Based Data Storage
- **Decision**: Store vocabulary in CSV files
- **Rationale**: Easy to edit, version control friendly, no backend needed
- **Trade-off**: All data loaded at once, but dataset is small (~100s of entries)

### 3. Generic Test System
- **Decision**: Single reusable TestForm component with mapping configuration
- **Rationale**: DRY principle, all tests share same UI/UX
- **Implementation**: Different logic modules generate test mappings

### 4. Synchronous Grammar Rules
- **Decision**: Implement grammar rules in TypeScript
- **Rationale**: Deterministic, testable, no external API needed
- **Example**: Plural form generation based on gender and word ending

### 5. Build-Time CSV Loading
- **Decision**: Use raw-loader to import CSV at build time
- **Rationale**: No runtime HTTP requests, faster initial load
- **Trade-off**: Rebuild needed for content updates

## Data Flow

### Test Flow
```
User selects test categories
  → genericTestUtils.createGenericMappingForCategories()
    → Loads CSV data (nouns/verbs/adjectives)
    → Creates TestEntry mapping for each category
  → TestForm.vue receives mapping as prop
    → Generates random question from mapping
    → User selects answer
    → Validates against mapping
    → Updates stats in component state
  → User finishes test
    → Stats saved to Vuex store
    → Navigate to TestResults
```

### Translation Flow
```
User types in Latin script
  → translatorLogic.latinToCyrillic()
    → Character-by-character conversion
    → Special digraph handling
  → Display Cyrillic result
```

## Performance Considerations

1. **Code Splitting**: Async component loading per route
2. **CSV Parsing**: Done once at app initialization
3. **Test Generation**: Lazy - only generate questions when test starts
4. **Answer Limiting**: Max 4 answer options per question (1 correct, 3 random incorrect)
5. **Service Worker**: Caches assets for offline use

## Extensibility Points

### Adding New Test Category

1. Define category in `src/store.ts`:
   ```typescript
   export const AllTestCategories = [..., 'NewTest'] as const;
   ```

2. Create logic module `src/logic/newTestUtils.ts`:
   ```typescript
   export function createNewTestMapping(): TestEntry { ... }
   ```

3. Add case in `genericTestUtils.ts`:
   ```typescript
   case 'NewTest':
     add(mapping, createNewTestMapping(), category);
     break;
   ```

4. Add translations in `src/assets/localization.csv`

### Adding New Language

1. Add column to `localization.csv` (e.g., 'de' for German)
2. Update `localizationUtils.ts` interface if needed
3. Add option to language selector in `MainMenu.vue`

### Adding New CSV Data

1. Create CSV file in `src/assets/`
2. Define TypeScript interface for row type
3. Create loader function using PapaCSV
4. Import with `!!raw-loader!@/assets/file.csv`

## Directory Structure Summary

```
serbian-playground/
├── src/
│   ├── App.vue                 # Root component
│   ├── main.ts                 # App initialization & i18n setup
│   ├── store.ts                # Vuex store definition
│   ├── registerServiceWorker.ts
│   ├── assets/                 # CSV data files
│   │   ├── localization.csv
│   │   ├── nouns.csv
│   │   ├── verbs.csv
│   │   └── adjectives.csv
│   ├── components/             # Vue components
│   │   ├── index.ts            # State-to-component mapping
│   │   ├── MainMenu.vue
│   │   ├── GenericTest.vue
│   │   ├── TestForm.vue
│   │   └── ...
│   └── logic/                  # Business logic & utilities
│       ├── TestEntry.ts        # Data model
│       ├── genericTestUtils.ts # Test factory
│       ├── pluralFormUtils.ts
│       ├── verbConjugationUtils.ts
│       ├── nounCaseUtils.ts
│       ├── adjectiveUtils.ts
│       ├── translatorLogic.ts
│       ├── localizationUtils.ts
│       └── testResultsStorage.ts # Test results persistence
├── public/                     # Static assets
│   ├── index.html
│   └── manifest.json
├── tests/                      # (Would be here if separate)
├── dist/                       # Build output
├── package.json
├── tsconfig.json
├── vue.config.js
└── jest.config.js
```

## Version History

See [version-history.md](version-history.md) for detailed version information.

Current version: defined in `store.ts`

---

**Last Updated**: 2025-10-04
**Maintainer**: KonH
**Repository**: https://github.com/KonH/serbian-playground (inferred)

