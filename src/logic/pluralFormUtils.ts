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

export const createNounMapping = (nouns: NounDef[]): Record<string, Record<string, boolean>> => {
    const result: Record<string, Record<string, boolean>> = {};
    const pluralFormTransforms = {
        endsWithI: (w: string) => w + 'i',
        endsWithE_NoEnding: (w: string) => w.slice(0, -1) + 'e',
        endsWithA_NoEnding: (w: string) => w.slice(0, -1) + 'a'
    };

    function applyTransform(container: Record<string, boolean>, w: string, wordTransform: (w: string) => string) {
        const transformedValue = wordTransform(w);
        container[transformedValue] = false;
    }

    function applyAllFormTransforms(container: Record<string, boolean>, w: string) {
        applyTransform(container, w, pluralFormTransforms.endsWithI);       
        applyTransform(container, w, pluralFormTransforms.endsWithE_NoEnding);
        applyTransform(container, w, pluralFormTransforms.endsWithA_NoEnding);
    }

    function getCorrectPluralForm(noun: NounDef): string {
        if (noun.plural_exception) {
            return noun.plural_exception;
        } else {
            switch (noun.gender) {
                case 'm': return pluralFormTransforms.endsWithI(noun.word);
                case 'f': return pluralFormTransforms.endsWithE_NoEnding(noun.word);
                case 'n': return pluralFormTransforms.endsWithA_NoEnding(noun.word);
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
