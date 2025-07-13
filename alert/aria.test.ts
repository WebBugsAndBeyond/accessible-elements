import { makeAccessibleAlert } from "./aria";

describe('makeAccessibleAlert function', () => {
    it('applies the role attribute', () => {
        const element: Element = makeAccessibleAlert(document.createElement('div'));
        expect(element.getAttribute('role')).toEqual('alert');
    });
});
