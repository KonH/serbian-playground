import { NounDef, createNounMapping } from './pluralFormUtils';

describe('createNounMapping', () => {
    it('ona - one', () => {
        const nouns: NounDef[] = [
            {
                word: 'ulica',
                gender: 'f'
            }
        ];
        const result = createNounMapping(nouns);
        expect(result).toHaveProperty('ulica');
        expect(result['ulica']['ulice']).toBe(true);
    });
});
