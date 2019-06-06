import {IdNumber} from '../db';
import {ModelLabels} from '../../lib/ModelLabels';

import {Version} from '../rtb';
import {Country} from '../Country';
import {Platform} from '../Platform';
import {enumValues} from "../../lib/enum";

export enum AuctionType {
    FirstPrice = 1,
    SecondPrice = 2
}

export const auctionTypeLabels = {
    [AuctionType.FirstPrice]: 'First Price',
    [AuctionType.SecondPrice]: 'Second Price',
};

export const auctionTypes = enumValues(AuctionType, auctionTypeLabels);

export interface Bidder extends IdNumber {
    agencyId: number;
    title: string;
    endpoint: string;
    rtbVersion: Version;
    coppaFlag: boolean;
    worldwide: boolean;
    countries?: Country[];
    platforms: Platform[];
    maxRpm: number;
    adControl: boolean;
    includedSellers: number[];
    protocol: string;
    auctionType: number;
}

export const labels = new ModelLabels({
    maxRpm: 'QPS'
});

export const defaultBidder = {
    coppaFlag: false,
    worldwide: false,
    adControl: true,
    maxRpm: 1000,
    includedSellers: [1],
    protocol: 'openrtb',
    auctionType: 2
};

export function validateBidder(bidder: Bidder) {
    const errors: any = {};
    if (!bidder.agencyId) {
        errors.agencyId = 'Required';
    }
    if (!bidder.title) {
        errors.title = 'Required';
    }
    if (!bidder.endpoint) {
        errors.endpoint = 'Required';
    }
    if (!bidder.rtbVersion) {
        errors.rtbVersion = 'Required';
    }
    if (bidder.coppaFlag === undefined) {
        errors.coppaFlag = 'Required';
    }
    if (bidder.worldwide === undefined) {
        errors.worldwide = 'Required';
    }
    if (!bidder.platforms) {
        errors.platforms = 'Required';
    }
    if (!bidder.maxRpm) {
        errors.maxRpm = 'Required';
    }
    if (bidder.maxRpm > 25000) {
        errors.maxRpm = 'Must be less or equal then 25000';
    }
    if (bidder.maxRpm < 0) {
        errors.maxRpm = 'Can\'t be less then 0';
    }
    return errors;
}
