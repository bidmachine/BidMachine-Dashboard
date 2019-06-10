import {IdString} from '../db';

import {ContentContext} from './ContentContext';
import {Ext} from './Ext';
import {Producer} from './Producer';
import {QagMediaRating} from './QagMediaRating';
import {VideoQuality} from './VideoQuality';

export interface Content extends IdString {
    episode?: number;
    title?: string;
    series?: string;
    season?: string;
    producer?: Producer;
    url?: string;
    cat?: string[];
    videoquality?: VideoQuality;
    context?: ContentContext;
    contentrating?: string;
    userrating?: string;
    qagmediarating?: QagMediaRating;
    keywords?: string;
    livestream?: boolean;
    sourcerelationship?: number;
    len?: number;
    lanuage?: string;
    embeddable?: boolean;
    ext?: Ext;
}
