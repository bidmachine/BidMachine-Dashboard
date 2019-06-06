import * as rtb from '../rtb';
import {Mime, mimes} from '../';

// w, h, btype, mimes, topframe, api - matched
// mimes, api - by default

export interface Banner {
    w?: number;
    h?: number;
    btype?: rtb.BannerAdType[];
    battr?: rtb.CreativeAttribute[];
    pos?: rtb.AdPosition;
    mimes?: Mime[];
    topframe?: boolean;
    expdir?: rtb.ExpandableDirection[];
    api?: rtb.ApiFramework[];
    ext?: rtb.Ext;
}

export const defaultBanner = {
    mimes,
    api: rtb.apiFrameworks.map(api => api.value)
};
