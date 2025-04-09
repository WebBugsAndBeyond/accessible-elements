import { AccessibleButtonType, AccessibleButtonViewModel, ButtonElementSelectorSet, makeAccessibleButton } from "./button";
import { MESSAGE_TABLE, warnAccessibilityMessage } from "./logs";
import { AccessibleTabsViewModel } from "./tabs";
import { AccessibleElementLabelSelectorPreference, AccessibleElementLabelViewModel, AccessibleElementViewModel, selectElementOrDefault } from "./utils";

export class CarouselControlButtonSelectorSet extends ButtonElementSelectorSet {

    public constructor(
        public readonly buttonSelector: string = ButtonElementSelectorSet.DEFAULT_BUTTON_SELECTOR,
        public readonly descriptionSelector: string = ButtonElementSelectorSet.DEFAULT_DESCRIPTION_SELECTOR,
        public readonly stateLabels: string[] = [],
        public currentLabelIndex: number = -1,
    ) {
        super(buttonSelector, descriptionSelector);
    }

    public static createDefault(): CarouselControlButtonSelectorSet {
        return new CarouselControlButtonSelectorSet();
    }

    public transformToButtonViewModel(): AccessibleButtonViewModel {
        const labelText: string = this.stateLabels.length > 0 && this.currentLabelIndex >= 0 && this.currentLabelIndex < (this.stateLabels.length - 1) ? this.stateLabels[this.currentLabelIndex] : '';
        const labelId: string = '';
        const labelElementSelector: string = '';
        const preference: AccessibleElementLabelSelectorPreference = AccessibleElementLabelSelectorPreference.LABEL_TEXT;
        const labelViewModel: AccessibleElementLabelViewModel = new AccessibleElementLabelViewModel(
            labelId,
            labelText,
            labelElementSelector,
            preference,
        );
        const selectors: ButtonElementSelectorSet = this;
        const buttonType: AccessibleButtonType = AccessibleButtonType.TOGGLE_BUTTON;
        const buttonViewModel: AccessibleButtonViewModel = new AccessibleButtonViewModel(
            selectors,
            labelViewModel,
            buttonType,
        );
        return buttonViewModel;
    }
}

export class CarouselSlideSelector {
    public constructor(
        public readonly slideContainersSelector: string = '',
        public readonly slideLabelIDs: string[] = [],
        public readonly slideLabels: string[] = [],
    ) {

    }

    public static createDefault(): CarouselSlideSelector {
        return new CarouselSlideSelector();
    }
}

export class CarouselElementSelectorSet {
    public constructor(
        public readonly containerSelector: string = '',
        public readonly rotationSelector: CarouselControlButtonSelectorSet = CarouselControlButtonSelectorSet.createDefault(),
        public readonly nextSlideSelector: CarouselControlButtonSelectorSet = CarouselControlButtonSelectorSet.createDefault(),
        public readonly prevSlideSelector: CarouselControlButtonSelectorSet = CarouselControlButtonSelectorSet.createDefault(),
        public readonly slideSelectors: CarouselSlideSelector = CarouselSlideSelector.createDefault(),
    ) {

    }

    public static createDefault(): CarouselElementSelectorSet {
        return new CarouselElementSelectorSet();
    }
}

export class TabbedCarouselElementSelectorSet {
    public constructor(
        public readonly containerSelector: string = '',
        public readonly tabsViewModel: AccessibleTabsViewModel = AccessibleTabsViewModel.createDefault(),
    ) {

    }

    public static createDefault(): TabbedCarouselElementSelectorSet {
        return new TabbedCarouselElementSelectorSet();
    }
}

export type CarouselControlSelectors = Pick<CarouselElementSelectorSet, 'rotationSelector' | 'nextSlideSelector' | 'prevSlideSelector'>;

export type NamedSelectorPair = [CarouselControlButtonSelectorSet, string];

