import {IdString} from '../db';

import {Ext} from './Ext';

export interface Publisher extends IdString {
    name?: string;
    cat?: string[];
    domain?: string;
    ext?: Ext;
}
