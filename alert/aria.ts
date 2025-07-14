/**
 * Applies accessibility attributes in accordance with the W3C WAI Alert Pattern.
 * Refer to the W3C documentation https://www.w3.org/WAI/ARIA/apg/patterns/alert/.
 * 
 * @param alertElement 
 * @returns Returns alertElement
 */
export function makeAccessibleAlert(alertElement: Element): Element {
    alertElement.setAttribute('role', 'alert');
    return alertElement;
}
