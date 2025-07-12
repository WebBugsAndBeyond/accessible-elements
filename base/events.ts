import { identityFunction } from "./types";

export type FocusChange = {
    blurred: HTMLElement;
    focused: HTMLElement;
    blurredIndex: number;
    focusedIndex: number;
    elementCount: number;
}

export abstract class DOMActionInvoker {
    public abstract invoke(element: HTMLElement): void;
}

export class FocusMethodInvoker extends DOMActionInvoker {
    public invoke(element: HTMLElement): void {
        element.focus();
    }
}

export class FocusEventDispatchInvoker extends DOMActionInvoker {
    public invoke(element: HTMLElement): void {
        element.dispatchEvent(new FocusEvent('focus', {
            bubbles: true,
        }));
    }
}

export class ClickMethodInvoker extends DOMActionInvoker {
    public invoke(element: HTMLElement): void {
        element.click();
    }
}

export class ClickEventDispatchInvoker extends DOMActionInvoker {
    public invoke(element: HTMLElement): void {
        element.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
        }));
    }
}