export function createButtonStateLabelClickHandler(
    container: Element,
    carouselSelectors: CarouselElementSelectorSet,
): (e: Event) => void {
    return (e: Event) => {
        const clickedButton: EventTarget | null = e.target;
        if (clickedButton !== null) {
            const selectedButtonSelectors: CarouselControlButtonSelectorSet | undefined = [
                carouselSelectors.rotationSelector,
                carouselSelectors.nextSlideSelector,
                carouselSelectors.prevSlideSelector,
            ].find((selector: CarouselControlButtonSelectorSet) => {
                const { buttonSelector = '' } = selector;
                const selectedButton: Element | null = container.querySelector(buttonSelector);
                return (clickedButton as Element) === selectedButton;
            });
            if (selectedButtonSelectors) {
                const { stateLabels, currentLabelIndex = 0 } = selectedButtonSelectors;
                const nextLabelIndex: number = currentLabelIndex < (stateLabels.length - 2) ? currentLabelIndex + 1 : 0;
                const currentLabel: string = stateLabels[nextLabelIndex];
                const clickedButtonElement: Element = clickedButton as Element;
                clickedButtonElement.setAttribute('aria-label', currentLabel);
                if (clickedButtonElement.hasAttribute('aria-labelledby')) {
                    const labelId: string | null = clickedButtonElement.getAttribute('aria-labelledby');
                    if (labelId) {
                        const label: Element | null = container.querySelector(`#${labelId}`);
                        if (label !== null) {
                            label.textContent = currentLabel;
                        }
                    }
                }
                if (nextLabelIndex < (stateLabels.length - 1)) {
                    selectedButtonSelectors.currentLabelIndex = nextLabelIndex;
                } else {
                    selectedButtonSelectors.currentLabelIndex = 0;
                }
            }
        }
    };
}

export class AccessibleRoleDescriptor {
    public static readonly BASIC_CAROUSEL_ROLE_NAME: string = 'group';
    public static readonly TABBED_CAROUSEL_ROLE_NAME: string = 'tabpanel';
    public static readonly BASIC_CAROUSEL_ROLE_DESCRIPTION: string = 'slide';

    constructor(public readonly roleName: string, public readonly roleDescription: string | undefined = undefined) {
        Object.freeze(this);
    }

    public static createDefault(): AccessibleRoleDescriptor {
        return new AccessibleRoleDescriptor(
            AccessibleRoleDescriptor.BASIC_CAROUSEL_ROLE_NAME,
            AccessibleRoleDescriptor.BASIC_CAROUSEL_ROLE_DESCRIPTION,
        );
    }
}

export class AccessibleLabelDescriptor {
    public constructor(
        public readonly labelId: string = '',
        public readonly labelText: string = '',
        public readonly preference: 'id' | 'text' = 'id',
    ) {
        Object.freeze(this);
    }
}

export function createBasicCarouselSlideRoleDescriptor(): AccessibleRoleDescriptor {
    return new AccessibleRoleDescriptor(
        AccessibleRoleDescriptor.BASIC_CAROUSEL_ROLE_NAME,
        AccessibleRoleDescriptor.BASIC_CAROUSEL_ROLE_DESCRIPTION,
    );
}

export function createTabbedCarouselSlideRoleDescriptor(): AccessibleRoleDescriptor {
    return new AccessibleRoleDescriptor(AccessibleRoleDescriptor.TABBED_CAROUSEL_ROLE_NAME);
}

export function makeAccessibleCarouselSlide(
    slideElement: Element,
    roleDescriptor: AccessibleRoleDescriptor,
    labelDescriptor: AccessibleLabelDescriptor,
): Element {
    const { roleName = '', roleDescription = '' } = roleDescriptor;
    const { labelId, labelText, preference } = labelDescriptor;
    slideElement.setAttribute('role', roleName);
    if (roleDescription !== '') {
        slideElement.setAttribute('aria-roledescription', roleDescription);
    }

    const assignLabelId = () => {
        slideElement.setAttribute('aria-labelledby', labelId);
        warnAccessibilityMessage(MESSAGE_TABLE.CAROUSEL_DUPLICATE_IN_LABEL(document.getElementById(labelId), 'slide'));
    };
    const assignLabelText = () => {
        slideElement.setAttribute('aria-label', labelText);
        warnAccessibilityMessage(MESSAGE_TABLE.CAROUSEL_DUPLICATE_IN_LABEL(document.getElementById(labelId), 'slide'));
    };
    if (labelId !== '' && labelText !== '') {
        if (preference === 'id') {
            assignLabelId();
        } else {
            assignLabelText();
        }
    } else if (labelId !== '') {
        assignLabelId();
    } else if (labelText !== '') {
        assignLabelText();
    }
    return slideElement;
}

