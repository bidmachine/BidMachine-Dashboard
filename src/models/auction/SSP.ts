import {IdNumber} from '../db';

export interface SSP extends IdNumber {
    ks: string;
    name: string;
    fee: number
    active: boolean;
}

export function validateSSP(seller: SSP) {
    const errors: any = {};
    if (!seller.name) errors.name = 'Required';
    if (!seller.ks) errors.ks = 'Required';
    if ((!seller.fee && (seller.fee > 0))) errors.fee = 'Required';
    if (seller.fee < 0) errors.fee = 'Must be positive'
    return errors;
}
