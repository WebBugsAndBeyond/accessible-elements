import { makeAccessibleModalDialog, ModalDialogElementSelectors, ModalDialogViewModel } from "./modal-dialog";
import { AccessibleElementLabelViewModel, AnyKindOfFunction } from "./utils";
import { DispatchFocusInvoker, FocusInvoker } from "./utils/keyboard-focus-trap";

const DIALOG_SELECTOR: string = '';
const OPEN_CLASSNAME: string = 'open';
const CLOSE_CLASSNAME: string = 'close';
const OPEN_SELECTOR: string = `.${OPEN_CLASSNAME}`;
const CLOSE_SELECTOR: string = `.${CLOSE_CLASSNAME}`;
const FOCUSABLE_SELECTORS: string[] = [':scope button:nth-of-type(1)', ':scope button:nth-of-type(2)'];
const DIALOG_TITLE_TEXT: string = 'Dialog Title Text';
const BUTTONS_TEXT: string [] = ['First', 'Middle', 'Last'];
const LABEL_ID: string = 'label-id';
const DESCRIPTION_ID: string = 'description-id';
const DESCRIPTION_SELECTOR: string = ':scope > p';

function createSelectors(): ModalDialogElementSelectors {
    const instance: ModalDialogElementSelectors = new ModalDialogElementSelectors(
        DIALOG_SELECTOR,
        OPEN_SELECTOR,
        CLOSE_SELECTOR,
        DESCRIPTION_SELECTOR,
        FOCUSABLE_SELECTORS,
    );
    return instance;
}

function createViewModel(): ModalDialogViewModel {
    const labelViewModel: AccessibleElementLabelViewModel = AccessibleElementLabelViewModel.createDefault();
    const selectors: ModalDialogElementSelectors = createSelectors();
    const onOpenCallback: AnyKindOfFunction = () => {};
    const onCloseCallback: AnyKindOfFunction = () => {};
    const focusInvoker: FocusInvoker = new DispatchFocusInvoker();
    const openCloseOnce: boolean = false;
    const initiallyFocusedElementIndex: number = 0;
    return new ModalDialogViewModel(
        labelViewModel,
        selectors,
        onOpenCallback,
        onCloseCallback,
        focusInvoker,
        openCloseOnce,
        initiallyFocusedElementIndex,
    );
}

function createButton(text: string): HTMLElement {
    const buttonElement: HTMLElement = document.createElement('button');
    buttonElement.textContent = text;
    return buttonElement;
}

function createButtons(buttonsText: string[] = BUTTONS_TEXT): HTMLElement[] {
    const buttons: HTMLElement[] = buttonsText.map(createButton);
    return buttons;
}

function createOpenCloseButtons(): Element {
    const wrapper: Element = document.createElement('div');
    const openButton: Element = document.createElement('button');
    openButton.textContent = 'Open Dialog';
    openButton.setAttribute('class', OPEN_CLASSNAME);

    const closeButton: Element = document.createElement('button');
    closeButton.textContent = 'Close Dialog';
    closeButton.setAttribute('class', CLOSE_CLASSNAME);
    wrapper.append(openButton, closeButton);
    return wrapper;
}

function createDialogTitleElement(titleText: string, id: string = LABEL_ID): Element {
    const headerElement: Element = document.createElement('h2');
    headerElement.textContent = titleText;
    headerElement.setAttribute('id', id);
    return headerElement;
}

function createDescription(descriptionText: string = 'description', id: string = DESCRIPTION_ID): Element {
    const element: Element = document.createElement('p');
    element.textContent = descriptionText;
    element.setAttribute('id', id);
    return element;
}

function createDialogElement(buttons: HTMLElement[], titleText: string = DIALOG_TITLE_TEXT): Element {
    const dialogElement: Element = document.createElement('dialog');
    const titleElement: Element = createDialogTitleElement(titleText);
    const description: Element = createDescription();
    const openCloseButtons: Element = createOpenCloseButtons();
    dialogElement.append(titleElement, description, ...buttons, openCloseButtons);
    
    return dialogElement;
}

