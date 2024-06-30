import Papa from "papaparse";
import { TestEntry, TestEntryElement } from "./TestEntry";
import { NounDef } from "./pluralFormUtils";

type AdjectiveRow = {
    word: string;
    word_m: string;
    word_f: string;
    word_n: string;
    comparative_m: string;
    comparative_f: string;
    comparative_n: string;
    superlative_m: string;
    superlative_f: string;
    superlative_n: string;
};

type AdjectiveParseResult = {
    data: AdjectiveRow[];
};

export type AdjectiveDef = {
    word: string;
    word_m: string;
    word_f: string;
    word_n: string;
    comparative_m: string;
    comparative_f: string;
    comparative_n: string;
    superlative_m: string;
    superlative_f: string;
    superlative_n: string;
};

export type AdjectiveTranslate = (adjective: AdjectiveDef) => string;

export function loadAdjectives(csv: string, nouns: AdjectiveDef[]) {
    Papa.parse(csv, {
        download: false,
        header: true,
        complete: (results: AdjectiveParseResult) => {
            for (const row of results.data) {
                const def = {
                    word: row.word.trim(),
                    word_m: row.word_m.trim(),
                    word_f: row.word_f.trim(),
                    word_n: row.word_n.trim(),
                    comparative_m: row.comparative_m.trim(),
                    comparative_f: row.comparative_f.trim(),
                    comparative_n: row.comparative_n.trim(),
                    superlative_m: row.superlative_m.trim(),
                    superlative_f: row.superlative_f.trim(),
                    superlative_n: row.superlative_n.trim(),
                };
                nouns.push(def);
            }
        }
    });
}

export const createComparativeAdjectiveMapping = (adjectives: AdjectiveDef[], nouns: NounDef[], translate: AdjectiveTranslate): TestEntry => {
    const result: TestEntry = { questions: {} };
    // Standard form: adjective + noun, ali + noun2 + comparative
    const firstNounsSubset = nouns.sort(() => Math.random() - Math.random()).slice(0, 10);
    const secondNounsSubset = nouns.sort(() => Math.random() - Math.random()).slice(0, 10);
    for (const adjective of adjectives) {    
        for (const firstNoun of firstNounsSubset) {
            for (const secondNoun of secondNounsSubset) {
                if (firstNoun.word === secondNoun.word) {
                    continue;
                }
                tryAddComparativeCase(adjective, firstNoun, secondNoun, translate, result.questions);
            }
        }
    }
    return result;
};

function tryAddComparativeCase(adjective: AdjectiveDef, firstNoun: NounDef, secondNoun: NounDef, translate: AdjectiveTranslate, result: Record<string, TestEntryElement>) {
    const simpleForm = selectAdjectiveForm(adjective, firstNoun);
    const comparativeForm = selectComparativeForm(adjective, secondNoun);
    const question = formatQuestion(simpleForm, firstNoun, secondNoun);
    setupQuestion(adjective, comparativeForm, secondNoun, question, translate, result);
}

function selectAdjectiveForm(adjective: AdjectiveDef, noun: NounDef): string {
    switch (noun.gender) {
        case "m":
            return adjective.word_m;
        case "f":
            return adjective.word_f;
        case "n":
            return adjective.word_n;
        default:
            return "";
    }
}

function selectComparativeForm(adjective: AdjectiveDef, noun: NounDef): string {
    switch (noun.gender) {
        case "m":
            return adjective.comparative_m;
        case "f":
            return adjective.comparative_f;
        case "n":
            return adjective.comparative_n;
        default:
            return "";
    }
}

function formatQuestion(simpleForm: string, firstNoun: NounDef, secondNoun: NounDef): string {
    return `${simpleForm} ${firstNoun.word}, ali ${secondNoun.word} je ...`;
}

function setupQuestion(adjective: AdjectiveDef, correctForm: string, secondNoun: NounDef, question: string, translate: AdjectiveTranslate, result: Record<string, TestEntryElement>) {
    const inlineHint = setupInlineHint(adjective, secondNoun, translate);
    const answers = setupAnswers(adjective, correctForm);
    result[question] = { question, inlineHint, answers };
}

function setupInlineHint(adjective: AdjectiveDef, noun: NounDef, translate: AdjectiveTranslate): string {
    const t = translate(adjective);
    const prefix = t ? `${adjective.word} - ${t}, ` : ``;
    return `${prefix}${noun.word} - ${noun.gender}`;
}

function setupAnswers(adjective: AdjectiveDef, correntForm: string): Record<string, boolean> {
    const answers: Record<string, boolean> = {};
    answers[correntForm] = true;
    const allCases = collectAllForms(adjective);
    for (const c of getRandomForm(allCases, correntForm)) {
        answers[c] = false;
    }
    return answers;
}

function collectAllForms(adjective: AdjectiveDef): string[] {
    return [
        adjective.word_m,
        adjective.word_f,
        adjective.word_n,
        adjective.comparative_m,
        adjective.comparative_f,
        adjective.comparative_n,
        adjective.superlative_m,
        adjective.superlative_f,
        adjective.superlative_n,
    ];
}

function getRandomForm(allForms: string[], correntForm: string): string[] {
    const result = allForms.filter(f => f !== correntForm);
    shuffle(result);
    return result.slice(0, 3);
}

function shuffle(array: string[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}