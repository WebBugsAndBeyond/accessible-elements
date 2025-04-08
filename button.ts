import { AccessibleElementLabelViewModel, AccessibleElementViewModel, applyDescribedBy, ensureElementHasID, selectElementOrDefault } from "./utils";

export class ButtonElementSelectorSet {

    public static readonly DEFAULT_BUTTON_SELECTOR: string = '';
    public static readonly DEFAULT_DESCRIPTION_SELECTOR: string = '';

    constructor(
        public readonly buttonSelector: string = ButtonElementSelectorSet.DEFAULT_BUTTON_SELECTOR,
        public readonly descriptionSelector: string = ButtonElementSelectorSet.DEFAULT_DESCRIPTION_SELECTOR,
    ) {
        
    }

    public static createDefault(): ButtonElementSelectorSet {
        return new ButtonElementSelectorSet();
    }
}

export enum AccessibleButtonType {
    PUSH_BUTTON,
    TOGGLE_BUTTON,
    MENU_BUTTON,
}

export class AccessibleButtonViewModel extends AccessibleElementViewModel<ButtonElementSelectorSet> {
    public constructor(
        public readonly selectors: ButtonElementSelectorSet,
        public readonly labelViewModel: AccessibleElementLabelViewModel,
        public readonly buttonType: AccessibleButtonType = AccessibleButtonType.PUSH_BUTTON,
    ) {
        super(selectors, labelViewModel);
    }

    public static createDefault(): AccessibleButtonViewModel {
        const selectors: ButtonElementSelectorSet = ButtonElementSelectorSet.createDefault();
        const labelViewModel: AccessibleElementLabelViewModel = AccessibleElementLabelViewModel.createDefault();
        return new AccessibleButtonViewModel(selectors, labelViewModel);
    }
}

/**
 * Applies element attributes in accordance with the W3C WAI Button Pattern.
 * Refer to the W3C documentation for the Button pattern https://www.w3.org/WAI/ARIA/apg/patterns/button/.
 * 
 * If the `buttonSelector` property of the `selectors` value is an empty string, or is undefined 
 * then the `buttonElement` Element is used as the element considered to need the "button" role.
 * 
 * If the `labelSelector` property of the `selectors` value is an empty string, or is undefined
 * then the `textContent` of the button will be used as the accessible label.
 * 
 * @param buttonElement DOM element serving as the root node for element selection
 * @param selectors DOM Element selectors for identifying the button, label, and description elements.
 * @returns Returns buttonElement.
 */
export function makeAccessibleButton(
    buttonElement: Element,
    viewModel: AccessibleButtonViewModel = AccessibleButtonViewModel.createDefault(),
): Element {
    const { selectors: { buttonSelector, descriptionSelector }, labelViewModel } = viewModel;
    const button: Element | null = selectElementOrDefault(buttonElement, buttonSelector);
    
    if (button !== null) {
        button.setAttribute('role', 'button');
        if (button.hasAttribute('disabled')) {
            button.setAttribute('aria-disabled', 'true');
        } else if (button.hasAttribute('aria-disabled')) {
            button.removeAttribute('aria-disabled');
        }
        AccessibleElementLabelViewModel.applyAccessibleLabel(button, labelViewModel);
        applyDescribedBy(buttonElement, descriptionSelector, buttonSelector);
    }
    return buttonElement;
}

/**
 * Returns a boolean indicating toggle button pressed state based on its 'aria-pressed` attribute value.
 * @param button 
 * @returns 
 */
export function evaluatePressedState(button: HTMLElement): boolean {
    const ariaPressed: string | null = button.getAttribute('aria-pressed');
    const isPressed: boolean = ariaPressed !== null ? ariaPressed === 'true' : false;
    return isPressed;
}

export class AccessibleToggleButtonViewModel extends AccessibleButtonViewModel {
    constructor(
        public readonly selectors: ButtonElementSelectorSet,
        public readonly labelViewModel: AccessibleElementLabelViewModel,
        public readonly isToggled: boolean = false,
    ) {
        super(selectors, labelViewModel, AccessibleButtonType.TOGGLE_BUTTON);
    }

    public static createDefault(): AccessibleToggleButtonViewModel {
        const selectors: ButtonElementSelectorSet = ButtonElementSelectorSet.createDefault();
        const labelViewModel: AccessibleElementLabelViewModel = AccessibleElementLabelViewModel.createDefault();
        const isToggled: boolean = false;
        const instance: AccessibleToggleButtonViewModel = new AccessibleToggleButtonViewModel(
            selectors,
            labelViewModel,
            isToggled,
        );
        return instance;
    }
}

/**
 * Applies attributes and interactivity behaviors in accordance with the W3C WAI Button Pattern using the
 * toggle button subtype.
 * Refer to the W3C WAI Button Pattern documentation https://www.w3.org/WAI/ARIA/apg/patterns/button/.
 * 
 * @param buttonElement DOM Element root for the accessible button.
 * @param viewModel Toggle button view model.
 * @returns Returns buttonElement.
 */
export function makeAccessibleToggleButton(
    buttonElement: HTMLElement,
    viewModel: AccessibleToggleButtonViewModel = AccessibleToggleButtonViewModel.createDefault(),
): HTMLElement {
    const { isToggled } = viewModel;
    makeAccessibleButton(buttonElement, viewModel);
    buttonElement.setAttribute('aria-pressed', isToggled ? 'true' : 'false');
    buttonElement.addEventListener('click', (e: MouseEvent) => {
        const target: HTMLElement = (e.target as HTMLElement);
        const toggledState: boolean = evaluatePressedState(target);
        if (toggledState) {
            target.setAttribute('aria-pressed', 'false');
        } else {
            target.setAttribute('aria-pressed', 'true');
        }
    });
    return buttonElement;
}
