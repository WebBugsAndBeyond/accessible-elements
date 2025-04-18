
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
    selector: string = '',
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

export type AnyKindOfFunction = (...args: any[]) => any;

export type TrappedKeyboardFocusState = {
    focusableElements: HTMLElement[];
    currentlyFocusedElementIndex: number;
    onCloseCallback: AnyKindOfFunction;
}

export type TrappedKeyboardFocusKeyPressHandlerCallback = (
    trappedKeyboardFocusState: TrappedKeyboardFocusState,
    event: KeyboardEvent | undefined,
) => void;

export type KeyEventCallback = (event: KeyboardEvent) => void;

export type TrappedKeyboardFocusKeyPressInitializer = {
    focusableElementsSelectors: string[];
    onEscapeDialogClose?: AnyKindOfFunction;
    notifyCloseExternal: Promise<void>;
    notifyOpenExternal: Promise<void>;
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

export function createTrappedElementKeyboardFocusHandler(trappedKeyboardFocusState: TrappedKeyboardFocusState): (e: KeyboardEvent) => void {
    return (event: KeyboardEvent) => {
        const { key, shiftKey } = event;
        if (key === 'Tab') {
            const { currentlyFocusedElementIndex, focusableElements } = trappedKeyboardFocusState;
            let nextIndex: number = currentlyFocusedElementIndex;
            if (shiftKey) {
                nextIndex = nextIndex > 0 ? nextIndex - 1 : focusableElements.length - 1;
            } else {
                nextIndex = nextIndex < (focusableElements.length - 1) ? nextIndex + 1 : 0;
            }
            focusableElements[nextIndex].focus();
            trappedKeyboardFocusState.currentlyFocusedElementIndex = nextIndex;
        } else if (key === 'Escape') {
            trappedKeyboardFocusState.onCloseCallback();
        }
    };
}

export function trappedElementKeyboardFocusHandler(
    trappedKeyboardFocusState: TrappedKeyboardFocusState,
    event: KeyboardEvent,
): void {
    const { key, shiftKey } = event;
    if (key === 'Tab') {
        const { currentlyFocusedElementIndex, focusableElements } = trappedKeyboardFocusState;
        let nextIndex: number = currentlyFocusedElementIndex;
        if (shiftKey) {
            nextIndex = nextIndex > 0 ? nextIndex - 1 : focusableElements.length - 1;
        } else {
            nextIndex = nextIndex < (focusableElements.length - 1) ? nextIndex + 1 : 0;
        }
        focusableElements[nextIndex].focus();
        trappedKeyboardFocusState.currentlyFocusedElementIndex = nextIndex;
    } else if (key === 'Escape') {
        trappedKeyboardFocusState.onCloseCallback();
    }
}

export function createTrappedKeyboardFocusKeyPressHandler(
    parentElement: HTMLElement,
    focusableElementsSelectors: string[],
    onCloseCallback: AnyKindOfFunction,
): KeyEventCallback {

    const focusableElements: HTMLElement[] = focusableElementsSelectors.reduce((carry: HTMLElement[], current: string): HTMLElement[] => {
        const selected: NodeList = parentElement.querySelectorAll(current);
        if (selected.length > 0) {
            const selectedArray: HTMLElement[] = Array.from(selected) as HTMLElement[];
            return [...carry, ...selectedArray];
        }
        return carry;
    }, [] as HTMLElement[]);

    const state: TrappedKeyboardFocusState = {
        focusableElements: focusableElements,
        currentlyFocusedElementIndex: 0,
        onCloseCallback,
    };

    const handler = createTrappedElementKeyboardFocusHandler(state);
    return handler as KeyEventCallback;
}

export function trapElementKeyboardFocus(
    parentElement: HTMLElement,
    initializer: TrappedKeyboardFocusKeyPressInitializer,
): HTMLElement {
    const { notifyCloseExternal, notifyOpenExternal , focusableElementsSelectors } = initializer;
    const addKeyUpListener: AnyKindOfFunction = () => {
        parentElement.removeEventListener('keyup', keyUpListener);
    };
    const removeKeyUpListener: AnyKindOfFunction = () => {
        parentElement.removeEventListener('keyup', keyUpListener);
    };
    const keyUpListener = createTrappedKeyboardFocusKeyPressHandler(
        parentElement,
        focusableElementsSelectors,
        removeKeyUpListener,
    );
    
    notifyOpenExternal.then(addKeyUpListener);
    notifyCloseExternal.then(removeKeyUpListener);
    return parentElement;
}
