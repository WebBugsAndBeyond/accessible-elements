import { AnyKindOfFunction, KeyEventCallback } from '../utils';
import { ClickInvoker, createTrappedElementKeyboardFocusHandler, DispatchClickInvoker, DispatchFocusInvoker, FocusChange, FocusInvoker, MethodClickInvoker, MethodFocusInvoker, OpenCloseListener, trapElementKeyboardFocus, TrappedKeyboardFocusKeyPressInitializer, TrappedKeyboardFocusState } from './keyboard-focus-trap';

describe('The TrappedKeyboardFocusState class', () => {

    const BUTTON_TEXT: string[] = ['First', 'Middle', 'Last'];

    function createButtonElement(buttonText: string): HTMLElement {
        const buttonElement: HTMLElement = document.createElement('button');
        buttonElement.textContent = buttonText;
        return buttonElement;
    }

    function createButtons(buttonsText: string[] = BUTTON_TEXT): HTMLElement[] {
        const buttonCollection: HTMLElement[] = BUTTON_TEXT.map(createButtonElement);
        return buttonCollection;
    }

    function createWrapper(buttons: HTMLElement[]): HTMLElement {
        const divWrapper: HTMLElement = document.createElement('div');
        divWrapper.append(...buttons);
        return divWrapper;
    }
    
    function createButtonClickHandlers(buttons: HTMLElement[]): jest.Mock[] {
        const focusHandlers: jest.Mock[] = buttons.map((button: HTMLElement) => jest.fn());
        focusHandlers.forEach((handler: jest.Mock, index: number) => {
            const buttonElement: HTMLElement = buttons[index];
            buttonElement.addEventListener('focus', handler);
        });
        return focusHandlers;
    }

    it('defines a focusableElements HTMLElement array upon instantiation.', () => {
        const buttons: HTMLElement[] = createButtons();
        const instance: TrappedKeyboardFocusState = new TrappedKeyboardFocusState(buttons, () => {});
        expect(instance.focusableElements).toBeDefined();
        expect(instance.focusableElements).toBe(buttons);
    });
    it('provides the index of the currently focused element.', () => {
        const buttons: HTMLElement[] = createButtons();
        const instance: TrappedKeyboardFocusState = new TrappedKeyboardFocusState(buttons, () => {});
        expect(instance.getCurrentFocusIndex()).toEqual(0);
        
    });
    it('applies focus to the next element from 0 through N-1 back to 0.', async () => {
        const buttonText: string[] = [...BUTTON_TEXT];
        const buttons: HTMLElement[] = createButtons(buttonText);
        const focusHandlers: jest.Mock[] = createButtonClickHandlers(buttons);
        const instance: TrappedKeyboardFocusState = new TrappedKeyboardFocusState(
            buttons, () => {},
            0,
            new DispatchFocusInvoker(),
        );
        const iterationHandlers: jest.Mock[] = [...focusHandlers.slice(1), focusHandlers[0]];
        const iterationButtons: HTMLElement[] = [...buttons.slice(1), buttons[0]];
        const iterationBlurredIndexes: number[] = Array.from(buttons.keys());
        const iterationFocusedIndexes: number[] = [
            ...Array.from(buttons.keys()).slice(1),
            0,
        ];

        for (let i: number = 0; i < iterationHandlers.length; ++i) {
            const focusChange: FocusChange = await instance.focusNextElement();
            expect(focusChange.blurred).toBe(buttons[i]);
            expect(focusChange.blurredIndex).toEqual(iterationBlurredIndexes[i]);
            expect(focusChange.focused).toEqual(iterationButtons[i]);
            expect(focusChange.focusedIndex).toEqual(iterationFocusedIndexes[i]);
            expect(focusHandlers[iterationFocusedIndexes[i]]).toHaveBeenCalled();
        }
    });
    it('applies focus to the previous element from N-1 through 0 back to N-1.', async () => {
        const buttonText: string[] = [...BUTTON_TEXT];
        const buttons: HTMLElement[] = createButtons(buttonText);
        const focusHandlers: jest.Mock[] = createButtonClickHandlers(buttons);
        const instance: TrappedKeyboardFocusState = new TrappedKeyboardFocusState(
            buttons,
            () => {},
            buttons.length - 1,
            new DispatchFocusInvoker(),
        );
        const iterationHandlers: jest.Mock[] = createButtonClickHandlers(buttons);
        const reversedButtons: HTMLElement[] = ((copy: HTMLElement[]): HTMLElement[] => {
            copy.reverse();
            return copy;
        })([...buttons]);
        const iterationFocusButtons: HTMLElement[] = [...reversedButtons.slice(1), reversedButtons[0]];
        const iterationFocusedIndexes: number[] = ((keys: number[]): number[] => {
            keys.reverse();
            return [...keys.slice(1), keys[0]];
        })(Array.from(buttons.keys()));
        
        const iterationBlurredIndexes: number[] = ((buttonKeys: number[]): number[] => {
            buttonKeys.reverse();
            return buttonKeys;
        })(Array.from(buttons.keys()));

        for (let i: number = 0; i < iterationHandlers.length; ++i) {
            const focusChange: FocusChange = await instance.focusPreviousElement();
            expect(focusChange.blurred).toEqual(buttons[iterationBlurredIndexes[i]]);
            expect(focusChange.blurredIndex).toEqual(iterationBlurredIndexes[i]);
            expect(focusChange.focused).toEqual(iterationFocusButtons[i]);
            expect(focusChange.focusedIndex).toEqual(iterationFocusedIndexes[i]);
            expect(focusHandlers[iterationFocusedIndexes[i]]).toHaveBeenCalled();
        }
    });
});
describe('The MethodFocusInvoker class', () => {
    it('invokes the focus method of an HTML element.', () => {
        const element: HTMLElement = document.createElement('button');
        element.textContent = 'Test button';
        const invoker: FocusInvoker = new MethodFocusInvoker();
        const focusSpy = jest.spyOn(element, 'focus');
        invoker.invokeFocus(element);
        expect(focusSpy).toHaveBeenCalled();
    });
});
describe('The DispatchFocusInvoker class', () => {
    it('dispatches a focus event on an HTML element.', () => {
        const element: HTMLElement = document.createElement('button');
        element.textContent = 'Test Button';
        const focusHandler: jest.Mock = jest.fn();
        element.addEventListener('focus', focusHandler);
        const invoker: FocusInvoker = new DispatchFocusInvoker();
        invoker.invokeFocus(element);
        expect(focusHandler).toHaveBeenCalled();
    });
});

