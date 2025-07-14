import { AccessibleElementLabelViewModel } from "../base/types";
import { selectElementOrDefault } from "../utils/dom";
import { AccessibleBreadcrumbsViewModel } from "./types";

/**
 * Applies ARIA to a DOM Element in accordance with the Breadcrumbs pattern defined at
 * https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/
 * @param breadcrumbsElement Breadcrumbs component root DOM Element.
 * @param viewModel Breadcrumbs component accessibility options.
 * @returns Returns the component decorated with appropriate ARIA.
 * @see {https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/}
 */
export function makeAccessibleBreadcrumbs(
    breadcrumbsElement: Element,
    viewModel: AccessibleBreadcrumbsViewModel = AccessibleBreadcrumbsViewModel.createDefault(),
): Element {
    const {
        selectors,
        isLinkCurrentPage,
        labelViewModel,
    } = viewModel;
    const navigationElement: Element | null = selectElementOrDefault(breadcrumbsElement, selectors.navigationSelector);
    const anchorElements: NodeList = breadcrumbsElement.querySelectorAll(selectors.anchorSelector);

    AccessibleElementLabelViewModel.applyAccessibleLabel(navigationElement as Element, labelViewModel);

    if (anchorElements.length > 0) {
        const currentPageAnchorElement: Node | undefined = Array.from(anchorElements).find(node => (
            isLinkCurrentPage((node as Element).getAttribute('href') as string)
        ));
        if(currentPageAnchorElement) {
            (currentPageAnchorElement as Element).setAttribute('aria-current', 'page');
        }
    }

    return breadcrumbsElement;
}
