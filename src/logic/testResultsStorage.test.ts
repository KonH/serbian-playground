/**
 * Unit tests for testResultsStorage module
 */

import {
  saveTestSession,
  loadTestSessions,
  clearTestSessions,
  getStorageKey,
  generateSessionId,
  extractRelatedWords,
  TestSession,
  CategorySummary,
  QuestionResult
} from './testResultsStorage';

// Mock localStorage for Node.js test environment
class LocalStorageMock implements Storage {
  private store: Record<string, string> = {};

  get length(): number {
    return Object.keys(this.store).length;
  }

  clear() {
    this.store = {};
  }

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string) {
    this.store[key] = value;
  }

  removeItem(key: string) {
    delete this.store[key];
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }
}

global.localStorage = new LocalStorageMock();

describe('testResultsStorage', () => {
  const STORAGE_KEY = 'serbianPlayground_testResults';

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
  });

  describe('getStorageKey', () => {
    it('should return correct storage key', () => {
      expect(getStorageKey()).toBe(STORAGE_KEY);
    });
  });

  describe('generateSessionId', () => {
    it('should generate unique session IDs', () => {
      const id1 = generateSessionId();
      const id2 = generateSessionId();
      
      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^\d+-[a-z0-9]+$/);
    });
  });

  describe('extractRelatedWords', () => {
    it('should extract words in single quotes', () => {
      const questionText = "What is the plural of 'knjiga'?";
      const words = extractRelatedWords(questionText);
      
      expect(words).toContain('knjiga');
      expect(words.length).toBe(1);
    });

    it('should extract multiple words in quotes', () => {
      const questionText = "Conjugate 'govoriti' for 'ja'";
      const words = extractRelatedWords(questionText);
      
      expect(words).toContain('govoriti');
      expect(words).toContain('ja');
      expect(words.length).toBe(2);
    });

    it('should return empty array if no quoted words found', () => {
      const questionText = "What is the answer?";
      const words = extractRelatedWords(questionText);
      
      expect(words).toEqual([]);
    });

    it('should handle empty string', () => {
      const words = extractRelatedWords('');
      expect(words).toEqual([]);
    });

    it('should trim whitespace from extracted words', () => {
      const questionText = "What is ' test '?";
      const words = extractRelatedWords(questionText);
      
      expect(words).toContain('test');
    });
  });

  describe('saveTestSession and loadTestSessions', () => {
    it('should save and load a single session', () => {
      const session: TestSession = {
        sessionId: 'test-123',
        sessionDate: '2025-10-04T12:00:00.000Z',
        appVersion: '0.30',
        totalQuestions: 5,
        successCount: 4,
        successRatio: 80.0,
        categories: [{
          category: 'PluralFormsTest',
          totalQuestions: 5,
          correctAnswers: 4,
          successRatio: 80.0
        }],
        questions: [{
          category: 'PluralFormsTest',
          questionText: "What is the plural of 'knjiga'?",
          inlineHint: 'Feminine noun',
          relatedWords: ['knjiga'],
          successOnFirstTry: true,
          attemptsCount: 1
        }]
      };

      saveTestSession(session);
      const loaded = loadTestSessions();

      expect(loaded).toHaveLength(1);
      expect(loaded[0]).toEqual(session);
    });

    it('should append multiple sessions', () => {
      const session1: TestSession = {
        sessionId: 'test-123',
        sessionDate: '2025-10-04T12:00:00.000Z',
        appVersion: '0.30',
        totalQuestions: 5,
        successCount: 4,
        successRatio: 80.0,
        categories: [],
        questions: []
      };

      const session2: TestSession = {
        sessionId: 'test-456',
        sessionDate: '2025-10-04T13:00:00.000Z',
        appVersion: '0.30',
        totalQuestions: 10,
        successCount: 8,
        successRatio: 80.0,
        categories: [],
        questions: []
      };

      saveTestSession(session1);
      saveTestSession(session2);
      const loaded = loadTestSessions();

      expect(loaded).toHaveLength(2);
      expect(loaded[0]).toEqual(session1);
      expect(loaded[1]).toEqual(session2);
    });

    it('should return empty array when no sessions exist', () => {
      const loaded = loadTestSessions();
      expect(loaded).toEqual([]);
    });

    it('should handle corrupted JSON gracefully', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid json{');
      const loaded = loadTestSessions();
      
      expect(loaded).toEqual([]);
    });

    it('should handle invalid storage structure', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: '1.0' }));
      const loaded = loadTestSessions();
      
      expect(loaded).toEqual([]);
    });

    it('should reset storage if sessions is not an array', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ 
        version: '1.0', 
        sessions: 'not an array' 
      }));
      
      const session: TestSession = {
        sessionId: 'test-789',
        sessionDate: '2025-10-04T14:00:00.000Z',
        appVersion: '0.30',
        totalQuestions: 3,
        successCount: 3,
        successRatio: 100.0,
        categories: [],
        questions: []
      };
      
      saveTestSession(session);
      const loaded = loadTestSessions();
      
      expect(loaded).toHaveLength(1);
      expect(loaded[0]).toEqual(session);
    });
  });

  describe('clearTestSessions', () => {
    it('should remove all sessions from localStorage', () => {
      const session: TestSession = {
        sessionId: 'test-123',
        sessionDate: '2025-10-04T12:00:00.000Z',
        appVersion: '0.30',
        totalQuestions: 5,
        successCount: 4,
        successRatio: 80.0,
        categories: [],
        questions: []
      };

      saveTestSession(session);
      expect(loadTestSessions()).toHaveLength(1);

      clearTestSessions();
      expect(loadTestSessions()).toEqual([]);
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('should handle clearing when no sessions exist', () => {
      clearTestSessions();
      expect(loadTestSessions()).toEqual([]);
    });
  });

  describe('data integrity', () => {
    it('should preserve all session fields accurately', () => {
      const categories: CategorySummary[] = [
        {
          category: 'PluralFormsTest',
          totalQuestions: 3,
          correctAnswers: 2,
          successRatio: 66.67
        },
        {
          category: 'VerbConjugationTest',
          totalQuestions: 2,
          correctAnswers: 2,
          successRatio: 100.0
        }
      ];

      const questions: QuestionResult[] = [
        {
          category: 'PluralFormsTest',
          questionText: "What is the plural of 'knjiga'?",
          inlineHint: 'Feminine noun ending in -a',
          relatedWords: ['knjiga'],
          successOnFirstTry: true,
          attemptsCount: 1
        },
        {
          category: 'VerbConjugationTest',
          questionText: "Conjugate 'govoriti' for 'ja'",
          inlineHint: '',
          relatedWords: ['govoriti', 'ja'],
          successOnFirstTry: false,
          attemptsCount: 2
        }
      ];

      const session: TestSession = {
        sessionId: 'test-complete-123',
        sessionDate: '2025-10-04T15:30:00.000Z',
        appVersion: '0.30',
        totalQuestions: 5,
        successCount: 4,
        successRatio: 80.0,
        categories: categories,
        questions: questions
      };

      saveTestSession(session);
      const loaded = loadTestSessions();

      expect(loaded).toHaveLength(1);
      expect(loaded[0].sessionId).toBe(session.sessionId);
      expect(loaded[0].sessionDate).toBe(session.sessionDate);
      expect(loaded[0].appVersion).toBe(session.appVersion);
      expect(loaded[0].totalQuestions).toBe(session.totalQuestions);
      expect(loaded[0].successCount).toBe(session.successCount);
      expect(loaded[0].successRatio).toBe(session.successRatio);
      expect(loaded[0].categories).toEqual(categories);
      expect(loaded[0].questions).toEqual(questions);
    });

    it('should maintain storage format version', () => {
      const session: TestSession = {
        sessionId: 'test-123',
        sessionDate: '2025-10-04T12:00:00.000Z',
        appVersion: '0.30',
        totalQuestions: 1,
        successCount: 1,
        successRatio: 100.0,
        categories: [],
        questions: []
      };

      saveTestSession(session);
      
      const rawData = localStorage.getItem(STORAGE_KEY);
      expect(rawData).toBeTruthy();
      
      const parsed = JSON.parse(rawData!);
      expect(parsed.version).toBe('1.0');
      expect(Array.isArray(parsed.sessions)).toBe(true);
    });
  });
});

