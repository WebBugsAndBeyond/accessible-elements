import {
    CheckboxElementSelectorSet,
    TriStateCheckboxElementSelectorSet,
    AccessibleCheckboxViewModel,
    AccessibleCheckboxType,
    AccessibleTriStateCheckboxViewModel,
    isCheckboxChecked,
    isKeyboardEvent,
    createCheckedStateToggleHandler,
    createTriStateCheckboxToggleHandler,
    makeAccessibleSimpleCheckbox,
    makeAccessibleTriStateCheckbox,
} from './checkbox';
import { AccessibleElementLabelViewModel, AccessibleElementViewModel } from './utils';

describe('The CheckboxElementSelectorSet class', () => {
    it('defines a default checkbox selector string', () => {
        expect(CheckboxElementSelectorSet.DEFAULT_CHECKBOX_SELECTOR).toBeDefined();
        expect(typeof CheckboxElementSelectorSet.DEFAULT_CHECKBOX_SELECTOR).toEqual('string');
    });
    it('defines a default description selector string.', () => {
        expect(CheckboxElementSelectorSet.DEFAULT_DESCRIPTION_SELECTOR).toBeDefined();
        expect(typeof CheckboxElementSelectorSet.DEFAULT_DESCRIPTION_SELECTOR).toEqual('string');
    });
    it('defines a checkboxSelector property upon instantiation.', () => {
        const mockCheckboxSelector: string = ':scope > input[type="checkbox"]';
        const instance: CheckboxElementSelectorSet = new CheckboxElementSelectorSet(
            mockCheckboxSelector,
        );
        expect(instance.checkboxSelector).toBeDefined();
        expect(typeof instance.checkboxSelector).toEqual('string');
        expect(instance.checkboxSelector).toEqual(mockCheckboxSelector);
    });
    it('defines a descriptionSelector property upon instantiation.', () => {
        const mockDescriptionSelector: string = ':scope > p';
        const instance: CheckboxElementSelectorSet = new CheckboxElementSelectorSet(
            '',
            mockDescriptionSelector,
        );
        expect(instance.descriptionSelector).toBeDefined();
        expect(typeof instance.descriptionSelector).toEqual('string');
        expect(instance.descriptionSelector).toEqual(mockDescriptionSelector);
    });
    it('defines a checkboxSelector property with a default value of the class DEFAULT_CHECKBOX_SELECTOR constant.', () => {
        const instance: CheckboxElementSelectorSet = new CheckboxElementSelectorSet();
        expect(instance.checkboxSelector).toEqual(CheckboxElementSelectorSet.DEFAULT_CHECKBOX_SELECTOR);
    });
    it('defines a descriptionSelector property with a default value of the class DEFAULT_DESCRIPTION_SELECTOR constant.', () => {
        const instance: CheckboxElementSelectorSet = new CheckboxElementSelectorSet();
        expect(instance.descriptionSelector).toEqual(CheckboxElementSelectorSet.DEFAULT_DESCRIPTION_SELECTOR);
    });
    it('creates an instance with default values.', () => {
        const instance: CheckboxElementSelectorSet = CheckboxElementSelectorSet.createDefault();
        expect(instance.checkboxSelector).toEqual(CheckboxElementSelectorSet.DEFAULT_CHECKBOX_SELECTOR);
        expect(instance.descriptionSelector).toEqual(CheckboxElementSelectorSet.DEFAULT_DESCRIPTION_SELECTOR);
    });
});

