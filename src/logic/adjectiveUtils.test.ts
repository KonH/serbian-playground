import { loadLocalAdjectives } from "./adjectiveTestUtils";
import { createComparativeAdjectiveMapping } from "./adjectiveUtils";
import { loadLocalNouns } from "./nounTestUtils";

describe('createComparativeAdjectiveMapping', () => {
    it('no more than 4 variants', () => {
        const adjectives = loadLocalAdjectives();
        const nouns = loadLocalNouns();
        const result = createComparativeAdjectiveMapping(adjectives, nouns, () => '');
        const firstKey = Object.keys(result.questions)[0];
        const element = result.questions[firstKey];
        expect(Object.keys(element.answers).length).toBe(4);
    });
});