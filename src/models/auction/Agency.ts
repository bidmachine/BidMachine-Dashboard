import {IdNumber} from '../db';

export interface Agency extends IdNumber {
    title: string;
    externalId?: boolean;
    active?: boolean;
    contactName?: string;
    instantMessaging?: string;
    phone?: string;
    email?: string;
    site?: string;
}

export function validateAgency(agency: Agency) {
    const errors: any = {};
    if (!agency.title) errors.title = 'Required';
    return errors;
}
