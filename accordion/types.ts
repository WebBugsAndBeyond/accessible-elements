import { AccessibleElementLabelViewModel, AccessibleElementSelectors, AccessibleElementViewModel } from "../base/types";

export class AccordionElementSelectorSet extends AccessibleElementSelectors {

    public static readonly DEFAULT_TOGGLE_BUTTON_SELECTOR = ':scope > h3 > button';
    public static readonly DEFAULT_CONTENT_WRAPPER_SELECTOR = ':scope > div';

    constructor(
        public readonly toggleButtonSelector: string = AccordionElementSelectorSet.DEFAULT_TOGGLE_BUTTON_SELECTOR,
        public readonly contentWrapperSelector: string = AccordionElementSelectorSet.DEFAULT_CONTENT_WRAPPER_SELECTOR,
        protected readonly queryRootSelector: string = AccessibleElementSelectors.DEFAULT_QUERY_ROOT_SELECTOR,
        protected readonly accessibleElementSelector: string = AccessibleElementSelectors.DEFAULT_ACCESSIBLE_ELEMENT_SELECTOR,
    ) {
        super(queryRootSelector, accessibleElementSelector);
    }

    /**
     * Returns an instance of AccordionElementSelectorSet with the default values
     * for toggle button and content wrapper selectors defined in the corresponding
     * static class properties.
     * 
     * @returns 
     */
    public static createDefault(): AccordionElementSelectorSet {
        return new AccordionElementSelectorSet(
            AccordionElementSelectorSet.DEFAULT_TOGGLE_BUTTON_SELECTOR,
            AccordionElementSelectorSet.DEFAULT_CONTENT_WRAPPER_SELECTOR,
            AccessibleElementSelectors.DEFAULT_QUERY_ROOT_SELECTOR,
            AccessibleElementSelectors.DEFAULT_ACCESSIBLE_ELEMENT_SELECTOR,
        );
    }
}


export class AccessibleAccordionElementViewModel extends AccessibleElementViewModel<AccordionElementSelectorSet> {
    public constructor(
        public readonly selectors: AccordionElementSelectorSet,
        public readonly labelViewModel: AccessibleElementLabelViewModel,
    ) {
        super(selectors, labelViewModel);
    }

    public static createDefault(): AccessibleAccordionElementViewModel {
        return new AccessibleAccordionElementViewModel(
            AccordionElementSelectorSet.createDefault(),
            AccessibleElementLabelViewModel.createDefault(),
        );
    }
}