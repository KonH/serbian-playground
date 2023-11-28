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
        endsWithE: (w: string) => w.slice(0, -1) + 'e',
        endsWithA: (w: string) => w.slice(0, -1) + 'a'
    };

    function applyTransform(container: Record<string, boolean>, w: string, wordTransform: (w: string) => string) {
        const transformedValue = wordTransform(w);
        container[transformedValue] = false;
    }

    function applyAllFormTransforms(container: Record<string, boolean>, w: string) {
        applyTransform(container, w, pluralFormTransforms.endsWithE);
        applyTransform(container, w, pluralFormTransforms.endsWithA);
    }
    
    for (const noun of nouns) {
        const container: Record<string, boolean> = {};
        if (noun.gender == 'f') {
            applyAllFormTransforms(container, noun.word);
            if (noun.plural_exception) {
                container[noun.plural_exception] = true;   
            } else {
                const correctPluralForm = pluralFormTransforms.endsWithE(noun.word);
                container[correctPluralForm] = true;
            }
            result[noun.word] = container;
        }
        if (noun.gender == 'n') {
            applyAllFormTransforms(container, noun.word);
            const correctPluralForm = pluralFormTransforms.endsWithA(noun.word);
            container[correctPluralForm] = true;
            result[noun.word] = container;
        }
    }
    return result;
};
