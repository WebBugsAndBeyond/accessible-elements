import {
    AccessibleElementDescriptionViewModel,
    AccessibleElementLabelSelectorPreference,
    AccessibleElementLabelViewModel,
    AccessibleElementSelectors,
} from "../base/types";
import { makeAccessibleAlertDialog } from "./aria";
import { AccessibleAlertDialogViewModel } from "./types";

describe('makeAccessibleAlertDialog function', () => {
    const mockSelectors: AccessibleElementSelectors = new AccessibleElementSelectors('', '');
    const mockDescriptionViewModel: AccessibleElementDescriptionViewModel = new AccessibleElementDescriptionViewModel(
        '#description-id',
        '',
    );
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
            isModal,
            mockSelectors,
            mockLabelViewModel,
            mockDescriptionViewModel,
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
            isModal,
            mockSelectors,
            mockLabelViewModel,
            mockDescriptionViewModel,
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
            isModal,
            mockSelectors,
            mockLabelViewModel,
            mockDescriptionViewModel,
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
            isModal,
            mockSelectors,
            mockLabelViewModel,
            mockDescriptionViewModel,
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
            isModal,
            mockSelectors,
            mockLabelViewModel,
            mockDescriptionViewModel,
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
            isModal,
            mockSelectors,
            mockLabelViewModel,
            mockDescriptionViewModel,
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
