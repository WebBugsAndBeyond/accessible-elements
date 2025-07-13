import { AccessibleElementLabelViewModel } from "../base/types";
import { AccessibleBreadcrumbsViewModel, BreadcrumbsElementSelectorSet } from "./types";

describe('BreadcrumbsElementSelectorSet', () => {
    it('defines a default navigation selector string.', () => {
        expect(BreadcrumbsElementSelectorSet.DEFAULT_NAVIGATION_SELECTOR).toBeDefined();
        expect(typeof BreadcrumbsElementSelectorSet.DEFAULT_NAVIGATION_SELECTOR).toEqual('string');
        expect(BreadcrumbsElementSelectorSet.DEFAULT_NAVIGATION_SELECTOR.trim()).not.toEqual('');
    });
    it('defines a default anchor selector string.', () => {
        expect(BreadcrumbsElementSelectorSet.DEFAULT_ANCHOR_SELECTOR).toBeDefined();
        expect(typeof BreadcrumbsElementSelectorSet.DEFAULT_ANCHOR_SELECTOR).toEqual('string');
        expect(BreadcrumbsElementSelectorSet.DEFAULT_ANCHOR_SELECTOR.trim()).not.toEqual('');
    });
    it('defines a navigation selector property upon instantiation.', () => {
        const instance: BreadcrumbsElementSelectorSet = new BreadcrumbsElementSelectorSet(
            BreadcrumbsElementSelectorSet.DEFAULT_NAVIGATION_SELECTOR,
            BreadcrumbsElementSelectorSet.DEFAULT_ANCHOR_SELECTOR,
        );
        expect(instance.navigationSelector).toEqual(BreadcrumbsElementSelectorSet.DEFAULT_NAVIGATION_SELECTOR);
    });
    it('defines an anchor selector property upon instantiation.', () => {
        const instance: BreadcrumbsElementSelectorSet = new BreadcrumbsElementSelectorSet(
            BreadcrumbsElementSelectorSet.DEFAULT_NAVIGATION_SELECTOR,
            BreadcrumbsElementSelectorSet.DEFAULT_ANCHOR_SELECTOR,
        );
        expect(instance.anchorSelector).toEqual(BreadcrumbsElementSelectorSet.DEFAULT_ANCHOR_SELECTOR);
    });
    it('returns an instance with the defualt navigation, and anchor selectors from createDefault.', () => {
        const instance: BreadcrumbsElementSelectorSet = BreadcrumbsElementSelectorSet.createDefault();
        expect(instance.navigationSelector).toEqual(BreadcrumbsElementSelectorSet.DEFAULT_NAVIGATION_SELECTOR);
        expect(instance.anchorSelector).toEqual(BreadcrumbsElementSelectorSet.DEFAULT_ANCHOR_SELECTOR);
    });
});

describe('AccessibleBreadcrumbsViewModel class', () => {
    it('defines a default label id prefix string.', () => {
        expect(AccessibleBreadcrumbsViewModel.LABEL_ID_PREFIX).toBeDefined();
        expect(typeof AccessibleBreadcrumbsViewModel.LABEL_ID_PREFIX).toEqual('string');
        expect(AccessibleBreadcrumbsViewModel.LABEL_ID_PREFIX.trim()).not.toEqual('');
    });
    it('defines a default labe id suffix string.', () => {
        expect(AccessibleBreadcrumbsViewModel.LABEL_ID_SUFFIX).toBeDefined();
        expect(typeof AccessibleBreadcrumbsViewModel.LABEL_ID_SUFFIX).toEqual('string');
        expect(AccessibleBreadcrumbsViewModel.LABEL_ID_SUFFIX).not.toEqual('');
    });
    it('defines a default breadcrumbs label string.', () => {
        expect(AccessibleBreadcrumbsViewModel.DEFAULT_LABEL).toBeDefined();
        expect(typeof AccessibleBreadcrumbsViewModel.DEFAULT_LABEL).toEqual('string');
        expect(AccessibleBreadcrumbsViewModel.DEFAULT_LABEL.trim()).not.toEqual('');
    });
    it('defines a default current page determination function.', () => {
        expect(AccessibleBreadcrumbsViewModel.DEFAULT_CURRENT_PAGE_DETERMINATION).toBeDefined();
        expect(typeof AccessibleBreadcrumbsViewModel).toEqual('function');
    });
    it('defines a selectors property upon instantiation.', () => {
        const instance: AccessibleBreadcrumbsViewModel = AccessibleBreadcrumbsViewModel.createDefault();
        expect(instance.selectors).toBeDefined();
        expect(instance.selectors).not.toBeNull();
        expect(instance.selectors instanceof BreadcrumbsElementSelectorSet).toEqual(true);
    });
    it('defines a breadcrumbs label view model upon instantiation.', () => {
        const instance: AccessibleBreadcrumbsViewModel = AccessibleBreadcrumbsViewModel.createDefault();
        expect(instance.labelViewModel).toBeDefined();
        expect(instance.labelViewModel).not.toBeNull();
        expect(instance.labelViewModel instanceof AccessibleElementLabelViewModel).toEqual(true);
    });
    it('defines an is current page getter property upon instantiation.', () => {
        const instance: AccessibleBreadcrumbsViewModel = AccessibleBreadcrumbsViewModel.createDefault();
        expect(instance.isLinkCurrentPage).toBeDefined();
        expect(instance.isLinkCurrentPage).not.toBeNull();
        expect(typeof instance.isLinkCurrentPage).toEqual('function');
    });
    it('creates an instance with default values.', () => {
        const instance: AccessibleBreadcrumbsViewModel = AccessibleBreadcrumbsViewModel.createDefault();
        expect(instance).toBeDefined();
        expect(instance).not.toBeNull();
        expect(instance instanceof AccessibleBreadcrumbsViewModel).toEqual(true);
    });
});
