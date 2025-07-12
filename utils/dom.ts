import { AnyKindOfFunction } from "../base/types";

export function createElementID(prefix: string = '', suffix: string = ''): string {
    return [prefix, window.crypto.randomUUID(), suffix].join('');
}

export function ensureElementHasID(element: Element, idGenerator: (...args: string[]) => string = createElementID): string {
    const elementID: string | null = element.getAttribute('id');
    if (!elementID) {
        const createdID: string = idGenerator();
        element.setAttribute('id', createdID);
        return createdID;
    }
    return elementID;
}

export function targetElementIsToggleButton(eventTarget: EventTarget | null): boolean {
    const element: HTMLElement = eventTarget as HTMLElement;
    const isButton: boolean = element.getAttribute('role') === 'button';
    const isControl: boolean = element.hasAttribute('aria-controls');
    const isExpandButton: boolean = element.hasAttribute('aria-expanded');
    return isButton && isControl && isExpandButton;
}

export function toggleExpandedHiddenState(toggleElement: HTMLElement, controlledElement: Element): void {
    toggleElement.addEventListener('click', () => {
        const expanded: string | null = toggleElement.getAttribute('aria-expanded');
        if (!expanded || expanded === 'false') {
            toggleElement.setAttribute('aria-expanded', 'true');
            controlledElement.removeAttribute('hidden');
        } else {
            toggleElement.setAttribute('aria-expanded', 'false');
            controlledElement.setAttribute('hidden', '');
        }
    });
}

export function determineLandmarkRole(element: Element): string {
    const isInBodyContext = () => {
        const bodyElement: Element | null = element.closest('body');
        return bodyElement !== null;
    };
    const roleMap: Record<string, () => string> = {
        ASIDE: () => 'complementary',
        FOOTER: () => {
            if (isInBodyContext()) {
                return 'contentinfo';
            }
            return '';
        },
        HEADER: () => {
            if (isInBodyContext()) {
                return 'banner';
            }
            return '';
        },
        MAIN: () => 'main',
        NAV: () => 'navigation',
        SECTION: () => {
            const hasLabel: boolean = element.hasAttribute('aria-label');
            const isLabelledBy: boolean = element.hasAttribute('aria-labelledby');
            if (hasLabel || isLabelledBy) {
                return 'region';
            }
            return '';
        },
    };
    const { tagName } = element;
    const isRuleDefined: boolean = roleMap.hasOwnProperty(tagName);
    if (isRuleDefined) {
        const role: string = roleMap[tagName]();
        return role;
    }
    return '';
}

export function isButtonElement(element: Element): boolean {
    if (element.tagName === 'BUTTON') {
        return true;
    }
    return false;
}

export function selectElementOrDefault(
    rootElement: Element,
    selector: string,
    defaultElement: Element | null = rootElement,
): Element | null {
    if (selector !== '') {
        const selectedElement: Element | null = rootElement.querySelector(selector);
        if (selectedElement) {
            return selectedElement;
        }
    }
    return defaultElement;
}

export function windowLocationIncludesUrl(linkUrl: string): boolean {
    const isUrlCurrentPage: boolean = window.location.href.includes(linkUrl);
    return isUrlCurrentPage;
}

export function interceptClick(element: HTMLElement): Promise<void> {
    return new Promise((resolve: AnyKindOfFunction) => {
        element.addEventListener('click', (e: MouseEvent) => {
            resolve();
        }, {
            once: true,
            passive: true,
        });
    });
}

export function queryChildren(parentElement: Element, selectors: string[]): (Element | null)[] {
    const elements: (Element | null)[] = selectors.map((selector: string) => {
        const element: Element | null = parentElement.querySelector(selector);
        return element;
    });
    return elements;
}
