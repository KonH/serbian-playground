import Papa from 'papaparse';

type CsvRow = string[];

type ParseResult = {
  data: CsvRow[];
};

export type NounDef = {
    word: string,
    gender: 'm' | 'f' | 'n',
    plural_exception: string | null
};

export function loadNouns(csv: string, nouns: NounDef[]) {
    Papa.parse(csv, {
        download: false,
        header: false,
        complete: (results: ParseResult) => {
          results.data.forEach(row => {
            const word = row[0].trim();
            const gender = ensureGender(row[1]);
            if ( gender == null ) {
              return;
            }
            const readyGender = gender as 'm' | 'f' | 'n';
            const optionalPluralException = row[2]?.trim() || null;
            const def = {
              word: word,
              gender: readyGender,
              plural_exception: optionalPluralException
            };
            nouns.push(def);
          });
        }
      });
}

function ensureGender(input: string) {
    const readyStr = input.trim().toLowerCase();
    if (readyStr == 'm' || readyStr == 'f' || readyStr == 'n') {
        return readyStr;
    }
    return null;
}

function skipLastVowel(w: string): string {
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    const lastChar = w[w.length - 1];
    if (vowels.includes(lastChar)) {
        return w.slice(0, w.length - 1);
    } else {
        return w;
    }
}

export const createNounMapping = (nouns: NounDef[]): Record<string, Record<string, boolean>> => {
    const result: Record<string, Record<string, boolean>> = {};
    const pluralFormTransforms = {
        endsWithI_NoVowelEnding: (w: string) => skipLastVowel(w) + 'i',
        endsWithNa: (w: string) => w + 'na',
        endsWithE_NoVowelEnding: (w: string) => skipLastVowel(w) + 'e',
        endsWithA_NoVowelEnding: (w: string) => skipLastVowel(w) + 'a'
    };

    function applyTransform(container: Record<string, boolean>, w: string, wordTransform: (w: string) => string) {
        const transformedValue = wordTransform(w);
        container[transformedValue] = false;
    }

    function applyAllFormTransforms(container: Record<string, boolean>, w: string) {
        applyTransform(container, w, pluralFormTransforms.endsWithI_NoVowelEnding);   
        applyTransform(container, w, pluralFormTransforms.endsWithNa);    
        applyTransform(container, w, pluralFormTransforms.endsWithE_NoVowelEnding);
        applyTransform(container, w, pluralFormTransforms.endsWithA_NoVowelEnding);
    }

    function getCorrectPluralForm(noun: NounDef): string {
        if (noun.plural_exception) {
            return noun.plural_exception;
        } else {
            switch (noun.gender) {
                case 'm': return pluralFormTransforms.endsWithI_NoVowelEnding(noun.word);
                case 'f': return pluralFormTransforms.endsWithE_NoVowelEnding(noun.word);
                case 'n': {
                    if (noun.word.endsWith('e')) {
                        return pluralFormTransforms.endsWithNa(noun.word);
                    }
                    return pluralFormTransforms.endsWithA_NoVowelEnding(noun.word);
                }
            }
        }
    }
    
    for (const noun of nouns) {
        const container: Record<string, boolean> = {};
        applyAllFormTransforms(container, noun.word);
        const correctPluralForm = getCorrectPluralForm(noun);
        container[correctPluralForm] = true;
        result[noun.word] = container;
    }
    return result;
};
