import { createNounCaseMapping } from './nounCaseUtils';
import { loadLocalNouns } from './nounTestUtils';
import { TestEntry } from './TestEntry';

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
        const nouns = loadLocalNouns();
        const result = createNounCaseMapping(nouns);
        const element = result.questions['On priča o + voz'];
        expect(Object.keys(element.answers).length).toBe(4);
    });

    it('biti - budem', () => {
        const nouns = loadLocalNouns();
        const result = createNounCaseMapping(nouns);
        expectCorrectForm(result, 'On priča o + voz', 'vozu');
    });
});
