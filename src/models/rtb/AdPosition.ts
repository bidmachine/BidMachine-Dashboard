import {enumValues} from '../../lib/enum';

export enum AdPosition {
    unknown,
    above_the_fold,
    maybe_not_visible,
    below_the_fold,
    header,
    footer,
    sidebar,
    full_screen
}

export const adPositionLabels = {
    [AdPosition.unknown]: 'Unknown',
    [AdPosition.above_the_fold]: 'Above the Fold',
    [AdPosition.maybe_not_visible]: 'May or may not be initially visible depending on screen size/resolution.',
    [AdPosition.below_the_fold]: 'Below the Fold',
    [AdPosition.header]: 'Header',
    [AdPosition.footer]: 'Footer',
    [AdPosition.sidebar]: 'Sidebar',
    [AdPosition.full_screen]: 'Full Screen'
};

export const adPositions = enumValues(AdPosition, adPositionLabels);
