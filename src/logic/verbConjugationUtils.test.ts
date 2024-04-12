import fs from 'fs';
import path from 'path';
import { VerbDef, loadVerbs, createVerbMapping } from './verbConjugationUtils';
import { TestEntry } from './TestEntry';

function loadLocalVerbs(): VerbDef[] {
    const verbs: VerbDef[] = [];
    const csvFilePath = path.join(__dirname, '..', 'assets', 'verbs.csv');
    const csvContent = fs.readFileSync(csvFilePath, 'utf8');
    loadVerbs(csvContent, verbs);
    return verbs;
}

function expectForm(result: TestEntry, question: string, form: string, value: boolean) {
    expect(result.questions).toHaveProperty(question);
    expect(result.questions[question].answers).toHaveProperty(form);
    expect(result.questions[question].answers[form]).toBe(value);
}

function expectCorrectForm(result: TestEntry, question: string, form: string) {
    expectForm(result, question, form, true);
}

describe('createVerbMapping', () => {
    it('no more than 4 variants', () => {
        const verbs = loadLocalVerbs();
        const result = createVerbMapping(verbs);
        const element = result.questions['ja + biti'];
        expect(Object.keys(element.answers).length).toBe(4);
    });

    it('biti - budem', () => {
        const verbs = loadLocalVerbs();
        const result = createVerbMapping(verbs);
        expectCorrectForm(result, 'ja + biti', 'budem');
    });
});
