import { 
    AnyKindOfFunction,
    filterOutNulls,
    KeyEventCallback,
    nextWrapAroundIndex,
    queryChildren,
    WrapAroundDirection,
} from '../utils';

export type FocusChange = {
    blurred: HTMLElement;
    focused: HTMLElement;
    blurredIndex: number;
    focusedIndex: number;
    elementCount: number;
}

export abstract class FocusInvoker {
    public abstract invokeFocus(element: HTMLElement): void;
}

export class MethodFocusInvoker extends FocusInvoker {
    public invokeFocus(element: HTMLElement): void {
        element.focus();
    }
}

export class DispatchFocusInvoker extends FocusInvoker {
    public invokeFocus(element: HTMLElement): void {
        element.dispatchEvent(new FocusEvent('focus', {
            bubbles: true,
        }));
    }
}

export abstract class ClickInvoker {
    public abstract invokeClick(element: HTMLElement): void;
}

export class MethodClickInvoker extends ClickInvoker {
    public invokeClick(element: HTMLElement): void {
        element.click();
    }
}

export class DispatchClickInvoker extends ClickInvoker {
    public invokeClick(element: HTMLElement): void {
        element.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
        }));
    }
}

export class TrappedKeyboardFocusState {

    public constructor(
        public readonly focusableElements: HTMLElement[],
        public readonly onCloseCallback: AnyKindOfFunction,
        private currentlyFocusedElementIndex: number = 0,
        private readonly focusInvoker: FocusInvoker = new MethodFocusInvoker(),
    ) {
        
    }

    public getCurrentFocusIndex(): number {
        return this.currentlyFocusedElementIndex;
    }

    private createFocusChangeState(direction: WrapAroundDirection): FocusChange {
        const currentlyFocusedElement: HTMLElement = this.focusableElements[this.currentlyFocusedElementIndex];
        const nextIndex: number = nextWrapAroundIndex(
            this.focusableElements,
            this.currentlyFocusedElementIndex,
            direction,
        );
        const nextElement: HTMLElement = this.focusableElements[nextIndex];
        const focusChange: FocusChange = {
            blurred: currentlyFocusedElement,
            blurredIndex: this.currentlyFocusedElementIndex,
            focused: nextElement,
            focusedIndex: nextIndex,
            elementCount: this.focusableElements.length,
        };
        return focusChange;
    }

    private focusAndResolve(focusChange: FocusChange): Promise<FocusChange> {
        return new Promise<FocusChange>((resolve) => {
            focusChange.focused.addEventListener('focus', () => {
                resolve(focusChange);
            }, {
                once: true,
                passive: true,
            });
            this.focusInvoker.invokeFocus(focusChange.focused);
        });
    }

    public focusNextElement(): Promise<FocusChange> {
        return this.focusAndResolve(
            this.updateCurrentlyFocusedElementIndex(
                this.createFocusChangeState(WrapAroundDirection.NEXT),
            ),
        );
    }

    private updateCurrentlyFocusedElementIndex(focusChange: FocusChange): FocusChange {
        this.currentlyFocusedElementIndex = focusChange.focusedIndex;
        return focusChange;
    }

    public focusPreviousElement(): Promise<FocusChange> {
        return this.focusAndResolve(
            this.updateCurrentlyFocusedElementIndex(
                this.createFocusChangeState(WrapAroundDirection.PREVIOUS),
            ),
        );
    }
}

export type TrappedKeyboardFocusKeyPressHandlerCallback = (
    trappedKeyboardFocusState: TrappedKeyboardFocusState,
    event: KeyboardEvent | undefined,
) => void;

export class OpenCloseListener {

    private openListeners: AnyKindOfFunction[] = [];
    private closeListeners: AnyKindOfFunction[] = [];

    public constructor(
        public readonly removeAfterNotify: boolean = true,
    ) {

    }

    public get openListenerCount(): number {
        return this.openListeners.length;
    }

    public get closeListenerCount(): number {
        return this.closeListeners.length;
    }
    
    private registerListener(listeners: AnyKindOfFunction[], listener: AnyKindOfFunction): void {
        const alreadyRegistered: boolean = !!listeners.find((
            fn: AnyKindOfFunction,
        ) => fn === listener);
        if (!alreadyRegistered) {
            listeners.push(listener);
        }
    }

