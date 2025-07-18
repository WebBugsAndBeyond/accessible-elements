import { AccessibleElementDescriptionViewModel } from './base/types';
import { AccessibleElementLabelViewModel, AccessibleElementViewModel, applyDescribedBy } from './utils';

export class AlertDialogElementSelectorSet {

    public static readonly DEFAULT_LABEL_SELECTOR = ':scope > *:nth-child(1)';
    public static readonly DEFAULT_DESCRIPTION_SELECTOR = ':scope > *:nth-child(2)';
    constructor(
        public readonly labelSelector: string,
        public readonly descriptionSelector: string,
    ) {
        
    }

    /**
     * Create an instance of AlertDialogElementSelectorSet with values for labelSelector,
     * and descriptionSelector set to the corresponding static properties.
     * 
     * @returns 
     * @see {AlertDialogElementSelectorSet#DEFAULT_LABEL_SELECTOR}
     * @see {AlertDialogElementSelectorSet#DEFAULT_DESCRIPTION_SELECTOR}
     */
    public static createDefault(): AlertDialogElementSelectorSet {
        const labelSelector: string = AlertDialogElementSelectorSet.DEFAULT_LABEL_SELECTOR;
        const descriptionSelector: string = AlertDialogElementSelectorSet.DEFAULT_DESCRIPTION_SELECTOR;
        return new AlertDialogElementSelectorSet(
            labelSelector,
            descriptionSelector,
        );
    }
}

export class AccessibleAlertDialogViewModel extends AccessibleElementViewModel<AlertDialogElementSelectorSet> {

    public static readonly DIALOG_ROLE_NAME = 'alertdialog';

    public constructor(
        public readonly selectors: AlertDialogElementSelectorSet = AlertDialogElementSelectorSet.createDefault(),
        public readonly labelViewModel: AccessibleElementLabelViewModel = AccessibleElementLabelViewModel.createDefault(),
        public readonly isModal: boolean = true,
    ) {
       super(selectors, labelViewModel); 
    }

    public static createDefault(): AccessibleAlertDialogViewModel {
        return new AccessibleAlertDialogViewModel();
    }
}

/**
 * Applies accessibility attributes that satisfy the requirements defined by the W3C WAI
 * Alert Dialog Box Pattern. Refer to the W3C documentation: https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/examples/alertdialog/.
 * 
 * @param dialogElement DOM element serves as the root node for the dialog box elements.
 * @param selectors DOM selector strings for querying the root element for dialog box elements.
 * @returns Returns dialogElement.
 * @throws {ReferenceError} A ReferenceError is thrown if the provided selectors do not identify existing elements.
 */
export function makeAccessibleAlertDialog(
    dialogElement: Element,
    viewModel: AccessibleAlertDialogViewModel = AccessibleAlertDialogViewModel.createDefault(),
): Element {
    const { selectors, labelViewModel, isModal } = viewModel;
    AccessibleElementLabelViewModel.applyAccessibleLabel(dialogElement, labelViewModel);
    applyDescribedBy(dialogElement, selectors.descriptionSelector);
    dialogElement.setAttribute('role', AccessibleAlertDialogViewModel.DIALOG_ROLE_NAME);
    dialogElement.setAttribute('aria-modal', `${isModal}`);
    return dialogElement;
}
