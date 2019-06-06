import {enumValues} from '../../lib/enum';

export enum BannerAdType {
    xhtml_text_ad = 1,
    xhtml_banner_ad,
    javascript_ad,
    iframe
}

export const bannerAdTypeLabels = {
    [BannerAdType.iframe]: 'Iframe',
    [BannerAdType.javascript_ad]: 'JavaScript Ad',
    [BannerAdType.xhtml_banner_ad]: 'XHTML Banner Ad',
    [BannerAdType.xhtml_text_ad]: 'XHTML Text Ad'
};

export const bannerAdTypes = enumValues(BannerAdType, bannerAdTypeLabels);
