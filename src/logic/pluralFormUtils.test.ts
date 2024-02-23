import fs from 'fs';
import path from 'path';
import { NounDef, loadNouns, createNounMapping } from './pluralFormUtils';
import { TestEntry } from './TestEntry';

function loadLocalNouns(): NounDef[] {
    const nouns: NounDef[] = [];
    const csvFilePath = path.join(__dirname, '..', 'assets', 'nouns.csv');
    const csvContent = fs.readFileSync(csvFilePath, 'utf8');
    loadNouns(csvContent, nouns);
    return nouns;
}

function expectPlural(result: TestEntry, singular: string, plural: string, value: boolean) {
    expect(result.questions).toHaveProperty(singular);
    expect(result.questions[singular].answers).toHaveProperty(plural);
    expect(result.questions[singular].answers[plural]).toBe(value);
}

function expectCorrectPlural(result: TestEntry, singular: string, plural: string) {
    expectPlural(result, singular, plural, true);
}

function expectIncorrectPlural(result: TestEntry, singular: string, plural: string) {
    expectPlural(result, singular, plural, false);
}

describe('createNounMapping', () => {
    it('no more than 4 variants', () => {
        const nouns = loadLocalNouns();
        const result = createNounMapping(nouns);
        const element = result.questions['student'];
        expect(Object.keys(element.answers).length).toBe(4);
    });

    it('student - studenti', () => {
        const nouns = loadLocalNouns();
        const result = createNounMapping(nouns);
        expectCorrectPlural(result, 'student', 'studenti');
    });

    it('stranac - stranci', () => {
        const nouns = loadLocalNouns();
        const result = createNounMapping(nouns);
        expectCorrectPlural(result, 'stranac', 'stranci');
    });

    it('učenik - učenici', () => {
        const nouns = loadLocalNouns();
        const result = createNounMapping(nouns);
        expectCorrectPlural(result, 'učenik', 'učenici');
    });

    it('dialog - dialozi', () => {
        const nouns = loadLocalNouns();
        const result = createNounMapping(nouns);
        expectCorrectPlural(result, 'dialog', 'dialozi');
    });

    it('orah - orasi', () => {
        const nouns = loadLocalNouns();
        const result = createNounMapping(nouns);
        expectCorrectPlural(result, 'orah', 'orasi');
    });

    it('grad - gradovi', () => {
        const nouns = loadLocalNouns();
        const result = createNounMapping(nouns);
        expectCorrectPlural(result, 'grad', 'gradovi');
    });

    it('sto - stolovi', () => {
        const nouns = loadLocalNouns();
        const result = createNounMapping(nouns);
        expectCorrectPlural(result, 'sto', 'stolovi');
    });

    it('posao - poslovi', () => {
        const nouns = loadLocalNouns();
        const result = createNounMapping(nouns);
        expectCorrectPlural(result, 'posao', 'poslovi');
    });

    it('broj - brojevi', () => {
        const nouns = loadLocalNouns();
        const result = createNounMapping(nouns);
        expectCorrectPlural(result, 'broj', 'brojevi');
    });

    it('konj - konji', () => {
        const nouns = loadLocalNouns();
        const result = createNounMapping(nouns);
        expectCorrectPlural(result, 'konj', 'konji');
    });

    it('ključ - klučevi', () => {
        const nouns = loadLocalNouns();
        const result = createNounMapping(nouns);
        expectCorrectPlural(result, 'ključ', 'ključevi');
    });

    it('nož - noževi', () => {
        const nouns = loadLocalNouns();
        const result = createNounMapping(nouns);
        expectCorrectPlural(result, 'nož', 'noževi');
    });

    it('miš - miševi', () => {
        const nouns = loadLocalNouns();
        const result = createNounMapping(nouns);
        expectCorrectPlural(result, 'miš', 'miševi');
    });

    it('džak - džaci', () => {
        const nouns = loadLocalNouns();
        const result = createNounMapping(nouns);
        expectCorrectPlural(result, 'džak', 'džaci');
    });

    it('dan - dani', () => {
        const nouns = loadLocalNouns();
        const result = createNounMapping(nouns);
        expectCorrectPlural(result, 'dan', 'dani');
    });

    it('komšija - komšije', () => {
        const nouns = loadLocalNouns();
        const result = createNounMapping(nouns);
        expectCorrectPlural(result, 'komšija', 'komšije');
    });

    it('turista - turisti', () => {
        const nouns = loadLocalNouns();
        const result = createNounMapping(nouns);
        expectCorrectPlural(result, 'turista', 'turisti');
    });
    
    it('ulica - ulice', () => {
        const nouns = loadLocalNouns();
        const result = createNounMapping(nouns);
        expectCorrectPlural(result, 'ulica', 'ulice');
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

    it('ime - imena', () => {
        const nouns = loadLocalNouns();
        const result = createNounMapping(nouns);
        expectCorrectPlural(result, 'ime', 'imena');
    });

    it('dete - deca', () => {
        const nouns = loadLocalNouns();
        const result = createNounMapping(nouns);
        expectCorrectPlural(result, 'dete', 'deca');
    });

    it('klizanje - klizanja', () => {
        const nouns = loadLocalNouns();
        const result = createNounMapping(nouns);
        expectCorrectPlural(result, 'klizanje', 'klizanja');
    });

    it('uništenje - uništenja', () => {
        const nouns = loadLocalNouns();
        const result = createNounMapping(nouns);
        expectCorrectPlural(result, 'uništenje', 'uništenja');
    });
});
