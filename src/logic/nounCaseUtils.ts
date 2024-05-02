import { TestEntry, TestEntryElement } from './TestEntry';
import { NounDef } from './pluralFormUtils';

type NounCase = 'Nominativ' | 'Genitiv' | 'Dativ' | 'Akuzativ' | 'Instrumental' | 'Lokativ' | 'Vokativ';

const cases: Record<NounCase, string> = {
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
        tryAddGenitiv(noun, result.questions);
        tryAddDativ(noun, result.questions);
        tryAddAkuzativ(noun, result.questions);
        tryAddInstrumental(noun, result.questions);
        tryAddLocativ(noun, result.questions);
        tryAddVokativ(noun, result.questions);
    }
    return result;
};

function tryAddGenitiv(noun: NounDef, result: Record<string, TestEntryElement>) {
    setupQuestion(noun, result, `Ja imam + ${noun.word}`, 'Genitiv');
    setupQuestion(noun, result, `On nema + ${noun.word}`, 'Genitiv');
    setupQuestion(noun, result, `Život bez + ${noun.word} + je težak`, 'Genitiv');
    setupQuestion(noun, result, `Imam strah od + ${noun.word}`, 'Genitiv');
}

function tryAddDativ(noun: NounDef, result: Record<string, TestEntryElement>) {
    setupQuestion(noun, result, `Ja dajem to + ${noun.word}`, 'Dativ');
    setupQuestion(noun, result, `On preporučuje to + ${noun.word}`, 'Dativ');
    setupQuestion(noun, result, `Zavisim od + ${noun.word}`, 'Dativ');
}

function tryAddAkuzativ(noun: NounDef, result: Record<string, TestEntryElement>) {
    setupQuestion(noun, result, `Ja volim + ${noun.word}`, 'Akuzativ');
    setupQuestion(noun, result, `On ne voli + ${noun.word}`, 'Akuzativ');
    setupQuestion(noun, result, `Mi vidimo + ${noun.word}`, 'Akuzativ');
    setupQuestion(noun, result, `Vidim + ${noun.word} + svaki dan`, 'Akuzativ');
}

function tryAddInstrumental(noun: NounDef, result: Record<string, TestEntryElement>) {
    setupQuestion(noun, result, `Ja radim s + ${noun.word}`, 'Instrumental');
    setupQuestion(noun, result, `Manipulišem + ${noun.word}`, 'Instrumental');
    setupQuestion(noun, result, `Pokrivam površinu sa + ${noun.word}`, 'Instrumental');
    setupQuestion(noun, result, `Ukrašavam prostor pomoću + ${noun.word}`, 'Instrumental');
}

function tryAddLocativ(noun: NounDef, result: Record<string, TestEntryElement>) {
    setupQuestion(noun, result, `On priča o + ${noun.word}`, 'Lokativ');
    setupQuestion(noun, result, `Razgovor o + ${noun.word} + bio dug`, 'Lokativ');
    setupQuestion(noun, result, `Vest o + ${noun.word} + bila dobra`, 'Lokativ');
    setupQuestion(noun, result, `Razmišljam o + ${noun.word}`, 'Lokativ');
}

function tryAddVokativ(noun: NounDef, result: Record<string, TestEntryElement>) {
    setupQuestion(noun, result, `O, + ${noun.word}`, 'Vokativ');
}

function setupQuestion(noun: NounDef, result: Record<string, TestEntryElement>, question: string, caseName: NounCase) {
    const inlineHint = setupInlineHint(noun, caseName);
    const answers = setupAnswers(noun, getCaseForm(noun, caseName));
    result[question] = { question, inlineHint, answers };
}

function getCaseForm(noun: NounDef, caseName: NounCase): string {
    switch (caseName) {
        case 'Nominativ':
            return noun.word;
        case 'Genitiv':
            return noun.genitiv;
        case 'Dativ':
            return noun.dativ;
        case 'Akuzativ':
            return noun.akuzativ;
        case 'Instrumental':
            return noun.instrumental;
        case 'Lokativ':
            return noun.lokativ;
        case 'Vokativ':
            return noun.vokativ;
    }
}

function setupInlineHint(noun: NounDef, caseName: NounCase): string {
    return `${caseName} - ${cases[caseName]} + ${noun.word} - ${noun.gender}`;
}

function setupAnswers(noun: NounDef, correntForm: string): Record<string, boolean> {
    const answers: Record<string, boolean> = {};
    answers[correntForm] = true;
    const allCases = collectAllCases(noun);
    for (const c of getRandomCases(allCases, correntForm)) {
        answers[c] = false;
    }
    return answers;
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
