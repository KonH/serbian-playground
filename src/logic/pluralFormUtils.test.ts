import fs from 'fs';
import path from 'path';
import { NounDef, loadNouns, createNounMapping } from './pluralFormUtils';

function loadLocalNouns(): NounDef[] {
    const nouns: NounDef[] = [];
    const csvFilePath = path.join(__dirname, '..', 'assets', 'nouns.csv');
    const csvContent = fs.readFileSync(csvFilePath, 'utf8');
    loadNouns(csvContent, nouns);
    return nouns;
}

function expectPlural(result: Record<string, Record<string, boolean>>, singular: string, plural: string, value: boolean) {
    expect(result).toHaveProperty(singular);
    expect(result[singular]).toHaveProperty(plural);
    expect(result[singular][plural]).toBe(value);
}

function expectCorrectPlural(result: Record<string, Record<string, boolean>>, singular: string, plural: string) {
    expectPlural(result, singular, plural, true);
}

function expectIncorrectPlural(result: Record<string, Record<string, boolean>>, singular: string, plural: string) {
    expectPlural(result, singular, plural, false);
}

describe('createNounMapping', () => {
    it('ulica - ulice', () => {
        const nouns = loadLocalNouns();
        const result = createNounMapping(nouns);
        expectCorrectPlural(result, 'ulica', 'ulice');
    });
    it('ulica - ...', () => {
        const nouns = loadLocalNouns();
        const result = createNounMapping(nouns);
        expectIncorrectPlural(result, 'ulica', 'ulica');
    });
    it('stvar - stvari', () => {
        const nouns = loadLocalNouns();
        const result = createNounMapping(nouns);
        expectCorrectPlural(result, 'stvar', 'stvari');
    });

    it('slovo - slova', () => {
        const nouns = loadLocalNouns();
        const result = createNounMapping(nouns);
        expectCorrectPlural(result, 'slovo', 'slova');
    });
    it('slovo - ...', () => {
        const nouns = loadLocalNouns();
        const result = createNounMapping(nouns);
        expectIncorrectPlural(result, 'slovo', 'slove');
    });
});
