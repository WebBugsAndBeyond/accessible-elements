import { AccessibleElementLabelViewModel, AccessibleElementViewModel, applyDescribedBy, selectElementOrDefault } from "./utils";

export class CheckboxElementSelectorSet {
    public static readonly DEFAULT_CHECKBOX_SELECTOR: string = '';
    public static readonly DEFAULT_DESCRIPTION_SELECTOR: string = '';

    public constructor(
        public readonly checkboxSelector: string = CheckboxElementSelectorSet.DEFAULT_CHECKBOX_SELECTOR,
        public readonly descriptionSelector: string = CheckboxElementSelectorSet.DEFAULT_DESCRIPTION_SELECTOR,
    ) {

    }

    public static createDefault(): CheckboxElementSelectorSet {
        return new CheckboxElementSelectorSet();
    }
}

export class TriStateCheckboxElementSelectorSet {

    public static readonly DEFAULT_GROUP_SELECTOR: string = '';
    public static readonly DEFAULT_CHECKBOXES_SELECTOR: string = ':scope input[type="checkbox"]';
    public static readonly DEFAULT_DESCRIPTION_SELECTOR: string = '';

    public constructor(
        public readonly groupSelector: string = TriStateCheckboxElementSelectorSet.DEFAULT_GROUP_SELECTOR,
        public readonly checkboxesSelector: string = TriStateCheckboxElementSelectorSet.DEFAULT_CHECKBOXES_SELECTOR,
        public readonly descriptionSelector: string = TriStateCheckboxElementSelectorSet.DEFAULT_DESCRIPTION_SELECTOR,
    ) {

    }

    public static createDefault(): TriStateCheckboxElementSelectorSet {
        return new TriStateCheckboxElementSelectorSet();
    }
}

export enum AccessibleCheckboxType {
    DUAL_STATE,
    TRI_STATE,
}

export class AccessibleCheckboxViewModel extends AccessibleElementViewModel<CheckboxElementSelectorSet> {

    public static readonly CHECKBOX_ROLE: string = 'checkbox';

    public constructor(
        public readonly selectors: CheckboxElementSelectorSet = CheckboxElementSelectorSet.createDefault(),
        public readonly labelViewModel: AccessibleElementLabelViewModel = AccessibleElementLabelViewModel.createDefault(),
        public readonly checkboxType: AccessibleCheckboxType = AccessibleCheckboxType.DUAL_STATE,
    ) {
        super(selectors, labelViewModel);
    }

    public static createDefault(): AccessibleCheckboxViewModel {
        return new AccessibleCheckboxViewModel();
    }
}

export class AccessibleTriStateCheckboxViewModel extends AccessibleElementViewModel<TriStateCheckboxElementSelectorSet> {
    public constructor(
        public readonly selectors: TriStateCheckboxElementSelectorSet = TriStateCheckboxElementSelectorSet.createDefault(),
        public readonly labelViewModel: AccessibleElementLabelViewModel = AccessibleElementLabelViewModel.createDefault(),
    ) {
        super(selectors, labelViewModel);
    }
    
    public static createDefault(): AccessibleTriStateCheckboxViewModel {
        return new AccessibleTriStateCheckboxViewModel();
    }
}

export function isCheckboxChecked(checkbox: Element): boolean {
    const hasCheckedAttribute: boolean = checkbox.hasAttribute('checked');
    return hasCheckedAttribute;
}

export function isCheckboxRole(element: Element): boolean {
    const hasCheckboxRole: boolean = element.getAttribute('role') === AccessibleCheckboxViewModel.CHECKBOX_ROLE;
    return hasCheckboxRole;
}

export function isCheckboxInput(element: Element): boolean {
    const isInputTag: boolean = element.tagName === 'INPUT';
    const isCheckboxType: boolean = element.getAttribute('type') === AccessibleCheckboxViewModel.CHECKBOX_ROLE;
    return isInputTag && isCheckboxType;
}

export function isKeyboardEvent(e: unknown): e is KeyboardEvent {
    const extendsEvent: boolean = (e instanceof Event);
    const hasKeyProp: boolean = typeof (e as Record<string, string>)['key'] === 'string';
    const hasCodeProp: boolean = typeof (e as Record<string, string>)['code'] === 'string';
    const isPossiblyKeyboardEvent: boolean = extendsEvent && hasKeyProp && hasCodeProp;
    return isPossiblyKeyboardEvent;
}

export function createCheckedStateToggleHandler<EventType extends Event>(checkbox: HTMLElement): (e: EventType) => void {
    return (e: EventType) => {
        if (isKeyboardEvent(e)) {
            const keyboardEvent: KeyboardEvent = e as KeyboardEvent;
            if (keyboardEvent.key !== ' ') {
                return;
            }
        }
        if (isCheckboxChecked(e.target as Element)) {
            checkbox.setAttribute('aria-checked', 'false');
            checkbox.removeAttribute('checked');
        } else {
            checkbox.setAttribute('aria-checked', 'true');
            checkbox.setAttribute('checked', '');
        }
    };
}

