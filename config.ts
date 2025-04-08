export type AccessibleDecoratorConfigOptionValue = string | boolean | number;
export type AccessibleDecoratorConfigOptions = Record<string, AccessibleDecoratorConfigOptionValue>;

export const AccessibleDecoratorConfig: AccessibleDecoratorConfigOptions = {
    LOG_ACCESSIBILITY_WARNINGS: true,
};
