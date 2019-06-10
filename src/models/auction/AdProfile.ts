import {IdNumber} from '../db';
import {Bidder} from './Bidder';
import {Banner, Native, Video} from "../dto";

export type AdProfileType = 'banner' | 'native' | 'video';

export interface AdProfile extends IdNumber {
    bidderId: number;
    bidder?: Bidder;
    active: boolean;
    interstitial: boolean;
    debug: boolean;
    delayedNotification: boolean;
    externalId?: number;
    title?: string;
    ad: object;
    template?: string;
    reward: boolean;
}

export const defaultAdProfile = {
    active: false,
    interstitial: false,
    debug: false,
    reward: false,
    delayedNotification: true
};

export function validateAdProfileBanner(ad: Banner): object {
    const errors: any = {};
    if (!ad.w || ad.w === 0) { errors.w = 'Required'; }
    if (!ad.h || ad.w === 0) { errors.h = 'Required'; }
    return errors;
}

export function validateAdProfileNative(ad: Native): object {
    return {};
}

export function validateAdProfileVideo(ad: Video): object {
    return {};
}

export function validateAdProfile(adProfile: AdProfile, adProfileType: AdProfileType) {
    let errors: any = {};
    if (!adProfile.bidderId) { errors.bidderId = 'Required'; }
    switch (adProfileType) {
        case 'banner':
            errors = {...errors, ad: validateAdProfileBanner(adProfile.ad as Banner)};
            break;
        case 'native':
            errors = {...errors, ad: validateAdProfileNative(adProfile.ad as Native)};
            break;
        case 'video':
            errors = {...errors, ad: validateAdProfileVideo(adProfile.ad as Video)};
            break;
    }
    return errors;
}
