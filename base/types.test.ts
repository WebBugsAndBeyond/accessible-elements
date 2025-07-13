import { AccessibleElementLabelViewModel, AccessibleElementLabelSelectorPreference, AccessibleElementSelectors, AccessibleElementViewModel, AccessibleElementDescriptionViewModel } from "./types";
import { identityFunction } from "./types";

describe('identityFunction', () => {
    it('returns its argument directly.', () => {
        const value: string = 'mock identity arg';
        expect(identityFunction(value)).toStrictEqual(value);

        const referenceValue: string[] = ['mock', 'identity', 'value'];
        expect(identityFunction(referenceValue)).toBe(referenceValue);
    });
});

describe('AccessibleElementLabelViewModel', () => {
    it('defines a default label id value.', () => {
        expect(AccessibleElementLabelViewModel.DEFAULT_LABEL_ID).toBeDefined();
        expect(typeof AccessibleElementLabelViewModel.DEFAULT_LABEL_ID).toEqual('string');
        expect(AccessibleElementLabelViewModel.DEFAULT_LABEL_ID).toEqual('');
    });
    it('defines a default label text string.', () => {
        expect(AccessibleElementLabelViewModel.DEFAULT_LABEL_TEXT).toBeDefined();
        expect(typeof AccessibleElementLabelViewModel.DEFAULT_LABEL_TEXT).toEqual('string');
        expect(AccessibleElementLabelViewModel.DEFAULT_LABEL_TEXT).toEqual('');
    });
    it('defines a default label element selector string.', () => {
        expect(AccessibleElementLabelViewModel.DEFAULT_LABEL_ELEMENT_SELECTOR).toBeDefined();
        expect(typeof AccessibleElementLabelViewModel.DEFAULT_LABEL_ELEMENT_SELECTOR).toEqual('string');
        expect(AccessibleElementLabelViewModel.DEFAULT_LABEL_ELEMENT_SELECTOR).toEqual('');
    });
    it('defines a default selection preference.', () => {
        expect(AccessibleElementLabelViewModel.DEFAULT_SELECTION_PREFERENCE).toBeDefined();
        expect(AccessibleElementLabelViewModel.DEFAULT_SELECTION_PREFERENCE).toEqual(AccessibleElementLabelSelectorPreference.LABEL_ID);
    });
    it('defines a labelId property upon instantiation.', () => {
        const labelId: string = 'label-id';
        const instance: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel(
            labelId,
        );
        expect(instance.labelId).toBeDefined();
        expect(typeof instance.labelId).toEqual('string');
        expect(instance.labelId).toEqual(labelId);
    });
    it('defines a labelId property with a default value upon instantiation.', () => {
        const instance: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel();
        expect(instance.labelId).toBeDefined();
        expect(typeof instance.labelId).toEqual('string');
        expect(instance.labelId).toStrictEqual(AccessibleElementLabelViewModel.DEFAULT_LABEL_ID);
    });
    it('defines a labelText property upon instantiation.', () => {
        const labelText: string = 'label text';
        const labelId: string = 'label id';
        const instance: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel(labelId, labelText);
        expect(instance.labelText).toBeDefined();
        expect(typeof instance.labelText).toEqual('string');
        expect(instance.labelText).toStrictEqual(labelText);
    });
    it('defines a labelText property with a default value upon instantiation.', () => {
        const instance: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel();
        expect(instance.labelText).toStrictEqual(AccessibleElementLabelViewModel.DEFAULT_LABEL_TEXT);
    });
    it('defines a labelElementSelector property upon instantiation.', () => {
        const selector: string = ':scope > label';
        const labelId: string = 'label id';
        const labelText: string = 'label text';
        const instance: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel(
            labelId,
            labelText,
            selector,
        );
        expect(instance.labelElementSelector).toBeDefined();
        expect(typeof instance.labelElementSelector).toEqual('string');
        expect(instance.labelElementSelector).toStrictEqual(selector);
    });
    it('defines a labelElementSelector property with a default value upon instantiation.', () => {
        const instance: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel();
        expect(instance.labelElementSelector).toBeDefined();
        expect(typeof instance.labelElementSelector).toEqual('string');
        expect(instance.labelElementSelector).toStrictEqual(AccessibleElementLabelViewModel.DEFAULT_LABEL_ELEMENT_SELECTOR);
    });
    it('defines a preference property upon instantiation.', () => {
        const preference: AccessibleElementLabelSelectorPreference = AccessibleElementLabelSelectorPreference.LABEL_ELEMENT_SELECTOR;
        const labelId: string = 'label id';
        const labelText: string = 'label text';
        const selector: string = ':scope > label';
        const instance: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel(
            labelId,
            labelText,
            selector,
            preference,
        );
        expect(instance.preference).toBeDefined();
        expect(instance.preference).toStrictEqual(preference);
    });
    it('defines a preference property with a default value upon instantiation.', () => {
        const instance: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel();
        expect(instance.preference).toBeDefined();
        expect(instance.preference).toEqual(AccessibleElementLabelViewModel.DEFAULT_SELECTION_PREFERENCE);
    });
    it('applies the label id to the aria-labelledby attribute.', () => {
        const labelId: string = 'label-id';
        const element: Element = document.createElement('div');
        const instance: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel(labelId);
        const labelledById: string | null = AccessibleElementLabelViewModel.applyAccessibleLabel(element, instance).getAttribute('aria-labelledby');
        expect(labelledById).toEqual(labelId);
    });
    it('applies the label text to the aria-label attribute.', () => {
        const labelId: string = 'label-id';
        const labelText: string = 'label text';
        const labelSelector: string = ':scope > div:nth-of-type(1)';
        const preference: AccessibleElementLabelSelectorPreference = AccessibleElementLabelSelectorPreference.LABEL_TEXT
        const element: Element = document.createElement('div');
        const instance: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel(
            labelId,
            labelText,
            labelSelector,
            preference,
        );
        const label: string | null = AccessibleElementLabelViewModel.applyAccessibleLabel(element, instance).getAttribute('aria-label');
        expect(label).toEqual(labelText);
    });
    it('applies the label id of the selected label element to the aria-labelledby attribute when all other options are provided and the preference is the selector.', () => {
        const labelId: string = 'label-id';
        const labelText: string = 'label text';
        const labelSelector: string = ':scope > div:nth-of-type(1)';
        const element: Element = document.createElement('div');
        const labelElement: Element = document.createElement('div');
        const preference: AccessibleElementLabelSelectorPreference = AccessibleElementLabelSelectorPreference.LABEL_ELEMENT_SELECTOR;
        labelElement.setAttribute('id', labelId);
        element.appendChild(labelElement);
        const instance: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel(
            labelId,
            labelText,
            labelSelector,
            preference,
        );
        const labelledById: string | null = AccessibleElementLabelViewModel.applyAccessibleLabel(element, instance).getAttribute('aria-labelledby');
        expect(labelledById).toEqual(labelId);
    });
    it('applies the label id of the selected label element to the aria-labelledby attribute when no other options are provided.', () => {
        const labelId: string = 'label-id';
        const labelSelector: string = ':scope > div:nth-of-type(1)';
        const element: Element = document.createElement('div');
        const labelElement: Element = document.createElement('div');
        const preference: AccessibleElementLabelSelectorPreference = AccessibleElementLabelSelectorPreference.LABEL_ELEMENT_SELECTOR;
        labelElement.setAttribute('id', labelId);
        element.appendChild(labelElement);
        const instance: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel(
            '',
            '',
            labelSelector,
            preference,
        );
        const labelledById: string | null = AccessibleElementLabelViewModel.applyAccessibleLabel(element, instance).getAttribute('aria-labelledby');
        expect(labelledById).toEqual(labelId);
    });
    it('throws a ReferenceError when the selector does not identify a selectable element.', () => {
        const labelId: string = 'label-id';
        const labelText: string = 'label text';
        const labelSelector: string = ':scope > img';
        const preference: AccessibleElementLabelSelectorPreference = AccessibleElementLabelSelectorPreference.LABEL_ELEMENT_SELECTOR;
        const instance: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel(
            labelId,
            labelText,
            labelSelector,
            preference,
        );
        const element: Element = document.createElement('div');
        expect(() => {
            AccessibleElementLabelViewModel.applyAccessibleLabel(element, instance);
        }).toThrow();
    });
    it('does not change aria-labelledby and aria-label when no id, text, or selector value is provided.', () => {
        const instance: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel();
        const element: Element = document.createElement('div');
        AccessibleElementLabelViewModel.applyAccessibleLabel(element, instance);
        const labelledById: string | null = element.getAttribute('aria-labelledby');
        const label: string | null = element.getAttribute('aria-label');
        expect(labelledById).toBeNull();
        expect(label).toBeNull();
    });
    it('applies the aria-labelledby when both id and text are set with the id as the preference.', () => {
        const labelId: string = 'label-id';
        const labelText: string = 'label text';
        const wrapperElement: Element = document.createElement('div');
        const buttonElement: Element = document.createElement('button');
        const labelElement: Element = document.createElement('div');
        labelElement.setAttribute('id', labelId);
        buttonElement.textContent = 'button text';
        wrapperElement.append(buttonElement, labelElement);
        const labelIdViewModel: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel(
            labelId,
            labelText,
            undefined,
            AccessibleElementLabelSelectorPreference.LABEL_ID,
        );
        AccessibleElementLabelViewModel.applyAccessibleLabel(wrapperElement, labelIdViewModel);
        expect(wrapperElement.getAttribute('aria-labelledby')).toEqual(labelId);
    });
    it('applies the aria-labelledby attribute when id, text, and selectors are provided and the preference is for the id.', () => {
        const labelId: string = 'label-id';
        const labelText: string = 'label text';
        const labelSelector: string = ':scope > label';
        const preference: AccessibleElementLabelSelectorPreference = AccessibleElementLabelSelectorPreference.LABEL_ID;
        const wrapperElement: Element = document.createElement('div');
        const buttonElement: Element = document.createElement('button');
        const labelElement: Element = document.createElement('div');
        labelElement.setAttribute('id', labelId);
        buttonElement.textContent = 'button text';
        wrapperElement.append(buttonElement, labelElement);
        const instance: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel(
            labelId,
            labelText,
            labelSelector,
            preference,
        );
        AccessibleElementLabelViewModel.applyAccessibleLabel(wrapperElement, instance);
        expect(wrapperElement.getAttribute('aria-labelledby')).toEqual(labelId);
    });
    it('applies the aria-label when both id and text are set with the text as the preference.', () => {
        const labelId: string = 'label-id';
        const labelText: string = 'label text';
        const wrapperElement: Element = document.createElement('div');
        const buttonElement: Element = document.createElement('button');
        const labelElement: Element = document.createElement('div');
        labelElement.setAttribute('id', labelId);
        buttonElement.textContent = 'button text';
        wrapperElement.append(buttonElement, labelElement);
        const labelTextViewModel: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel(
            labelId,
            labelText,
            '',
            AccessibleElementLabelSelectorPreference.LABEL_TEXT,
        );
        AccessibleElementLabelViewModel.applyAccessibleLabel(wrapperElement, labelTextViewModel);
        expect(wrapperElement.getAttribute('aria-label')).toEqual(labelText);
    });
    it('applies the aria-label attribute when only the label text is set.', () => {
        const labelId: string = '';
        const labelText: string = 'labe text';
        const labelSelector: string = '';
        const preference: AccessibleElementLabelSelectorPreference = AccessibleElementLabelSelectorPreference.LABEL_TEXT;
        const wrapperElement: Element = document.createElement('div');
        const buttonElement: Element = document.createElement('button');
        const labelElement: Element = document.createElement('div');
        labelElement.setAttribute('id', labelId);
        buttonElement.textContent = 'button text';
        wrapperElement.append(buttonElement, labelElement);
        const labelTextViewModel: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel(
            labelId,
            labelText,
            labelSelector,
            preference,
        );
        AccessibleElementLabelViewModel.applyAccessibleLabel(wrapperElement, labelTextViewModel);
        expect(wrapperElement.getAttribute('aria-label')).toEqual(labelText);
    });
    it('returns an instance with default property values from its static factory function.', () => {
        const instance: AccessibleElementLabelViewModel = AccessibleElementLabelViewModel.createDefault();
        expect(instance.labelId).toStrictEqual(AccessibleElementLabelViewModel.DEFAULT_LABEL_ID);
        expect(instance.labelText).toStrictEqual(AccessibleElementLabelViewModel.DEFAULT_LABEL_TEXT);
        expect(instance.labelElementSelector).toStrictEqual(AccessibleElementLabelViewModel.DEFAULT_LABEL_ELEMENT_SELECTOR);
        expect(instance.preference).toStrictEqual(AccessibleElementLabelViewModel.DEFAULT_SELECTION_PREFERENCE);
    });
});

