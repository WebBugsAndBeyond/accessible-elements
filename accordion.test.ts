import {
    AccordionElementSelectorSet,
    targetElementIsToggleButton,
    makeAccessibleAccordion,
    createAccordionKeyboardNavigationKeyUpHandler,
 } from './accordion';

 import { AccessibleToggleButtonViewModel, makeAccessibleToggleButton } from './button';

 describe('Accordion element selector set class', () => {
    it('has a toggle button selector string', () => {
        const mockToggleButtonSelectorString: string = 'mock toggle button selector string';
        const mockContentWrapperSelectorString: string = 'mock content wrapper selector string';
        const accordionElementSelectorSetInstance: AccordionElementSelectorSet = new AccordionElementSelectorSet(
            mockToggleButtonSelectorString,
            mockContentWrapperSelectorString,
        );
        expect(accordionElementSelectorSetInstance.toggleButtonSelector).toBeDefined();
        expect(typeof accordionElementSelectorSetInstance.toggleButtonSelector).toEqual('string');
        expect(accordionElementSelectorSetInstance.toggleButtonSelector).toEqual(mockToggleButtonSelectorString);
    });
    it('has a content wrapper selector string', () => {
        const mockToggleButtonSelectorString: string = 'mock toggle button selector string';
        const mockContentWrapperSelectorString: string = 'mock content wrapper selector string';

        const accordionElementSelectorSetInstance: AccordionElementSelectorSet = new AccordionElementSelectorSet(
            mockToggleButtonSelectorString,
            mockContentWrapperSelectorString,
        );
        expect(accordionElementSelectorSetInstance.contentWrapperSelector).toEqual(mockContentWrapperSelectorString);
    });
    it('has a default toggle button selector', () => {
        const toggleButtonSelector: string = ':scope > h3 > button';
        expect(AccordionElementSelectorSet.DEFAULT_TOGGLE_BUTTON_SELECTOR).toEqual(toggleButtonSelector);
    });
    it('has a default content wrapper selector string.', () => {
        const contentWrapperSelector: string = ':scope > div';
        expect(AccordionElementSelectorSet.DEFAULT_CONTENT_WRAPPER_SELECTOR).toEqual(contentWrapperSelector);
    });
    it('creates an instance with default values.', () => {
        const defaultInstance: AccordionElementSelectorSet = AccordionElementSelectorSet.createDefault();
        expect(defaultInstance.toggleButtonSelector).toEqual(AccordionElementSelectorSet.DEFAULT_TOGGLE_BUTTON_SELECTOR);
        expect(defaultInstance.contentWrapperSelector).toEqual(AccordionElementSelectorSet.DEFAULT_CONTENT_WRAPPER_SELECTOR);
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

 describe('makeAccessibleAccordion function', () => {
    const mockToggleButtonId: string = 'mock-accordion-toggle-button';
    const mockContentWrappeId: string = 'mock-content-wrapper';
    const mockAccordionHeadingText: string = 'mock-accordion-heading';
    
    const createAccordionElement = () => {
        const accordionRootElement: HTMLElement = document.createElement('div');
        const level3Heading: HTMLElement = document.createElement('h3');
        const buttonElement: HTMLElement = document.createElement('button');
        const contentWrapperElement: HTMLElement = document.createElement('div');

        level3Heading.innerHTML = mockAccordionHeadingText;
        buttonElement.setAttribute('id', mockToggleButtonId);
        contentWrapperElement.setAttribute('id', mockContentWrappeId);
        level3Heading.appendChild(buttonElement);
        accordionRootElement.appendChild(level3Heading);
        accordionRootElement.appendChild(contentWrapperElement);
        return accordionRootElement;
    };

    it('applies role attribute to toggle button.', () => {
        const accordion: HTMLElement = createAccordionElement();
        const selectorSet: AccordionElementSelectorSet = AccordionElementSelectorSet.createDefault();
        const toggleButton: Element | null = accordion.querySelector(selectorSet.toggleButtonSelector);
        makeAccessibleAccordion(accordion, selectorSet);
        expect(toggleButton?.getAttribute?.('role')).toEqual('button');
    });
    it('applies aria-controls attribute equal to the content wrapper id to toggle button.', () => {
        const accordion: HTMLElement = createAccordionElement();
        const selectorSet: AccordionElementSelectorSet = AccordionElementSelectorSet.createDefault();
        const toggleButton: Element | null = accordion.querySelector(selectorSet.toggleButtonSelector);
        makeAccessibleAccordion(accordion, selectorSet);
        expect(toggleButton?.getAttribute?.('aria-controls')).toEqual(mockContentWrappeId);
    });
    it('applies aria-expanded attribute to toggle button.', () => {
        const accordion: HTMLElement = createAccordionElement();
        const selectorSet: AccordionElementSelectorSet = AccordionElementSelectorSet.createDefault();
        const toggleButton: Element | null = accordion.querySelector(selectorSet.toggleButtonSelector);
        makeAccessibleAccordion(accordion, selectorSet);
        expect(toggleButton?.getAttribute?.('aria-expanded')).toEqual('false');
    });
    it('applies role attribute to content wrapper.', () => {
        const accordion: HTMLElement = createAccordionElement();
        const selectorSet: AccordionElementSelectorSet = AccordionElementSelectorSet.createDefault();
        const contentWrapper: Element | null = accordion.querySelector(selectorSet.contentWrapperSelector);
        makeAccessibleAccordion(accordion, selectorSet);
        expect(contentWrapper?.getAttribute?.('role')).toEqual('region');
    });
    it('applies aria-labelledby to content wrapper with toggle button id.', () => {
        const accordion: HTMLElement = createAccordionElement();
        const selectorSet: AccordionElementSelectorSet = AccordionElementSelectorSet.createDefault();
        const contentWrapper: Element | null = accordion.querySelector(selectorSet.contentWrapperSelector);
        makeAccessibleAccordion(accordion, selectorSet);
        expect(contentWrapper?.getAttribute?.('aria-labelledby')).toEqual(mockToggleButtonId);
    });
    it('applies hidden attribute to content wrapper.', () => {
        const accordion: HTMLElement = createAccordionElement();
        const selectorSet: AccordionElementSelectorSet = AccordionElementSelectorSet.createDefault();
        const contentWrapper: Element | null = accordion.querySelector(selectorSet.contentWrapperSelector);
        makeAccessibleAccordion(accordion, selectorSet);
        expect(contentWrapper?.hasAttribute?.('hidden')).toBeTruthy();
    });
    it('toggles aria-expanded attribute value when toggle button is clicked.', async () => {
        const accordion: HTMLElement = createAccordionElement();
        const selectorSet: AccordionElementSelectorSet = AccordionElementSelectorSet.createDefault();
        const toggleButton: Element | null = accordion.querySelector(selectorSet.toggleButtonSelector);
        makeAccessibleAccordion(accordion, selectorSet);
        (toggleButton as HTMLElement).click();
        expect(toggleButton?.getAttribute?.('aria-expanded')).toEqual('true');
        (toggleButton as HTMLElement).click();
        expect(toggleButton?.getAttribute?.('aria-expanded')).toEqual('false');
    });
    it('toggles hidden attribute on content wrapper when toggle button is clicked.', async () => {
        const accordion: HTMLElement = createAccordionElement();
        const selectorSet: AccordionElementSelectorSet = AccordionElementSelectorSet.createDefault();
        const contentWrapper: Element | null = accordion.querySelector(selectorSet.contentWrapperSelector);
        const toggleButton: Element | null = accordion.querySelector(selectorSet.toggleButtonSelector);
        makeAccessibleAccordion(accordion, selectorSet);
        (toggleButton as HTMLElement).click();
        expect(contentWrapper?.hasAttribute?.('hidden')).toEqual(false);
        (toggleButton as HTMLElement).click();
        expect(contentWrapper?.hasAttribute?.('hidden')).toEqual(true);
    });
    it('uses default element selection.', () => {
        const accordion: HTMLElement = createAccordionElement();
        const madeAccessibleAccordion: HTMLElement = makeAccessibleAccordion(accordion);
        const contentWrapperElement: Element | null = accordion.querySelector(AccordionElementSelectorSet.DEFAULT_CONTENT_WRAPPER_SELECTOR);
        expect(contentWrapperElement).not.toBeNull();
        expect(contentWrapperElement?.getAttribute?.('role')).toEqual('region');
    });
 });

describe('The createAccordionKeyboardNavigationKeyUpHandler function', () => {

    const mockToggleButtonId: string = 'mock-accordion-toggle-button';
    const mockContentWrappeId: string = 'mock-content-wrapper';
    const mockAccordionHeadingText: string = 'mock-accordion-heading';
    const KEYUP: string = 'keyup';
    const createAccordionElement: (accordionIndex?: number) => HTMLElement = (accordionIndex: number = 0): HTMLElement => {
        const accordionRootElement: HTMLElement = document.createElement('div');
        const level3Heading: HTMLElement = document.createElement('h3');
        const buttonElement: HTMLElement = document.createElement('button');
        const contentWrapperElement: HTMLElement = document.createElement('div');

        level3Heading.innerHTML = mockAccordionHeadingText;
        buttonElement.setAttribute('id', `${mockToggleButtonId}-${accordionIndex}`);
        buttonElement.setAttribute('role', 'button');
        buttonElement.setAttribute('aria-controls', `${mockContentWrappeId}-${accordionIndex}`);
        buttonElement.setAttribute('aria-expanded', 'false');
        buttonElement.textContent = 'Click me!';
        contentWrapperElement.setAttribute('id', `${mockContentWrappeId}-${accordionIndex}`);
        contentWrapperElement.textContent = 'Some text content';
        level3Heading.appendChild(buttonElement);
        accordionRootElement.appendChild(level3Heading);
        accordionRootElement.appendChild(contentWrapperElement);
        return accordionRootElement;
    };

    const createAccordionElementSet: (count: number) => HTMLElement = (count: number): HTMLElement => {
        const wrapper: HTMLElement = document.createElement('div');
        for (let i: number = 0; i < count; ++i) {
            const accordion: HTMLElement = createAccordionElement(i);
            wrapper.appendChild(accordion);
        }
        return wrapper;
    };

    const createSelectorSet: () => AccordionElementSelectorSet = () => {
        return AccordionElementSelectorSet.createDefault();
    };

    

    it('returns a function that triggers a click event when Space and Enter keys are pressed on the target.', () => {
        const clickHandler = jest.fn();
        const accordion = createAccordionElement();
        const buttonElement: HTMLElement | null = accordion.querySelector(`#${mockToggleButtonId}-0`);
        if (buttonElement === null) {
            throw new ReferenceError('buttonElement is null');
        }
        
        buttonElement.addEventListener('click', clickHandler);
        
        expect(targetElementIsToggleButton(buttonElement)).toEqual(true);
        const selectors: AccordionElementSelectorSet = createSelectorSet();
        const keyUpHandler: (e: KeyboardEvent) => void = createAccordionKeyboardNavigationKeyUpHandler(
            accordion,
            selectors,
        );
        expect(keyUpHandler).toBeInstanceOf(Function);
        accordion.addEventListener(KEYUP, keyUpHandler as EventListenerOrEventListenerObject);
        const spaceKeyUp: KeyboardEvent = new KeyboardEvent(KEYUP, {
            code: 'Space',
            key: ' ',
            bubbles: true,
        });
        const enterKeyUp: KeyboardEvent = new KeyboardEvent(KEYUP, {
            code: 'Enter',
            key: 'Enter',
            bubbles: true,
        });
        
        const toggles: Node[] = Array.from(accordion.querySelectorAll(selectors.toggleButtonSelector));
        expect(toggles.length).toEqual(1);

        buttonElement.dispatchEvent(spaceKeyUp);
        expect(clickHandler).toHaveBeenCalledTimes(1);
        buttonElement.dispatchEvent(enterKeyUp);
        expect(clickHandler).toHaveBeenCalledTimes(2);
    });

    it('returns a function that triggers focus on the next and previous accordion toggle buttons via arrow up and down.', () => {
        const accordionCount: number = 3;
        const accordionSet: HTMLElement = createAccordionElementSet(accordionCount);
        const selectors: AccordionElementSelectorSet = new AccordionElementSelectorSet(
            ':scope > div > h3 > button',
            ':scope > div > div',
        );
        const keyUpHandler: (e: KeyboardEvent) => void = createAccordionKeyboardNavigationKeyUpHandler(
            accordionSet,
            selectors,
        );
        const toggleButtons: NodeList = accordionSet.querySelectorAll(selectors.toggleButtonSelector);
        const focusHandlers: jest.Mock[]= [];
        const focusCallCounts: number[] = [];
        expect(toggleButtons.length).toEqual(accordionCount);

        toggleButtons.forEach((toggleButtonNode: Node) => {
            const toggleButtonElement: HTMLElement = toggleButtonNode as HTMLElement;
            const focusHandler: jest.Mock = jest.fn();
            focusHandlers.push(focusHandler);
            focusCallCounts.push(0);
            toggleButtonElement.addEventListener('focus', focusHandler);
        });
        const arrowDownModel: [number, number][] = [[0, 1], [1, 2], [2, 0]];
        const arrowUpModel: [number, number][] = [[0, 2], [2, 1], [1, 0]];
        
        const EXPECTED_FOCUS_CALL_COUNT: number = arrowDownModel.length + arrowUpModel.length + 2;

        accordionSet.addEventListener(KEYUP, keyUpHandler as EventListenerOrEventListenerObject);
        arrowDownModel.forEach(([current, next]) => {
            const toggleButtonElement: HTMLElement = toggleButtons.item(current) as HTMLElement;
            if (current === 0) {
                toggleButtonElement.focus();
                focusCallCounts[current] = focusCallCounts[current] + 1;
            }
            const arrowKeyEvent: KeyboardEvent = new KeyboardEvent(KEYUP, {
                code: 'ArrowDown',
                key: 'ArrowDown',
                bubbles: true,
            });
            toggleButtonElement.dispatchEvent(arrowKeyEvent);
            focusCallCounts[next] = focusCallCounts[next] + 1;
        });
        arrowUpModel.forEach(([current, next]) => {
            const toggleButtonElement: HTMLElement = toggleButtons.item(current) as HTMLElement;
            if (current === 0) {
                toggleButtonElement.focus();
                focusCallCounts[current] = focusCallCounts[current] + 1;
            }
            const arrowKeyEvent: KeyboardEvent = new KeyboardEvent(KEYUP, {
                code: 'ArrowUp',
                key: 'ArrowUp',
                bubbles: true,
            });
            toggleButtonElement.dispatchEvent(arrowKeyEvent);
            focusCallCounts[next] = focusCallCounts[next] + 1;
        });
        const focusHandlerCallSum: number = focusCallCounts.reduce((carry, current) => carry + current, 0);
        expect(EXPECTED_FOCUS_CALL_COUNT).toEqual(focusHandlerCallSum);
    });
    it('returns a function that focuses the first accordion toggle when the Home button is pressed.', () => {
        const accordionCount: number = 3;
        const accordionSet: HTMLElement = createAccordionElementSet(accordionCount);
        const selectors: AccordionElementSelectorSet = new AccordionElementSelectorSet(
            ':scope > div > h3 > button',
            ':scope > div > div',
        );
        const keyUpHandler: (e: KeyboardEvent) => void = createAccordionKeyboardNavigationKeyUpHandler(
            accordionSet,
            selectors,
        );
        accordionSet.addEventListener(KEYUP, keyUpHandler as EventListenerOrEventListenerObject);

        const toggleButtons: NodeList = accordionSet.querySelectorAll(selectors.toggleButtonSelector);
        expect(toggleButtons.length).toEqual(accordionCount);

        const firstToggleButton: HTMLElement = toggleButtons.item(0) as HTMLElement;
        const lastToggleButton: HTMLElement = toggleButtons.item(toggleButtons.length - 1) as HTMLElement;
        const firstToggleFocusHandler: jest.Mock = jest.fn();

        firstToggleButton.addEventListener('focus', firstToggleFocusHandler);
        lastToggleButton.focus();
        
        const homeKeyEvent: KeyboardEvent = new KeyboardEvent(KEYUP, {
            code: 'Home',
            key: 'Home',
            bubbles: true,
        });
        lastToggleButton.dispatchEvent(homeKeyEvent);
        expect(firstToggleFocusHandler).toHaveBeenCalled();
    });
    it('returns a function that focuses the last accordion toggle when the End button is pressed.', () => {
        const accordionCount: number = 3;
        const accordionSet: HTMLElement = createAccordionElementSet(accordionCount);
        const selectors: AccordionElementSelectorSet = new AccordionElementSelectorSet(
            ':scope > div > h3 > button',
            ':scope > div > div',
        );
        const keyUpHandler: (e: KeyboardEvent) => void = createAccordionKeyboardNavigationKeyUpHandler(
            accordionSet,
            selectors,
        );
        const toggleButtons: NodeList = accordionSet.querySelectorAll(selectors.toggleButtonSelector);
        accordionSet.addEventListener(KEYUP, keyUpHandler as EventListenerOrEventListenerObject);
        
        expect(toggleButtons.length).toEqual(accordionCount);
        const firstToggleButton: HTMLElement = toggleButtons[0] as HTMLElement;
        const lastToggleButton: HTMLElement = toggleButtons[toggleButtons.length - 1] as HTMLElement;
        const lastToggleFocusHandler: jest.Mock = jest.fn();

        firstToggleButton.focus();
        lastToggleButton.addEventListener('focus', lastToggleFocusHandler);
        const endKeyEvent: KeyboardEvent = new KeyboardEvent(KEYUP, {
            code: 'End',
            key: 'End',
            bubbles: true,
        });
        firstToggleButton.dispatchEvent(endKeyEvent);
        expect(lastToggleFocusHandler).toHaveBeenCalled();
    });
 });
