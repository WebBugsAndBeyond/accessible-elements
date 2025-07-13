import {
    AccessibleElementDescriptionViewModel,
    AccessibleElementLabelViewModel,
    AccessibleElementSelectors,
    AccessibleElementViewModel,
} from "../base/types";

/**
 * View model for accessible alert dialog components.
 * @see {https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/}
 */
export class AccessibleAlertDialogViewModel extends AccessibleElementViewModel<AccessibleElementSelectors> {

    /**
     * The value for the ARIA role of an alert dialog.
     * @value "alertdialog"
     */
    public static readonly DIALOG_ROLE_NAME = 'alertdialog';

    /**
     * @param isModal 
     * @param selectors 
     * @param labelViewModel 
     * @param descriptionViewModel 
     * @see {AccessibleElementViewModel#constructor}
     */
    public constructor(


        /**
         * Whether or not the dialog is a modal dialog.
         * @default true
         */
        public readonly isModal: boolean = true,

        /**
         * @see {AccessibleElementViewModel#constructor}
         * @see {AccessibleElementViewModel#selectors}
         */
        public readonly selectors: AccessibleElementSelectors = AccessibleElementSelectors.createDefault(),

        /**
         * @see {AccessibleElementViewModel#constructor}
         * @see {AccessibleElememntViewModel#labelViewModel}
         */
        public labelViewModel: AccessibleElementLabelViewModel = AccessibleElementLabelViewModel.createDefault(),

        /**
         * @see {AccessibleElementViewModel#constructor}
         * @see {AccessibleElementViewModel#descriptionViewModel}
         */
        public descriptionViewModel: AccessibleElementDescriptionViewModel = AccessibleElementDescriptionViewModel.createDefault(),
    ) {
       super(selectors, labelViewModel, descriptionViewModel); 
    }

    /**
     * Return a new instance with default property values.
     * @returns Instance reference with default property values.
     */
    public static createDefault(): AccessibleAlertDialogViewModel {
        return new AccessibleAlertDialogViewModel();
    }
}
