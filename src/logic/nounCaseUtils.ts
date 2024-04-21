import { TestEntry, TestEntryElement } from './TestEntry';
import { NounDef } from './pluralFormUtils';

export const cases = {
    'Nominativ': 'ko? šta?',
    'Genitiv': 'koga? čega?',
    'Dativ': 'kome? čemu?',
    'Akuzativ': 'koga? šta?',
    'Instrumental': 's kim? s čim?',
    'Lokativ': 'o kome? o čemu?',
    'Vokativ': 'o!'
};

export const createNounCaseMapping = (nouns: NounDef[]): TestEntry => {
    const result: TestEntry = { questions: {} };
    for (const noun of nouns) {
        tryAddLocativ(noun, result.questions);
    }
    return result;
};

function tryAddLocativ(noun: NounDef, result: Record<string, TestEntryElement>) {
    const question = `On priča o + ${noun.word}`;
    const inlineHint = `Locativ - ${cases.Lokativ} + ${noun.word} - ${noun.gender}`;
    const answers: Record<string, boolean> = {};
    answers[noun.lokativ] = true;
    const allCases = collectAllCases(noun);
    for (const c of getRandomCases(allCases, noun.lokativ)) {
        answers[c] = false;
    }
    result[question] = { question, inlineHint, answers };
}

function collectAllCases(noun: NounDef): string[] {
    return [
        noun.genitiv,
        noun.dativ,
        noun.akuzativ,
        noun.instrumental,
        noun.lokativ,
        noun.vokativ
    ];
}

function getRandomCases(allCases: string[], correctCase: string): string[] {
    const result: string[] = [];
    const incorrectRawCases = allCases.filter(c => c !== correctCase);
    const incorrectUniqueCases = Array.from(new Set(incorrectRawCases));
    if (incorrectUniqueCases.length <= 3) {
        return incorrectUniqueCases;
    }
    while (result.length < 3) {
        const randomCaseForm = incorrectUniqueCases[Math.floor(Math.random() * incorrectUniqueCases.length)];
        if (randomCaseForm && !result.includes(randomCaseForm)) {
            result.push(randomCaseForm);
        }
    }
    return result;
}