describe('AccessibleElementSelectors', () => {
    it('defines a static default query root selector string.', () => {
        expect(AccessibleElementSelectors.DEFAULT_QUERY_ROOT_SELECTOR).toBeDefined();
        expect(typeof AccessibleElementSelectors.DEFAULT_QUERY_ROOT_SELECTOR).toEqual('string');
        expect(AccessibleElementSelectors.DEFAULT_QUERY_ROOT_SELECTOR).toEqual('');
    });
    it('defines a static default accessible element selector string.', () => {
        expect(AccessibleElementSelectors.DEFAULT_ACCESSIBLE_ELEMENT_SELECTOR).toBeDefined();
        expect(typeof AccessibleElementSelectors.DEFAULT_ACCESSIBLE_ELEMENT_SELECTOR).toEqual('string');
        expect(AccessibleElementSelectors.DEFAULT_ACCESSIBLE_ELEMENT_SELECTOR).toEqual('');
    });
    it('defines a queryRoot property string upon instantiation.', () => {
        const rootSelector: string = ':scope > div';
        const instance: AccessibleElementSelectors = new AccessibleElementSelectors(
            rootSelector,
        );
        expect(instance.queryRoot).toBeDefined();
        expect(typeof instance.queryRoot).toEqual('string');
        expect(instance.queryRoot).toStrictEqual(rootSelector);
    });
    it('defines a queryRoot property with a default value upon instantiation.', () => {
        const instance: AccessibleElementSelectors = new AccessibleElementSelectors();
        expect(typeof instance.queryRoot).toEqual('string');
        expect(instance.queryRoot).toStrictEqual(AccessibleElementSelectors.DEFAULT_QUERY_ROOT_SELECTOR);
    });
    it('defines an accessibleElement property string upon instantiation.', () => {
        const rootSelector: string = ':scope > div';
        const elementSelector: string = ':scope > div > div';
        const instance: AccessibleElementSelectors = new AccessibleElementSelectors(
            rootSelector,
            elementSelector,
        );
        expect(instance.accessibleElement).toBeDefined();
        expect(typeof instance.queryRoot).toEqual('string');
        expect(instance.accessibleElement).toStrictEqual(elementSelector);
    });
    it('defines an acccessibleElement property string with a default value upon instantiation.', () => {
        const instance: AccessibleElementSelectors = new AccessibleElementSelectors();
        expect(instance.accessibleElement).toBeDefined();
        expect(typeof instance.accessibleElement).toEqual('string');
        expect(instance.accessibleElement).toStrictEqual(AccessibleElementSelectors.DEFAULT_ACCESSIBLE_ELEMENT_SELECTOR);
    });
    it('returns an instance with default values from its static factory.', () => {
        const instance: AccessibleElementSelectors = AccessibleElementSelectors.createDefault();
        expect(instance).toBeInstanceOf(AccessibleElementSelectors);
        expect(instance.queryRoot).toEqual(AccessibleElementSelectors.DEFAULT_QUERY_ROOT_SELECTOR);
        expect(instance.accessibleElement).toEqual(AccessibleElementSelectors.DEFAULT_ACCESSIBLE_ELEMENT_SELECTOR);
    });
});

