import {
    AccessibleDecoratorConfig,
    AccessibleDecoratorConfigOptions,
} from './config';
import { isButtonElement } from './utils';

export type MessageLookup = Record<string, (...rest: any[]) => string>;
export const MESSAGE_TABLE: MessageLookup = {
    CAROUSEL_DUPLICATE_IN_LABEL: (
        element: Element | string,
        role: string,
        appConfig: AccessibleDecoratorConfigOptions = AccessibleDecoratorConfig,
    ): string => {
        if (appConfig.LOG_ACCESSIBILITY_WARNINGS) {
            let labelText: string = '';
            if (typeof element !== 'string' && element instanceof Element) {
                labelText = element.textContent?.toLowerCase?.() ?? '';
            } else if (typeof element === 'string') {
                labelText = element as string;
            } else {
                return '';
            }
            if (labelText.includes(role.toLowerCase())) {
                const message: string = `The carousel accessibility label text contains the word "${role}" which duplicates the aria-roledescription.`;
                return message;
            }
        }
        return '';
    },
    CAROUSEL_CONTROL_NOT_BUTTON: (
        element: Element,
        controlName: string,
        appConfig: AccessibleDecoratorConfigOptions = AccessibleDecoratorConfig,
    ): string => {
        if (appConfig.LOG_ACCESSIBILITY_WARNINGS) {
            if (!isButtonElement(element)) {
                const message: string = `The carousel ${controlName} control is not a native BUTTON element.`;
                return message;
            }
        }
        return '';
    },
}

export function warnAccessibilityMessage(
    messageText: string,
    appConfig: AccessibleDecoratorConfigOptions = AccessibleDecoratorConfig,
): void {
    if (appConfig.LOG_ACCESSIBILITY_WARNINGS) {
        console.warn(messageText);
    }
}

