import { ClickEventDispatchInvoker, ClickMethodInvoker, DOMActionInvoker, FocusEventDispatchInvoker, FocusMethodInvoker } from "./events";

describe('FocusMethodInvoker', () => {
    it('invokes the focus method of an element.', () => {
        const focusMethodInvoker: DOMActionInvoker = new FocusMethodInvoker();
        const element: HTMLElement = document.createElement('button');
        const focusSpy = jest.spyOn(element, 'focus');
        focusMethodInvoker.invoke(element);
        expect(focusSpy).toHaveBeenCalled();
    });
});
describe('FocusEventDispatchInvoker', () => {
    it('invokes the dispatchEvent method.', () => {
        const invoker: DOMActionInvoker = new FocusEventDispatchInvoker();
        const element: HTMLElement = document.createElement('button');
        const dispatchEventSpy = jest.spyOn(element, 'dispatchEvent');
        invoker.invoke(element);
        expect(dispatchEventSpy).toHaveBeenCalledWith(expect.objectContaining({
            type: 'focus',
        }));
    });
});
describe('ClickMethodInvoker', () => {
    it('invokes the click method.', () => {
        const invoker: DOMActionInvoker = new ClickMethodInvoker();
        const element: HTMLElement = document.createElement('button');
        const clickSpy = jest.spyOn(element, 'click');
        invoker.invoke(element);
        expect(clickSpy).toHaveBeenCalled();
    });
});

describe('ClickEventDispatchInvoker', () => {
    it('invokes dispatchEvent', () => {
        const invoker: DOMActionInvoker = new ClickEventDispatchInvoker();
        const element: HTMLElement = document.createElement('button');
        const dispatchEventSpy = jest.spyOn(element, 'dispatchEvent');
        invoker.invoke(element);
        expect(dispatchEventSpy).toHaveBeenCalledWith(expect.objectContaining({
            type: 'click',
        }));
    });
});