describe('The TriStateCheckboxElementSelectorSet class', () => {
    it('defines a default group selector string.', () => {
        expect(TriStateCheckboxElementSelectorSet.DEFAULT_GROUP_SELECTOR).toBeDefined();
        expect(typeof TriStateCheckboxElementSelectorSet.DEFAULT_GROUP_SELECTOR).toEqual('string');
    });
    it('defines a default checkboxes selector string.', () => {
        expect(TriStateCheckboxElementSelectorSet.DEFAULT_CHECKBOXES_SELECTOR).toBeDefined();
        expect(typeof TriStateCheckboxElementSelectorSet.DEFAULT_CHECKBOXES_SELECTOR).toEqual('string');
    });
    it('defines a default description selector string.', () => {
        expect(TriStateCheckboxElementSelectorSet.DEFAULT_DESCRIPTION_SELECTOR).toBeDefined();
        expect(typeof TriStateCheckboxElementSelectorSet.DEFAULT_DESCRIPTION_SELECTOR).toEqual('string');
    });
    it('defines a groupSelector property upon instantiation.', () => {
        const mockGroupSelector: string = 'form > fieldset';
        const instance: TriStateCheckboxElementSelectorSet = new TriStateCheckboxElementSelectorSet(
            mockGroupSelector,
        );
        expect(instance.groupSelector).toBeDefined();
        expect(typeof instance.groupSelector).toEqual('string');
        expect(instance.groupSelector).toEqual(mockGroupSelector);
    });
    it('defines a checkboxesSelector property upon instantiation.', () => {
        const mockCheckboxesSelector: string = ':scope > form > fieldset > input[type="checkbox"';
        const instance: TriStateCheckboxElementSelectorSet = new TriStateCheckboxElementSelectorSet(
            '',
            mockCheckboxesSelector,
        );
        expect(instance.checkboxesSelector).toBeDefined();
        expect(typeof instance.checkboxesSelector).toEqual('string');
        expect(instance.checkboxesSelector).toEqual(mockCheckboxesSelector);
    });
    it('defines a descriptionSelector property upon instantiation.', () => {
        const mockDescriptionSelector: string = ':scope > form > fieldset > legend';
        const instance: TriStateCheckboxElementSelectorSet = new TriStateCheckboxElementSelectorSet(
            '',
            '',
            mockDescriptionSelector,
        );
        expect(instance.descriptionSelector).toBeDefined();
        expect(typeof instance.descriptionSelector).toEqual('string');
        expect(instance.descriptionSelector).toEqual(mockDescriptionSelector);
    });
    it('defines a groupSelector property with a default value of the class DEFAULT_GROUP_SELECTOR constant upon instantiation.', () => {
        const instance: TriStateCheckboxElementSelectorSet = new TriStateCheckboxElementSelectorSet();
        expect(instance.groupSelector).toBeDefined();
        expect(typeof instance.groupSelector).toEqual('string');
        expect(instance.groupSelector).toEqual(TriStateCheckboxElementSelectorSet.DEFAULT_GROUP_SELECTOR);
    });
    it('defines a checkboxesSelector property with a default value of the class DEFAULT_CHECKBOXES_SELECTOR constant upon instantiation.', () => {
        const instance: TriStateCheckboxElementSelectorSet = new TriStateCheckboxElementSelectorSet();
        expect(instance.checkboxesSelector).toBeDefined();
        expect(typeof instance.checkboxesSelector).toEqual('string');
        expect(instance.checkboxesSelector).toEqual(TriStateCheckboxElementSelectorSet.DEFAULT_CHECKBOXES_SELECTOR);
    });
    it('defines a descriptionSelector property with a default value of the class DEFAULT_DESCRIPTION_SELECTOR constant upon instantiation.', () => {
        const instance: TriStateCheckboxElementSelectorSet = new TriStateCheckboxElementSelectorSet();
        expect(instance.descriptionSelector).toBeDefined();
        expect(typeof instance.descriptionSelector).toEqual('string');
        expect(instance.descriptionSelector).toEqual(TriStateCheckboxElementSelectorSet.DEFAULT_DESCRIPTION_SELECTOR);
    });
    it('creates an instance with default values from its class createDefault factory function.', () => {
        const instance: TriStateCheckboxElementSelectorSet = TriStateCheckboxElementSelectorSet.createDefault();
        expect(instance.groupSelector).toBeDefined();
        expect(typeof instance.groupSelector).toEqual('string');
        expect(instance.groupSelector).toEqual(TriStateCheckboxElementSelectorSet.DEFAULT_GROUP_SELECTOR);
        expect(instance.checkboxesSelector).toBeDefined();
        expect(typeof instance.checkboxesSelector).toEqual('string');
        expect(instance.checkboxesSelector).toEqual(TriStateCheckboxElementSelectorSet.DEFAULT_CHECKBOXES_SELECTOR);
        expect(instance.descriptionSelector).toBeDefined();
        expect(typeof instance.descriptionSelector).toEqual('string');
        expect(instance.descriptionSelector).toEqual(TriStateCheckboxElementSelectorSet.DEFAULT_DESCRIPTION_SELECTOR);
    });
});

describe('The AccessibleCheckboxViewModel class', () => {
    it('defines a string constant for the checkbox role name.', () => {
        expect(AccessibleCheckboxViewModel.CHECKBOX_ROLE).toBeDefined();
        expect(typeof AccessibleCheckboxViewModel.CHECKBOX_ROLE).toEqual('string');
        expect(AccessibleCheckboxViewModel.CHECKBOX_ROLE).toEqual('checkbox');
    });
    it('defines a selectors CheckboxElementSelectorSet property upon instantiation.', () => {
        const mockSelectors: CheckboxElementSelectorSet = CheckboxElementSelectorSet.createDefault();
        const instance: AccessibleCheckboxViewModel = new AccessibleCheckboxViewModel(
            mockSelectors,
        );
        expect(instance.selectors).toBeDefined();
        expect(instance.selectors).toBeInstanceOf(CheckboxElementSelectorSet);
        expect(instance.selectors).toBe(mockSelectors);
    });
    it('defines a labelViewModel AccessibleElementLabelViewModel property upon instantiation.', () => {
        const mockLabelViewModel: AccessibleElementLabelViewModel = AccessibleElementLabelViewModel.createDefault();
        const instance: AccessibleCheckboxViewModel = new AccessibleCheckboxViewModel(
            CheckboxElementSelectorSet.createDefault(),
            mockLabelViewModel,
        );
        expect(instance.labelViewModel).toBeDefined();
        expect(instance.labelViewModel).toBeInstanceOf(AccessibleElementLabelViewModel);
        expect(instance.labelViewModel).toBe(mockLabelViewModel);
    });
    it('defines a checkboxType AccessibleCheckboxType property upon instantiation.', () => {
        const mockCheckboxType: AccessibleCheckboxType = AccessibleCheckboxType.DUAL_STATE;
        const instance: AccessibleCheckboxViewModel = new AccessibleCheckboxViewModel(
            CheckboxElementSelectorSet.createDefault(),
            AccessibleElementLabelViewModel.createDefault(),
            mockCheckboxType,
        );
        expect(instance.checkboxType).toBeDefined();
        expect(instance.checkboxType).toEqual(mockCheckboxType);
    });
    it('extends the AccessibleElementViewModel base class.', () => {
        const instance: AccessibleCheckboxViewModel = new AccessibleCheckboxViewModel();
        expect(instance).toBeInstanceOf(AccessibleElementViewModel);
    });
    it('creates an instance with default values with its static createDefault factory function.', () => {
        const instance: AccessibleCheckboxViewModel = AccessibleCheckboxViewModel.createDefault();
        expect(instance.selectors).toBeDefined();
        expect(instance.selectors).toBeInstanceOf(CheckboxElementSelectorSet);
        expect(instance.labelViewModel).toBeDefined();
        expect(instance.labelViewModel).toBeInstanceOf(AccessibleElementLabelViewModel);
        expect(instance.checkboxType).toBeDefined();
    });
});

