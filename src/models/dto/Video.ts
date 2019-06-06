import * as rtb from '../rtb';
import {VideoMime, videoMimes} from '../';

// minduration, maxduration, protocols, w, h, linearity, boxingallowed, playbackmethod, delivery, api - matched
// minduration, maxduration, playbackmethod, protocols, delivery, api - default

export interface Video {
    mimes: VideoMime[];
    minduration?: number;
    maxduration?: number;
    protocol?: rtb.Protocol;
    protocols?: rtb.Protocol[];
    w?: number;
    h?: number;
    startdelay?: number;
    linearity?: rtb.VideoLinearity;
    battr?: rtb.CreativeAttribute[];
    maxextended?: number;
    minbitrate?: number;
    maxbitrate?: number;
    boxingallowed?: boolean;
    playbackmethod?: rtb.VideoPlaybackMethod[];
    delivery?: rtb.ContentDeliveryMethod[];
    pos?: rtb.AdPosition;
    api?: rtb.ApiFramework[];
    ext?: rtb.Ext;
}

export const defaultVideo = {
    mimes: videoMimes,
    protocols: rtb.protocols.map(p => p.value),
    linearity: rtb.VideoLinearity.linear,
    api: rtb.apiFrameworks.map(api => api.value),
};