describe('MethodClickInvoker', () => {
    it('invokes the click method on an element.', () => {
        const element: HTMLElement = document.createElement('button');
        element.textContent = 'Test Button';
        const clickSpy = jest.spyOn(element, "click");
        const invoker: ClickInvoker = new MethodClickInvoker();
        invoker.invokeClick(element);
        expect(clickSpy).toHaveBeenCalled();
    });
});

describe('DispatchClickInvoker', () => {
    it('dispatches a click event on an element.', () => {
        const element: HTMLElement = document.createElement('button');
        element.textContent = 'Test Button';
        const dispatchEventSpy = jest.spyOn(element, 'dispatchEvent');
        const invoker: ClickInvoker = new DispatchClickInvoker();
        invoker.invokeClick(element);
        expect(dispatchEventSpy).toHaveBeenCalled();
    });
});

describe('The createTrappedElementKeyboardFocusHandler function', () => {

    const BUTTON_TEXT: string[] = ['Cancel', 'No', 'Yes'];

    function createButtonElement(buttonText: string): HTMLElement {
        const buttonElement: HTMLElement = document.createElement('button');
        buttonElement.textContent = buttonText;
        return buttonElement;
    }

    function createButtons(buttonsText: string[] = BUTTON_TEXT): HTMLElement[] {
        return buttonsText.map(createButtonElement);
    }

    function createWrapperElement(buttons: HTMLElement[]): HTMLElement {
        const wrapperElement: HTMLElement = document.createElement('div');
        wrapperElement.append(...buttons);
        return wrapperElement;
    }

    it('returns a function that moves focus from 0 through N-1 to 0 with the TAB key.', () => {
        const buttons: HTMLElement[] = createButtons();
        const wrapper: HTMLElement = createWrapperElement(buttons);
        const trappedState: TrappedKeyboardFocusState = new TrappedKeyboardFocusState(
            buttons,
            () => {},
            0,
            new DispatchFocusInvoker(),
        );
        const focusSpy: jest.SpyInstance<Promise<FocusChange>> = jest.spyOn(trappedState, 'focusNextElement');
        const focusHandler: KeyEventCallback = createTrappedElementKeyboardFocusHandler(trappedState);
        wrapper.addEventListener('keyup', focusHandler);
        for (let i: number = 0; i < buttons.length; ++i) {
            buttons[i].dispatchEvent(new KeyboardEvent('keyup', {
                key: 'Tab',
                code: 'Tab',
                bubbles: true,
                shiftKey: false,
            }));
        }
        expect(focusSpy).toHaveBeenCalledTimes(buttons.length);
    });
    it('applies focus to the previous focusable element when the TAB key is pressed with shift.', () => {
        const buttons: HTMLElement[] = createButtons();
        const wrapper: HTMLElement = createWrapperElement(buttons);
        const trappedState: TrappedKeyboardFocusState = new TrappedKeyboardFocusState(
            buttons,
            () => {},
            0,
            new DispatchFocusInvoker(),
        );
        const focusSpy: jest.SpyInstance<Promise<FocusChange>> = jest.spyOn(trappedState, 'focusPreviousElement');
        const focusHandler: KeyEventCallback = createTrappedElementKeyboardFocusHandler(trappedState);
        wrapper.addEventListener('keyup', focusHandler);
        for (let i: number = 0; i < buttons.length; ++i) {
            buttons[i].dispatchEvent(new KeyboardEvent('keyup', {
                key: 'Tab',
                code: 'Tab',
                bubbles: true,
                shiftKey: true,
            }));
        }
        expect(focusSpy).toHaveBeenCalledTimes(buttons.length);
    });
    it('invokes the close dialog callback function when the Escape key is pressed.', () => {
        const buttons: HTMLElement[] = createButtons();
        const wrapper: HTMLElement = createWrapperElement(buttons);
        const closeCallback: jest.Mock = jest.fn();
        const trappedState: TrappedKeyboardFocusState = new TrappedKeyboardFocusState(
            buttons,
            closeCallback,
            0,
            new DispatchFocusInvoker(),
        );
        
        const focusHandler: KeyEventCallback = createTrappedElementKeyboardFocusHandler(trappedState);
        wrapper.addEventListener('keyup', focusHandler);
        for (let i: number = 0; i < buttons.length; ++i) {
            buttons[i].dispatchEvent(new KeyboardEvent('keyup', {
                key: 'Escape',
                code: 'Escape',
                bubbles: true,
                shiftKey: false,
            }));
        }
        expect(closeCallback).toHaveBeenCalledTimes(buttons.length);
    });
});

