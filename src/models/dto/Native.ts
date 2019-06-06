import * as rtb from '../rtb';

export interface Native {
    ver?: string;
    api?: rtb.ApiFramework[];
    battr?: rtb.CreativeAttribute[];
    ext?: rtb.Ext;
}

export const defaultNative = {
    ver: '1.1'
};
