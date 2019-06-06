import {IdString} from '../db';

import {Ext} from './Ext';

export interface Producer extends IdString {
    name?: string;
    cat?: string[];
    domain?: string;
    ext?: Ext;
}
