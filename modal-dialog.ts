import {
    AccessibleElementLabelViewModel,
    AnyKindOfFunction,
    trapElementKeyboardFocus,
    TrappedKeyboardFocusKeyPressInitializer,
} from './utils';

export class ModalDialogElementSelectors {

    constructor(
        public readonly dialogOpenElementSelector: string,
        public readonly dialogCloseElementSelector: string,
        public readonly focusableElementsSelectors: string[] = [],
    ) {
        
    }
}

export class ModalDialogViewModel {

    constructor(
        public readonly labelViewModel: AccessibleElementLabelViewModel,
        public readonly selectors: ModalDialogElementSelectors,
        public readonly onOpenCallback: AnyKindOfFunction,
        public readonly onCloseCallback: AnyKindOfFunction,
    ) {
        
    }
}

export function makeAccessibleModalDialog(dialogElement: Element, viewModel: ModalDialogViewModel): Element {
    const { selectors, labelViewModel, onCloseCallback } = viewModel;
    const { dialogOpenElementSelector, dialogCloseElementSelector, focusableElementsSelectors } = selectors;
    const interceptClick: (elementSelector: string) => Promise<void> = (elementSelector: string) => (new Promise((resolve: AnyKindOfFunction) => {
        const element: HTMLElement = document.querySelector(elementSelector) as HTMLElement;
        if (element) {
            element.addEventListener('click', (e: MouseEvent) => {
                resolve();
            });
        }
    }));
    
    AccessibleElementLabelViewModel.applyAccessibleLabel(dialogElement, labelViewModel);
    const initializer: TrappedKeyboardFocusKeyPressInitializer = {
        focusableElementsSelectors,
        notifyCloseExternal: interceptClick(dialogCloseElementSelector),
        notifyOpenExternal: interceptClick(dialogOpenElementSelector),
        onEscapeDialogClose: onCloseCallback,
    };
    trapElementKeyboardFocus(dialogElement as HTMLElement, initializer);

    return dialogElement;
}
