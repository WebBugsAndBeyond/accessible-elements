import { AccordionElementSelectorSet } from "./types";

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
    it('has a constructor with default value initialization.', () => {
        const instance: AccordionElementSelectorSet = new AccordionElementSelectorSet();
        expect(instance.queryRoot).toEqual(AccordionElementSelectorSet.DEFAULT_QUERY_ROOT_SELECTOR);
        expect(instance.toggleButtonSelector).toEqual(AccordionElementSelectorSet.DEFAULT_TOGGLE_BUTTON_SELECTOR);
    });
});
