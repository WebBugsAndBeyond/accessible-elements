import { AccessibleElementLabelSelectorPreference, AccessibleElementLabelViewModel, AccessibleElementSelectors } from "../base/types";
import { AccessibleAlertDialogViewModel } from "./types";

describe('AccessibleAlertDialogViewModel class', () => {
    const mockSelectors: AccessibleElementSelectors = AccessibleElementSelectors.createDefault();
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
            true,
            mockSelectors,
            mockLabelViewModel,
        );
        expect(mockDialogViewModel.selectors).toBeDefined();
        expect(mockDialogViewModel.selectors instanceof AccessibleElementSelectors).toEqual(true);

    });
    it('initializes a label view model property upon construction.', () => {
        const mockLabelViewModel: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel(
            mockLabelId,
            mockLabelText,
            mockLabelElementSelector,
            mockPreference,
        );
        const mockDialogViewModel: AccessibleAlertDialogViewModel = new AccessibleAlertDialogViewModel(
            true,
            mockSelectors,
            mockLabelViewModel,
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
            isModal,
            mockSelectors,
            mockLabelViewModel,
        );
        expect(mockDialogViewModel.isModal).toEqual(isModal);
    });
    it('initiates an instance with default values with its static createDefault factory function.', () => {
        const instance: AccessibleAlertDialogViewModel = AccessibleAlertDialogViewModel.createDefault();
        expect(instance.selectors).toBeDefined();
        expect(instance.selectors).toBeInstanceOf(AccessibleElementSelectors);
        expect(instance.isModal).toBeDefined();
        expect(typeof instance.isModal).toEqual('boolean');
        expect(instance.labelViewModel).toBeDefined();
        expect(instance.labelViewModel).toBeInstanceOf(AccessibleElementLabelViewModel);
    });
});
