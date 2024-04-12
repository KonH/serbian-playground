import Papa from 'papaparse';
import { TestEntry } from './TestEntry';

type VerbRow = {
    inf: string,
    ja: string,
    ti: string,
    on: string,
    mi: string,
    vi: string,
    oni: string
}

type VerbParseResult = {
  data: VerbRow[]
};

export type VerbDef = {
    inf: string,
    forms: Map<string, string>
};

const verbPersons = ['ja', 'ti', 'on', 'mi', 'vi', 'oni'];

export function loadVerbs(csv: string, nouns: VerbDef[]) {
    Papa.parse(csv, {
        download: false,
        header: true,
        complete: (results: VerbParseResult) => {
          results.data.forEach(row => {
            const inf = row.inf.trim();
            const forms = new Map<string, string>();
            forms.set('ja', row.ja.trim());
            forms.set('ti', row.ti.trim());
            forms.set('on', row.on.trim());
            forms.set('mi', row.mi.trim());
            forms.set('vi', row.vi.trim());
            forms.set('oni', row.oni.trim());
            const def = {
              inf: inf,
              forms: forms
            };
            nouns.push(def);
          });
        }
      });
}

export const createVerbMapping = (verbs: VerbDef[]): TestEntry => {
    const result: TestEntry = { questions: {} };
    for (const verb of verbs) {
        for (const correctPerson of verbPersons) {
            const question = `${correctPerson} + ${verb.inf}`;
            const incorrectForms = getRandomForms(verb.forms, correctPerson);
            const answers: Record<string, boolean> = {};
            for (const incorrectForm of incorrectForms) {
                answers[incorrectForm] = false;
            }
            const correctForm = verb.forms.get(correctPerson) ?? '';
            answers[correctForm] = true; 
            const entry = {
                question: question,
                inlineHint: '',
                answers: answers
            };
            result.questions[question] = entry;
        }
    }
    return result;
};

function getRandomForms(personToFormMap: Map<string, string>, correctPerson: string): string[] {
    const result: string[] = [];
    const allPersons = Array.from(personToFormMap.keys());
    const incorrectPersons = allPersons.filter(person => person !== correctPerson);
    while (result.length < 3) {
        const randomPerson = incorrectPersons[Math.floor(Math.random() * incorrectPersons.length)];
        const randomForm = personToFormMap.get(randomPerson);
        
        if (randomForm && !result.includes(randomForm)) {
            result.push(randomForm);
        }
    }
    return result;
}
