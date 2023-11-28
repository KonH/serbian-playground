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
    for (const noun of nouns) {
        if (noun.gender == 'f') {
            result[noun.word] = {};
            if (noun.plural_exception) {
                result[noun.word][noun.plural_exception] = true;   
            } else {
                const pluralForm = noun.word.slice(0, -1) + 'e';
                result[noun.word][pluralForm] = true;
            }
        }
    }
    return result;
};