describe('The AccessibleTriStateCheckboxViewModel class', () => {
    it('defines a selectors property upon instantiation.', () => {
        const mockSelectors: TriStateCheckboxElementSelectorSet = new TriStateCheckboxElementSelectorSet();
        const instance: AccessibleTriStateCheckboxViewModel = new AccessibleTriStateCheckboxViewModel(
            mockSelectors,
        );
        expect(instance.selectors).toBeDefined();
        expect(instance.selectors).toBeInstanceOf(TriStateCheckboxElementSelectorSet);
        expect(instance.selectors).toBe(mockSelectors);
    });
    it('defines a labelViewModel property upon instantiation.', () => {
        const mockLabelViewModel: AccessibleElementLabelViewModel = AccessibleElementLabelViewModel.createDefault();
        const instance: AccessibleTriStateCheckboxViewModel = new AccessibleTriStateCheckboxViewModel(
            TriStateCheckboxElementSelectorSet.createDefault(),
            mockLabelViewModel,
        );
        expect(instance.labelViewModel).toBeDefined();
        expect(instance.labelViewModel).toBeInstanceOf(AccessibleElementLabelViewModel);
        expect(instance.labelViewModel).toBe(mockLabelViewModel);
    });
    it('creates an instance with default values from its createDefault factory function.', () => {
        const instance: AccessibleTriStateCheckboxViewModel = AccessibleTriStateCheckboxViewModel.createDefault();
        expect(instance.selectors).toBeDefined();
        expect(instance.selectors).toBeInstanceOf(TriStateCheckboxElementSelectorSet);
        expect(instance.labelViewModel).toBeDefined();
        expect(instance.labelViewModel).toBeInstanceOf(AccessibleElementLabelViewModel);
    });
});

describe('The isCheckboxChecked function', () => {
    function createCheckboxElement(checked: boolean = true): Element {
        const checkboxElement: Element = document.createElement('input');
        checkboxElement.setAttribute('type', 'checkbox');
        checked && checkboxElement.setAttribute('checked', '');
        return checkboxElement;
    }
    it('returns true for a checked checkbox.', () => {
        const checkbox: Element = createCheckboxElement();
        const isChecked: boolean = isCheckboxChecked(checkbox);
        expect(isChecked).toEqual(true);
    });
    it('returns false for a non-checked checkbox.', () => {
        const notChecked: boolean = false;
        const checkbox: Element = createCheckboxElement(notChecked);
        const isChecked: boolean = isCheckboxChecked(checkbox);
        expect(isChecked).toEqual(notChecked);
    });
});

describe('The isKeyboardEvent function', () => {
    it('returns true for a KeyboardEvent instance.', () => {
        const mockKeyboardEvent: KeyboardEvent = new KeyboardEvent('keyup', {
            code: 'Enter',
            key: 'Enter',
        });
        const isKeyboardEventCheck: boolean = isKeyboardEvent(mockKeyboardEvent);
        expect(isKeyboardEventCheck).toEqual(true);
    });
    it('returns false for not a KeyboardEvent instance.', () => {
        const mockMouseEvent: MouseEvent = new MouseEvent('click');
        const isKeyboardEventCheck: boolean = isKeyboardEvent(mockMouseEvent);
        expect(isKeyboardEventCheck).toEqual(false);
    });
});

