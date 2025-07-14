import { ensureElementHasID, selectElementOrDefault } from "../utils/dom";

/**
 * Abstraction of a function that accepts any number of arguments of any type, and returns any type.
 * More generally speaking: a function.
 */
export type AnyKindOfFunction = (...args: any[]) => any;

export type EventHandlerFunction<EventType> = (e: EventType) => void;

/**
 * Keyboard interactivity event callback function.
 * Used when referring to an event handler for keyboard events.
 */
export type KeyEventCallback = (event: KeyboardEvent) => void;

/**
 * The identity function. A function that returns its argument.
 * @param arg Identity subject.
 * @returns The arg identity.
 */
export function identityFunction<T>(arg: T) {
    return arg;
}

/**
 * Preference for indicating which DOM structure component to refer to when creating the value
 * for the aria-labelledby, or the aria-label attribute value.
 * @see {AccessibleElementLabelViewModel}
 */
export enum AccessibleElementLabelSelectorPreference {
    LABEL_ID,
    LABEL_TEXT,
    LABEL_ELEMENT_SELECTOR,
}

/**
 * View model for defining how an element's ARIA description is determined.
 */
export class AccessibleElementDescriptionViewModel {

    /**
     * An empty string indicating that the described element is the root of the component DOM subtree
     * without any subtree selelction necessary.
     */
    public static readonly DEFAULT_DESCRIBED_ELEMENT_SELECTOR: string = '';

    public constructor(

        /**
         * DOM query selector string for referring to the element in the component DOM subtree that
         * contains the component description. eg. `aria-describedby`
         */
        public readonly descriptionElementSelector: string,

        /**
         * DOM query selector string for referring to the element that is described. 
         */
        public readonly describedElementSelector: string = AccessibleElementDescriptionViewModel.DEFAULT_DESCRIBED_ELEMENT_SELECTOR,
    ) {

    }

    public static createDefault(): AccessibleElementDescriptionViewModel {
        return new AccessibleElementDescriptionViewModel(
            AccessibleElementDescriptionViewModel.DEFAULT_DESCRIBED_ELEMENT_SELECTOR,
        );
    }

    /**
     * Apply the state defined by the view model to a component DOM element.
     * @param rootElement The component DOM element for which to apply the view model state.
     * @returns The component DOM element.
     */
    public static applyDescribedBy(
        rootElement: Element,
        viewModel: AccessibleElementDescriptionViewModel,
    ): Element {
        const { 
            descriptionElementSelector,
            describedElementSelector,
        } = viewModel;

        if (!descriptionElementSelector) {
            // There is no description so return the root unaffacted.
            return rootElement;
        }
        const descriptionElement: Element | null = rootElement.querySelector(descriptionElementSelector);
        if (descriptionElement) {
            // There is an element containging the description information.
            // Ensure there is an identifier, and an element to describe.
            const descriptionId: string = ensureElementHasID(descriptionElement);
            const describedElement: Element = selectElementOrDefault(rootElement, describedElementSelector);
            
            // Apply the ARIA description to the element.
            describedElement.setAttribute('aria-describedby', descriptionId);
            
        }
        return rootElement;
    }
}

/**
 * View model for defining how an element's AIRA label is determined.
 */
export class AccessibleElementLabelViewModel {

    /**
     * Default value for identifying the DOM element that will label the component.
     * Empty string means unused in the view model.
     * An empty string will result in no ARIA being applied if the preference value
     * is AccessibleElementLabelSelectorPreference.LABEL_ID.
     * @see {AccessibleElementLabelSelectorPreference}
     */
    public static readonly DEFAULT_LABEL_ID: string = '';

    /**
     * Default value for label text to be used as the string value for the `aria-label` 
     * attribute of the component. Empty string means unused in the view model.
     * An empty string will result in no ARIA being applied if the preference value
     * is AccessibleElementLabelSelectorPreference.LABEL_TEXT.
     * @see {AccessibleElementLabelSelectorPreference}
     */
    public static readonly DEFAULT_LABEL_TEXT: string = '';

