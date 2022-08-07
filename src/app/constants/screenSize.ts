export const SCREENSIZE_XSMALL = 'XSmall';
export const SCREENSIZE_SMALL = 'Small';
export const SCREENSIZE_MEDIUM = 'Medium';
export const SCREENSIZE_LARGE = 'Large';
export const SCREENSIZE_XLARGE = 'XLarge';
export const SCREENSIZE_UNKNOWN = 'Unknown';
export type ScreenSize =
    | typeof SCREENSIZE_XSMALL
    | typeof SCREENSIZE_SMALL
    | typeof SCREENSIZE_MEDIUM
    | typeof SCREENSIZE_LARGE
    | typeof SCREENSIZE_XLARGE
    | typeof SCREENSIZE_UNKNOWN;