describe('The createCheckedStateToggleHandler function', () => {
    function createCheckboxElement(): HTMLElement {
        const checkboxElement: HTMLElement = document.createElement('input');
        checkboxElement.setAttribute('type', 'checkbox');
        return checkboxElement;
    }
    it('returns a function that toggles a checkbox aria-checked attribute upon click.', () => {
        const checkbox: HTMLElement = createCheckboxElement();
        const checkedToggleHandler = createCheckedStateToggleHandler(checkbox);
        
        checkbox.setAttribute('checked', '');
        checkbox.setAttribute('aria-checked', 'true');
        checkbox.addEventListener('click', checkedToggleHandler);
        checkbox.dispatchEvent(new MouseEvent('click'));
        expect(checkbox.hasAttribute('checked')).toEqual(false);
        expect(checkbox.getAttribute('aria-checked')).toEqual('false');
        checkbox.dispatchEvent(new MouseEvent('click'));
        expect(checkbox.hasAttribute('checked')).toEqual(true);
        expect(checkbox.getAttribute('aria-checked')).toEqual('true');
    });
    it('returns a function that toggles a checkbox aria-checked and checked attributes with the space key.', () => {
        const checkbox: HTMLElement = createCheckboxElement();
        const checkedToggleHandler = createCheckedStateToggleHandler(checkbox);
        
        checkbox.setAttribute('checked', '');
        checkbox.setAttribute('aria-checked', 'true');
        checkbox.addEventListener('keyup', checkedToggleHandler);
        checkbox.dispatchEvent(new KeyboardEvent('keyup', {
            code: ' ',
            key: ' ',
        }));
        expect(checkbox.hasAttribute('checked')).toEqual(false);
        expect(checkbox.getAttribute('aria-checked')).toEqual('false');
        checkbox.dispatchEvent(new KeyboardEvent('keyup', {
            code: ' ',
            key: ' ',
        }));
        expect(checkbox.hasAttribute('checked')).toEqual(true);
        expect(checkbox.getAttribute('aria-checked')).toEqual('true');
    });
    it('returns a function that does not toggle a checkbox aria-checked and checked attributes when a key other than space is pressed.', () => {
        const checkbox: HTMLElement = createCheckboxElement();
        const checkedToggleHandler = createCheckedStateToggleHandler(checkbox);
        
        checkbox.setAttribute('checked', '');
        checkbox.setAttribute('aria-checked', 'true');
        checkbox.addEventListener('keyup', checkedToggleHandler);
        checkbox.dispatchEvent(new KeyboardEvent('keyup', {
            code: 'Enter',
            key: 'Enter',
        }));
        expect(checkbox.hasAttribute('checked')).toEqual(true);
        expect(checkbox.getAttribute('aria-checked')).toEqual('true');
    });
});

