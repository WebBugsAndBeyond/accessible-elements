export enum WrapAroundDirection {
    NEXT,
    PREVIOUS,
}

export function nextWrapAroundIndex<CollectionElementType>(
    collection: CollectionElementType[],
    currentIndex: number,
    direction: WrapAroundDirection,
): number {
    if (direction === WrapAroundDirection.NEXT) {
        if (currentIndex < (collection.length - 1)) {
            return currentIndex + 1;
        } else {
            return 0;
        }
    } else {
        if (currentIndex > 0) {
            return currentIndex - 1;
        } else {
            return collection.length - 1;
        }
    }
}
