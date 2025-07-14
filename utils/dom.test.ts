import { AccessibleElementDescriptionViewModel } from "../base/types";
import { createElementID, determineLandmarkRole, ensureElementHasID, interceptClick, isButtonElement, queryChildren, selectElementOrDefault, targetElementIsToggleButton, toggleExpandedHiddenState, windowLocationIncludesUrl } from "./dom";

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

describe('The targetElementIsToggleButton function', () => {
    type MockToggleButtonAttributes = {
        role?: string;
        control?: string;
        expanded?: string;
    }

    const createElement: (attributes: MockToggleButtonAttributes) => Element = (attributes: MockToggleButtonAttributes): Element => {
        const element: Element = document.createElement('button');
        if (attributes.role !== '') {
            const { role = '' } = attributes;
            element.setAttribute('role', role);
        }
        if (attributes.control !== '') {
            const { control = '' } = attributes;
            element.setAttribute('aria-controls', control);
        }
        if (attributes.expanded !== '') {
            const { expanded = '' } = attributes;
            element.setAttribute('aria-expanded', expanded);
        }
        return element;
    };

    it('correctly identifies a toggle button.', () => {
        const element: Element = createElement({
            role: 'button',
            control: 'foo',
            expanded: 'true',
        });
        const isToggleButton: boolean = targetElementIsToggleButton(element as EventTarget);
        expect(isToggleButton).toEqual(true);
    });
    it('correctly identifies what is not a toggle button without the button role.', () => {
        const element: Element = createElement({
            control: '',
            expanded: '',
        });
        const isToggleButton: boolean = targetElementIsToggleButton(element as EventTarget);
        expect(isToggleButton).toEqual(false);
    });
    it('correctly identifies what is not a toggle button that does not control something else.', () => {
        const element: Element = createElement({
            role: '',
            expanded: '',
        });
        const isToggleButton: boolean = targetElementIsToggleButton(element as EventTarget);
        expect(isToggleButton).toEqual(false);
    });
    it('correctly identifies what is not a toggle button that does not expand collapse something else.', () => {
        const element: Element = createElement({
            role: '',
            control: '',
        });
        const isToggleButton: boolean = targetElementIsToggleButton(element as EventTarget);
        expect(isToggleButton).toEqual(false);
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

describe('selectElementOrDefault function', () => {
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
        const viewModel: AccessibleElementDescriptionViewModel = new AccessibleElementDescriptionViewModel(selectorString);
        const describedById: string | null = AccessibleElementDescriptionViewModel.applyDescribedBy(
            element,
            viewModel,
        ).getAttribute('aria-describedby');
        expect(describedById).toEqual(labelId);
    });
    it('applies a newly created ID to the description element to the aria-describedby attribute.', () => {
        const element: Element = createElement();
        const selectorString: string = ':scope > div';
        const viewModel: AccessibleElementDescriptionViewModel = new AccessibleElementDescriptionViewModel(selectorString);
        const describedById: string | null = AccessibleElementDescriptionViewModel.applyDescribedBy(
            element,
            viewModel,
        ).getAttribute('aria-describedby');
        expect(describedById).not.toEqual('');
    });
    it('returns the element unaffected if an empty selector is provided.', () => {
        const element: Element = createElement();
        const selectorString: string = '';
        const viewModel: AccessibleElementDescriptionViewModel = new AccessibleElementDescriptionViewModel(selectorString);
        const describedById: string | null = AccessibleElementDescriptionViewModel.applyDescribedBy(
            element,
            viewModel,
        ).getAttribute('aria-describedby');
        expect(describedById).toBeNull();
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
