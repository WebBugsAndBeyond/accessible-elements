import {
    ButtonElementSelectorSet,
    AccessibleButtonType,
    AccessibleButtonViewModel,
    makeAccessibleButton,
    evaluatePressedState,
    AccessibleToggleButtonViewModel,
    makeAccessibleToggleButton,
} from './button';
import { AccessibleElementLabelViewModel } from './utils';

describe('The ButtonElementSelectorSet class', () => {
    it('defines a default button selector string.', () => {
        expect(ButtonElementSelectorSet.DEFAULT_BUTTON_SELECTOR).toBeDefined();
        expect(typeof ButtonElementSelectorSet.DEFAULT_BUTTON_SELECTOR).toEqual('string');
    });
    it('defines a default description element selector string.', () => {
        expect(ButtonElementSelectorSet.DEFAULT_DESCRIPTION_SELECTOR).toBeDefined();
        expect(typeof ButtonElementSelectorSet.DEFAULT_DESCRIPTION_SELECTOR).toEqual('string');
    });
    it('creates an instance with default values.', () => {
        const instance: ButtonElementSelectorSet = ButtonElementSelectorSet.createDefault();
        expect(instance.buttonSelector).toEqual(ButtonElementSelectorSet.DEFAULT_BUTTON_SELECTOR);
        expect(instance.descriptionSelector).toEqual(ButtonElementSelectorSet.DEFAULT_DESCRIPTION_SELECTOR);
    });
});

describe('The AccessibleButtonViewModel class', () => {
    it('defines a selctors property upon instantiation.', () => {
        const instance: AccessibleButtonViewModel = new AccessibleButtonViewModel(
            ButtonElementSelectorSet.createDefault(),
            AccessibleElementLabelViewModel.createDefault(),
        );
        expect(instance.selectors).toBeDefined();
        expect(instance.selectors).toBeInstanceOf(ButtonElementSelectorSet);
    });
    it('defines a labelViewModel property upon instantiation.', () => {
        const instance: AccessibleButtonViewModel = new AccessibleButtonViewModel(
            ButtonElementSelectorSet.createDefault(),
            AccessibleElementLabelViewModel.createDefault(),
        );
        expect(instance.labelViewModel).toBeDefined();
        expect(instance.labelViewModel).toBeInstanceOf(AccessibleElementLabelViewModel);
    });
    it('defines a buttonType property upon instantiation.', () => {
        const instance: AccessibleButtonViewModel = new AccessibleButtonViewModel(
            ButtonElementSelectorSet.createDefault(),
            AccessibleElementLabelViewModel.createDefault(),
        );
        expect(instance.buttonType).toBeDefined();
    });
});

describe('The makeAccessibleButton function', () => {
    it('correctly applies the button role.', () => {
        const buttonElement: Element = makeAccessibleButton(document.createElement('button'));
        expect(buttonElement.getAttribute('role')).toEqual('button');
    });
    it('correctly applies the aria-disabled attribute.', () => {
        const buttonElement: Element = document.createElement('button');
        buttonElement.setAttribute('disabled', '');
        makeAccessibleButton(buttonElement);
        expect(buttonElement.getAttribute('aria-disabled')).toEqual('true');
    });
    it('correctly removes the aria-disabled attribute.', () => {
        const buttonElement: Element = document.createElement('button');
        buttonElement.setAttribute('aria-disabled', 'true');
        makeAccessibleButton(buttonElement);
        expect(buttonElement.hasAttribute('aria-disabled')).toEqual(false);
    });
    it('correctly applies the aria-label attribute.', () => {
        const labelViewModel: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel(
            '', 
            'label text'
        );
        const viewModel: AccessibleButtonViewModel = new AccessibleButtonViewModel(
            ButtonElementSelectorSet.createDefault(),
            labelViewModel
        );
        const buttonElement: Element = makeAccessibleButton(document.createElement('button'), viewModel);
        expect(buttonElement.getAttribute('aria-label')).toEqual('label text');
    });
    it('correctly applies the aria-labelledby attribute.', () => {
        const divElement: Element = document.createElement('div');
        const buttonElement: Element = document.createElement('button');
        const labelElement: Element = document.createElement('label');
        const labelId: string = 'label-id';
        labelElement.textContent = 'label text';
        labelElement.setAttribute('id', labelId);
        divElement.append(buttonElement, labelElement);
        const labelViewModel: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel(
            labelId,
        );
        const selectors: ButtonElementSelectorSet = new ButtonElementSelectorSet(
            ':scope > button',
        );
        const viewModel: AccessibleButtonViewModel = new AccessibleButtonViewModel(
            selectors,
            labelViewModel,
        );
        makeAccessibleButton(divElement, viewModel);
        expect(buttonElement.getAttribute('aria-labelledby')).toEqual(labelId);
    });
    it('correctly applies the aria-describedby attribute.', () => {
        const divElement: Element = document.createElement('div');
        const buttonElement: Element = document.createElement('button');
        const descriptionElement: Element = document.createElement('div');
        const descriptionId: string = 'description-id';
        descriptionElement.setAttribute('id', descriptionId);
        descriptionElement.textContent = 'description';
        divElement.append(buttonElement, descriptionElement);
        
        const viewModel: AccessibleButtonViewModel = new AccessibleButtonViewModel(
            new ButtonElementSelectorSet(':scope > button', `:scope > div#${descriptionId}`),
            AccessibleElementLabelViewModel.createDefault(),
        );
        makeAccessibleButton(divElement, viewModel);
        expect(buttonElement.getAttribute('aria-describedby')).toEqual(descriptionId);
    });
});

