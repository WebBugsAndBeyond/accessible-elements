import { AccessibleElementDescriptionViewModel, AccessibleElementLabelViewModel } from "../base/types";
import { selectElementOrDefault } from "../utils/dom";
import { AccessibleAlertDialogViewModel } from "./types";

/**
 * Applies accessibility attributes that satisfy the requirements defined by the W3C WAI
 * Alert Dialog Box Pattern. Refer to the W3C documentation: https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/examples/alertdialog/.
 * 
 * @param dialogElement DOM element serves as the root node for the dialog box elements.
 * @param selectors DOM selector strings for querying the root element for dialog box elements.
 * @returns Returns dialogElement.
 * @throws {ReferenceError} A ReferenceError is thrown if the provided selectors do not identify existing elements.
 * @see {https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/examples/alertdialog/}
 */
export function makeAccessibleAlertDialog(
    dialogElement: Element,
    viewModel: AccessibleAlertDialogViewModel = AccessibleAlertDialogViewModel.createDefault(),
): Element {
    const { selectors, labelViewModel, isModal, descriptionViewModel } = viewModel;
    const rootElement: Element = selectElementOrDefault(dialogElement, selectors.queryRoot);
    const componentElement: Element = selectElementOrDefault(rootElement, selectors.accessibleElement);
    
    AccessibleElementLabelViewModel.applyAccessibleLabel(componentElement, labelViewModel);
    AccessibleElementDescriptionViewModel.applyDescribedBy(componentElement, descriptionViewModel);
    componentElement.setAttribute('role', AccessibleAlertDialogViewModel.DIALOG_ROLE_NAME);
    componentElement.setAttribute('aria-modal', `${isModal}`);
    return dialogElement;
}