describe('The ModalDialogElementSelectors class', () => {
    it('defines a dialogElementSelector property', () => {
        const instance: ModalDialogElementSelectors = createSelectors();
        expect(instance.dialogElementSelector).toBeDefined();
        expect(typeof instance.dialogElementSelector).toEqual('string');
        expect(instance.dialogElementSelector).toEqual(DIALOG_SELECTOR);
    });
    it('defines a dialogOpenElementSelector property.', () => {
        const instance: ModalDialogElementSelectors = createSelectors();
        expect(instance.dialogOpenElementSelector).toBeDefined();
        expect(typeof instance.dialogOpenElementSelector).toEqual('string');
        expect(instance.dialogOpenElementSelector).toEqual(OPEN_SELECTOR);
    });
    it('defines a dialgoCloseElementSelector property.', () => {
        const instance: ModalDialogElementSelectors = createSelectors();
        expect(instance.dialogCloseElementSelector).toBeDefined();
        expect(typeof instance.dialogCloseElementSelector).toEqual('string');
        expect(instance.dialogCloseElementSelector).toEqual(CLOSE_SELECTOR);
    });
    it('defines a describedBySelector property.', () => {
        const instance: ModalDialogElementSelectors = createSelectors();
        expect(instance.describedBySelector).toBeDefined();
        expect(typeof instance.describedBySelector).toEqual('string');
        expect(instance.describedBySelector).toEqual(DESCRIPTION_SELECTOR);
    });
    it('defines a focusableElementsSelectors property.', () => {
        const instance: ModalDialogElementSelectors = createSelectors();
        expect(instance.focusableElementsSelectors).toBeDefined();
        expect(Array.isArray(instance.focusableElementsSelectors)).toEqual(true);
        expect(instance.focusableElementsSelectors.every((selector: string) => FOCUSABLE_SELECTORS.includes(selector))).toEqual(true);
        expect(FOCUSABLE_SELECTORS.every((selector: string) => instance.focusableElementsSelectors.includes(selector))).toEqual(true);
    });
});

describe('The ModalDialogViewModel class', () => {

    it('defines a labelViewModel property.', () => {
        const instance: ModalDialogViewModel = createViewModel();
        expect(instance.labelViewModel).toBeDefined();
        expect(instance.labelViewModel).toBeInstanceOf(AccessibleElementLabelViewModel);
    });
    it('defines a selectors property.', () => {
        const instance: ModalDialogViewModel = createViewModel();
        expect(instance.selectors).toBeDefined();
        expect(instance.selectors).toBeInstanceOf(ModalDialogElementSelectors);
    });
    it('defines an onOpenCallback property.', () => {
        const instance: ModalDialogViewModel = createViewModel();
        expect(instance.onOpenCallback).toBeDefined();
        expect(typeof instance.onOpenCallback).toEqual('function');
    });
    it('defines an onCloseCallback function.', () => {
        const instance: ModalDialogViewModel = createViewModel();
        expect(instance.onCloseCallback).toBeDefined();
        expect(typeof instance.onCloseCallback).toEqual('function');
    });
    it('defines a focusInvoker property.', () => {
        const instance: ModalDialogViewModel = createViewModel();
        expect(instance.focusInvoker).toBeDefined();
        expect(instance.focusInvoker).toBeInstanceOf(FocusInvoker);
    });
    it('defines an openCloseOnce property.', () => {
        const instance: ModalDialogViewModel = createViewModel();
        expect(instance.openCloseOnce).toBeDefined();
        expect(typeof instance.openCloseOnce).toEqual('boolean');
    });
    it('defines an initiallyFocusedElementIndex property.', () => {
        const instance: ModalDialogViewModel = createViewModel();
        expect(instance.initiallyFocusedElementIndex).toBeDefined();
        expect(typeof instance.initiallyFocusedElementIndex).toEqual('number');
    });
});

