import {IdNumber} from './db';
import {BannerAdSpace} from './BannerAdSpace';

export type AdSpaceType = 'banner' | 'native' | 'video';

export interface AdSpace extends IdNumber {
    appId?: number;
    sellerId: number;
    interstitial: boolean;
    priceScale: number;
    debug: boolean;
    active: boolean;
    title?: string;
    reward: boolean;
    displayManager: string;
}

export const defaultAdSpace = {
    interstitial: false,
    priceScale: 1,
    debug: false,
    active: true,
    displayManager: '',
    reward: false
};

export function validateBannerAdSpace(adSpace: BannerAdSpace) {
    const errors: any = {};
    if (!adSpace.ad.w || adSpace.ad.w === 0) { errors.w = 'Required'; }
    if (!adSpace.ad.h || adSpace.ad.w === 0) { errors.h = 'Required'; }
    return errors;
}

export function validateAdSpace(adSpace: AdSpace, adSpaceType: AdSpaceType) {
    let errors: any = {};
    if (adSpaceType === 'banner') {
        {
            errors = {...errors, ad: validateBannerAdSpace(adSpace as BannerAdSpace)};
        }
    }
    return errors;
}
