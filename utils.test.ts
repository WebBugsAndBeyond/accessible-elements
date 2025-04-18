import {
    createElementID,
    ensureElementHasID,
    toggleExpandedHiddenState,
    determineLandmarkRole,
    isButtonElement,
    selectElementOrDefault,
    windowLocationIncludesUrl,
    applyDescribedBy,
    AccessibleElementLabelViewModel,
    AccessibleElementLabelSelectorPreference,
    interceptClick,
    WrapAroundDirection,
    nextWrapAroundIndex,
    queryChildren,
    filterOutNulls,
} from './utils';

describe('createElementID function', () => {
    it('returns a string with a specified prefix.', () => {
        const mockPrefix: string = 'prefix';
        const elementID: string = createElementID(mockPrefix);
        expect(elementID.startsWith(mockPrefix)).toBeTruthy();
    });
    it('returns a string with a specified suffix.', () => {
        const mockSuffix: string = 'suffix';
        const elementID: string = createElementID('', mockSuffix);
        expect(elementID.endsWith(mockSuffix)).toBeTruthy();
    });
    it('returns a random UUID.', () => {
        const elementID: string = createElementID();
        const pattern: RegExp = /^([a-z0-9]+-*)+([a-z0-9]+)$/i;
        const patternMatched: boolean = pattern.test(elementID);
        expect(patternMatched).toBeTruthy();
    });
});
describe('ensureElementHasID function', () => {
    const createElement: (...id: string[]) => Element = (id: string = '') => {
        const element: Element = document.createElement('div');
        if (id !== '') {
            element.setAttribute('id', id);
        }
        return element;
    };
    it('returns the value of the existing id attribute.', () => {
        const mockID: string = 'mock-id';
        const element: Element = createElement(mockID);
        const ensuredElementID: string = ensureElementHasID(element);
        expect(ensuredElementID).toEqual(mockID);
    });
    it('returns an ID using the supplied ID generation function.', () => {
        const mockID: string = 'mock-id';
        const idGenerator = () => mockID;
        const element: Element = createElement();
        const ensuredElementID: string = ensureElementHasID(element, idGenerator);
        expect(ensuredElementID).toEqual(mockID);
    });
    it('returns an ID that is also applied to the element.', () => {
        const element: Element = createElement();
        const ensuredElementID: string = ensureElementHasID(element);
        expect(ensuredElementID).not.toEqual('');
        expect(element.hasAttribute('id')).toBeTruthy();
        expect(element.getAttribute('id')).toEqual(ensuredElementID);
    });
});
describe('toggleExpandedHiddenState function', () => {
    const createToggleWithControlled: () => Element = () => {
        const rootElement: Element = document.createElement('div');
        const headingElement: Element = document.createElement('h3');
        const toggleElement: Element = document.createElement('button');
        const controlledElement: Element = document.createElement('div');

        toggleElement.setAttribute('aria-expanded', 'false');
        controlledElement.setAttribute('hidden', '');
        headingElement.appendChild(toggleElement);
        rootElement.appendChild(headingElement);
        rootElement.appendChild(controlledElement);
        return rootElement;
    };
    it('toggles the aria-expanded attribute on the toggle element.', () => {
        const element: Element = createToggleWithControlled();
        const toggle: HTMLElement | null = element.querySelector('button');
        const controlled: HTMLElement | null = element.querySelector('div');
        expect(toggle).not.toBeNull();
        expect(controlled).not.toBeNull();
        toggleExpandedHiddenState(toggle as HTMLElement, controlled as HTMLElement);
        toggle?.click?.();
        expect(toggle?.getAttribute?.('aria-expanded')).toEqual('true');
        toggle?.click?.();
        expect(toggle?.getAttribute?.('aria-expanded')).toEqual('false');
    });
    it('toggles the hidden attribute on the controlled element.', () => {
        const element: Element = createToggleWithControlled();
        const toggle: HTMLElement | null = element.querySelector('button');
        const controlled: Element | null = element.querySelector('div');
        expect(toggle).not.toBeNull();
        expect(controlled).not.toBeNull();
        toggleExpandedHiddenState(toggle as HTMLElement, controlled as HTMLElement);
        toggle?.click?.();
        expect(controlled?.hasAttribute?.('hidden')).toBeFalsy();
        toggle?.click?.();
        expect(controlled?.hasAttribute?.('hidden')).toBeTruthy();
    });
});
describe('determineLandmarkRole function', () => {
    const createNamedElement: (tagName: string) => Element = (tagName: string) => {
        const element: Element = document.createElement(tagName);
        return element;
    };
    const wrapElement: (wrapper: Element, wrapped: Element) => Element = (wrapper: Element, wrapped: Element) => {
        wrapper.appendChild(wrapped);
        return wrapper;
    };
    it('returns complementary for ASIDE elements.', () => {
        const asideElement: Element = createNamedElement('aside');
        const role: string = determineLandmarkRole(asideElement);
        const complementaryRole: string = 'complementary';
        expect(role).toEqual(complementaryRole);
    });
    it('returns contentinfo for FOOTER elements that are in a body context.', () => {
        const footerElement: Element = createNamedElement('footer');
        const bodyElement: Element = createNamedElement('body');
        wrapElement(bodyElement, footerElement);
        const role: string = determineLandmarkRole(footerElement);
        const contentInfoRole: string = 'contentinfo';
        expect(role).toEqual(contentInfoRole);
    });
    it('returns empty for FOOTER elements that are NOT in a body context.', () => {
        const footerElement: Element = createNamedElement('footer');
        const role: string = determineLandmarkRole(footerElement);
        expect(role).toEqual('');
    });
    it('returns banner for HEADER elements that are in a body context.', () => {
        const headerElement: Element = createNamedElement('header');
        const bodyElement: Element = wrapElement(createNamedElement('body'), headerElement);
        const role: string = determineLandmarkRole(headerElement);
        const bannerRole: string = 'banner';
        expect(role).toEqual(bannerRole);
    });
    it('returns empty for HEADER elements that are NOT in a body context.', () => {
        const headerElement: Element = createNamedElement('header');
        const role: string = determineLandmarkRole(headerElement);
        expect(role).toEqual('');
    });
    it('returns main for MAIN elements.', () => {
        const mainElement: Element = createNamedElement('main');
        const role: string = determineLandmarkRole(mainElement);
        const mainRole: string = 'main';
        expect(role).toEqual(mainRole);
    });
    it('returns navigation for NAV elements.', () => {
        const navElement: Element = createNamedElement('nav');
        const role: string = determineLandmarkRole(navElement);
        const navigationRole: string = 'navigation';
        expect(role).toEqual(navigationRole);
    });
    it('returns region for SECTION elements that have aria-label attributes.', () => {
        const sectionElement: Element = createNamedElement('section');
        const labelText: string = 'label text';
        sectionElement.setAttribute('aria-label', labelText);
        const role: string = determineLandmarkRole(sectionElement);
        const regionRole: string = 'region';
        expect(role).toEqual(regionRole);
    });
    it('returns region for SECTION elements that have aria-labelledby attributes.', () => {
        const sectionElement: Element = createNamedElement('section');
        const labelId: string = 'label-id';
        sectionElement.setAttribute('aria-labelledby', labelId);
        const role: string = determineLandmarkRole(sectionElement);
        const regionRole: string = 'region';
        expect(role).toEqual(regionRole);
    });
    it('returns empty for SECTION elements that do not have both aria-label and aria-labelledby attributes.', () => {
        const sectionElement: Element = createNamedElement('section');
        const role: string = determineLandmarkRole(sectionElement);
        expect(role).toEqual('');
    });
    it('returns empty for non-landmark elements.', () => {
        const divElement: Element = createNamedElement('div');
        const role: string = determineLandmarkRole(divElement);
        expect(role).toEqual('');
    });
});
describe('isButtonElement function', () => {
    it('returns true for BUTTON elements.', () => {
        const buttonElement: Element = document.createElement('button');
        const isButton: boolean = isButtonElement(buttonElement);
        expect(isButton).toEqual(true);
    });
    it('returns false for non BUTTON elements.', () => {
        const divElement: Element = document.createElement('div');
        const isButton: boolean = isButtonElement(divElement);
        expect(isButton).toBeFalsy();
    });
});
describe('selectElementOrRootDefault function', () => {
    const createElement = () => {
        const wrapped: Element = document.createElement('h3');
        const wrapper: Element = document.createElement('div');
        wrapper.appendChild(wrapped);
        return wrapper;
    }
    it('returns the root element with an empty selector string.', () => {
        const element: Element = createElement();
        const selector: string = '';
        const selected: Element | null = selectElementOrDefault(element, selector);
        expect(selected).toBe(element);
    });
    it('returns the selected element.', () => {
        const element: Element = createElement();
        const selector: string = ':scope > h3';
        const headingElement: Element | null = element.querySelector(selector);
        const selected: Element | null = selectElementOrDefault(element, selector);
        expect(selected).toBe(headingElement);
    });
    it('returns null for a selector string that does not identify an element.', () => {
        const element: Element = createElement();
        const selector: string = 'main';
        const selected: Element | null = selectElementOrDefault(element, selector, null);
        expect(selected).toBeNull();
    });
});
describe('windowLocationIncludesUrl function', () => {
    const originalWindowLocation: Location = window.location;
    const mockLocationHref: string = 'https://foobar.com/url/path/file.html';

    beforeEach(() => {
        Object.defineProperty(window, 'location', {
            configurable: true,
            enumerable: true,
            value: new URL(mockLocationHref),
        });
    });
    afterEach(() => {
        Object.defineProperty(window, 'location', {
            configurable: true,
            enumerable: true,
            value: originalWindowLocation,
        });
    });
    it('returns true when the linkUrl identifies the current page.', () => {
        const linkUrl: string = mockLocationHref;
        const locationIncludesUrl: boolean = windowLocationIncludesUrl(linkUrl);
        expect(locationIncludesUrl).toBeTruthy();
    });
    it('returns false when the linkUrl does not identify the current page.', () => {
        const linkUrl: string = 'https://nothere.com/';
        const locationIncludesUrl: boolean = windowLocationIncludesUrl(linkUrl);
        expect(locationIncludesUrl).toBeFalsy();
    });
});
describe('applyDescribedBy function', () => {
    const createElement = (id: string = '') => {
        const rootElement: Element = document.createElement('div');
        const labelElement: Element = document.createElement('div');
        if (id) {
            labelElement.setAttribute('id', id);
        }
        rootElement.appendChild(labelElement);
        return rootElement;
    };

    it('applies the id of the description element to the aria-describedby attribute.', () => {
        const labelId: string = 'label-id';
        const element: Element = createElement(labelId);
        const selectorString: string = ':scope > div';
        const describedById: string | null = applyDescribedBy(element, selectorString).getAttribute('aria-describedby');
        expect(describedById).toEqual(labelId);
    });
    it('applies a newly created ID to the description element to the aria-describedby attribute.', () => {
        const element: Element = createElement();
        const selectorString: string = ':scope > div';
        const describedById: string | null = applyDescribedBy(element, selectorString).getAttribute('aria-describedby');
        expect(describedById).not.toEqual('');
    });
});
describe('AccessibleElementLabelViewModel class', () => {
    it('is constructed with a determined label id.', () => {
        const labelId: string = 'label-id';
        const instance: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel(labelId);
        expect(instance.labelId).toEqual(labelId);
    });
    it('is constructed with a determined label text.', () => {
        const labelId: string = 'label-id';
        const labelText: string = 'label text';
        const instance: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel(
            labelId,
            labelText,
        );
        expect(instance.labelText).toEqual(labelText);
    });
    it('is constructed with a determined label element selector.', () => {
        const labelId: string = 'label-id';
        const labelText: string = 'label text';
        const labelSelector: string = ':scope > div:nth-of-type(1)';
        const instance: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel(
            labelId,
            labelText,
            labelSelector,
        );
        expect(instance.labelElementSelector).toEqual(labelSelector);
    });
    it('is constructed with a determined preference.', () => {
        const labelId: string = 'label-id';
        const labelText: string = 'label text';
        const labelSelector: string = ':scope > div:nth-of-type(1)';
        const preference: AccessibleElementLabelSelectorPreference = AccessibleElementLabelSelectorPreference.LABEL_TEXT;
        const instance: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel(
            labelId,
            labelText,
            labelSelector,
            preference,
        );
        expect(instance.preference).toEqual(preference);
    });
    it('applies the label id to the aria-labelledby attribute.', () => {
        const labelId: string = 'label-id';
        const element: Element = document.createElement('div');
        const instance: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel(labelId);
        const labelledById: string | null = AccessibleElementLabelViewModel.applyAccessibleLabel(element, instance).getAttribute('aria-labelledby');
        expect(labelledById).toEqual(labelId);
    });
    it('applies the label text to the aria-label attribute.', () => {
        const labelId: string = 'label-id';
        const labelText: string = 'label text';
        const labelSelector: string = ':scope > div:nth-of-type(1)';
        const preference: AccessibleElementLabelSelectorPreference = AccessibleElementLabelSelectorPreference.LABEL_TEXT
        const element: Element = document.createElement('div');
        const instance: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel(
            labelId,
            labelText,
            labelSelector,
            preference,
        );
        const label: string | null = AccessibleElementLabelViewModel.applyAccessibleLabel(element, instance).getAttribute('aria-label');
        expect(label).toEqual(labelText);
    });
    it('applies the label id of the selected label element to the aria-labelledby attribute when all other options are provided and the preference is the selector.', () => {
        const labelId: string = 'label-id';
        const labelText: string = 'label text';
        const labelSelector: string = ':scope > div:nth-of-type(1)';
        const element: Element = document.createElement('div');
        const labelElement: Element = document.createElement('div');
        const preference: AccessibleElementLabelSelectorPreference = AccessibleElementLabelSelectorPreference.LABEL_ELEMENT_SELECTOR;
        labelElement.setAttribute('id', labelId);
        element.appendChild(labelElement);
        const instance: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel(
            labelId,
            labelText,
            labelSelector,
            preference,
        );
        const labelledById: string | null = AccessibleElementLabelViewModel.applyAccessibleLabel(element, instance).getAttribute('aria-labelledby');
        expect(labelledById).toEqual(labelId);
    });
    it('applies the label id of the selected label element to the aria-labelledby attribute when no other options are provided.', () => {
        const labelId: string = 'label-id';
        const labelSelector: string = ':scope > div:nth-of-type(1)';
        const element: Element = document.createElement('div');
        const labelElement: Element = document.createElement('div');
        const preference: AccessibleElementLabelSelectorPreference = AccessibleElementLabelSelectorPreference.LABEL_ELEMENT_SELECTOR;
        labelElement.setAttribute('id', labelId);
        element.appendChild(labelElement);
        const instance: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel(
            '',
            '',
            labelSelector,
            preference,
        );
        const labelledById: string | null = AccessibleElementLabelViewModel.applyAccessibleLabel(element, instance).getAttribute('aria-labelledby');
        expect(labelledById).toEqual(labelId);
    });
    it('throws a ReferenceError when the selector does not identify a selectable element.', () => {
        const labelId: string = 'label-id';
        const labelText: string = 'label text';
        const labelSelector: string = ':scope > img';
        const preference: AccessibleElementLabelSelectorPreference = AccessibleElementLabelSelectorPreference.LABEL_ELEMENT_SELECTOR;
        const instance: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel(
            labelId,
            labelText,
            labelSelector,
            preference,
        );
        const element: Element = document.createElement('div');
        expect(() => {
            AccessibleElementLabelViewModel.applyAccessibleLabel(element, instance);
        }).toThrow();
    });
    it('does not change aria-labelledby and aria-label when no id, text, or selector value is provided.', () => {
        const instance: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel();
        const element: Element = document.createElement('div');
        AccessibleElementLabelViewModel.applyAccessibleLabel(element, instance);
        const labelledById: string | null = element.getAttribute('aria-labelledby');
        const label: string | null = element.getAttribute('aria-label');
        expect(labelledById).toBeNull();
        expect(label).toBeNull();
    });
    it('applies the aria-labelledby when both id and text are set with the id as the preference.', () => {
        const labelId: string = 'label-id';
        const labelText: string = 'label text';
        const wrapperElement: Element = document.createElement('div');
        const buttonElement: Element = document.createElement('button');
        const labelElement: Element = document.createElement('div');
        labelElement.setAttribute('id', labelId);
        buttonElement.textContent = 'button text';
        wrapperElement.append(buttonElement, labelElement);
        const labelIdViewModel: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel(
            labelId,
            labelText,
            undefined,
            AccessibleElementLabelSelectorPreference.LABEL_ID,
        );
        AccessibleElementLabelViewModel.applyAccessibleLabel(wrapperElement, labelIdViewModel);
        expect(wrapperElement.getAttribute('aria-labelledby')).toEqual(labelId);
    });
    it('applies the aria-label when both id and text are set with the text as the preference.', () => {
        const labelId: string = 'label-id';
        const labelText: string = 'label text';
        const wrapperElement: Element = document.createElement('div');
        const buttonElement: Element = document.createElement('button');
        const labelElement: Element = document.createElement('div');
        labelElement.setAttribute('id', labelId);
        buttonElement.textContent = 'button text';
        wrapperElement.append(buttonElement, labelElement);
        const labelTextViewModel: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel(
            labelId,
            labelText,
            '',
            AccessibleElementLabelSelectorPreference.LABEL_TEXT,
        );
        AccessibleElementLabelViewModel.applyAccessibleLabel(wrapperElement, labelTextViewModel);
        expect(wrapperElement.getAttribute('aria-label')).toEqual(labelText);
    });
});
describe('The interceptClick function', () => {
    it('returns a promise resolved when a button is clicked once.', async () => {
        const buttonElement: HTMLElement = document.createElement('button');
        const mockHandler: jest.Mock = jest.fn();
        const promise: Promise<void> = interceptClick(buttonElement).then(mockHandler);
        buttonElement.dispatchEvent(new MouseEvent('click'));
        await promise;
        expect(mockHandler).toHaveBeenCalled();
        buttonElement.dispatchEvent(new MouseEvent('click'));
        await promise;
        expect(mockHandler).toHaveBeenCalledTimes(1);
    });
});

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
describe('The queryChildren function', () => {
    it('returns an array of elements that are found.', () => {
        const baseElement: Element = document.createElement('div');
        const buttonElements: Element[] = ['First', 'Middle', 'Last'].map((text: string) => {
            const buttonElement: Element = document.createElement('button');
            buttonElement.textContent = text;
            return buttonElement;
        });
        baseElement.append(...buttonElements);
        const selectors: string[] = [
            ':scope > button:nth-of-type(1)',
            ':scope > button:nth-of-type(2)',
            ':scope > button:nth-of-type(3)',
        ];
        const selectedElements: (Element | null)[] = queryChildren(baseElement, selectors);
        expect(selectedElements.length).toEqual(buttonElements.length);
        expect(buttonElements.every((button: Element) => selectedElements.includes(button))).toEqual(true);
        expect(selectedElements.every((selected: Element | null) => selected !== null)).toEqual(true);
    });
    it('returns an array of nulls for selecting elements that are not present.', () => {
        const baseElement: Element = document.createElement('div');
        const buttonElements: Element[] = ['First', 'Middle', 'Last'].map((text: string) => {
            const buttonElement: Element = document.createElement('button');
            buttonElement.textContent = text;
            return buttonElement;
        });
        baseElement.append(...buttonElements);
        const selectors: string[] = [
            ':scope > a:nth-of-type(1)',
            ':scope > p:nth-of-type(2)',
            ':scope > section:nth-of-type(3)',
        ];
        const selectedElements: (Element | null)[] = queryChildren(baseElement, selectors);
        expect(selectedElements.length).toEqual(selectors.length);
        expect(selectedElements.every((element: Element | null) => element === null)).toEqual(true);
    });
});

describe('The filterOutNulls function', () => {
    it('removes all null elements from an array.', () => {
        const elements = [{}, null, {}, null, null, {}];
        const notNullCount: number = 3;
        const nullCount: number = 3;
        const elementCount: number = notNullCount + nullCount;
        const filteredCount: number = elementCount - nullCount;
        const filteredElements = filterOutNulls(elements);
        expect(filteredElements.length).toEqual(filteredCount);
        expect(filteredElements.every((element) => element !== null)).toEqual(true);

    });
    it('persists non-null elements from an array.', () => {
        const elements = [{}, null, {}, null, null, {}];
        const notNullCount: number = 3;
        const nullCount: number = 3;
        const elementCount: number = notNullCount + nullCount;
        const filteredCount: number = elementCount - nullCount;
        const filteredElements = filterOutNulls(elements);
        expect(filteredElements.length).toEqual(notNullCount);
    });
});