    /**
     * Default value for selecting an element in the component DOM subtree to be used
     * as identified element of the `aria-labelledby` attribute.
     * An empty string means that it is unused in the view model.
     * An empty string will result in no ARIA being applied if the prefernece is
     * AccessibleElementLabelSelectorPreference.LABEL_ELEMENT_SELECTOR.
     * @see {AccessibleElementLabelSelectorPreference}
     */
    public static readonly DEFAULT_LABEL_ELEMENT_SELECTOR: string = '';

    /**
     * Default value for indicating which of the view model state indicators is to be used
     * for resolving the component label. The default value is 
     * AccessibleElementLabelSelectorPreference.LABEL_ID indicating that the `labelId` property
     * identifies an element whos `id` attribute will be used with the `aria-labelledby` attribute
     * on the component.
     * @see {AccessibleElementLabelSelectorPreference}
     */
    public static readonly DEFAULT_SELECTION_PREFERENCE: AccessibleElementLabelSelectorPreference = AccessibleElementLabelSelectorPreference.LABEL_ID;

    constructor(

        /**
         * Identifier of the labelling element, or an empty string if either `labelText`, 
         * or `labelElementSelector` is used.
         * @default {AccessibleElementLabelViewModel.DEFAULT_LABEL_ID}
         */
        public readonly labelId: string = AccessibleElementLabelViewModel.DEFAULT_LABEL_ID,

        /**
         * Label text string to be applied to the `aria-label` attribute, or an empty string
         * if either `labelId`, or `labelElementSelector` is used.
         * @default {AccessibleElementLabelViewModel.DEFAULT_LABEL_TEXT}
         */
        public readonly labelText: string = AccessibleElementLabelViewModel.DEFAULT_LABEL_TEXT,

        /**
         * DOM query selector string used to select the labelling element in the component DOM
         * subtree, or an empty string if either `labelId`, or `labelText` is used.
         * @default {AccessibleElementLabelViewModel.DEFAULT_LABEL_ELEMENT_SELECTOR}
         */
        public readonly labelElementSelector: string = AccessibleElementLabelViewModel.DEFAULT_LABEL_ELEMENT_SELECTOR,

        /**
         * An enum contant indicating which of the instance properties contains the valid value used
         * for determining the label ARIA.
         * @default {AccessibleElementLabelViewModel.DEFAULT_SELECTION_PREFERENCE}
         * @see {AccessibleElementLabelSelectorPreference}
         */
        public readonly preference: AccessibleElementLabelSelectorPreference = AccessibleElementLabelViewModel.DEFAULT_SELECTION_PREFERENCE,
    ) {

    }

    static applyAccessibleLabel(element: Element, viewModel: AccessibleElementLabelViewModel): Element {
        const { 
            labelId, 
            labelText, 
            labelElementSelector, 
            preference,
        } = viewModel;
        const assignByLabelId = (id: string = labelId) => {
            element.setAttribute('aria-labelledby', id);
        };
        const assignByLabelText = (text: string = labelText) => {
            element.setAttribute('aria-label', text);
        };
        const assignLabelBySelector = (selector: string = labelElementSelector) => {
            const labelElement: Element | null = element.querySelector(labelElementSelector);
            if (labelElement) {
                const id: string = ensureElementHasID(labelElement);
                assignByLabelId(id);
            } else {
                throw new ReferenceError(`Label element selector does not identify an existing Element: ${selector}`);
            }
        };

        if (labelId !== '' && labelText !== '' && labelElementSelector !== '') {
            if (preference === AccessibleElementLabelSelectorPreference.LABEL_ID) {
                assignByLabelId();
            } else if (preference === AccessibleElementLabelSelectorPreference.LABEL_TEXT) {
                assignByLabelText();
            } else if (preference === AccessibleElementLabelSelectorPreference.LABEL_ELEMENT_SELECTOR) {
                assignLabelBySelector();
            }
        } else if (labelId !== '' && labelText !== '') {
            if (preference === AccessibleElementLabelSelectorPreference.LABEL_ID) {
                assignByLabelId();
            } else if (preference === AccessibleElementLabelSelectorPreference.LABEL_TEXT) {
                assignByLabelText();
            }
        } else if (labelId !== '') {
            assignByLabelId(labelId);
        } else if (labelText !== '') {
            assignByLabelText();
        } else if (labelElementSelector !== '') {
            assignLabelBySelector();
        }
        return element;
    }

