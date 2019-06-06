import {AdProfile, defaultAdProfile} from './AdProfile';

import {Banner, defaultBanner} from '../dto';

export interface BannerAdProfile extends AdProfile {
    ad: Banner;
}

export const defaultBannerAdProfile = {
    ...defaultAdProfile,
    ad: defaultBanner
};
