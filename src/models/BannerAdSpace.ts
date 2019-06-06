import {AdSpace, defaultAdSpace} from './AdSpace';

import {Banner, defaultBanner} from './dto';

export interface BannerAdSpace extends AdSpace {
    ad: Banner;
}

export const defaultBannerAdSpace = {
    ...defaultAdSpace,
    ad: defaultBanner
};
