import Papa from 'papaparse';
import { TestEntry } from './TestEntry';

type NounRow = {
    word: string;
    gender: string;
    plural?: string;
}

type NounParseResult = {
  data: NounRow[];
};

export type NounDef = {
    word: string,
    gender: 'm' | 'f' | 'n',
    plural_exception: string | null
};

const vowels = ['a', 'e', 'i', 'o', 'u'];

export function loadNouns(csv: string, nouns: NounDef[]) {
    Papa.parse(csv, {
        download: false,
        header: true,
        complete: (results: NounParseResult) => {
          results.data.forEach(row => {
            const word = row.word.trim();
            const gender = ensureGender(row.gender);
            if ( gender == null ) {
              return;
            }
            const readyGender = gender as 'm' | 'f' | 'n';
            const optionalPluralException = row.plural?.trim() || null;
            const def = {
              word: word,
              gender: readyGender,
              plural_exception: optionalPluralException
            };
            nouns.push(def);
          });
        }
      });
}

function ensureGender(input: string) {
    const readyStr = input.trim().toLowerCase();
    if (readyStr == 'm' || readyStr == 'f' || readyStr == 'n') {
        return readyStr;
    }
    return null;
}

function skipLastVowel(w: string): string {
    const lastChar = w[w.length - 1];
    if (vowels.includes(lastChar)) {
        return w.slice(0, w.length - 1);
    } else {
        return w;
    }
}

function isSingleSyllable(w: string): boolean {
    let count = 0;
    for (const char of w) {
        if (vowels.includes(char)) {
            count++;
        }
    }
    return count <= 1;
}

function isSoftConsonant(c: string): boolean {
    return ['j', 'č', 'ć', 'đ', 'š', 'ž'].includes(c);
}

export const createNounMapping = (nouns: NounDef[]): TestEntry => {
    const result: TestEntry = { questions: {} };
    const pluralFormTransforms = {
        endsWithI_SkipPrevChar: (w: string) => w.slice(0, w.length - 2) + w[w.length - 1] + 'i',
        endsWithI_NoVowelEnding: (w: string) => skipLastVowel(w) + 'i',
        endsWithCi_NoEnding: (w: string) => w.slice(0, w.length - 1) + 'ci',
        endsWithZi_NoEnding: (w: string) => w.slice(0, w.length - 1) + 'zi',
        endsWithSi_NoEnding: (w: string) => w.slice(0, w.length - 1) + 'si',
        endsWithOvi: (w: string) => w + 'ovi',
        endsWithLovi: (w: string) => w + 'lovi',
        endsWithEvi: (w: string) => w + 'evi',
        endsWithNa: (w: string) => w + 'na',
        endsWithE_NoVowelEnding: (w: string) => skipLastVowel(w) + 'e',
        endsWithA_NoVowelEnding: (w: string) => skipLastVowel(w) + 'a'
    };

    function applyTransform(container: Record<string, boolean>, w: string, wordTransform: (w: string) => string) {
        const transformedValue = wordTransform(w);
        container[transformedValue] = false;
    }

    function applyAllFormTransforms(container: Record<string, boolean>, w: string) {
        applyTransform(container, w, pluralFormTransforms.endsWithI_SkipPrevChar);
        applyTransform(container, w, pluralFormTransforms.endsWithI_NoVowelEnding);
        applyTransform(container, w, pluralFormTransforms.endsWithCi_NoEnding);
        applyTransform(container, w, pluralFormTransforms.endsWithZi_NoEnding);
        applyTransform(container, w, pluralFormTransforms.endsWithSi_NoEnding);
        applyTransform(container, w, pluralFormTransforms.endsWithOvi);
        applyTransform(container, w, pluralFormTransforms.endsWithLovi);
        applyTransform(container, w, pluralFormTransforms.endsWithEvi);
        applyTransform(container, w, pluralFormTransforms.endsWithNa);
        applyTransform(container, w, pluralFormTransforms.endsWithE_NoVowelEnding);
        applyTransform(container, w, pluralFormTransforms.endsWithA_NoVowelEnding);
    }

    function getCorrectPluralForm(noun: NounDef): string {
        if (noun.plural_exception) {
            return noun.plural_exception;
        } else {
            const word = noun.word;
            switch (noun.gender) {
                case 'm': {
                    if (word.endsWith('ac')) {
                        return pluralFormTransforms.endsWithI_SkipPrevChar(word);
                    }
                    if (word.endsWith('k')) {
                        return pluralFormTransforms.endsWithCi_NoEnding(word);
                    }
                    if(isSingleSyllable(word)) {
                        if (word.endsWith('o')) {
                            return pluralFormTransforms.endsWithLovi(word);
                        }
                        const lastChar = word[word.length - 1];
                        if (isSoftConsonant(lastChar)) {
                            return pluralFormTransforms.endsWithEvi(word);
                        }
                        return pluralFormTransforms.endsWithOvi(word);
                    }
                    if (word.endsWith('g')) {
                        return pluralFormTransforms.endsWithZi_NoEnding(word);
                    }
                    if (word.endsWith('h')) {
                        return pluralFormTransforms.endsWithSi_NoEnding(word);
                    }
                    return pluralFormTransforms.endsWithI_NoVowelEnding(word);
                }
                case 'f': return pluralFormTransforms.endsWithE_NoVowelEnding(word);
                case 'n': {
                    if (word.endsWith('e') && !word.endsWith('nje')) {
                        return pluralFormTransforms.endsWithNa(word);
                    }
                    return pluralFormTransforms.endsWithA_NoVowelEnding(word);
                }
            }
        }
    }

    function displayGender(gender: 'm' | 'f' | 'n') {
        switch (gender) {
            case 'm':
                return 'muško';
            case 'f':
                return 'žensko';
            case 'n':
                return 'neodređeno';
            default:
                throw new Error('Invalid gender');
        }
    }
    
    for (const noun of nouns) {
        const answers: Record<string, boolean> = {};
        applyAllFormTransforms(answers, noun.word);
        const correctPluralForm = getCorrectPluralForm(noun);
        answers[correctPluralForm] = true;
        result.questions[noun.word] = { 
            question: noun.word,
            inlineHint: displayGender(noun.gender),
            answers
        };
    }
    const limitedResult: TestEntry = { questions: {} };
    for (const key in result.questions) {
        const element = result.questions[key];
        const limitedAnswers: Record<string, boolean> = {};
        const keys = Object.keys(element.answers);
        const correctPluralForm = keys.find(k => element.answers[k]);
        if (correctPluralForm) {
            limitedAnswers[correctPluralForm] = true;
        }
        const otherPluralForms = keys.filter(k => !element.answers[k]);
        let otherPluralFormsCount = otherPluralForms.length;
        const otherPluralFormsToTake = Math.min(3, otherPluralFormsCount);
        for (let i = 0; i < otherPluralFormsToTake; i++) {
            const randomIndex = Math.floor(Math.random() * otherPluralFormsCount);
            const randomPluralForm = otherPluralForms[randomIndex];
            limitedAnswers[randomPluralForm] = false;
            otherPluralForms.splice(randomIndex, 1);
            otherPluralFormsCount--;
        }
        limitedResult.questions[key] = {
            question: element.question,
            inlineHint: element.inlineHint,
            answers: limitedAnswers
        };
    }
    return limitedResult;
};
