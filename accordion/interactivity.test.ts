import { targetElementIsToggleButton } from "../utils/dom";
import { createAccordionKeyboardNavigationKeyUpHandler, InteractiveAccessibleAccordionElement } from "./interactivity";
import { AccessibleAccordionElementViewModel, AccordionElementSelectorSet } from "./types";

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

describe('InteractiveAccessibleAccordionElement', () => {
    it('initializes an interactive state from an uninitialized state.', () => {
        const interactiveAccordion: InteractiveAccessibleAccordionElement = new InteractiveAccessibleAccordionElement();
        const element: HTMLElement = createAccordionElement();
        const viewModel: AccessibleAccordionElementViewModel = AccessibleAccordionElementViewModel.createDefault();
        expect(interactiveAccordion.initializeInteractiveState(element, viewModel)).toEqual(true);
        expect(interactiveAccordion.interactivityState).not.toBeNull();
        expect(interactiveAccordion.interactivityState?.element).toBe(element);
        expect(interactiveAccordion.interactivityState?.viewModel).toBe(viewModel);
        expect(interactiveAccordion.interactivityState?.handler).toBeInstanceOf(Function);
        expect(typeof interactiveAccordion.interactivityState?.handler).toEqual('function');
    });
    it('does not initialize an interactive state from an attached initialized state.', () => {
        const interactiveAccordion: InteractiveAccessibleAccordionElement = new InteractiveAccessibleAccordionElement();
        const element: HTMLElement = createAccordionElement();
        const viewModel: AccessibleAccordionElementViewModel = AccessibleAccordionElementViewModel.createDefault();
        expect(interactiveAccordion.initializeInteractiveState(element, viewModel)).toEqual(true);
        expect(interactiveAccordion.attachEventHandler()).toEqual(true);
        expect(interactiveAccordion.initializeInteractiveState(element, viewModel)).toEqual(false);
    });
    it('attaches the event handler', () => {
        const interactiveAccordion: InteractiveAccessibleAccordionElement = new InteractiveAccessibleAccordionElement();
        const element: HTMLElement = createAccordionElement();
        const viewModel: AccessibleAccordionElementViewModel = AccessibleAccordionElementViewModel.createDefault();
        expect(interactiveAccordion.initializeInteractiveState(element, viewModel)).toEqual(true);
        expect(interactiveAccordion.attachEventHandler()).toEqual(true);
        expect(interactiveAccordion.isEventHandlerAttached).toEqual(true);
    });
    it('does not attach an event handler with an uninitialized state.', () => {
        const interactiveAccordion: InteractiveAccessibleAccordionElement = new InteractiveAccessibleAccordionElement();
        const element: HTMLElement = createAccordionElement();
        const viewModel: AccessibleAccordionElementViewModel = AccessibleAccordionElementViewModel.createDefault();
        expect(interactiveAccordion.attachEventHandler()).toEqual(false);
        expect(interactiveAccordion.isEventHandlerAttached).toEqual(false);
    });
    it('removes the event handler.', () => {
        const interactiveAccordion: InteractiveAccessibleAccordionElement = new InteractiveAccessibleAccordionElement();
        const element: HTMLElement = createAccordionElement();
        const viewModel: AccessibleAccordionElementViewModel = AccessibleAccordionElementViewModel.createDefault();
        expect(interactiveAccordion.initializeInteractiveState(element, viewModel)).toEqual(true);
        expect(interactiveAccordion.attachEventHandler()).toEqual(true);
        expect(interactiveAccordion.isEventHandlerAttached).toEqual(true);
        expect(interactiveAccordion.removeEventHandler()).toEqual(true);
        expect(interactiveAccordion.isEventHandlerAttached).toEqual(false);
    });
    it('does not remove an event handler from an uninitialized state.', () => {
        const interactiveAccordion: InteractiveAccessibleAccordionElement = new InteractiveAccessibleAccordionElement();
        expect(interactiveAccordion.interactivityState).toBeNull();
        expect(interactiveAccordion.removeEventHandler()).toEqual(false);
    });
    it('cleansup the interactivity state.', () => {
        const interactiveAccordion: InteractiveAccessibleAccordionElement = new InteractiveAccessibleAccordionElement();
        const element: HTMLElement = createAccordionElement();
        const viewModel: AccessibleAccordionElementViewModel = AccessibleAccordionElementViewModel.createDefault();
        expect(interactiveAccordion.initializeInteractiveState(element, viewModel)).toEqual(true);
        expect(interactiveAccordion.cleanupHandlerState()).toEqual(true);
    });
    it('does not cleanup uninitialized interactivity state.', () => {
        const interactiveAccordion: InteractiveAccessibleAccordionElement = new InteractiveAccessibleAccordionElement();
        expect(interactiveAccordion.cleanupHandlerState()).toEqual(false);
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

