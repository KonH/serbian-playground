/**
 * Test Results Storage Module
 * 
 * Manages persistent storage of test session results in browser's localStorage.
 * This module provides infrastructure for tracking detailed test performance
 * including question-level data and per-category statistics.
 */

/**
 * Single question result with all attempt details
 */
export interface QuestionResult {
  category: string;              // TestCategory as string
  questionText: string;          // Question text in Latin
  inlineHint: string;            // Hint text (empty if none)
  relatedWords: string[];        // Words being tested (extracted from question)
  successOnFirstTry: boolean;    // True if correct on first attempt
  attemptsCount: number;         // Number of attempts before success
}

/**
 * Per-category summary statistics
 */
export interface CategorySummary {
  category: string;
  totalQuestions: number;
  correctAnswers: number;
  successRatio: number;          // Percentage 0-100
}

/**
 * Complete test session with metadata and results
 */
export interface TestSession {
  sessionId: string;             // UUID or timestamp-based ID
  sessionDate: string;           // ISO 8601 datetime
  appVersion: string;            // From store
  totalQuestions: number;
  successCount: number;          // Correct on first try
  successRatio: number;          // Percentage 0-100
  categories: CategorySummary[];
  questions: QuestionResult[];
}

/**
 * Storage container for all test sessions
 */
export interface TestResultsStorage {
  version: string;               // Storage format version
  sessions: TestSession[];
}

// Storage configuration
const STORAGE_KEY = 'serbianPlayground_testResults';
const STORAGE_FORMAT_VERSION = '1.0';

/**
 * Get the localStorage key used for storing test results
 */
export function getStorageKey(): string {
  return STORAGE_KEY;
}

/**
 * Generate a unique session ID using timestamp and random component
 */
export function generateSessionId(): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomStr}`;
}

/**
 * Extract related words from question text
 * 
 * Attempts to identify words being tested by looking for:
 * - Words in single quotes
 * - Common question patterns
 * 
 * @param questionText - The question text to analyze
 * @returns Array of related words, or empty array if extraction fails
 */
export function extractRelatedWords(questionText: string): string[] {
  const words: string[] = [];
  
  // Extract words in single quotes
  const quotedWords = questionText.match(/'([^']+)'/g);
  if (quotedWords) {
    quotedWords.forEach(quoted => {
      // Remove quotes and add to words array
      const word = quoted.replace(/'/g, '');
      if (word.trim()) {
        words.push(word.trim());
      }
    });
  }
  
  return words;
}

/**
 * Save a test session to localStorage
 * 
 * Appends the new session to existing sessions in localStorage.
 * Handles errors gracefully by logging to console.
 * 
 * @param session - The test session to save
 */
export function saveTestSession(session: TestSession): void {
  try {
    // Load existing storage or create new
    let storage: TestResultsStorage;
    const existingData = localStorage.getItem(STORAGE_KEY);
    
    if (existingData) {
      try {
        storage = JSON.parse(existingData);
        // Validate structure
        if (!storage.sessions || !Array.isArray(storage.sessions)) {
          // eslint-disable-next-line no-console
          console.warn('Invalid storage structure, resetting storage');
          storage = {
            version: STORAGE_FORMAT_VERSION,
            sessions: []
          };
        }
      } catch (parseError) {
        // eslint-disable-next-line no-console
        console.error('Failed to parse existing test results, resetting storage:', parseError);
        storage = {
          version: STORAGE_FORMAT_VERSION,
          sessions: []
        };
      }
    } else {
      storage = {
        version: STORAGE_FORMAT_VERSION,
        sessions: []
      };
    }
    
    // Add new session
    storage.sessions.push(session);
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to save test session to localStorage:', error);
    // Don't throw - failing to save shouldn't break the app
  }
}

/**
 * Load all test sessions from localStorage
 * 
 * @returns Array of test sessions, or empty array if none exist or on error
 */
export function loadTestSessions(): TestSession[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return [];
    }
    
    const storage: TestResultsStorage = JSON.parse(data);
    
    // Validate structure
    if (!storage.sessions || !Array.isArray(storage.sessions)) {
      // eslint-disable-next-line no-console
      console.warn('Invalid storage structure');
      return [];
    }
    
    return storage.sessions;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to load test sessions from localStorage:', error);
    return [];
  }
}

/**
 * Clear all stored test sessions
 * 
 * Useful for testing or manual data reset.
 */
export function clearTestSessions(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to clear test sessions from localStorage:', error);
  }
}

