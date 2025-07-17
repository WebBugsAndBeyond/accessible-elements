import { AccessibleElementDescriptionViewModel, AccessibleElementLabelViewModel } from "../base/types";
import { selectElementOrDefault } from "../utils/dom";
import { AccessibleButtonViewModel } from "./types";

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
    const { selectors, labelViewModel, descriptionViewModel } = viewModel;
    const rootElement: Element = selectElementOrDefault(buttonElement, selectors.queryRoot);
    const button: Element = selectElementOrDefault(rootElement, selectors.accessibleElement);

    button.setAttribute('role', 'button');
    if (button.hasAttribute('disabled')) {
        button.setAttribute('aria-disabled', 'true');
    } else if (button.hasAttribute('aria-disabled')) {
        button.removeAttribute('aria-disabled');
    }
    AccessibleElementLabelViewModel.applyAccessibleLabel(button, labelViewModel);
    AccessibleElementDescriptionViewModel.applyDescribedBy(button, descriptionViewModel);

    return buttonElement;
}
