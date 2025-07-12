import { nextWrapAroundIndex, WrapAroundDirection } from "./collections";

describe('The nextWrapAroundIndex function', () => {

    const collection: string[] = ['First', 'Next', 'Last'];

    it('returns the next index through entire collection.', () => {
        expect(collection.length).toBeGreaterThan(1);
        for (let i: number = 0; i < collection.length - 1; ++i) {
            const nextIndex: number = nextWrapAroundIndex(collection, i, WrapAroundDirection.NEXT);
            expect(nextIndex).toEqual(i + 1);
        }
    });
    it('returns the wrap around to zero index after the last index.', () => {
        const currentIndex: number = collection.length - 1;
        const expectedIndex: number = 0;
        const nextIndex: number = nextWrapAroundIndex(collection, currentIndex, WrapAroundDirection.NEXT);
        expect(nextIndex).toEqual(expectedIndex);
    });
    it('returns the previous index through the entire collection from the end.', () => {
        expect(collection.length).toBeGreaterThan(1);
        for (let i: number = collection.length; i > 0; --i) {
            const previousIndex: number = nextWrapAroundIndex(collection, i, WrapAroundDirection.PREVIOUS);
            const expectedIndex: number = i - 1;
            expect(previousIndex).toEqual(expectedIndex);
        }
    });
    it('returns the wrap around to length-1 index before the first index.', () => {
        expect(collection.length).toBeGreaterThan(1);
        const currentIndex: number = 0;
        const previousIndex: number = nextWrapAroundIndex(collection, currentIndex, WrapAroundDirection.PREVIOUS);
        const expectedIndex: number = collection.length - 1;
    });
});
