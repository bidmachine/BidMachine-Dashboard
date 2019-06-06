import {AdProfile, defaultAdProfile} from './AdProfile';

import {defaultVideo, Video} from '../dto';

export interface VideoAdProfile extends AdProfile {
    ad: Video;
}

export const defaultVideoAdProfile = {
    ...defaultAdProfile,
    ad: defaultVideo
};
