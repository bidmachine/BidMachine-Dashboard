import {AdSpace, defaultAdSpace} from './AdSpace';

import {defaultNative, Native} from './dto';

export interface NativeAdSpace extends AdSpace {
    ad: Native;
}

export const defaultNativeAdSpace = {
    ...defaultAdSpace,
    ad: defaultNative
};
