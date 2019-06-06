import {IdNumber} from './db';

export interface Publisher extends IdNumber {
    name: string;
    autoAppCreation: boolean;
}