    public static createDefault(): AccessibleElementLabelViewModel {
        return new AccessibleElementLabelViewModel();
    }
}

/**
 * Defines the values necessary for determing how to select the accessible component to apply ARIA relative
 * to the Element, or HTMLElement decorated by one of the library's component functions.
 */
export class AccessibleElementSelectors {
    
    /**
     * Default value for the root of the component DOM subtree relative to the DOM Element instance
     * provided to be decorated with ARIA. An empty string is the default which indicates that the
     * Element instance itself is to serve as the root of the component DOM subtree from within the
     * accessible element can be identified for decoration.
     * @default ""
     */
    public static readonly DEFAULT_QUERY_ROOT_SELECTOR: string = '';

    /**
     * Default value for the accessible element DOM query selector string relative to the root selector.
     * The default value selects the first child <div> element.
     * @default {":scope > div:nth-of-type(1)"}
     */
    public static readonly DEFAULT_ACCESSIBLE_ELEMENT_SELECTOR: string = '';

    public constructor(

        /**
         * DOM query selector string for identifying the component root element from which to select
         * the actual element to decorate with ARIA.
         * @default {AccessibleElementSelectors#DEFAULT_QUERY_ROOT_SELECTOR}
         */
        protected readonly queryRootSelector: string = AccessibleElementSelectors.DEFAULT_QUERY_ROOT_SELECTOR,

        /**
         * DOM query selector string for selecting the element within the root identifed by `queryRootSelector`
         * to decorate with ARIA.
         * @default {AccessibleElementSelectors#DEFAULT_ACCESSIBLE_ELEMENT_SELECTOR}
         */
        protected readonly accessibleElementSelector: string = AccessibleElementSelectors.DEFAULT_ACCESSIBLE_ELEMENT_SELECTOR,
    ) {}

    /**
     * Return a new instance with default property values.
     * @returns 
     */
    public static createDefault(): AccessibleElementSelectors {
        return new AccessibleElementSelectors();
    }

    public get queryRoot(): string {
        return this.queryRootSelector;
    }

    public get accessibleElement(): string {
        return this.accessibleElementSelector;
    }
}

/**
 * 
 */
export abstract class AccessibleElementViewModel<SelectorType extends AccessibleElementSelectors> {
    protected constructor(
        public readonly selectors: SelectorType,
        public readonly labelViewModel: AccessibleElementLabelViewModel,
        public readonly descriptionViewModel: AccessibleElementDescriptionViewModel = AccessibleElementDescriptionViewModel.createDefault(),
    ) {}
}

export type AccessibleElementInteractivityPatternState<
    SelectorType extends AccessibleElementSelectors, 
    ViewModelType extends AccessibleElementViewModel<SelectorType>,
    EventType extends Event,
> = {
    element: HTMLElement;
    viewModel: ViewModelType;
    handler: EventHandlerFunction<EventType>;
}


export abstract class InteractiveAccessibleElement<
    SelectorType extends AccessibleElementSelectors, 
    ViewModelType extends AccessibleElementViewModel<SelectorType>,
    EventType extends Event,
> {

    protected constructor(
        protected patternState: AccessibleElementInteractivityPatternState<SelectorType, ViewModelType, EventType> | null = null,
    ) {}

    public get interactivityState(): AccessibleElementInteractivityPatternState<SelectorType, ViewModelType, EventType> | null {
        return this.patternState;
    }

    public abstract initializeInteractiveState(
        element: HTMLElement,
        viewModel: ViewModelType,
    ): boolean;

    public abstract attachEventHandler(): boolean;

    public abstract removeEventHandler(): boolean;

    public abstract cleanupHandlerState(): boolean;
}