export function createTriStateCheckboxToggleHandler<EventType extends Event>(group: Element, checkboxes: NodeList): (e: EventType) => void {
    return (e: EventType) => {
        if (isKeyboardEvent(e)) {
            const keyboardEvent: KeyboardEvent = e as KeyboardEvent;
            if (keyboardEvent.key !== ' ') {
                return;
            }
        }
        
        if (isCheckboxRole(e.target as Element) || isCheckboxInput(e.target as Element)) {
            const targetIsChecked: boolean = isCheckboxChecked(e.target as Element);
            
            if (targetIsChecked) {
                (e.target as Element).removeAttribute('checked');
                (e.target as Element).setAttribute('aria-checked', 'false');
            } else {
                (e.target as Element).setAttribute('checked', '');
                (e.target as Element).setAttribute('aria-checked', 'true');
            }

            const totalGroupIsChecked: boolean = Array.from(checkboxes).every((checkbox: Node) => {
                
                const checkboxElement: Element = checkbox as Element;
                const isChecked: boolean = isCheckboxChecked(checkboxElement);
                return isChecked;
            });
            if (totalGroupIsChecked) {
                group.setAttribute('aria-checked', 'true');
            } else {
                const isCompletelyUnchecked: boolean = Array.from(checkboxes).every((checkbox: Node) => {
                    const checkboxElement: Element = checkbox as Element;
                    const isChecked: boolean = isCheckboxChecked(checkboxElement);
                    return !isChecked;
                });
                if (isCompletelyUnchecked) {
                    group.setAttribute('aria-checked', 'false');
                } else {
                    group.setAttribute('aria-checked', 'mixed');
                }
            }
        }
    };
}

/**
 * Applies element attributes in accordance with the W3C WAI Checkbox Pattern.
 * Refer to the W3C documentation for the Checkbox pattern https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/.
 * 
 * @param checkboxElement DOM element serving as the root node for element selection.
 * @param viewModel View model specifying element characteristics.
 * @returns Returns the checkboxElement.
 */
export function makeAccessibleSimpleCheckbox(
    checkboxElement: HTMLElement,
    viewModel: AccessibleCheckboxViewModel,
    toggleHandlerCreator: (e: HTMLElement) => <T extends Event>(e: T) => void = createCheckedStateToggleHandler,
): HTMLElement {
    const { selectors, labelViewModel } = viewModel;
    const checkbox: Element | null = selectElementOrDefault(checkboxElement, selectors.checkboxSelector);
    if (checkbox !== null) {
        checkbox.setAttribute('role', AccessibleCheckboxViewModel.CHECKBOX_ROLE);
        AccessibleElementLabelViewModel.applyAccessibleLabel(checkbox, labelViewModel);
        applyDescribedBy(checkboxElement, selectors.descriptionSelector);
        if (isCheckboxChecked(checkbox)) {
            checkbox.setAttribute('aria-checked', 'true');
        } else {
            checkbox.setAttribute('aria-checked', 'false');
        }
        const checkboxHTMLElement: HTMLElement = checkbox as HTMLElement;
        const checkedToggleListener = toggleHandlerCreator(checkboxHTMLElement);
        checkboxHTMLElement.addEventListener('click', checkedToggleListener);
        checkboxHTMLElement.addEventListener('keyup', checkedToggleListener);

    }
    return checkboxElement;
}

export function makeAccessibleTriStateCheckbox(
    checkboxElement: HTMLElement,
    viewModel: AccessibleTriStateCheckboxViewModel,
    toggleHandlerCreator: <T extends Event>(e: HTMLElement, checkboxes: NodeList) => (e: T) => void = createTriStateCheckboxToggleHandler
): HTMLElement {
    const { selectors, labelViewModel } = viewModel;
    const group: Element | null = selectElementOrDefault(checkboxElement, selectors.groupSelector);
    const checkboxes: NodeList = checkboxElement.querySelectorAll(selectors.checkboxesSelector);

    if (group !== null) {
        group.setAttribute('role', 'group');
        AccessibleElementLabelViewModel.applyAccessibleLabel(group, labelViewModel);
        if (selectors.descriptionSelector) {
            applyDescribedBy(group, selectors.descriptionSelector);
        }
        if (checkboxes.length > 0) {
            
            const allAreChecked: boolean = Array.from(checkboxes).every((checkbox: Node) => {
                const checkboxElement: Element = checkbox as Element;
                const isChecked: boolean = isCheckboxChecked(checkboxElement);
                const ariaCheckedValue: string = isChecked ? 'true' : 'false';
                checkboxElement.setAttribute('aria-checked', ariaCheckedValue);
                checkboxElement.setAttribute('role', AccessibleCheckboxViewModel.CHECKBOX_ROLE);
                return isChecked;
            });
            if (allAreChecked) {
                group.setAttribute('aria-checked', 'true');
            } else {
                const allAreUnchecked: boolean = Array.from(checkboxes).every((checkbox: Node) => {
                    const checkboxElement: Element = checkbox as Element;
                    const isChecked: boolean = isCheckboxChecked(checkboxElement);
                    return !isChecked;
                });
                if (allAreUnchecked) {
                    group.setAttribute('aria-checked', 'false');
                } else {
                    group.setAttribute('aria-checked', 'mixed');
                }
            }
        }
        const handler = toggleHandlerCreator(group as HTMLElement, checkboxes);
        group.addEventListener('click', handler);
        group.addEventListener('keyup', handler);
    }
    return checkboxElement;
}
