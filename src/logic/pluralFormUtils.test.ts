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
    it('student - studenti', () => {
        const nouns = loadLocalNouns();
        const result = createNounMapping(nouns);
        expectCorrectPlural(result, 'student', 'studenti');
    });
    it('student - ...', () => {
        const nouns = loadLocalNouns();
        const result = createNounMapping(nouns);
        expectIncorrectPlural(result, 'student', 'studenta');
    });

    it('stranac - stranci', () => {
        const nouns = loadLocalNouns();
        const result = createNounMapping(nouns);
        expectCorrectPlural(result, 'stranac', 'stranci');
    });
    it('stranac - ...', () => {
        const nouns = loadLocalNouns();
        const result = createNounMapping(nouns);
        expectIncorrectPlural(result, 'stranac', 'stranaci');
    });

    it('dan - dani', () => {
        const nouns = loadLocalNouns();
        const result = createNounMapping(nouns);
        expectCorrectPlural(result, 'dan', 'dani');
    });
    it('dan - ...', () => {
        const nouns = loadLocalNouns();
        const result = createNounMapping(nouns);
        expectIncorrectPlural(result, 'dan', 'dane');
    });

    it('komšija - komšije', () => {
        const nouns = loadLocalNouns();
        const result = createNounMapping(nouns);
        expectCorrectPlural(result, 'komšija', 'komšije');
    });
    it('komšija - ...', () => {
        const nouns = loadLocalNouns();
        const result = createNounMapping(nouns);
        expectIncorrectPlural(result, 'komšija', 'komšiji');
    });

    it('turista - turisti', () => {
        const nouns = loadLocalNouns();
        const result = createNounMapping(nouns);
        expectCorrectPlural(result, 'turista', 'turisti');
    });
    it('turista - ...', () => {
        const nouns = loadLocalNouns();
        const result = createNounMapping(nouns);
        expectIncorrectPlural(result, 'turista', 'turiste');
    });
    
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
    it('stvar - stvari', () => {
        const nouns = loadLocalNouns();
        const result = createNounMapping(nouns);
        expectIncorrectPlural(result, 'stvar', 'stvare');
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

    it('ime - imena', () => {
        const nouns = loadLocalNouns();
        const result = createNounMapping(nouns);
        expectCorrectPlural(result, 'ime', 'imena');
    });
    it('ime - ...', () => {
        const nouns = loadLocalNouns();
        const result = createNounMapping(nouns);
        expectIncorrectPlural(result, 'ime', 'ime');
    });
});
