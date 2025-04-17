import { AccessibleAlertDialogViewModel, AlertDialogElementSelectorSet, makeAccessibleAlertDialog } from './alert-dialog';
import { AccessibleElementLabelViewModel, AccessibleElementLabelSelectorPreference } from './utils';

describe('AlertDialogElementSelectorSet class', () => {
    it('defines a default label selector string.', () => {
        expect(AlertDialogElementSelectorSet.DEFAULT_LABEL_SELECTOR).toBeTruthy();
        expect(AlertDialogElementSelectorSet.DEFAULT_LABEL_SELECTOR).not.toEqual('');
        expect(typeof AlertDialogElementSelectorSet.DEFAULT_LABEL_SELECTOR).toEqual('string');
    });
    it('defines a default description selector string.', () => {
        expect(AlertDialogElementSelectorSet.DEFAULT_DESCRIPTION_SELECTOR).toBeTruthy();
        expect(AlertDialogElementSelectorSet.DEFAULT_DESCRIPTION_SELECTOR).not.toEqual('');
        expect(typeof AlertDialogElementSelectorSet.DEFAULT_DESCRIPTION_SELECTOR).toEqual('string');
    });
    it('initializes a label selector property upon construction.', () => {
        const mockLabelSelector: string = ':scope > div';
        const mockDescriptionSelector: string = ':scope > section';
        const instance: AlertDialogElementSelectorSet = new AlertDialogElementSelectorSet(
            mockLabelSelector,
            mockDescriptionSelector,
        );
        expect(instance.labelSelector).toEqual(mockLabelSelector);
    });
    it('initializes a description selector property upon construction.', () => {
        const mockLabelSelector: string = ':scope > div';
        const mockDescriptionSelector: string = ':scope > section';
        const instance: AlertDialogElementSelectorSet = new AlertDialogElementSelectorSet(
            mockLabelSelector,
            mockDescriptionSelector,
        );
        expect(instance.descriptionSelector).toEqual(mockDescriptionSelector);
    });
    it('returns an instance with default properties via the static createDefault function.', () => {
        const instance: AlertDialogElementSelectorSet = AlertDialogElementSelectorSet.createDefault();
        expect(instance.labelSelector).toEqual(AlertDialogElementSelectorSet.DEFAULT_LABEL_SELECTOR);
        expect(instance.descriptionSelector).toEqual(AlertDialogElementSelectorSet.DEFAULT_DESCRIPTION_SELECTOR);
    });
});

describe('AccessibleAlertDialogViewModel class', () => {
    const mockSelectors: AlertDialogElementSelectorSet = AlertDialogElementSelectorSet.createDefault();
    const mockLabelId: string = 'label-id';
    const mockLabelText: string = 'label text';
    const mockLabelElementSelector: string = ':scope > label';
    const mockPreference: AccessibleElementLabelSelectorPreference = AccessibleElementLabelSelectorPreference.LABEL_ID;
    
    it('defines a role name static class property.', () => {
        expect(AccessibleAlertDialogViewModel.DIALOG_ROLE_NAME).toBeTruthy();
        expect(AccessibleAlertDialogViewModel.DIALOG_ROLE_NAME).not.toEqual('');
        expect(typeof AccessibleAlertDialogViewModel.DIALOG_ROLE_NAME).toEqual('string');
    });
    it('initializes a selector set property upon construction.', () => {
        const mockLabelViewModel: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel(
            mockLabelId,
            mockLabelText,
            mockLabelElementSelector,
            mockPreference,
        );
        const mockDialogViewModel: AccessibleAlertDialogViewModel = new AccessibleAlertDialogViewModel(
            mockSelectors,
            mockLabelViewModel,
            true,
        );
        expect(mockDialogViewModel.selectors).toBeDefined();
        expect(mockDialogViewModel.selectors instanceof AlertDialogElementSelectorSet).toEqual(true);

    });
    it('initializes a label view model property upon construction.', () => {
        const mockLabelViewModel: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel(
            mockLabelId,
            mockLabelText,
            mockLabelElementSelector,
            mockPreference,
        );
        const mockDialogViewModel: AccessibleAlertDialogViewModel = new AccessibleAlertDialogViewModel(
            mockSelectors,
            mockLabelViewModel,
            true,
        );
        expect(mockDialogViewModel.labelViewModel).toBeDefined();
        expect(mockDialogViewModel.labelViewModel instanceof AccessibleElementLabelViewModel).toEqual(true);
    });
    it('initializes a boolean property indicating modal state upon construction.', () => {
        const mockLabelViewModel: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel(
            mockLabelId,
            mockLabelText,
            mockLabelElementSelector,
            mockPreference,
        );
        const isModal: boolean = true;
        const mockDialogViewModel: AccessibleAlertDialogViewModel = new AccessibleAlertDialogViewModel(
            mockSelectors,
            mockLabelViewModel,
            isModal,
        );
        expect(mockDialogViewModel.isModal).toEqual(isModal);
    });
    it('initiates an instance with default values with its static createDefault factory function.', () => {
        const instance: AccessibleAlertDialogViewModel = AccessibleAlertDialogViewModel.createDefault();
        expect(instance.selectors).toBeDefined();
        expect(instance.selectors).toBeInstanceOf(AlertDialogElementSelectorSet);
        expect(instance.isModal).toBeDefined();
        expect(typeof instance.isModal).toEqual('boolean');
        expect(instance.labelViewModel).toBeDefined();
        expect(instance.labelViewModel).toBeInstanceOf(AccessibleElementLabelViewModel);
    });
});

