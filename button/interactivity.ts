import { AccessibleElementSelectors, InteractiveAccessibleElement } from "../base/types";
import { AccessibleButtonViewModel } from "../button";

export function createButtonClickEventHandler(
    buttonElement: HTMLElement,

)

export class ClickableInteractiveButtonElement extends InteractiveAccessibleElement<
    AccessibleElementSelectors,
    AccessibleButtonViewModel,
    MouseEvent
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
}

export function makeAccessibleButtonTrackDisabledState(
    button: HTMLElement,
    viewModel: AccessibleButtonViewModel,
): HTMLElement {
    button.addEventListener('click', () => {

    });
}