describe('The OpenCloseListener class', () => {
    it('defines open/close listeners.', () => {
        const listeners: OpenCloseListener = new OpenCloseListener();
        expect(listeners.closeListenerCount).toEqual(0);
        expect(listeners.openListenerCount).toEqual(0);
        listeners.registerCloseListener(() => {});
        listeners.registerOpenListener(() => {});
        expect(listeners.closeListenerCount).toEqual(1);
        expect(listeners.openListenerCount).toEqual(1);
    });
    it('removes listeners after notification.', () => {
        const listeners: OpenCloseListener = new OpenCloseListener();
        const openListener: jest.Mock = jest.fn();
        const closeListener: jest.Mock = jest.fn();
        expect(listeners.closeListenerCount).toEqual(0);
        expect(listeners.openListenerCount).toEqual(0);
        listeners.registerCloseListener(closeListener);
        listeners.registerOpenListener(openListener);
        expect(listeners.closeListenerCount).toEqual(1);
        expect(listeners.openListenerCount).toEqual(1);
        listeners.notifyCloseListeners();
        listeners.notifyOpenListeners();
        expect(openListener).toHaveBeenCalled();
        expect(closeListener).toHaveBeenCalled();
        expect(listeners.closeListenerCount).toEqual(0);
        expect(listeners.openListenerCount).toEqual(0);
    });
    it('does not remove listeners after notification.', () => {
        const listeners: OpenCloseListener = new OpenCloseListener(false);
        const openListener: jest.Mock = jest.fn();
        const closeListener: jest.Mock = jest.fn();
        expect(listeners.closeListenerCount).toEqual(0);
        expect(listeners.openListenerCount).toEqual(0);
        listeners.registerCloseListener(closeListener);
        listeners.registerOpenListener(openListener);
        expect(listeners.closeListenerCount).toEqual(1);
        expect(listeners.openListenerCount).toEqual(1);
        listeners.notifyCloseListeners();
        listeners.notifyOpenListeners();
        expect(closeListener).toHaveBeenCalled();
        expect(openListener).toHaveBeenCalled();
        expect(listeners.closeListenerCount).toEqual(1);
        expect(listeners.openListenerCount).toEqual(1);
    });
    it('does not register duplicate listeners.', () => {
        const listeners: OpenCloseListener = new OpenCloseListener();
        const openListener: jest.Mock = jest.fn();
        const closeListener: jest.Mock = jest.fn();
        expect(listeners.closeListenerCount).toEqual(0);
        expect(listeners.openListenerCount).toEqual(0);
        listeners.registerCloseListener(closeListener);
        listeners.registerOpenListener(openListener);
        expect(listeners.closeListenerCount).toEqual(1);
        expect(listeners.openListenerCount).toEqual(1);
        listeners.registerCloseListener(closeListener);
        listeners.registerOpenListener(openListener);
        expect(listeners.closeListenerCount).toEqual(1);
        expect(listeners.openListenerCount).toEqual(1);
    });
    it('clears the registered listener collections.', () => {
        const instance: OpenCloseListener = new OpenCloseListener();
        const openListener: jest.Mock = jest.fn();
        const closeListener: jest.Mock = jest.fn();
        expect(instance.closeListenerCount).toEqual(0);
        expect(instance.openListenerCount).toEqual(0);
        instance.registerCloseListener(closeListener);
        instance.registerOpenListener(openListener);
        expect(instance.closeListenerCount).toEqual(1);
        expect(instance.openListenerCount).toEqual(1);
        instance.clearCloseListeners();
        instance.clearOpenListeners();
        expect(instance.closeListenerCount).toEqual(0);
        expect(instance.openListenerCount).toEqual(0);
    });
    it('unregisters listeners.', () => {
        const instance: OpenCloseListener = new OpenCloseListener();
        const openListeners: jest.Mock[] = [jest.fn(), jest.fn()];
        const closeListeners: jest.Mock[] = [jest.fn(), jest.fn()];
        expect(instance.closeListenerCount).toEqual(0);
        expect(instance.openListenerCount).toEqual(0);
        openListeners.forEach((listener: AnyKindOfFunction) => instance.registerOpenListener(listener));
        closeListeners.forEach((listener: AnyKindOfFunction) => instance.registerCloseListener(listener));
        expect(instance.closeListenerCount).toEqual(2);
        expect(instance.openListenerCount).toEqual(2);
        instance.unregisterCloseListener(closeListeners[0]);
        instance.unregisterOpenListener(openListeners[0]);
        expect(instance.closeListenerCount).toEqual(1);
        expect(instance.openListenerCount).toEqual(1);
    });
});

