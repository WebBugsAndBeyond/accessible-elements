import {
    AccessibleElementLabelViewModel,
    AnyKindOfFunction,
    applyDescribedBy,
    filterOutNulls,
    interceptClick,
    queryChildren,
    selectElementOrDefault,
} from './utils';
import { DispatchFocusInvoker, FocusInvoker, OpenCloseListener, trapElementKeyboardFocus, TrappedKeyboardFocusKeyPressInitializer } from './utils/keyboard-focus-trap';

export class ModalDialogElementSelectors {

    constructor(
        public readonly dialogElementSelector: string,
        public readonly dialogOpenElementSelector: string,
        public readonly dialogCloseElementSelector: string,
        public readonly describedBySelector: string,
        public readonly focusableElementsSelectors: string[],
    ) {
        
    }
}

export class ModalDialogViewModel {

    public static readonly DIALOG_ROLE_NAME: string = 'dialog';

    constructor(
        public readonly labelViewModel: AccessibleElementLabelViewModel,
        public readonly selectors: ModalDialogElementSelectors,
        public readonly onOpenCallback: AnyKindOfFunction,
        public readonly onCloseCallback: AnyKindOfFunction,
        public readonly focusInvoker: FocusInvoker = new DispatchFocusInvoker(),
        public readonly openCloseOnce: boolean = false,
        public readonly initiallyFocusedElementIndex: number = 0,
    ) {
        
    }
}

export function makeAccessibleModalDialog(
    dialogElement: Element,
    viewModel: ModalDialogViewModel,
): Element {
    const { 
        selectors,
        labelViewModel,
        onCloseCallback,
        openCloseOnce,
        initiallyFocusedElementIndex,
        focusInvoker,
    } = viewModel;
    const { 
        dialogElementSelector,
        dialogOpenElementSelector,
        dialogCloseElementSelector,
        focusableElementsSelectors,
        describedBySelector,
    } = selectors;
    const dialogContainer: Element | null = selectElementOrDefault(dialogElement, dialogElementSelector);
    if (dialogContainer !== null) {
        const focusableElements: Element[] = filterOutNulls(queryChildren(dialogContainer, focusableElementsSelectors)) as Element[];
        if (focusableElements.length !== focusableElementsSelectors.length) {
            throw new Error('Dialog controls are not decendents of dialog role element.');
        }
        dialogContainer.setAttribute('role', ModalDialogViewModel.DIALOG_ROLE_NAME);
        dialogContainer.setAttribute('aria-modal', 'true');
        AccessibleElementLabelViewModel.applyAccessibleLabel(dialogElement, labelViewModel);
        applyDescribedBy(dialogElement, describedBySelector);
    }
    
    return dialogElement;
}
