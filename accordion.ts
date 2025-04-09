import { ensureElementHasID, toggleExpandedHiddenState } from "./utils";

export class AccordionElementSelectorSet {

    public static readonly DEFAULT_TOGGLE_BUTTON_SELECTOR = ':scope > h3 > button';
    public static readonly DEFAULT_CONTENT_WRAPPER_SELECTOR = ':scope > div';

    constructor(
        public readonly toggleButtonSelector: string,
        public readonly contentWrapperSelector: string,
    ) {
        
    }

    /**
     * Returns an instance of AccordionElementSelectorSet with the default values
     * for toggle button and content wrapper selectors defined in the corresponding
     * static class properties.
     * 
     * @returns 
     */
    public static createDefault(): AccordionElementSelectorSet {
        return {
            toggleButtonSelector: AccordionElementSelectorSet.DEFAULT_TOGGLE_BUTTON_SELECTOR,
            contentWrapperSelector: AccordionElementSelectorSet.DEFAULT_CONTENT_WRAPPER_SELECTOR,
        };
    }

}

export function targetElementIsToggleButton(eventTarget: EventTarget | null): boolean {
    const element: HTMLElement = eventTarget as HTMLElement;
    const isButton: boolean = element?.getAttribute?.('role') === 'button';
    const isControl: boolean = element?.hasAttribute?.('aria-controls');
    const isExpandButton: boolean = element?.hasAttribute?.('aria-expanded');
    return isButton && isControl && isExpandButton;
}

export function createAccordionKeyboardNavigationKeyUpHandler(
    accordionElement: HTMLElement,
    selectors: AccordionElementSelectorSet,
): (e: KeyboardEvent) => void {
    return (e: KeyboardEvent) => {
        const { target, key } = e;
        if (targetElementIsToggleButton(target)) {
            const toggles: Node[] = Array.from(accordionElement.querySelectorAll(selectors.toggleButtonSelector));
            if (key === ' ' || key === 'Enter') {
                (target as HTMLElement)?.click();
            } else if (toggles.length > 0 && (key === 'ArrowUp' || key === 'ArrowDown')) {
                const direction: number = ({ 'ArrowUp': -1, 'ArrowDown': 1 })[key];
                const targetIndex: number | undefined = toggles.findIndex(node => node === target);
                if (typeof targetIndex !== 'undefined') {
                    let nextIndex: number = targetIndex + direction;
                    if (nextIndex === toggles.length) {
                        nextIndex = 0
                    } else if (nextIndex === -1) {
                        nextIndex = toggles.length - 1;
                    }
                    const nextElement: HTMLElement = toggles[nextIndex] as HTMLElement;
                    nextElement.focus();
                }
            } else if (key === 'Home' && toggles.length > 0) {
                (toggles[0] as HTMLElement).focus();
            } else if (key === 'End' && toggles.length > 0) {
                (toggles[toggles.length - 1] as HTMLElement).focus();
            }
            e.preventDefault();
            e.stopPropagation();
        }
    };
}

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

        toggleElement?.setAttribute?.('role', 'button');
        toggleElement?.setAttribute?.('aria-controls', wrapperId);
        toggleElement?.setAttribute?.('aria-expanded', 'false');

        contentWrapper?.setAttribute?.('role', 'region');
        contentWrapper?.setAttribute?.('aria-labelledby', toggleId);
        contentWrapper?.setAttribute?.('hidden', '');

        toggleExpandedHiddenState(toggleElement, contentWrapper);
    }
    
    return accordionElement;
}