describe('The createTriStateCheckboxToggleHandler function', () => {
    function createCheckboxElement(): HTMLElement {
        const checkbox: HTMLElement = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('checked', '');
        checkbox.setAttribute('aria-checked', 'true');
        return checkbox;
    }
    function createCheckboxGroup(checkboxCount: number = 3): HTMLElement {
        const fieldSet: HTMLElement = document.createElement('fieldset');
        fieldSet.setAttribute('aria-checked', 'true');
        fieldSet.setAttribute('role', 'group');
        const checkboxes: HTMLElement[] = [];
        for (let i: number = 0; i < checkboxCount; ++i) {
            const checkbox: HTMLElement = createCheckboxElement();
            checkboxes.push(checkbox);
        }
        fieldSet.append(...checkboxes);
        return fieldSet;
    }
    it('returns a function that toggles the aria-checked attribute of both the checkbox and the group when clicked.', () => {
        const checkboxGroup: HTMLElement = createCheckboxGroup(3);
        const checkboxes: NodeList = checkboxGroup.querySelectorAll('input');
        const handler = createTriStateCheckboxToggleHandler(checkboxGroup, checkboxes);
        checkboxGroup.addEventListener('click', handler);

        // state: all 3 checked; group[aria-checked="true"], all input[aria-checked="true"].
        const firstCheckbox: HTMLElement = checkboxes.item(0) as HTMLElement;
        const secondCheckbox: HTMLElement = checkboxes.item(1) as HTMLElement;
        const thirdCheckbox: HTMLElement = checkboxes.item(2) as HTMLElement;
        firstCheckbox.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
        }));
        // state: first is unchecked; group[aria-checked="mixed"], first input[aria-checked="false"], rest="true".
        
        expect(checkboxGroup.getAttribute('aria-checked')).toEqual('mixed');
        expect(firstCheckbox.getAttribute('aria-checked')).toEqual('false');
        expect(secondCheckbox.getAttribute('aria-checked')).toEqual('true');
        expect(thirdCheckbox.getAttribute('aria-checked')).toEqual('true');

        secondCheckbox.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
        }));
        // state: only last checkbox is checked; group[aria-checked="mixed"], last input[aria-checked="true"]; others false

        expect(checkboxGroup.getAttribute('aria-checked')).toEqual('mixed');
        expect(firstCheckbox.getAttribute('aria-checked')).toEqual('false');
        expect(secondCheckbox.getAttribute('aria-checked')).toEqual('false');
        expect(thirdCheckbox.getAttribute('aria-checked')).toEqual('true');

        thirdCheckbox.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
        }));
        // state: all unchecked; group[aria-checked="false"]; all input[aria-checked="false"].

        expect(checkboxGroup.getAttribute('aria-checked')).toEqual('false');
        expect(firstCheckbox.getAttribute('aria-checked')).toEqual('false');
        expect(secondCheckbox.getAttribute('aria-checked')).toEqual('false');
        expect(thirdCheckbox.getAttribute('aria-checked')).toEqual('false');

    });
    it('returns a function that toggles the aria-checked attribute of both the checkbox and the group with the space key.', () => {
        const checkboxGroup: HTMLElement = createCheckboxGroup(3);
        const checkboxes: NodeList = checkboxGroup.querySelectorAll('input');
        const handler = createTriStateCheckboxToggleHandler(checkboxGroup, checkboxes);
        checkboxGroup.addEventListener('keyup', handler);

        // state: all 3 checked; group[aria-checked="true"], all input[aria-checked="true"].
        const firstCheckbox: HTMLElement = checkboxes.item(0) as HTMLElement;
        const secondCheckbox: HTMLElement = checkboxes.item(1) as HTMLElement;
        const thirdCheckbox: HTMLElement = checkboxes.item(2) as HTMLElement;
        firstCheckbox.dispatchEvent(new KeyboardEvent('keyup', {
            bubbles: true,
            key: ' ',
            code: ' ',
        }));
        // state: first is unchecked; group[aria-checked="mixed"], first input[aria-checked="false"], rest="true".
        
        expect(checkboxGroup.getAttribute('aria-checked')).toEqual('mixed');
        expect(firstCheckbox.getAttribute('aria-checked')).toEqual('false');
        expect(secondCheckbox.getAttribute('aria-checked')).toEqual('true');
        expect(thirdCheckbox.getAttribute('aria-checked')).toEqual('true');

        secondCheckbox.dispatchEvent(new KeyboardEvent('keyup', {
            bubbles: true,
            key: ' ',
            code: ' ',
        }));
        // state: only last checkbox is checked; group[aria-checked="mixed"], last input[aria-checked="true"]; others false

        expect(checkboxGroup.getAttribute('aria-checked')).toEqual('mixed');
        expect(firstCheckbox.getAttribute('aria-checked')).toEqual('false');
        expect(secondCheckbox.getAttribute('aria-checked')).toEqual('false');
        expect(thirdCheckbox.getAttribute('aria-checked')).toEqual('true');

        thirdCheckbox.dispatchEvent(new KeyboardEvent('keyup', {
            bubbles: true,
            key: ' ',
            code: ' ',
        }));
        // state: all unchecked; group[aria-checked="false"]; all input[aria-checked="false"].

        expect(checkboxGroup.getAttribute('aria-checked')).toEqual('false');
        expect(firstCheckbox.getAttribute('aria-checked')).toEqual('false');
        expect(secondCheckbox.getAttribute('aria-checked')).toEqual('false');
        expect(thirdCheckbox.getAttribute('aria-checked')).toEqual('false');

    });
    it('returns a function that does not toggle the aria-checked attribute of both the checkbox and the group without the space key.', () => {
        const checkboxGroup: HTMLElement = createCheckboxGroup(3);
        const checkboxes: NodeList = checkboxGroup.querySelectorAll('input');
        const handler = createTriStateCheckboxToggleHandler(checkboxGroup, checkboxes);
        checkboxGroup.addEventListener('keyup', handler);

        // state: all 3 checked; group[aria-checked="true"], all input[aria-checked="true"].
        const firstCheckbox: HTMLElement = checkboxes.item(0) as HTMLElement;
        const secondCheckbox: HTMLElement = checkboxes.item(1) as HTMLElement;
        const thirdCheckbox: HTMLElement = checkboxes.item(2) as HTMLElement;
        firstCheckbox.dispatchEvent(new KeyboardEvent('keyup', {
            bubbles: true,
            key: 'Enter',
            code: 'Enter',
        }));
        // state: unchanged
        
        expect(checkboxGroup.getAttribute('aria-checked')).toEqual('true');
        expect(firstCheckbox.getAttribute('aria-checked')).toEqual('true');
        expect(secondCheckbox.getAttribute('aria-checked')).toEqual('true');
        expect(thirdCheckbox.getAttribute('aria-checked')).toEqual('true');

        secondCheckbox.dispatchEvent(new KeyboardEvent('keyup', {
            bubbles: true,
            key: 'Enter',
            code: 'Enter',
        }));
        // state: unchanged

        expect(checkboxGroup.getAttribute('aria-checked')).toEqual('true');
        expect(firstCheckbox.getAttribute('aria-checked')).toEqual('true');
        expect(secondCheckbox.getAttribute('aria-checked')).toEqual('true');
        expect(thirdCheckbox.getAttribute('aria-checked')).toEqual('true');

        thirdCheckbox.dispatchEvent(new KeyboardEvent('keyup', {
            bubbles: true,
            key: 'Enter',
            code: 'Enter',
        }));
        // state: unchanged

        expect(checkboxGroup.getAttribute('aria-checked')).toEqual('true');
        expect(firstCheckbox.getAttribute('aria-checked')).toEqual('true');
        expect(secondCheckbox.getAttribute('aria-checked')).toEqual('true');
        expect(thirdCheckbox.getAttribute('aria-checked')).toEqual('true');

    });
});