describe('the makeAccessibleModalDialog function', () => {
    it('applies the dialog role to the dialog container element.', () => {
        const buttons: HTMLElement[] = createButtons();
        const dialog: Element = createDialogElement(buttons);
        const viewModel: ModalDialogViewModel = createViewModel();
        const madeAccessibleDialog: Element = makeAccessibleModalDialog(dialog, viewModel);
        expect(madeAccessibleDialog.getAttribute('role')).toEqual(ModalDialogViewModel.DIALOG_ROLE_NAME);
    });
    it('determines that all dialog controls are DOM decendants of the element with the dialog role.', () => {
        const buttons: HTMLElement[] = createButtons();
        const openCloseButtons: Element = createOpenCloseButtons();
        const titleElement: Element = createDialogTitleElement(DIALOG_TITLE_TEXT);
        const malformedDialogElement: Element = document.createElement('dialog');
        const malformedDialogWrapper: Element = document.createElement('div');

        malformedDialogElement.append(titleElement);

        malformedDialogWrapper.append(openCloseButtons);
        malformedDialogWrapper.append(...buttons);
        malformedDialogWrapper.append(malformedDialogElement);
        const dialogContainerSelector: string = ':scope > dialog';
        
        const focusableElementsSelectors: string[] = [
            ':scope > button:nth-of-type(1)',
            ':scope > button:nth-of-type(2)',
            ':scope > button:nth-of-type(3)',
        ];
        const selectors: ModalDialogElementSelectors = new ModalDialogElementSelectors(
            dialogContainerSelector,
            OPEN_SELECTOR,
            CLOSE_SELECTOR,
            DESCRIPTION_SELECTOR,
            focusableElementsSelectors,
        );
        const viewModel: ModalDialogViewModel = new ModalDialogViewModel(
            AccessibleElementLabelViewModel.createDefault(),
            selectors,
            () => {},
            () => {},
        );
        expect(() => makeAccessibleModalDialog(malformedDialogWrapper, viewModel)).toThrow();

        const wellFormedDialogElement: Element = createDialogElement(buttons);
        const wellFormedViewModel: ModalDialogViewModel = createViewModel();
        expect(() => makeAccessibleModalDialog(wellFormedDialogElement, wellFormedViewModel)).not.toThrow();
    });
    it('applies the aria-modal attribute equal to true on the dialog element.', () => {
        const buttons: HTMLElement[] = createButtons();
        const dialog: Element = createDialogElement(buttons);
        const viewModel: ModalDialogViewModel = createViewModel();
        const madeAccessibleDialog: Element = makeAccessibleModalDialog(dialog, viewModel);
        expect(madeAccessibleDialog.getAttribute('aria-modal')).toEqual('true');
    });
    it('applies the aria-labelledby attribute with the id of the dialog title.', () => {
        const dialog: Element = createDialogElement(createButtons());
        const labelViewModel: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel(LABEL_ID);
        const viewModel: ModalDialogViewModel = new ModalDialogViewModel(
            labelViewModel,
            createSelectors(),
            () => {},
            () => {},
        );
        const madeAccessibleDialog: Element = makeAccessibleModalDialog(dialog, viewModel);
        expect(madeAccessibleDialog.getAttribute('aria-labelledby')).toEqual(LABEL_ID);
    });
    it('applies the aria-label attribute for dialogs without a title.', () => {
        const dialog: Element = createDialogElement(createButtons());
        const labelText: string = 'label text';
        const labelViewModel: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel(
            '',
            labelText,
        );
        const viewModel: ModalDialogViewModel = new ModalDialogViewModel(
            labelViewModel,
            createSelectors(),
            () => {},
            () => {},
        );
        const madeAccessibleDialog: Element = makeAccessibleModalDialog(dialog, viewModel);
        expect(madeAccessibleDialog.getAttribute('aria-label')).toEqual(labelText);
    });
    it('applies the aria-describedby attribute.', () => {
        const dialog: Element = createDialogElement(createButtons());
        const viewModel: ModalDialogViewModel = createViewModel();
        const madeAccessibleDialog: Element = makeAccessibleModalDialog(dialog, viewModel);
        expect(madeAccessibleDialog.getAttribute('aria-describedby')).toEqual(DESCRIPTION_ID);
    });
});

describe('the makeAccessibleSemanticContentModalDialog function', () => {
    test('focus is moved to a static element with tabindex -1 when opened.', () => {

    });
    test('the aria-describedby attribute is removed.', () => {

    });
    test('focus is moved to a static element with tabindex -1 when opened if content will be obscured.', () => {

    });
});
