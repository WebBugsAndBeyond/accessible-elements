import { AccessibleElementSelectors } from "../base/types";
import { makeAccessibleAccordion } from "./aria";
import { AccordionElementSelectorSet } from "./types";

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
    it('applies role attribute to toggle button with the default selector set.', () => {
        const accordion: HTMLElement = createAccordionElement();
        const selectorSet: AccordionElementSelectorSet = AccordionElementSelectorSet.createDefault();
        const toggleButton: Element | null = accordion.querySelector(selectorSet.toggleButtonSelector);
        makeAccessibleAccordion(accordion);
        expect(toggleButton?.getAttribute?.('role')).toEqual('button');
    });

    it('applies aria-controls attribute equal to the content wrapper id to toggle button.', () => {
        const accordion: HTMLElement = createAccordionElement();
        const selectorSet: AccordionElementSelectorSet = AccordionElementSelectorSet.createDefault();
        const toggleButton: Element | null = accordion.querySelector(selectorSet.toggleButtonSelector);
        makeAccessibleAccordion(accordion, selectorSet);
        expect(toggleButton?.getAttribute?.('aria-controls')).toEqual(mockContentWrappeId);
    });

    it('applies aria-controls attribute equal to the content wrapper id to toggle button with the default selector set.', () => {
        const accordion: HTMLElement = createAccordionElement();
        const selectorSet: AccordionElementSelectorSet = AccordionElementSelectorSet.createDefault();
        const toggleButton: Element | null = accordion.querySelector(selectorSet.toggleButtonSelector);
        makeAccessibleAccordion(accordion);
        expect(toggleButton?.getAttribute?.('aria-controls')).toEqual(mockContentWrappeId);
    });

    it('applies aria-expanded attribute to toggle button.', () => {
        const accordion: HTMLElement = createAccordionElement();
        const selectorSet: AccordionElementSelectorSet = AccordionElementSelectorSet.createDefault();
        const toggleButton: Element | null = accordion.querySelector(selectorSet.toggleButtonSelector);
        makeAccessibleAccordion(accordion, selectorSet);
        expect(toggleButton?.getAttribute?.('aria-expanded')).toEqual('false');
    });

    it('applies aria-expanded attribute to toggle button with a default selector set.', () => {
        const accordion: HTMLElement = createAccordionElement();
        const selectorSet: AccordionElementSelectorSet = AccordionElementSelectorSet.createDefault();
        const toggleButton: Element | null = accordion.querySelector(selectorSet.toggleButtonSelector);
        makeAccessibleAccordion(accordion);
        expect(toggleButton?.getAttribute?.('aria-expanded')).toEqual('false');
    });

    it('applies role attribute to content wrapper.', () => {
        const accordion: HTMLElement = createAccordionElement();
        const selectorSet: AccordionElementSelectorSet = AccordionElementSelectorSet.createDefault();
        const contentWrapper: Element | null = accordion.querySelector(selectorSet.contentWrapperSelector);
        makeAccessibleAccordion(accordion, selectorSet);
        expect(contentWrapper?.getAttribute?.('role')).toEqual('region');
    });

    it('applies role attribute to content wrapper with a default selector set.', () => {
        const accordion: HTMLElement = createAccordionElement();
        const selectorSet: AccordionElementSelectorSet = AccordionElementSelectorSet.createDefault();
        const contentWrapper: Element | null = accordion.querySelector(selectorSet.contentWrapperSelector);
        makeAccessibleAccordion(accordion);
        expect(contentWrapper?.getAttribute?.('role')).toEqual('region');
    });

    it('applies aria-labelledby to content wrapper with toggle button id.', () => {
        const accordion: HTMLElement = createAccordionElement();
        const selectorSet: AccordionElementSelectorSet = AccordionElementSelectorSet.createDefault();
        const contentWrapper: Element | null = accordion.querySelector(selectorSet.contentWrapperSelector);
        makeAccessibleAccordion(accordion, selectorSet);
        expect(contentWrapper?.getAttribute?.('aria-labelledby')).toEqual(mockToggleButtonId);
    });

    it('applies aria-labelledby to content wrapper with toggle button id with a default selector set.', () => {
        const accordion: HTMLElement = createAccordionElement();
        const selectorSet: AccordionElementSelectorSet = AccordionElementSelectorSet.createDefault();
        const contentWrapper: Element | null = accordion.querySelector(selectorSet.contentWrapperSelector);
        makeAccessibleAccordion(accordion);
        expect(contentWrapper?.getAttribute?.('aria-labelledby')).toEqual(mockToggleButtonId);
    });

    it('applies hidden attribute to content wrapper.', () => {
        const accordion: HTMLElement = createAccordionElement();
        const selectorSet: AccordionElementSelectorSet = AccordionElementSelectorSet.createDefault();
        const contentWrapper: Element | null = accordion.querySelector(selectorSet.contentWrapperSelector);
        makeAccessibleAccordion(accordion, selectorSet);
        expect(contentWrapper?.hasAttribute?.('hidden')).toBeTruthy();
    });

    it('applies hidden attribute to content wrapper with a default selector set.', () => {
        const accordion: HTMLElement = createAccordionElement();
        const selectorSet: AccordionElementSelectorSet = AccordionElementSelectorSet.createDefault();
        const contentWrapper: Element | null = accordion.querySelector(selectorSet.contentWrapperSelector);
        makeAccessibleAccordion(accordion);
        expect(contentWrapper?.hasAttribute?.('hidden')).toBeTruthy();
    });    
    
});
