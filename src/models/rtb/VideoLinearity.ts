import {enumValues} from '../../lib/enum';

export enum VideoLinearity {
    linear = 1,
    non_linear
}

export const videoLinearityLabels = {
    [VideoLinearity.linear]: 'Linear',
    [VideoLinearity.non_linear]: 'Non Linear'
};

export const videoLinearities = enumValues(VideoLinearity, videoLinearityLabels);