    public registerOpenListener(listener: AnyKindOfFunction): void {
        this.registerListener(this.openListeners, listener);
    }

    public registerCloseListener(listener: AnyKindOfFunction): void {
        this.registerListener(this.closeListeners, listener);
    }

    public unregisterOpenListener(listener: AnyKindOfFunction): void {
        this.openListeners = this.removeListener(this.openListeners, listener);
    }

    public unregisterCloseListener(listener: AnyKindOfFunction): void {
        this.closeListeners = this.removeListener(this.closeListeners, listener);
    }
    
    private removeListener(listeners: AnyKindOfFunction[], listener: AnyKindOfFunction): AnyKindOfFunction[] {
        return listeners.filter((fn: AnyKindOfFunction) => fn !== listener);
    }

    private notifyListeners(listeners: AnyKindOfFunction[]): void {
        if (this.removeAfterNotify) {
            const listener: AnyKindOfFunction | undefined = listeners.shift();
            if (listener) {
                listener();
            }
        } else {
            listeners.forEach((listener: AnyKindOfFunction) => listener());
        }
    }

    public notifyOpenListeners(): void {
        this.notifyListeners(this.openListeners);
    }

    public notifyCloseListeners(): void {
        this.notifyListeners(this.closeListeners);
    }

    public clearOpenListeners(): void {
        this.closeListeners = [];
    }
    
    public clearCloseListeners(): void {
        this.openListeners = [];
    }

    
}

export type TrappedKeyboardFocusKeyPressInitializer<FocusInvokerType = DispatchFocusInvoker | MethodFocusInvoker > = {
    focusableElementsSelectors: string[];
    onEscapeDialogClose: AnyKindOfFunction;
    openCloseListeners: OpenCloseListener;
    initiallyFocusedElementIndex: number;
    focusInvoker: FocusInvokerType;
}

export function createTrappedElementKeyboardFocusHandler(
    trappedKeyboardFocusState: TrappedKeyboardFocusState,
): KeyEventCallback {
    return (event: KeyboardEvent) => {
        const { key, shiftKey } = event;
        if (key === 'Tab') {
            if (shiftKey) {
                trappedKeyboardFocusState.focusPreviousElement();
            } else {
                trappedKeyboardFocusState.focusNextElement();
            }
        } else if (key === 'Escape') {
            trappedKeyboardFocusState.onCloseCallback();
        }
    };
}


export function trapElementKeyboardFocus(
    parentElement: HTMLElement,
    initializer: TrappedKeyboardFocusKeyPressInitializer,
): Promise<TrappedKeyboardFocusState> {
    return new Promise<TrappedKeyboardFocusState>((resolve) => {
        const {
            onEscapeDialogClose,
            openCloseListeners,
            focusableElementsSelectors,
            initiallyFocusedElementIndex,
            focusInvoker,
        } = initializer;
        let keyPressHandler: KeyEventCallback | null = null;
        let trappedFocusState: TrappedKeyboardFocusState | null = null;
    
        const onOpenListener: AnyKindOfFunction = () => {
            const focusableElements: HTMLElement[] = filterOutNulls(
                queryChildren(parentElement, focusableElementsSelectors),
            ) as HTMLElement[];
            trappedFocusState = new TrappedKeyboardFocusState(
                focusableElements, () => {
                    parentElement.removeEventListener('keypress', keyPressHandler as unknown as KeyEventCallback);
                    onEscapeDialogClose();
                },
                initiallyFocusedElementIndex,
                focusInvoker,
            );
            keyPressHandler = createTrappedElementKeyboardFocusHandler(trappedFocusState);
            parentElement.addEventListener('keyup', keyPressHandler);
            resolve(trappedFocusState);
        };
        const onCloseListener: AnyKindOfFunction = () => {
            if (keyPressHandler !== null) {
                parentElement.removeEventListener('keyup', keyPressHandler);
            }
            if (trappedFocusState !== null) {
                trappedFocusState = null;
            }
        };
        openCloseListeners.registerCloseListener(onCloseListener);
        openCloseListeners.registerOpenListener(onOpenListener);
    });
}
