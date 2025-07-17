import {
    AccessibleElementDescriptionViewModel,
    AccessibleElementLabelViewModel,
    AccessibleElementSelectors,
    AccessibleElementViewModel,
} from "../base/types";

export enum AccessibleButtonType {
    PUSH_BUTTON,
    TOGGLE_BUTTON,
    MENU_BUTTON,
}

export class AccessibleButtonViewModel extends AccessibleElementViewModel<AccessibleElementSelectors> {

    public static readonly DEFAULT_BUTTON_TYPE: AccessibleButtonType = AccessibleButtonType.PUSH_BUTTON;
    public static readonly BUTTON_ROLE: string = 'button';

    public constructor(
        public readonly buttonType: AccessibleButtonType,
        selectors: AccessibleElementSelectors,
        labelViewModel: AccessibleElementLabelViewModel,
        descriptionViewModel: AccessibleElementDescriptionViewModel,
    ) {
        super(selectors, labelViewModel, descriptionViewModel);
    }

    public static createDefault(): AccessibleButtonViewModel {
        return new AccessibleButtonViewModel(
            this.DEFAULT_BUTTON_TYPE,
            AccessibleElementSelectors.createDefault(),
            AccessibleElementLabelViewModel.createDefault(),
            AccessibleElementDescriptionViewModel.createDefault(),
        );
    }
}