describe('The evaluatePressedState function', () => {
    it('returns true for a pressed state.', () => {
        const buttonElement: HTMLElement = document.createElement('button');
        buttonElement.setAttribute('aria-pressed', 'true');
        const isPressed: boolean = evaluatePressedState(buttonElement);
        expect(isPressed).toEqual(true);
    });
    it('returns false for a not-pressed state.', () => {
        const buttonElement: HTMLElement = document.createElement('button');
        buttonElement.setAttribute('aria-pressed', 'false');
        let isPressed: boolean = evaluatePressedState(buttonElement);
        expect(isPressed).toEqual(false);
        buttonElement.removeAttribute('aria-pressed');
        isPressed = evaluatePressedState(buttonElement);
        expect(isPressed).toEqual(false);
    });
});

describe('the AccessibleToggleButtonViewModel class', () => {
    it('defines a selectors property upon instantiation.', () => {
        const selectors: ButtonElementSelectorSet = ButtonElementSelectorSet.createDefault();
        const labelViewModel: AccessibleElementLabelViewModel = AccessibleElementLabelViewModel.createDefault();
        const instance: AccessibleToggleButtonViewModel = new AccessibleToggleButtonViewModel(
            selectors,
            labelViewModel
        );
        expect(instance.selectors).toBeDefined();
        expect(instance.selectors).toBe(selectors);
    });
    it('defines a labelViewModel property upon instantiation.', () => {
        const selectors: ButtonElementSelectorSet = ButtonElementSelectorSet.createDefault();
        const labelViewModel: AccessibleElementLabelViewModel = AccessibleElementLabelViewModel.createDefault();
        const instance: AccessibleToggleButtonViewModel = new AccessibleToggleButtonViewModel(
            selectors,
            labelViewModel,
        );
        expect(instance.labelViewModel).toBeDefined();
        expect(instance.labelViewModel).toBe(labelViewModel);
    });
    it('defines an isToggle property upon instantiation.', () => {
        const selectors: ButtonElementSelectorSet = ButtonElementSelectorSet.createDefault();
        const labelViewModel: AccessibleElementLabelViewModel = AccessibleElementLabelViewModel.createDefault();
        const isToggled: boolean = true;
        const instance: AccessibleToggleButtonViewModel = new AccessibleToggleButtonViewModel(
            selectors,
            labelViewModel,
            isToggled,
        );
        expect(instance.isToggled).toBeDefined();
        expect(instance.isToggled).toEqual(isToggled);
    });
    it('defines a buttonType property with the TOGGLE_BUTTON value upon instantiation.', () => {
        const selectors: ButtonElementSelectorSet = ButtonElementSelectorSet.createDefault();
        const labelViewModel: AccessibleElementLabelViewModel = AccessibleElementLabelViewModel.createDefault();
        const instance: AccessibleToggleButtonViewModel = new AccessibleToggleButtonViewModel(
            selectors,
            labelViewModel,
        );
        expect(instance.buttonType).toBeDefined();
        expect(instance.buttonType).toEqual(AccessibleButtonType.TOGGLE_BUTTON);
    });
    it('creates an instance with default values.', () => {
        const instance: AccessibleToggleButtonViewModel = AccessibleToggleButtonViewModel.createDefault();
        expect(instance.selectors).toBeDefined();
        expect(instance.labelViewModel).toBeDefined();
        expect(instance.isToggled).toBeDefined();
        expect(instance.buttonType).toBeDefined();
    });
});

describe('The makeAccessibleToggleButton function', () => {
    it('applies the aria-pressed attribute based upon the view model.', () => {
        const selectors: ButtonElementSelectorSet = ButtonElementSelectorSet.createDefault();
        const lablelViewModel: AccessibleElementLabelViewModel = AccessibleElementLabelViewModel.createDefault();
        let isToggled: boolean = true;
        let viewModel: AccessibleToggleButtonViewModel = new AccessibleToggleButtonViewModel(
            selectors,
            lablelViewModel,
            isToggled,
        );
        let button: HTMLElement = document.createElement('button');
        makeAccessibleToggleButton(button, viewModel);
        expect(button.getAttribute('aria-pressed')).toEqual('true');
        isToggled = false;
        viewModel = new AccessibleToggleButtonViewModel(
            selectors,
            lablelViewModel,
            isToggled,
        );
        button = makeAccessibleToggleButton(button, viewModel);
        expect(button.getAttribute('aria-pressed')).toEqual('false');
    });
    it('toggles pressed state when clicked.', () => {
        const selectors: ButtonElementSelectorSet = ButtonElementSelectorSet.createDefault();
        const lablelViewModel: AccessibleElementLabelViewModel = AccessibleElementLabelViewModel.createDefault();
        const isToggled: boolean = true;
        const viewModel: AccessibleToggleButtonViewModel = new AccessibleToggleButtonViewModel(
            selectors,
            lablelViewModel,
            isToggled,
        );
        const button: HTMLElement = document.createElement('button');
        makeAccessibleToggleButton(button, viewModel);
        expect(button.getAttribute('aria-pressed')).toEqual('true');
        button.click();
        expect(button.getAttribute('aria-pressed')).toEqual('false');
        button.click();
        expect(button.getAttribute('aria-pressed')).toEqual('true');
    });
    it('correctly utilizes the default view model when omitted from the argument list.', () => {
        const buttonElement: HTMLElement = document.createElement('button');
        makeAccessibleToggleButton(buttonElement);
        expect(buttonElement.getAttribute('aria-pressed')).toEqual('false');
    });
});