describe('The makeAccessibleSimpleCheckbox function', () => {
    it('returns the element with the role attribute defined.', () => {
        const checkbox: HTMLElement = document.createElement('input');
        const viewModel: AccessibleCheckboxViewModel = AccessibleCheckboxViewModel.createDefault();
        const madeAccessibleCheckbox: HTMLElement = makeAccessibleSimpleCheckbox(
            checkbox,
            viewModel,
        );
        expect(madeAccessibleCheckbox.getAttribute('role')).toEqual(AccessibleCheckboxViewModel.CHECKBOX_ROLE);
    });
    it('returns the element with the aria-checked attribute defined according to its checked state.', () => {
        const uncheckedCheckbox: HTMLElement = document.createElement('input');
        uncheckedCheckbox.setAttribute('type', 'checkbox');
        const viewModel: AccessibleCheckboxViewModel = AccessibleCheckboxViewModel.createDefault();
        const madeAccessibleCheckbox: HTMLElement = makeAccessibleSimpleCheckbox(
            uncheckedCheckbox,
            viewModel,
        );
        expect(madeAccessibleCheckbox.getAttribute('aria-checked')).toEqual('false');
        
        const checkedCheckbox: HTMLElement = document.createElement('input');
        checkedCheckbox.setAttribute('type', 'checkbox');
        checkedCheckbox.setAttribute('checked', '');
        const madeAccessibleCheckedCheckbox: HTMLElement = makeAccessibleSimpleCheckbox(
            checkedCheckbox,
            viewModel,
        );
        expect(madeAccessibleCheckedCheckbox.getAttribute('aria-checked')).toEqual('true');
    });
    it('returns the element with the aria-labelledby attribute defined.', () => {
        const CHECKBOX_ID: string = 'checkbox-id';
        const LABEL_ID: string = 'label-id';
        const divElement: HTMLElement = document.createElement('div');
        const checkbox: HTMLElement = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('checked', '');
        checkbox.setAttribute('id', CHECKBOX_ID);
        const label: Element = document.createElement('label');
        label.setAttribute('for', CHECKBOX_ID);
        label.setAttribute('id', LABEL_ID);
        divElement.append(checkbox, label);
        const selectors: CheckboxElementSelectorSet = new CheckboxElementSelectorSet(
            ':scope > input',
        );
        const viewModel: AccessibleCheckboxViewModel = new AccessibleCheckboxViewModel(
            selectors,
            new AccessibleElementLabelViewModel(LABEL_ID),
            AccessibleCheckboxType.DUAL_STATE,
        );
        const madeAccessibleCheckbox: HTMLElement = makeAccessibleSimpleCheckbox(
            divElement,
            viewModel,
        );
        expect(checkbox.getAttribute('aria-labelledby')).toEqual(LABEL_ID);
    });
    it('returns the element with the aria-label attribute defined.', () => {
        const checkbox: HTMLElement = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        const LABEL_TEXT: string = 'label text';
        const labelViewModel: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel('', LABEL_TEXT);
        const viewModel: AccessibleCheckboxViewModel = new AccessibleCheckboxViewModel(
            CheckboxElementSelectorSet.createDefault(),
            labelViewModel,
        );
        const madeAccessibleCheckbox: HTMLElement = makeAccessibleSimpleCheckbox(checkbox, viewModel);
        expect(madeAccessibleCheckbox.getAttribute('aria-label')).toEqual(LABEL_TEXT);
    });
    it('returns the element with the aria-described by attribute defined.', () => {
        const div: HTMLElement = document.createElement('div');
        const checkbox: HTMLElement = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        const DESCRIPTION_ID: string = 'description-id';
        const p: Element = document.createElement('p');
        p.textContent = 'This is a description';
        p.setAttribute('id', DESCRIPTION_ID);
        div.append(checkbox, p);
        const selectors: CheckboxElementSelectorSet = new CheckboxElementSelectorSet(':scope > input', ':scope > p');
        const viewModel: AccessibleCheckboxViewModel = new AccessibleCheckboxViewModel(selectors);
        const madeAccessibleCheckbox: HTMLElement = makeAccessibleSimpleCheckbox(div, viewModel);
        expect(madeAccessibleCheckbox.getAttribute('aria-describedby')).toEqual(DESCRIPTION_ID);
    });
    it('returns an element with toggle handling.', () => {
        const checkbox: HTMLElement = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        const handler = createCheckedStateToggleHandler;
        const viewModel: AccessibleCheckboxViewModel = AccessibleCheckboxViewModel.createDefault();
        const madeAccessibleCheckbox: HTMLElement = makeAccessibleSimpleCheckbox(checkbox, viewModel, handler);
        madeAccessibleCheckbox.dispatchEvent(new MouseEvent('click'));

        expect(madeAccessibleCheckbox.hasAttribute('checked')).toEqual(true);
        expect(madeAccessibleCheckbox.getAttribute('aria-checked')).toEqual('true');

        madeAccessibleCheckbox.dispatchEvent(new KeyboardEvent('keyup', {
            code: ' ',
            key: ' ',
        }));
        expect(madeAccessibleCheckbox.hasAttribute('checked')).toEqual(false);
        expect(madeAccessibleCheckbox.getAttribute('aria-checked')).toEqual('false');
    });
    it('returns an element with default toggle handling.', () => {
        const checkbox: HTMLElement = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        const viewModel: AccessibleCheckboxViewModel = AccessibleCheckboxViewModel.createDefault();
        const madeAccessibleCheckbox: HTMLElement = makeAccessibleSimpleCheckbox(checkbox, viewModel);
        madeAccessibleCheckbox.dispatchEvent(new MouseEvent('click'));

        expect(madeAccessibleCheckbox.hasAttribute('checked')).toEqual(true);
        expect(madeAccessibleCheckbox.getAttribute('aria-checked')).toEqual('true');

        madeAccessibleCheckbox.dispatchEvent(new KeyboardEvent('keyup', {
            code: ' ',
            key: ' ',
        }));
        expect(madeAccessibleCheckbox.hasAttribute('checked')).toEqual(false);
        expect(madeAccessibleCheckbox.getAttribute('aria-checked')).toEqual('false');
    });
});