describe('The trapElementKeyboardFocus function', () => {

    const BUTTON_TEXT: string[] = ['First', 'Middle', 'Last'];

    function createButton(text: string): HTMLElement {
        const buttonElement: HTMLElement = document.createElement('button');
        buttonElement.textContent = text;
        return buttonElement;
    }

    function createButtons(buttonsText: string[] = BUTTON_TEXT): HTMLElement[] {
        return buttonsText.map(createButton);
    }

    function createWrapperElement(buttons: HTMLElement[]): HTMLElement {
        const div: HTMLElement = document.createElement('div');
        div.append(...buttons);
        return div;
    }

    it('initializes a keyboard trap when the open signal is received.', async () => {
        const initializer: TrappedKeyboardFocusKeyPressInitializer = {
            focusableElementsSelectors: (new Array(BUTTON_TEXT.length)).fill(':scope > button'),
            onEscapeDialogClose: jest.fn(),
            openCloseListeners: new OpenCloseListener(false),
            focusInvoker: new DispatchFocusInvoker(),
            initiallyFocusedElementIndex: 0,
        };
        const buttons: HTMLElement[] = createButtons();
        const wrapper: HTMLElement = createWrapperElement(buttons);
        const trapPromise: Promise<TrappedKeyboardFocusState> = trapElementKeyboardFocus(wrapper, initializer);
        initializer.openCloseListeners.notifyOpenListeners();
        const resolvedState: TrappedKeyboardFocusState = await trapPromise;
        const nextSpy: jest.SpyInstance<Promise<FocusChange>> = jest.spyOn(resolvedState, 'focusNextElement');
        const previousSpy: jest.SpyInstance<Promise<FocusChange>> = jest.spyOn(resolvedState, 'focusPreviousElement');
        const closeSpy: jest.SpyInstance = jest.spyOn(resolvedState, 'onCloseCallback');
    
        for (let i: number = 0; i < buttons.length; ++i) {
            buttons[i].dispatchEvent(new KeyboardEvent('keyup', {
                key: 'Tab',
                code: 'Tab',
                bubbles: true,
            }));
        }
        for (let i: number = 0; i < buttons.length; ++i) {
            buttons[i].dispatchEvent(new KeyboardEvent('keyup', {
                key: 'Tab',
                code: 'Tab',
                bubbles: true,
                shiftKey: true,
            }));
        }
        buttons[0].dispatchEvent(new KeyboardEvent('keyup', {
            key: 'Escape',
            code: 'Escape',
            bubbles: true,
        }));
        
        expect(closeSpy).toHaveBeenCalled();
        expect(nextSpy).toHaveBeenCalledTimes(buttons.length);
        expect(previousSpy).toHaveBeenCalledTimes(buttons.length);
        expect(initializer.onEscapeDialogClose).toHaveBeenCalled();
    });
    it('removes the keyboard trap when closed.', async () => {
        const initializer: TrappedKeyboardFocusKeyPressInitializer = {
            focusableElementsSelectors: (new Array(BUTTON_TEXT.length)).fill(':scope > button'),
            onEscapeDialogClose: jest.fn(),
            openCloseListeners: new OpenCloseListener(false),
            focusInvoker: new DispatchFocusInvoker(),
            initiallyFocusedElementIndex: 0,
        };
        const buttons: HTMLElement[] = createButtons();
        const wrapper: HTMLElement = createWrapperElement(buttons);
        const trapPromise: Promise<TrappedKeyboardFocusState> = trapElementKeyboardFocus(wrapper, initializer);
        initializer.openCloseListeners.notifyOpenListeners();
        const resolvedState: TrappedKeyboardFocusState = await trapPromise;
        const nextSpy: jest.SpyInstance<Promise<FocusChange>> = jest.spyOn(resolvedState, 'focusNextElement');
        const previousSpy: jest.SpyInstance<Promise<FocusChange>> = jest.spyOn(resolvedState, 'focusPreviousElement');
        const closeSpy: jest.SpyInstance = jest.spyOn(resolvedState, 'onCloseCallback');

        initializer.openCloseListeners.notifyCloseListeners();
        for (let i: number = 0; i < buttons.length; ++i) {
            buttons[i].dispatchEvent(new KeyboardEvent('keyup', {
                key: 'Tab',
                code: 'Tab',
                bubbles: true,
            }));
        }
        for (let i: number = 0; i < buttons.length; ++i) {
            buttons[i].dispatchEvent(new KeyboardEvent('keyup', {
                key: 'Tab',
                code: 'Tab',
                bubbles: true,
                shiftKey: true,
            }));
        }
        buttons[0].dispatchEvent(new KeyboardEvent('keyup', {
            key: 'Escape',
            code: 'Escape',
            bubbles: true,
        }));
        
        expect(closeSpy).not.toHaveBeenCalled();
        expect(nextSpy).not.toHaveBeenCalled();
        expect(previousSpy).not.toHaveBeenCalled();
        expect(initializer.onEscapeDialogClose).not.toHaveBeenCalled();
    });
});
