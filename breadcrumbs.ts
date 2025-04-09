import {
    AccessibleElementLabelViewModel,
    createElementID,
    selectElementOrDefault,
    windowLocationIncludesUrl,
    AccessibleElementLabelSelectorPreference,
} from "./utils";

export class BreadcrumbsElementSelectorSet {

    public static readonly DEFAULT_NAVIGATION_SELECTOR = ':scope > nav';
    public static readonly DEFAULT_ANCHOR_SELECTOR = ':scope li a';
    
    constructor(
        public readonly navigationSelector: string,
        public readonly anchorSelector: string,
    ) {
        
    }
    
    public static createDefault(): BreadcrumbsElementSelectorSet {
        return new BreadcrumbsElementSelectorSet(
            this.DEFAULT_NAVIGATION_SELECTOR,
            this.DEFAULT_ANCHOR_SELECTOR,
        );
    }
}

export class AccessibleBreadcrumbsViewModel {

    public static readonly LABEL_ID_PREFIX: string = 'breadcrumb-';
    public static readonly LABEL_ID_SUFFIX: string = '-landmark';
    public static readonly DEFAULT_LABEL: string = 'Breadcrumb';
    public static readonly DEFAULT_CURRENT_PAGE_DETERMINATION: (linkUrl: string) => boolean = windowLocationIncludesUrl;

    constructor(
        public readonly selectors: BreadcrumbsElementSelectorSet,
        public readonly labelViewModel: AccessibleElementLabelViewModel,
        public readonly isLinkCurrentPage: (linkUrl: string) => boolean = AccessibleBreadcrumbsViewModel.DEFAULT_CURRENT_PAGE_DETERMINATION,
    ) {
        
    }

    public static createDefault(): AccessibleBreadcrumbsViewModel {
        return new AccessibleBreadcrumbsViewModel(
            BreadcrumbsElementSelectorSet.createDefault(),
            new AccessibleElementLabelViewModel(
                undefined,
                this.DEFAULT_LABEL,
                undefined,
                AccessibleElementLabelSelectorPreference.LABEL_TEXT,
            ),
            this.DEFAULT_CURRENT_PAGE_DETERMINATION,
        );
    }
}

export function makeAccessibleBreadcrumbs(
    breadcrumbsElement: Element,
    viewModel: AccessibleBreadcrumbsViewModel = AccessibleBreadcrumbsViewModel.createDefault(),
): Element {
    const {
        selectors,
        isLinkCurrentPage,
        labelViewModel,
    } = viewModel;
    const navigationElementSelector: string = selectors.navigationSelector !== '' ? selectors.navigationSelector : '';
    const navigationElement: Element | null = selectElementOrDefault(breadcrumbsElement, navigationElementSelector);
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
