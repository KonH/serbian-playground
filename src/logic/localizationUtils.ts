import { Composer, createI18n } from 'vue-i18n';
import Papa from 'papaparse';

interface CsvRow {
    key: string;
    en: string;
    ru: string;
    'sr-Latn': string;
    'sr-Cyrl': string;
}

interface LocaleMessages {
    [key: string]: {
        [key: string]: string;
    };
}

export async function parseLocalizationCsv(csvData: string): Promise<LocaleMessages> {
    return new Promise((resolve) => {
        Papa.parse<CsvRow>(csvData, {
            header: true,
            complete: (results) => {
                const messages = results.data.reduce((acc: LocaleMessages, row: CsvRow) => {
                    Object.keys(row).forEach((lang) => {
                        if (lang !== 'key') {
                            const safeKey = lang as keyof CsvRow;
                            acc[lang] = acc[lang] || {};
                            acc[lang][row.key] = row[safeKey];
                        }
                    });
                    return acc;
                }, {});
                resolve(messages);
            }
        });
    });
}

export function setupI18n(messages: LocaleMessages) {
    return createI18n({
        legacy: false,
        locale: getCurrentLanguage(),
        fallbackLocale: 'en',
        messages
    });
}

export function changeLanguage(i18n: Composer, newLang: string) {
    i18n.locale.value = newLang;
    localStorage.setItem('appLocale', newLang);
}

export function getCurrentLanguage(): string {
    return localStorage.getItem('appLocale') || 'en';
}