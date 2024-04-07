const latinToCyrillicMap : Record<string, string> = {
    'A': 'А', 'a': 'а',
    'B': 'Б', 'b': 'б',
    'V': 'В', 'v': 'в',
    'G': 'Г', 'g': 'г',
    'D': 'Д', 'd': 'д',
    'Đ': 'Ђ', 'đ': 'ђ',
    'E': 'Е', 'e': 'е',
    'Ž': 'Ж', 'ž': 'ж',
    'Z': 'З', 'z': 'з',
    'I': 'И', 'i': 'и',
    'J': 'Ј', 'j': 'ј',
    'K': 'К', 'k': 'к',
    'L': 'Л', 'l': 'л',
    'Lj': 'Љ', 'lj': 'љ',
    'M': 'М', 'm': 'м',
    'N': 'Н', 'n': 'н',
    'Nj': 'Њ', 'nj': 'њ',
    'O': 'О', 'o': 'о',
    'P': 'П', 'p': 'п',
    'R': 'Р', 'r': 'р',
    'S': 'С', 's': 'с',
    'T': 'Т', 't': 'т',
    'Ć': 'Ћ', 'ć': 'ћ',
    'U': 'У', 'u': 'у',
    'F': 'Ф', 'f': 'ф',
    'H': 'Х', 'h': 'х',
    'C': 'Ц', 'c': 'ц',
    'Č': 'Ч', 'č': 'ч',
    'Dž': 'Џ', 'dž': 'џ',
    'Š': 'Ш', 'š': 'ш'
};

const cyrillicToLatinMap : Record<string, string> = Object.keys(latinToCyrillicMap).reduce((acc : Record<string, string>, key) => {
    acc[latinToCyrillicMap[key]] = key;
    return acc;
}, {});

export function latinToCyrillic(text: string) {
    return text.split('').map(char => {
        if (latinToCyrillicMap[char + text.charAt(text.indexOf(char) + 1)]) {
            return latinToCyrillicMap[char + text.charAt(text.indexOf(char) + 1)];
        }
        return latinToCyrillicMap[char] || char;
    }).join('').replace(/љј|њј|Љј|Њј/g, match => {
        switch (match) {
            case 'љј': return 'љ';
            case 'њј': return 'њ';
            case 'Љј': return 'Љ';
            case 'Њј': return 'Њ';
            default: return match;
        }
    });
}

export function cyrillicToLatin(text: string) {
    return text.split('').map(char => cyrillicToLatinMap[char] || char).join('');
}