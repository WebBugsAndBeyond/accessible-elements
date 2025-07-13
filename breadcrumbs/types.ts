import { 
    AccessibleElementDescriptionViewModel,
    AccessibleElementLabelSelectorPreference,
    AccessibleElementLabelViewModel,
    AccessibleElementSelectors,
    AccessibleElementViewModel,
} from "../base/types";
import { windowLocationIncludesUrl } from "../utils/dom";

export class BreadcrumbsElementSelectorSet extends AccessibleElementSelectors {

    /**
     * Default navigation selector string expects a <nav> element which is
     * a landmark element by default.
     * @value ":scope > nav"
     * @constant
     */
    public static readonly DEFAULT_NAVIGATION_SELECTOR = ':scope > nav';

    /**
     * Default navigation anchor NodeList selector string expects a collection of
     * <a> elements directo or indirect children of <li> elements.
     * @value ":scope li a"
     * @constant
     */
    public static readonly DEFAULT_ANCHOR_SELECTOR = ':scope li a';
    
    constructor(

        /**
         * Query selector string for the <nav> element within the component.
         * Defines the labeled landmark element to apply aria-label, or aria-labelledby.
         * @see {BreadcrumbsElementSelectorSet#DEFAULT_NAVIGATION_SELECTOR}
         */
        public readonly navigationSelector: string,

        /**
         * Query selector string for the anchor elements.
         * Used to determine which requires `aria-current`.
         * @see {BreadcrumbsElementSelectorSet#DEFAULT_ANCHOR_SELECTOR}
         */
        public readonly anchorSelector: string,

        /**
         * @see {AccessibleElementSelectors#constructor}
         */
        protected readonly queryRootSelector: string = AccessibleElementSelectors.DEFAULT_QUERY_ROOT_SELECTOR,

        /**
         * @see {AccessibleElementSelectors#constructor}
         */
        protected readonly accessibleElementSelector: string = AccessibleElementSelectors.DEFAULT_ACCESSIBLE_ELEMENT_SELECTOR,
    ) {
        super(queryRootSelector, accessibleElementSelector);
    }
    
    public static createDefault(): BreadcrumbsElementSelectorSet {
        return new BreadcrumbsElementSelectorSet(
            this.DEFAULT_NAVIGATION_SELECTOR,
            this.DEFAULT_ANCHOR_SELECTOR,
        );
    }
}


export class AccessibleBreadcrumbsViewModel extends AccessibleElementViewModel<BreadcrumbsElementSelectorSet> {

    public static readonly LABEL_ID_PREFIX: string = 'breadcrumb-';
    public static readonly LABEL_ID_SUFFIX: string = '-landmark';
    public static readonly DEFAULT_LABEL: string = 'Breadcrumb';
    public static readonly DEFAULT_CURRENT_PAGE_DETERMINATION: (linkUrl: string) => boolean = windowLocationIncludesUrl;

    constructor(
        public readonly isLinkCurrentPage: (linkUrl: string) => boolean,
        public selectors: BreadcrumbsElementSelectorSet,
        public labelViewModel: AccessibleElementLabelViewModel,
        public descriptionViewModel: AccessibleElementDescriptionViewModel,
    ) {
        super(selectors, labelViewModel, descriptionViewModel);
    }

    public static createDefault(): AccessibleBreadcrumbsViewModel {
        const instance: AccessibleBreadcrumbsViewModel = new AccessibleBreadcrumbsViewModel(
            AccessibleBreadcrumbsViewModel.DEFAULT_CURRENT_PAGE_DETERMINATION,
            BreadcrumbsElementSelectorSet.createDefault(),
            new AccessibleElementLabelViewModel(
                undefined,
                this.DEFAULT_LABEL,
                undefined,
                AccessibleElementLabelSelectorPreference.LABEL_TEXT,
            ),
            AccessibleElementDescriptionViewModel.createDefault(),
        );
        return instance;
    }
}
