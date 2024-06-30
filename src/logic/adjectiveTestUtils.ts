import fs from 'fs';
import path from 'path';
import { AdjectiveDef, loadAdjectives } from './adjectiveUtils';

export function loadLocalAdjectives(): AdjectiveDef[] {
    const adjectives: AdjectiveDef[] = [];
    const csvFilePath = path.join(__dirname, '..', 'assets', 'adjectives.csv');
    const csvContent = fs.readFileSync(csvFilePath, 'utf8');
    loadAdjectives(csvContent, adjectives);
    return adjectives;
}