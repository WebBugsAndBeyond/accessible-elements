import { AnyKindOfFunction } from "../utils";
import {
    ensureElementHasID,
    targetElementIsToggleButton,
    toggleExpandedHiddenState,
} from "../utils/dom";
import { AccordionElementSelectorSet } from "./types";


/**
 * Applies accessibility attributes, and behaviors in accordance with the W3C WAI specification for
 * Accordian components. Refer to the W3C documentation https://www.w3.org/WAI/ARIA/apg/patterns/accordion/.
 * 
 * @param accordionElement DOM Element serving as the root element for selecting accordian elements.
 * @param selectorSet DOM selector strings for identifying accordian elements.
 * @returns Returns accordianElement.
 * @see {AccessibleDecoratorUtils#toggleExpandedHiddenState}
 */
export function makeAccessibleAccordion(
    accordionElement: HTMLElement,
    selectorSet: AccordionElementSelectorSet = AccordionElementSelectorSet.createDefault(),
): HTMLElement {

    const toggleWrappers: NodeList = accordionElement.querySelectorAll(selectorSet.toggleButtonSelector);
    const contentWrappers: NodeList = accordionElement.querySelectorAll(selectorSet.contentWrapperSelector);
    const itemCount: number = Math.min(toggleWrappers.length, contentWrappers.length);
    for (let i = 0; i < itemCount; ++i) {
        const toggleElement: HTMLElement = toggleWrappers.item(i) as HTMLElement;
        const contentWrapper: HTMLElement = contentWrappers.item(i) as HTMLElement;
        const toggleId: string = ensureElementHasID(toggleElement);
        const wrapperId: string = ensureElementHasID(contentWrapper);

        toggleElement.setAttribute('role', 'button');
        toggleElement.setAttribute('aria-controls', wrapperId);
        toggleElement.setAttribute('aria-expanded', 'false');

        contentWrapper.setAttribute('role', 'region');
        contentWrapper.setAttribute('aria-labelledby', toggleId);
        contentWrapper.setAttribute('hidden', '');

        toggleExpandedHiddenState(toggleElement, contentWrapper);
    }
    
    return accordionElement;
}