describe('makeAccessibleAlertDialog function', () => {
    const mockSelectors: AlertDialogElementSelectorSet = AlertDialogElementSelectorSet.createDefault();
    const mockLabelId: string = 'label-id';
    const mockLabelText: string = 'label text';
    const mockLabelElementSelector: string = ':scope > div:nth-of-type(1)';
    const mockDescriptionId: string = 'description-id';

    const createElement: () => Element = () => {
        const rootElement: Element = document.createElement('div');
        const labelElement: Element = document.createElement('div');
        const descriptionElement: Element = document.createElement('div');
        labelElement.setAttribute('id', mockLabelId);
        descriptionElement.setAttribute('id', mockDescriptionId);
        rootElement.append(labelElement, descriptionElement);
        return rootElement;
    };

    it('applies an aria-label attribute when defined via the view model.', () => {
        const mockLabelViewModel: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel(
            mockLabelId,
            mockLabelText,
            mockLabelElementSelector,
            AccessibleElementLabelSelectorPreference.LABEL_TEXT,
        );
        const isModal: boolean = true;
        const mockDialogViewModel: AccessibleAlertDialogViewModel = new AccessibleAlertDialogViewModel(
            mockSelectors,
            mockLabelViewModel,
            isModal,
        );
        const alertDialogElement: Element = makeAccessibleAlertDialog(
            createElement(),
            mockDialogViewModel,
        );
        expect(alertDialogElement.getAttribute('aria-label')).toEqual(mockLabelViewModel.labelText);

    });
    it('applies an aria-labelledby attribute when defined via the view model.', () => {
        const mockLabelViewModel: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel(
            mockLabelId,
            mockLabelText,
            mockLabelElementSelector,
            AccessibleElementLabelSelectorPreference.LABEL_ID,
        );
        const isModal: boolean = true;
        const mockDialogViewModel: AccessibleAlertDialogViewModel = new AccessibleAlertDialogViewModel(
            mockSelectors,
            mockLabelViewModel,
            isModal,
        );
        const alertDialogElement: Element = makeAccessibleAlertDialog(
            createElement(),
            mockDialogViewModel,
        );
        expect(alertDialogElement.getAttribute('aria-labelledby')).toEqual(mockLabelViewModel.labelId);
    });
    it('applies an aria-labelledby attribute via a selectable element when defined via the view model.', () => {
        const mockLabelViewModel: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel(
            mockLabelId,
            mockLabelText,
            mockLabelElementSelector,
            AccessibleElementLabelSelectorPreference.LABEL_ELEMENT_SELECTOR,
        );
        const isModal: boolean = true;
        const mockDialogViewModel: AccessibleAlertDialogViewModel = new AccessibleAlertDialogViewModel(
            mockSelectors,
            mockLabelViewModel,
            isModal,
        );
        const alertDialogElement: Element = makeAccessibleAlertDialog(
            createElement(),
            mockDialogViewModel,
        );
        expect(alertDialogElement.getAttribute('aria-labelledby')).toEqual(mockLabelViewModel.labelId);
    });
    it('applies an aria-describedby attribute via a selectable element when defined via the view model.', () => {
        const mockLabelViewModel: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel(
            mockLabelId,
            mockLabelText,
            mockLabelElementSelector,
            AccessibleElementLabelSelectorPreference.LABEL_ID,
        );
        const isModal: boolean = true;
        const mockDialogViewModel: AccessibleAlertDialogViewModel = new AccessibleAlertDialogViewModel(
            mockSelectors,
            mockLabelViewModel,
            isModal,
        );
        const alertDialogElement: Element = makeAccessibleAlertDialog(
            createElement(),
            mockDialogViewModel,
        );
        expect(alertDialogElement.getAttribute('aria-describedby')).toEqual(mockDescriptionId);
    });
    it('applies the role attribute.', () => {
        const mockLabelViewModel: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel(
            mockLabelId,
            mockLabelText,
            mockLabelElementSelector,
            AccessibleElementLabelSelectorPreference.LABEL_ID,
        );
        const isModal: boolean = true;
        const mockDialogViewModel: AccessibleAlertDialogViewModel = new AccessibleAlertDialogViewModel(
            mockSelectors,
            mockLabelViewModel,
            isModal,
        );
        const alertDialogElement: Element = makeAccessibleAlertDialog(
            createElement(),
            mockDialogViewModel,
        );
        expect(alertDialogElement.getAttribute('role')).toEqual(AccessibleAlertDialogViewModel.DIALOG_ROLE_NAME);
    });
    it('applies the aria-modal attribute.', () => {
        const mockLabelViewModel: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel(
            mockLabelId,
            mockLabelText,
            mockLabelElementSelector,
            AccessibleElementLabelSelectorPreference.LABEL_ID,
        );
        const isModal: boolean = true;
        const mockDialogViewModel: AccessibleAlertDialogViewModel = new AccessibleAlertDialogViewModel(
            mockSelectors,
            mockLabelViewModel,
            isModal,
        );
        const alertDialogElement: Element = makeAccessibleAlertDialog(
            createElement(),
            mockDialogViewModel,
        );
        expect(alertDialogElement.getAttribute('aria-modal')).toEqual('true');
    });
    it('uses a default view model.', () => {
        const alertElement: Element = createElement();
        const madeAccessibleAlert: Element = makeAccessibleAlertDialog(alertElement);
        expect(madeAccessibleAlert.getAttribute('role')).toEqual(AccessibleAlertDialogViewModel.DIALOG_ROLE_NAME);
    });
});