describe('The makeAccessibleTriStateCheckbox function', () => {
    
    const CHECKBOX_COUNT: number = 3;
    const LABEL_ID: string = 'label-id';
    const LABEL_TEXT: string = 'label-text';
    const DESCRIPTION_ID: string = 'description-id';
    function createTriStateCheckbox(checkboxCount: number = CHECKBOX_COUNT): HTMLElement {
        const group: HTMLElement = document.createElement('fieldset');
        const legend: HTMLElement = document.createElement('legend');
        legend.setAttribute('id', LABEL_ID);

        const description: Element = document.createElement('p');
        description.setAttribute('id', DESCRIPTION_ID);
        description.textContent = 'description text';
        const checkboxes: HTMLElement[] = [];
        for (let i: number = 0; i < checkboxCount; ++i) {
            const checkbox: HTMLElement = document.createElement('input');
            checkbox.setAttribute('type', 'checkbox');
            checkbox.setAttribute('checked', '');
            checkboxes.push(checkbox);
        }

        group.append(legend, ...checkboxes, description);
        return group;
    }
    it('returns an element with the role attribute set to group, and checkbox set for each checkbox.', () => {
        const checkboxGroup: HTMLElement = createTriStateCheckbox();
        const viewModel: AccessibleTriStateCheckboxViewModel = AccessibleTriStateCheckboxViewModel.createDefault();
        const madeAccessibleCheckboxGroup: HTMLElement = makeAccessibleTriStateCheckbox(
            checkboxGroup,
            viewModel,
        );
        expect(madeAccessibleCheckboxGroup.getAttribute('role')).toEqual('group');
        expect(madeAccessibleCheckboxGroup.getAttribute('aria-checked')).toEqual('true');
        const checkboxes: NodeList = madeAccessibleCheckboxGroup.querySelectorAll(':scope > input[type="checkbox"]');
        expect(checkboxes.length).toEqual(CHECKBOX_COUNT);
        for (let i: number = 0; i < CHECKBOX_COUNT; ++i) {
            const checkbox: HTMLElement = checkboxes.item(i) as HTMLElement;
            expect(checkbox.getAttribute('role')).toEqual(AccessibleCheckboxViewModel.CHECKBOX_ROLE);
            expect(checkbox.getAttribute('aria-checked')).toEqual('true');
        }
    });
    it('returns an element with the aria-checked attribute set according to the checkboxes state.', () => {
        const group: HTMLElement = createTriStateCheckbox();
        const checkboxes: NodeList = group.querySelectorAll('input[type="checkbox"]');
        expect(checkboxes.length).toEqual(CHECKBOX_COUNT);
        const checkedState: boolean[] = [false, true, false];
        checkboxes.forEach((checkboxNode: Node, key: number) => {
            const checkboxElement: Element = checkboxNode as Element;
            const isChecked: boolean = checkedState[key];
            if (isChecked) {
                checkboxElement.setAttribute('checked', '');
            } else {
                checkboxElement.removeAttribute('checked');
            }
        });
        const selectors: TriStateCheckboxElementSelectorSet = new TriStateCheckboxElementSelectorSet(
            '',
            ':scope > input[type="checkbox"]',
        );
        const viewModel: AccessibleTriStateCheckboxViewModel = new AccessibleTriStateCheckboxViewModel(
            selectors,
        );
        const madeAccessibleCheckboxGroup: HTMLElement = makeAccessibleTriStateCheckbox(group, viewModel);
        expect(madeAccessibleCheckboxGroup.getAttribute('aria-checked')).toEqual('mixed');

        const uncheckedGroup: HTMLElement = createTriStateCheckbox();
        const uncheckedCheckboxes: NodeList = uncheckedGroup.querySelectorAll(':scope > input');
        expect(uncheckedCheckboxes.length).toEqual(CHECKBOX_COUNT);
        uncheckedCheckboxes.forEach((checkboxNode: Node) => {
            const checkboxElement: Element = checkboxNode as Element;
            checkboxElement.removeAttribute('checked');
        });
        const uncheckedViewModel: AccessibleTriStateCheckboxViewModel = AccessibleTriStateCheckboxViewModel.createDefault();
        const uncheckedAccessibleCheckboxGroup: HTMLElement = makeAccessibleTriStateCheckbox(
            uncheckedGroup,
            uncheckedViewModel,
        );
        expect(uncheckedAccessibleCheckboxGroup.getAttribute('aria-checked')).toEqual('false');
    });
    it('returns an element with the aria-labelledby attribute correctly applied.', () => {
        const group: HTMLElement = createTriStateCheckbox();
        const labelViewModel: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel(LABEL_ID);
        const viewModel: AccessibleTriStateCheckboxViewModel = new AccessibleTriStateCheckboxViewModel(
            TriStateCheckboxElementSelectorSet.createDefault(),
            labelViewModel,
        );
        const madeAccessibleCheckboxGroup: HTMLElement = makeAccessibleTriStateCheckbox(group, viewModel);
        expect(madeAccessibleCheckboxGroup.getAttribute('aria-labelledby')).toEqual(LABEL_ID);
    });
    it('returns an element with the aria-label attribute correctly applied.', () => {
        const group: HTMLElement = createTriStateCheckbox();
        const labelViewModel: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel('', LABEL_TEXT);
        const viewModel: AccessibleTriStateCheckboxViewModel = new AccessibleTriStateCheckboxViewModel(
            TriStateCheckboxElementSelectorSet.createDefault(),
            labelViewModel,
        );
        const madeAccessibleCheckboxGroup: HTMLElement = makeAccessibleTriStateCheckbox(
            group,
            viewModel,
        );
        expect(madeAccessibleCheckboxGroup.getAttribute('aria-label')).toEqual(LABEL_TEXT);
    });
    it('returns an element with the aria-describedby attribute correctly set.', () => {
        const group: HTMLElement = createTriStateCheckbox();
        const selectors: TriStateCheckboxElementSelectorSet = new TriStateCheckboxElementSelectorSet(
            TriStateCheckboxElementSelectorSet.DEFAULT_GROUP_SELECTOR,
            TriStateCheckboxElementSelectorSet.DEFAULT_CHECKBOXES_SELECTOR,
            ':scope > p',
        );
        const viewModel: AccessibleTriStateCheckboxViewModel = new AccessibleTriStateCheckboxViewModel(selectors);
        const madeAccessibleCheckboxGroup: HTMLElement = makeAccessibleTriStateCheckbox(group, viewModel);
        expect(madeAccessibleCheckboxGroup.getAttribute('aria-describedby')).toEqual(DESCRIPTION_ID);
    })
    it('returns an element with checkbox toggle handling.', () => {
        const group: HTMLElement = createTriStateCheckbox();
        const viewModel: AccessibleTriStateCheckboxViewModel = AccessibleTriStateCheckboxViewModel.createDefault();
        const handler = createTriStateCheckboxToggleHandler;
        const madeAccessibleCheckboxGroup: HTMLElement = makeAccessibleTriStateCheckbox(
            group,
            viewModel,
            handler,
        );
        const checkboxes: NodeList = group.querySelectorAll(':scope > input[type="checkbox"]');
        expect(checkboxes.length).toEqual(CHECKBOX_COUNT);
        
        const firstCheckbox: HTMLElement = checkboxes.item(0) as HTMLElement;
        const secondCheckbox: HTMLElement = checkboxes.item(1) as HTMLElement;
        const thirdCheckbox: HTMLElement = checkboxes.item(2) as HTMLElement;
        expect(madeAccessibleCheckboxGroup.getAttribute('aria-checked')).toEqual('true');
        
        firstCheckbox.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
        }));
        expect(madeAccessibleCheckboxGroup.getAttribute('aria-checked')).toEqual('mixed');
        
        secondCheckbox.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
        }));
        expect(madeAccessibleCheckboxGroup.getAttribute('aria-checked')).toEqual('mixed');
        
        thirdCheckbox.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
        }));
        expect(madeAccessibleCheckboxGroup.getAttribute('aria-checked')).toEqual('false');

        firstCheckbox.dispatchEvent(new KeyboardEvent('keyup', {
            key: ' ',
            code: ' ',
            bubbles: true,
        }));
        expect(madeAccessibleCheckboxGroup.getAttribute('aria-checked')).toEqual('mixed');

        secondCheckbox.dispatchEvent(new KeyboardEvent('keyup', {
            key: ' ',
            code: ' ',
            bubbles: true,
        }));
        expect(madeAccessibleCheckboxGroup.getAttribute('aria-checked')).toEqual('mixed');

        thirdCheckbox.dispatchEvent(new KeyboardEvent('keyup', {
            key: ' ',
            code: ' ',
            bubbles: true,
        }));
        expect(madeAccessibleCheckboxGroup.getAttribute('aria-checked')).toEqual('true');
    });
    it('returns an element with default checkbox toggle handling.', () => {
        const group: HTMLElement = createTriStateCheckbox();
        const viewModel: AccessibleTriStateCheckboxViewModel = AccessibleTriStateCheckboxViewModel.createDefault();
        const madeAccessibleCheckboxGroup: HTMLElement = makeAccessibleTriStateCheckbox(
            group,
            viewModel,
        );
        const checkboxes: NodeList = group.querySelectorAll(':scope > input[type="checkbox"]');
        expect(checkboxes.length).toEqual(CHECKBOX_COUNT);
        
        const firstCheckbox: HTMLElement = checkboxes.item(0) as HTMLElement;
        const secondCheckbox: HTMLElement = checkboxes.item(1) as HTMLElement;
        const thirdCheckbox: HTMLElement = checkboxes.item(2) as HTMLElement;
        expect(madeAccessibleCheckboxGroup.getAttribute('aria-checked')).toEqual('true');
        
        firstCheckbox.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
        }));
        expect(madeAccessibleCheckboxGroup.getAttribute('aria-checked')).toEqual('mixed');
        
        secondCheckbox.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
        }));
        expect(madeAccessibleCheckboxGroup.getAttribute('aria-checked')).toEqual('mixed');
        
        thirdCheckbox.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
        }));
        expect(madeAccessibleCheckboxGroup.getAttribute('aria-checked')).toEqual('false');

        firstCheckbox.dispatchEvent(new KeyboardEvent('keyup', {
            key: ' ',
            code: ' ',
            bubbles: true,
        }));
        expect(madeAccessibleCheckboxGroup.getAttribute('aria-checked')).toEqual('mixed');

        secondCheckbox.dispatchEvent(new KeyboardEvent('keyup', {
            key: ' ',
            code: ' ',
            bubbles: true,
        }));
        expect(madeAccessibleCheckboxGroup.getAttribute('aria-checked')).toEqual('mixed');

        thirdCheckbox.dispatchEvent(new KeyboardEvent('keyup', {
            key: ' ',
            code: ' ',
            bubbles: true,
        }));
        expect(madeAccessibleCheckboxGroup.getAttribute('aria-checked')).toEqual('true');
    });
});

