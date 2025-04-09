import { MESSAGE_TABLE, warnAccessibilityMessage } from "./logs";
import { AccessibleElementLabelViewModel, ensureElementHasID } from "./utils";

export class TabsElementsSelectorSet {
    public static readonly DEFAULT_TAB_LIST_ELEMENT_SELECTOR: string = ':scope > div:nth-of-type(1)';
    public static readonly DEFAULT_TAB_ELEMENT_SELECTOR: string = ':scope > div:nth-of-type(1) > button';
    public static readonly DEFAULT_TAB_PANEL_SELECTOR: string = ':scope > div:not(:div:nth-of-type(1))';
    constructor(
        public readonly tabListElementSelector: string = TabsElementsSelectorSet.DEFAULT_TAB_LIST_ELEMENT_SELECTOR,
        public readonly tabElementSelector: string = TabsElementsSelectorSet.DEFAULT_TAB_ELEMENT_SELECTOR,
        public readonly tabPanelSelector: string = TabsElementsSelectorSet.DEFAULT_TAB_PANEL_SELECTOR,
    ) {
        
    }

    public static createDefault(): TabsElementsSelectorSet {
        return new TabsElementsSelectorSet();
    }
}

export class AccessibleTabsViewModel {

    public static readonly TABLIST_ROLE = 'tablist';
    public static readonly TABPANEL_ROLE = 'tabpanel';
    public static readonly TAB_ROLE = 'tab';

    constructor(
        public readonly elementSelectors: TabsElementsSelectorSet = TabsElementsSelectorSet.createDefault(),
        public readonly listLabelViewModel: AccessibleElementLabelViewModel = AccessibleElementLabelViewModel.createDefault(),
        public readonly panelsLabelViewModel: AccessibleElementLabelViewModel[] = [],
        public readonly orientation: 'horizontal' | 'vertical' = 'horizontal',
        public readonly tabsWithPopups: number[] = [],
        public readonly activeTabIndex: number = 0,
    ) {
        
    }

    public static createDefault(): AccessibleTabsViewModel {
        return new AccessibleTabsViewModel();
    }
}

/**
 * Correctly configure accessible attributes, and interactvity for a Tab component according to the W3C WAI Tab Pattern
 * found here: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/.
 * 
 * @param containerElement DOM Element reference that serves as the DOM root node from within which tab element selectors will be selected.
 * @param viewModel View model state.
 * @returns Returns containerElement.
 * @throws {TypeError}
 * @throws {ReferenceError}
 * @see {AccessibleElementLabelViewModel#applyAccessibleLabel}
 */
export function makeAccessibleTabs(containerElement: Element, viewModel: AccessibleTabsViewModel): Element {
    const tabList: Element | null = containerElement.querySelector(viewModel.elementSelectors.tabListElementSelector);
    const tabElements: NodeList | null = tabList?.querySelectorAll?.(viewModel.elementSelectors.tabElementSelector) ?? null;
    const tabPanels: NodeList = containerElement.querySelectorAll(viewModel.elementSelectors.tabPanelSelector);

    if (tabList) {
        tabList.setAttribute('role', AccessibleTabsViewModel.TABLIST_ROLE);
        tabList.setAttribute('aria-orientation', viewModel.orientation);
        AccessibleElementLabelViewModel.applyAccessibleLabel(tabList, viewModel.listLabelViewModel);
        if (tabElements?.length) {
            tabElements.forEach((tab: Node, key: number) => {
                const tabEl: Element = tab as Element;
                const hasPopup: boolean = viewModel.tabsWithPopups.includes(key);

                tabEl.setAttribute('role', AccessibleTabsViewModel.TAB_ROLE);
                if (hasPopup) {
                    tabEl.setAttribute('aria-haspopup', 'true');
                }
                if (key !== viewModel.activeTabIndex) {
                    tabEl.setAttribute('aria-selected', 'false');
                } else {
                    tabEl.setAttribute('aria-selected', 'true');
                }

                const panelNode: Node | null = key < tabPanels.length ? tabPanels.item(key) : null;
                if (panelNode) {
                    const panelElement: Element = panelNode as Element;
                    const panelId: string = ensureElementHasID(panelElement);
                    const tabId: string = ensureElementHasID(tabEl);
                    
                    tabEl.setAttribute('aria-controls', panelId);
                    panelElement.setAttribute('aria-labelledby', tabId);
                    panelElement.setAttribute('role', AccessibleTabsViewModel.TABPANEL_ROLE);
                }
            });
        }
    }
    return containerElement;
}
