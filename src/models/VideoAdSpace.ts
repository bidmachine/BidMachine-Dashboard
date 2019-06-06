import {AdSpace, defaultAdSpace} from './AdSpace';

import {defaultVideo, Video} from './dto';

export interface VideoAdSpace extends AdSpace {
    ad: Video;
}

export const defaultVideoAdSpace = {
    ...defaultAdSpace,
    ad: defaultVideo
};
