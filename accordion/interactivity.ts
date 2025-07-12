
import { InteractiveAccessibleElement } from "../base/types";
import { targetElementIsToggleButton } from "../utils/dom";
import { AccessibleAccordionElementViewModel, AccordionElementSelectorSet } from "./types";

export function createAccordionKeyboardNavigationKeyUpHandler(
    accordionElement: HTMLElement,
    selectors: AccordionElementSelectorSet,
): (e: KeyboardEvent) => void {
    return (e: KeyboardEvent) => {
        const { target, key } = e;
        if (targetElementIsToggleButton(target)) {
            const toggles: Node[] = Array.from(accordionElement.querySelectorAll(selectors.toggleButtonSelector));
            if (key === ' ' || key === 'Enter') {
                (target as HTMLElement).click();
            } else if (key === 'ArrowUp' || key === 'ArrowDown') {
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
            } else if (key === 'Home') {
                (toggles[0] as HTMLElement).focus();
                (toggles[0] as EventTarget).dispatchEvent(new FocusEvent('focus', {
                    bubbles: true,
                }));
            } else if (key === 'End') {
                (toggles[toggles.length - 1] as HTMLElement).focus();
                (toggles[toggles.length - 1] as EventTarget).dispatchEvent(new FocusEvent('focus', {
                    bubbles: true,
                }));
            }
            e.preventDefault();
            e.stopPropagation();
        }
    };
}

export class InteractiveAccessibleAccordionElement extends InteractiveAccessibleElement<
    AccordionElementSelectorSet,
    AccessibleAccordionElementViewModel,
    KeyboardEvent
> {
    public constructor(
        public isEventHandlerAttached: boolean = false,
    ) {
        super();
    }

    public initializeInteractiveState(element: HTMLElement, viewModel: AccessibleAccordionElementViewModel): boolean {
        if (this.isEventHandlerAttached) {
            return false;
        }
        this.patternState = {
            element: element,
            viewModel: viewModel,
            handler: createAccordionKeyboardNavigationKeyUpHandler(element, viewModel.selectors),
        };
        return true;
    }

    public attachEventHandler(): boolean {
        if (this.patternState) {
            const { element, handler } = this.patternState;
            element.addEventListener('keyup', handler);
            return this.isEventHandlerAttached = true;
        } else {
            return false;
        }
    }

    public removeEventHandler(): boolean {
        if (this.patternState && this.isEventHandlerAttached) {
            const { element, handler } = this.patternState;
            element.removeEventListener('keyup', handler);
            this.isEventHandlerAttached = false;
            return true;
        } else {
            return false;
        }
    }

    public cleanupHandlerState(): boolean {
        if (this.patternState) {
            this.removeEventHandler();
            this.patternState = null;
            return true;
        } else {
            return false;
        }
    }
}

export function applyAccessibleAccordionInteractivity(
    accordionElement: HTMLElement,
    viewModel: AccessibleAccordionElementViewModel,
): InteractiveAccessibleAccordionElement {
    const interactivity: InteractiveAccessibleAccordionElement = new InteractiveAccessibleAccordionElement();
    interactivity.initializeInteractiveState(accordionElement, viewModel);
    interactivity.attachEventHandler();
    return interactivity;
}
