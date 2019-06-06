import {AdProfile, defaultAdProfile} from './AdProfile';

import {defaultNative, Native} from '../dto';

export interface NativeAdProfile extends AdProfile {
    ad: Native;
}

export const defaultNativeAdProfile = {
    ...defaultAdProfile,
    ad: defaultNative
};
