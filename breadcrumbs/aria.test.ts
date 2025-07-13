import { AccessibleElementDescriptionViewModel, AccessibleElementLabelViewModel } from "../base/types";
import { createElementID } from "../utils/dom";
import { makeAccessibleBreadcrumbs } from "./aria";
import { AccessibleBreadcrumbsViewModel, BreadcrumbsElementSelectorSet } from "./types";

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
        const viewModel: AccessibleBreadcrumbsViewModel = new AccessibleBreadcrumbsViewModel(
            AccessibleBreadcrumbsViewModel.DEFAULT_CURRENT_PAGE_DETERMINATION,
            BreadcrumbsElementSelectorSet.createDefault(),
            labelViewModel,
            AccessibleElementDescriptionViewModel.createDefault(),
        );
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
            AccessibleBreadcrumbsViewModel.DEFAULT_CURRENT_PAGE_DETERMINATION,
            BreadcrumbsElementSelectorSet.createDefault(),
            new AccessibleElementLabelViewModel(
                createElementID(
                    AccessibleBreadcrumbsViewModel.LABEL_ID_PREFIX,
                    AccessibleBreadcrumbsViewModel.LABEL_ID_SUFFIX,
                ),
            ),
            AccessibleElementDescriptionViewModel.createDefault(),
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
            isLinkCurrentPage,
            BreadcrumbsElementSelectorSet.createDefault(),
            new AccessibleElementLabelViewModel(),
            AccessibleElementDescriptionViewModel.createDefault(),
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