export function createPositionInSlideSetLabel(ordinal: number, slideCount: number): string {
    const posInSetLabel: string = `${ordinal} of ${slideCount}`;
    return posInSetLabel;
}

export class AccessibleCarouselViewModel extends AccessibleElementViewModel<CarouselElementSelectorSet> {

    public static readonly DEFAULT_AUTO_ROTATING: boolean = true;
    public static CAROUSEL_ROLE_NAME: string = 'carousel';

    public constructor(
        public readonly selectors: CarouselElementSelectorSet = CarouselElementSelectorSet.createDefault(),
        public readonly labelViewModel: AccessibleElementLabelViewModel = AccessibleElementLabelViewModel.createDefault(),
        public readonly isAutoRotating: boolean = AccessibleCarouselViewModel.DEFAULT_AUTO_ROTATING,
        public readonly roleDescriptor: AccessibleRoleDescriptor = AccessibleRoleDescriptor.createDefault(),
    ) {
        super(selectors, labelViewModel);
    }

    public static createDefault(): AccessibleCarouselViewModel {
        return new AccessibleCarouselViewModel();
    }
}

export function makeAccessibleCarouselBasic(
    carouselElement: HTMLElement,
    viewModel: AccessibleCarouselViewModel = AccessibleCarouselViewModel.createDefault(),
): HTMLElement {
    const { selectors, labelViewModel, roleDescriptor, isAutoRotating } = viewModel;
    const containerElement: Element | null = selectElementOrDefault(carouselElement, selectors.containerSelector);
    
    if (containerElement !== null) {
        containerElement.setAttribute('aria-roledescription', AccessibleCarouselViewModel.CAROUSEL_ROLE_NAME);
        AccessibleElementLabelViewModel.applyAccessibleLabel(containerElement, labelViewModel);
        
        const namedSelectors: NamedSelectorPair[] = [
            [selectors.rotationSelector, 'rotation'],
            [selectors.prevSlideSelector, 'previous'],
            [selectors.nextSlideSelector, 'next'],
        ];

        namedSelectors.forEach(([selector, name]) => {
            const { buttonSelector = '' } = selector;
            const buttonElement: HTMLElement | null = containerElement.querySelector(buttonSelector);
            if (buttonElement) {
                const buttonViewModel: AccessibleButtonViewModel = selector.transformToButtonViewModel();
                makeAccessibleButton(buttonElement, buttonViewModel);
                warnAccessibilityMessage(MESSAGE_TABLE.CAROUSEL_CONTROL_NOT_BUTTON(buttonElement, name));
            }
        });
        containerElement.addEventListener(
            'click',
            createButtonStateLabelClickHandler(containerElement, selectors),
        );
        const slideElements: NodeList = containerElement.querySelectorAll(selectors.slideSelectors.slideContainersSelector);
        slideElements.forEach((slide: Node, key: number) => {
            const slideElement: Element = slide as Element;
            makeAccessibleCarouselSlide(slideElement, roleDescriptor, new AccessibleLabelDescriptor(
                selectors.slideSelectors.slideLabelIDs?.[key] ?? '', 
                selectors.slideSelectors.slideLabels?.[key] ?? ''
            ));
        });
        const slideWrapperElement: Element | null = slideElements.item(0)?.parentElement ?? null;
        if (slideWrapperElement) {
            slideWrapperElement.setAttribute('aria-atomic', 'false');
            const ariaLive: string = isAutoRotating ? 'off' : 'polite';
            slideWrapperElement.setAttribute('aria-live', ariaLive);
        }
    }
    return carouselElement;
}

export function makeAccessibleCarouselTabbed(
    carouselElement: HTMLElement,
    selectors: CarouselElementSelectorSet,
): HTMLElement {

    return carouselElement;
}

export function makeAccessibleCarouselGrouped(
    carouselElement: HTMLElement,
    selectors: CarouselElementSelectorSet,
): HTMLElement {

    return carouselElement;
}
