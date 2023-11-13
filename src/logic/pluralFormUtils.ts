export type NounDef = {
    word: string,
    gender: 'm' | 'f' | 'n'
};

export const createNounMapping = (nouns: NounDef[]): Record<string, Record<string, boolean>> => {
    const result: Record<string, Record<string, boolean>> = {};
    for (const noun of nouns) {
        if (noun.gender == 'f') {
            const pluralForm = noun.word.slice(0, -1) + 'e';
            result[noun.word] = {};
            result[noun.word][pluralForm] = true; 
        }
    }
    return result;
};
