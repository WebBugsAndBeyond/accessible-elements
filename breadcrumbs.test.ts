import { AccessibleBreadcrumbsViewModel, BreadcrumbsElementSelectorSet, makeAccessibleBreadcrumbs } from './breadcrumbs';
import { AccessibleElementLabelViewModel, createElementID } from './utils';

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

describe('makeAccessibleBreadcrumbs function', () => {
    const anchorElementsSpec: string[] = [
        'https://fake.com/page/1/',
        'https://fake.com/page/2',
    ];
    const createElement: () => Element = () => {
        const navigationElement: Element = document.createElement('nav');
        const labelElement: Element = document.createElement('h3');
        const listElement: Element = document.createElement('ul');
        const anchorListElements: Element[] = anchorElementsSpec.map((linkUrl: string) => {
            const listItemElement: Element = document.createElement('li');
            const anchorElement: Element = document.createElement('a');
            anchorElement.setAttribute('href', linkUrl);
            listItemElement.append(anchorElement);
            return listItemElement;
        });
        listElement.append(...anchorListElements);
        navigationElement.append(labelElement);
        navigationElement.append(listElement);
        return navigationElement;
    };
    it('applies the aria-label attribute when specified.', () => {
        const labelText: string = 'fake label text';
        const labelViewModel: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel(
            '',
            labelText,
        );
        const viewModel: AccessibleBreadcrumbsViewModel = new AccessibleBreadcrumbsViewModel(BreadcrumbsElementSelectorSet.createDefault(), labelViewModel);
        const element: Element = makeAccessibleBreadcrumbs(createElement(), viewModel);
        expect(element.getAttribute('aria-label')).toEqual(labelText);
    });
    it('applies a default aria-label attribute when not specifiec.', () => {
        const viewModel: AccessibleBreadcrumbsViewModel = AccessibleBreadcrumbsViewModel.createDefault();
        const element: Element = makeAccessibleBreadcrumbs(createElement(), viewModel);
        expect(element.getAttribute('aria-label')).toEqual(AccessibleBreadcrumbsViewModel.DEFAULT_LABEL);        
    });
    it('applies the aria-labelledby attribute.', () => {
        const viewModel: AccessibleBreadcrumbsViewModel = new AccessibleBreadcrumbsViewModel(
            BreadcrumbsElementSelectorSet.createDefault(),
            new AccessibleElementLabelViewModel(
                createElementID(
                    AccessibleBreadcrumbsViewModel.LABEL_ID_PREFIX,
                    AccessibleBreadcrumbsViewModel.LABEL_ID_SUFFIX,
                ),
            ),
        );
        const element: Element = createElement();
        element.querySelector('h3')?.setAttribute?.('id', viewModel.labelViewModel.labelId as string);
        makeAccessibleBreadcrumbs(
            element,
            viewModel,
        );
        expect(element.getAttribute('aria-labelledby')).toEqual(viewModel.labelViewModel.labelId);
    });
    it('applies the aria-current attribute to the correct anchor element.', () => {
        const isLinkCurrentPage = (linkUrl: string) => linkUrl === anchorElementsSpec[0];
        const viewModel: AccessibleBreadcrumbsViewModel = new AccessibleBreadcrumbsViewModel(
            BreadcrumbsElementSelectorSet.createDefault(),
            new AccessibleElementLabelViewModel(),
            isLinkCurrentPage,
        );
        const element: Element = makeAccessibleBreadcrumbs(createElement(), viewModel);
        const anchorSelector: string = ':scope ul a:nth-of-type(1)';
        const anchorElement: Element | null = element.querySelector(anchorSelector);
        expect(anchorElement).not.toBeNull();
        expect(anchorElement?.getAttribute('aria-current')).toEqual('page');
    });
    it('uses a default view model.', () => {
        const breadcrumbsElement: Element = createElement();
        const madeAccessibleBreadcrumbs: Element = makeAccessibleBreadcrumbs(breadcrumbsElement);
        expect(madeAccessibleBreadcrumbs).toBe(breadcrumbsElement);
    });
});
