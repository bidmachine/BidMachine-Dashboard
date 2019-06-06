import {IdString} from '../db';

import {ContentContext} from './ContentContext';
import {Ext} from './Ext';
import {Producer} from './Producer';
import {QagMediaRating} from './QagMediaRating';
import {VideoQuality} from './VideoQuality';

export interface Content extends IdString {
    episode?: number;
    title?: String;
    series?: String;
    season?: String;
    producer?: Producer;
    url?: string;
    cat?: string[];
    videoquality?: VideoQuality;
    context?: ContentContext;
    contentrating?: String;
    userrating?: String;
    qagmediarating?: QagMediaRating;
    keywords?: String;
    livestream?: Boolean;
    sourcerelationship?: number;
    len?: number;
    lanuage?: String;
    embeddable?: Boolean;
    ext?: Ext;
}
