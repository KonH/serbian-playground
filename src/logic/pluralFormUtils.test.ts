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

function expectPlural(result: Record<string, Record<string, boolean>>, singular: string, plural: string) {
    expect(result).toHaveProperty(singular);
    expect(result[singular]).toHaveProperty(plural);
    expect(result[singular][plural]).toBe(true);
}

describe('createNounMapping', () => {
    it('ona - one', () => {
        const nouns = loadLocalNouns();
        const result = createNounMapping(nouns);
        expectPlural(result, 'ulica', 'ulice');
    });
    it('stvar - stvari', () => {
        const nouns = loadLocalNouns();
        const result = createNounMapping(nouns);
        expectPlural(result, 'stvar', 'stvari');
    });
});