describe('AccessibleElementViewModel', () => {
    class ViewModel extends AccessibleElementViewModel<AccessibleElementSelectors> {
        public constructor(
            selectors: AccessibleElementSelectors,
            labelViewModel: AccessibleElementLabelViewModel,
            descriptionViewModel: AccessibleElementDescriptionViewModel,
        ) {
            super(selectors, labelViewModel, descriptionViewModel);
        }
    }

    it('defines a selectors property upon instantiation.', () => {
        const rootSelector: string = ':scope > div';
        const elementSelector: string = ':scope > div > div';
        const selectors: AccessibleElementSelectors = new AccessibleElementSelectors(
            rootSelector,
            elementSelector,
        );
        const labelModel: AccessibleElementLabelViewModel = AccessibleElementLabelViewModel.createDefault();
        const descriptionViewModel: AccessibleElementDescriptionViewModel = AccessibleElementDescriptionViewModel.createDefault();
        const model: ViewModel = new ViewModel(selectors, labelModel, descriptionViewModel);
        expect(model.selectors).toBeDefined();
        expect(model.selectors).toBeInstanceOf(AccessibleElementSelectors);
        expect(model.selectors).toBe(selectors);
    });
    it('defines a labelViewModel property upon instnatiation.', () => {
        const rootSelector: string = ':scope > div';
        const elementSelector: string = ':scope > div > div';
        const selectors: AccessibleElementSelectors = new AccessibleElementSelectors(
            rootSelector,
            elementSelector,
        );
        const labelModel: AccessibleElementLabelViewModel = AccessibleElementLabelViewModel.createDefault();
        const descriptionViewModel: AccessibleElementDescriptionViewModel = AccessibleElementDescriptionViewModel.createDefault();
        const model: ViewModel = new ViewModel(selectors, labelModel, descriptionViewModel);
        expect(model.labelViewModel).toBeDefined();
        expect(model.labelViewModel).toBeInstanceOf(AccessibleElementLabelViewModel);
        expect(model.labelViewModel).toBe(labelModel);
    });
    it('defines a descriptionViewModel property upon instantiation.', () => {
        const rootSelector: string = ':scope > div';
        const elementSelector: string = ':scope > div > div';
        const selectors: AccessibleElementSelectors = new AccessibleElementSelectors(
            rootSelector,
            elementSelector,
        );
        const labelModel: AccessibleElementLabelViewModel = AccessibleElementLabelViewModel.createDefault();
        const descriptionViewModel: AccessibleElementDescriptionViewModel = AccessibleElementDescriptionViewModel.createDefault();
        const model: ViewModel = new ViewModel(selectors, labelModel, descriptionViewModel);
        expect(model.descriptionViewModel).toBeDefined();
        expect(model.descriptionViewModel).toBeInstanceOf(AccessibleElementDescriptionViewModel);
        expect(model.descriptionViewModel).toBe(descriptionViewModel);
    });


});
