import {enumValues} from '../../lib/enum';

export enum ExpandableDirection {
    left = 1,
    right,
    up,
    down,
    full_screen
}

export const expandableDirectionLabels = {
    [ExpandableDirection.left]: 'Left',
    [ExpandableDirection.right]: 'Right',
    [ExpandableDirection.up]: 'Up',
    [ExpandableDirection.down]: 'Down',
    [ExpandableDirection.full_screen]: 'Full Screen'
};

export const expandableDirections = enumValues(ExpandableDirection, expandableDirectionLabels);
