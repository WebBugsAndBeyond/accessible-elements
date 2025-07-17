import { AccessibleElementDescriptionViewModel, AccessibleElementLabelViewModel, AccessibleElementSelectors } from "../base/types";
import { makeAccessibleButton } from "./aria";
import { AccessibleButtonType, AccessibleButtonViewModel } from "./types";

describe('makeAccessibleButton', () => {

    let testButtonElement: Element | null = null;
    let testViewModel: AccessibleButtonViewModel | null = null;
    beforeEach(() => {
        testButtonElement = document.createElement('button');
        testViewModel = AccessibleButtonViewModel.createDefault();
    });
    afterEach(() => {
        testButtonElement = null;
        testViewModel = null;
    });
    it('has button role.', () => {
        const element: Element = testButtonElement as Element;
        const viewModel: AccessibleButtonViewModel = testViewModel as AccessibleButtonViewModel;
        const output: Element = makeAccessibleButton(element, viewModel);
        expect(output.hasAttribute('role')).toEqual(true);
        expect(output.getAttribute('role')).toEqual(AccessibleButtonViewModel.BUTTON_ROLE);
    });
    it('has aria-disabled=true for a disabled button.', () => {
        const element: Element = testButtonElement as Element;
        const viewModel: AccessibleButtonViewModel = testViewModel as AccessibleButtonViewModel;

        element.setAttribute('disabled', '');
        const output: Element = makeAccessibleButton(element, viewModel);
        expect(output.hasAttribute('aria-disabled')).toEqual(true);
        expect(output.getAttribute('aria-disabled')).toEqual('true');
    });
    it('does not have aria-disabled for an enabled button.', () => {
        const element: Element = testButtonElement as Element;
        const viewModel: AccessibleButtonViewModel = testViewModel as AccessibleButtonViewModel;

        element.setAttribute('aria-disabled', 'false');
        const output: Element = makeAccessibleButton(element, viewModel);
        expect(output.hasAttribute('aria-disabled')).toEqual(false);
    });
    it('correctly selects the configured queryRoot.', () => {
        const element: Element = testButtonElement as Element;
        const wrapperElement: Element = document.createElement('div');
        const rootElement: Element = document.createElement('div');
        rootElement.appendChild(element);
        wrapperElement.appendChild(rootElement);
        const selectors: AccessibleElementSelectors = new AccessibleElementSelectors(
            ':scope > div',
            ':scope > button',
        );
        const viewModel: AccessibleButtonViewModel = new AccessibleButtonViewModel(
            AccessibleButtonType.PUSH_BUTTON,
            selectors,
            AccessibleElementLabelViewModel.createDefault(),
            AccessibleElementDescriptionViewModel.createDefault(),
        );
        makeAccessibleButton(wrapperElement, viewModel);
        expect(element.getAttribute('role')).toEqual(AccessibleButtonViewModel.BUTTON_ROLE);
    });
    it('uses a default view model.', () => {
        const output: Element = makeAccessibleButton(testButtonElement as Element);
        expect(output.getAttribute('role')).toEqual(AccessibleButtonViewModel.BUTTON_ROLE);
    })
});
