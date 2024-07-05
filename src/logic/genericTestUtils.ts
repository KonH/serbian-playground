import nounsCsv from '!!raw-loader!@/assets/nouns.csv';
import verbsCsv from '!!raw-loader!@/assets/verbs.csv';
import adjectivesCsv from '!!raw-loader!@/assets/adjectives.csv';
import { TestCategory } from "@/store";
import { createNounMapping, loadNouns, NounDef } from "./pluralFormUtils";
import { createVerbMapping, loadVerbs, VerbDef } from "./verbConjugationUtils";
import { createNounCaseMapping } from "./nounCaseUtils";
import { TestEntry, TestEntryElement } from "./TestEntry";
import { AdjectiveDef, createComparativeAdjectiveMapping, loadAdjectives } from "./adjectiveUtils";

const bitiForms: Record<string, string> = {
    'ja': 'sam',
    'ti': 'si',
    'on': 'je',
    'ona (ed)': 'je',
    'ono': 'je',
    'mi': 'smo',
    'vi': 'ste',
    'oni': 'su',
    'one': 'su',
    'ona (mn)': 'su'
};

export function createGenericMappingForCategories(categories: TestCategory[], translate: (key: string) => string) {
    const nouns: NounDef[] = [];
    loadNouns(nounsCsv, nouns);

    const verbs: VerbDef[] = [];
    loadVerbs(verbsCsv, verbs);

    const adjectives: AdjectiveDef[] = [];
    loadAdjectives(adjectivesCsv, adjectives);
    
    const mapping: TestEntry = { questions: {} };
    for (const category of categories) {
        switch (category) {
            case "BitiVerbFormsTest":
                add(mapping, getBitiVerbFormsMapping(), category);
                break;

            case 'BitiVerbFormsTestInvert':
                add(mapping, getBitiVerbFormsInvertMapping(), category);
                break;

            case 'PluralFormsTest':
                add(mapping, createNounMapping(nouns), category);
                break;

            case 'VerbConjugationTest':
                add(mapping, createVerbMapping(verbs), category);
                break;

            case 'NounCaseTest':
                add(mapping, createNounCaseMapping(nouns), category);
                break;

            case 'ComparativeAdjectiveTest': {
                const newMapping = createComparativeAdjectiveMapping(
                    adjectives,
                    nouns,
                    adj => translate(`adjective_${adj.word}`));
                add(mapping, newMapping, category);
                break;
            }

            default:
                // Compile-time check to ensure all categories are handled
                shouldBeUnreachable(category);
                break;
        }
    }
    return mapping;
}

function shouldBeUnreachable(value: never) {
    throw new Error(`Unexpected value: ${value}`);
}

function add(mapping: TestEntry, newMapping: TestEntry, category: TestCategory) {
    for (const [key, value] of Object.entries(newMapping.questions)) {
        value.category = category;
        mapping.questions[key] = value;
    }
}

function getBitiVerbFormsMapping() {
    const mapping: Record<string, Record<string, boolean>> = {};
    const allValues = Object.values(bitiForms);
    for (const [key, correctValue] of Object.entries(bitiForms)) {
        mapping[key] = {};
        for (const value of allValues) {
        const isCorrect = value === correctValue;
        mapping[key][value] = isCorrect;
        }
    }
    return convertFromLegacyMapping(mapping);
}

function getBitiVerbFormsInvertMapping() {
    const invertMapping: Record<string, Record<string, boolean>> = {};
    for (const [key, value] of Object.entries(bitiForms)) {
        invertMapping[value] = {};
        invertMapping[value][key] = true;
        const keysWithOtherValues = [];
        for (const [k, v] of Object.entries(bitiForms)) {
        if (v !== value) {
            keysWithOtherValues.push(k);
        }
        }
        for (const k of keysWithOtherValues) {
        invertMapping[value][k] = false;
        }
    }
    return convertFromLegacyMapping(invertMapping);
}

function convertFromLegacyMapping(input: Record<string, Record<string, boolean>>) {
    const testEntry: TestEntry = { questions: {} };
    for (const [key, answers] of Object.entries(input)) {
        const testEntryElement: TestEntryElement = {
            question: key,
            inlineHint: '',
            answers
        };
        testEntry.questions[key] = testEntryElement;
    }
    return testEntry;
}