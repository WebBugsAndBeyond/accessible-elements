export type AnyKindOfFunction = (...args: any[]) => any;
export type KeyEventCallback = (event: KeyboardEvent) => void;

export function createElementID(prefix: string = '', suffix: string = ''): string {
    return [prefix, window.crypto.randomUUID(), suffix].join('');
}

export function ensureElementHasID(element: Element, idGenerator: (...args: string[]) => string = createElementID): string {
    const elementID: string | null = element.getAttribute('id');
    if (!elementID) {
        const createdID: string = idGenerator();
        element.setAttribute('id', createdID);
        return createdID;
    }
    return elementID;
}

export function toggleExpandedHiddenState(toggleElement: HTMLElement, controlledElement: Element): void {
    toggleElement.addEventListener('click', () => {
        const expanded: string | null = toggleElement.getAttribute('aria-expanded');
        if (!expanded || expanded === 'false') {
            toggleElement.setAttribute('aria-expanded', 'true');
            controlledElement.removeAttribute('hidden');
        } else {
            toggleElement.setAttribute('aria-expanded', 'false');
            controlledElement.setAttribute('hidden', '');
        }
    });
}

export function determineLandmarkRole(element: Element): string {
    const isInBodyContext = () => {
        const bodyElement: Element | null = element.closest('body');
        return bodyElement !== null;
    };
    const roleMap: Record<string, () => string> = {
        ASIDE: () => 'complementary',
        FOOTER: () => {
            if (isInBodyContext()) {
                return 'contentinfo';
            }
            return '';
        },
        HEADER: () => {
            if (isInBodyContext()) {
                return 'banner';
            }
            return '';
        },
        MAIN: () => 'main',
        NAV: () => 'navigation',
        SECTION: () => {
            const hasLabel: boolean = element.hasAttribute('aria-label');
            const isLabelledBy: boolean = element.hasAttribute('aria-labelledby');
            if (hasLabel || isLabelledBy) {
                return 'region';
            }
            return '';
        },
    };
    const { tagName } = element;
    const isRuleDefined: boolean = roleMap.hasOwnProperty(tagName);
    if (isRuleDefined) {
        const role: string = roleMap[tagName]();
        return role;
    }
    return '';
}

export function isButtonElement(element: Element): boolean {
    if (element.tagName === 'BUTTON') {
        return true;
    }
    return false;
}

export function selectElementOrDefault(
    rootElement: Element,
    selector: string,
    defaultElement: Element | null = rootElement,
): Element | null {
    if (selector !== '') {
        const selectedElement: Element | null = rootElement.querySelector(selector);
        if (selectedElement) {
            return selectedElement;
        }
    }
    return defaultElement;
}

export function windowLocationIncludesUrl(linkUrl: string): boolean {
    const isUrlCurrentPage: boolean = window.location.href.includes(linkUrl);
    return isUrlCurrentPage;
}

export function applyDescribedBy(
    rootElement: Element,
    descriptionElementSelector: string,
    describedElementSelector: string = '',
): Element {
    if (!descriptionElementSelector) {
        return rootElement;
    }
    const descriptionElement: Element | null = rootElement.querySelector(descriptionElementSelector);
    if (descriptionElement) {
        const descriptionId: string = ensureElementHasID(descriptionElement);
        const describedElement: Element | null = selectElementOrDefault(rootElement, describedElementSelector);
        if (describedElement !== null) {
            describedElement.setAttribute('aria-describedby', descriptionId);
        }
    }
    return rootElement;
}

export abstract class AccessibleElementViewModel<AccessibleElementSelectorSet> {
    protected constructor(
        public readonly selectors: AccessibleElementSelectorSet,
        public readonly labelViewModel: AccessibleElementLabelViewModel,
    ) {

    }
}

export enum AccessibleElementLabelSelectorPreference {
    LABEL_ID,
    LABEL_TEXT,
    LABEL_ELEMENT_SELECTOR,
}

export class AccessibleElementLabelViewModel {
    constructor(
        public readonly labelId: string = '',
        public readonly labelText: string = '',
        public readonly labelElementSelector: string = '',
        public readonly preference: AccessibleElementLabelSelectorPreference = AccessibleElementLabelSelectorPreference.LABEL_ID,
    ) {
        
    }

    static applyAccessibleLabel(element: Element, viewModel: AccessibleElementLabelViewModel): Element {
        const { 
            labelId, 
            labelText, 
            labelElementSelector, 
            preference,
        } = viewModel;
        const assignByLabelId = (id: string = labelId) => {
            element.setAttribute('aria-labelledby', id);
        };
        const assignByLabelText = (text: string = labelText) => {
            element.setAttribute('aria-label', text);
        };
        const assignLabelBySelector = (selector: string = labelElementSelector) => {
            const labelElement: Element | null = element.querySelector(labelElementSelector);
            if (labelElement) {
                const id: string = ensureElementHasID(labelElement);
                assignByLabelId(id);
            } else {
                throw new ReferenceError(`Label element selector does not identify an existing Element: ${selector}`);
            }
        };

        if (labelId !== '' && labelText !== '' && labelElementSelector !== '') {
            if (preference === AccessibleElementLabelSelectorPreference.LABEL_ID) {
                assignByLabelId();
            } else if (preference === AccessibleElementLabelSelectorPreference.LABEL_TEXT) {
                assignByLabelText();
            } else if (preference === AccessibleElementLabelSelectorPreference.LABEL_ELEMENT_SELECTOR) {
                assignLabelBySelector();
            }
        } else if (labelId !== '' && labelText !== '') {
            if (preference === AccessibleElementLabelSelectorPreference.LABEL_ID) {
                assignByLabelId();
            } else if (preference === AccessibleElementLabelSelectorPreference.LABEL_TEXT) {
                assignByLabelText();
            }
        } else if (labelId !== '') {
            assignByLabelId(labelId);
        } else if (labelText !== '') {
            assignByLabelText();
        } else if (labelElementSelector !== '') {
            assignLabelBySelector();
        }
        return element;
    }

    public static createDefault(): AccessibleElementLabelViewModel {
        return new AccessibleElementLabelViewModel();
    }
}


export function interceptClick(element: HTMLElement): Promise<void> {
    return new Promise((resolve: AnyKindOfFunction) => {
        element.addEventListener('click', (e: MouseEvent) => {
            resolve();
        }, {
            once: true,
        });
    });
}

export enum WrapAroundDirection {
    NEXT,
    PREVIOUS,
}

export function nextWrapAroundIndex<CollectionElementType>(
    collection: CollectionElementType[],
    currentIndex: number,
    direction: WrapAroundDirection
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

export function queryChildren(parentElement: Element, selectors: string[]): (Element | null)[] {
    const elements: (Element | null)[] = selectors.map((selector: string) => {
        const element: Element | null = parentElement.querySelector(selector);
        return element;
    });
    return elements;
}

export function filterOutNulls<T>(collection: T[]): T[] {
    const filtered: T[] = collection.filter((item: T) => !!item);
    return filtered;
}
