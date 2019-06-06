import {Agency} from '../models/auction/Agency';
import {Bidder} from '../models/auction/Bidder';
import {AdSpace, AdSpaceType} from '../models/AdSpace';
import {AdProfile, AdProfileType} from '../models/auction/AdProfile';
import {VideoAdProfile} from '../models/auction/VideoAdProfile';
import {Granularity} from '../models/statistics/Granularity';
import {Collection} from '../models/statistics/Collection';
import backend from './backend';
import {AxiosPromise} from 'axios';
import {SSP} from '../models/auction/SSP';

//
// AGENCIES API
//

/**
 * get agencies list
 */
export function requestAgencies(): AxiosPromise<Agency[]> {
    return backend.get<Agency[]>('/agency');
}

/**
 * get Agency by id
 * @param id Agency id
 */
export function requestAgency(id: number): AxiosPromise<Agency> {
    return backend.get<Agency>(`/agency/${id}`);
}

/**
 * create new Agency
 * @param agency Agency body
 */
export function createAgency(agency: Agency): AxiosPromise<Agency> {
    return backend.post<Agency>(`/agency`, agency);
}

/**
 * update Agency
 * @param id Agency id
 * @param agency fields to update
 */
export function updateAgency(id: number, agency: Agency): AxiosPromise<Agency> {
    return backend.post<Agency>(`/agency/${id}`, {
        ...agency,
        id: undefined
    });
}

export function toggleAgency(id: number, active: boolean): AxiosPromise<any> {
    return backend.request({url: `/agency/${id}/active`, method: active ? 'POST' : 'DELETE'})
}

/**
 * delete Agency by id
 * @param id Agency id
 */
export function deleteAgency(id: number): AxiosPromise<any> {
    return backend.delete(`/agency/${id}`);
}


//
// BIDDERS API
//

/**
 * get bidders list
 */
export function requestBidders(): AxiosPromise<Bidder[]> {
    return backend.get<Bidder[]>('/bidder')
}

/**
 * get bidders list for agency
 */
export function requestAgencyBidders(id: number): AxiosPromise<Bidder[]> {
    return backend.get<Bidder[]>(`/agency/${id}/bidder`);
}

/**
 * get Bidder by id
 * @param id
 */
export function requestBidder(id: number): AxiosPromise<Bidder> {
    return backend.get<Bidder>(`/bidder/${id}`);
}

/**
 * create new Bidder
 * @param bidder json body
 */
export function createBidder(bidder: Bidder): AxiosPromise<Bidder> {
    return backend.post<Bidder>(`/agency/${bidder.agencyId}/bidder`, bidder);
}

/**
 * update Bidder
 * @param id Didder id
 * @param bidder field to update
 */
export function updateBidder(id: number, bidder: Bidder): AxiosPromise<Bidder> {
    return backend.post<Bidder>(`/bidder/${id}`, {
        ...bidder,
        id: undefined
    });
}

/**
 * delete Bidder by id
 * @param id Bidder id
 */
export function deleteBidder(id: number) {
    return backend.delete(`/bidder/${id}`);
}

// 
// SSP
//
export function requestSSP(): AxiosPromise<SSP[]> {
    return backend.get<SSP[]>('/sellers');
}

/**
 * get SSP by id
 * @param id SSP id
 */
export function requestSeller(id: number): AxiosPromise<SSP> {
    return backend.get<SSP>(`/sellers/${id}`);
}

/**
 * create new SSP
 * @param seller SSP body
 */
export function createSSP(seller: SSP): AxiosPromise<SSP> {
    return backend.post<SSP>(`/sellers`, seller);
}

/**
 * update SSP
 * @param id SSP id
 * @param seller fields to update
 */
export function updateSSP(id: number, seller: SSP): AxiosPromise<SSP> {
    return backend.put<SSP>(`/sellers/${id}`, seller);
}

/**
 * delete SSP by id
 * @param id SSP id
 */
export function deleteSSP(id: number): AxiosPromise<any> {
    return backend.delete(`/sellers/${id}`);
}


//
// AdProfiles
//

export function requestAdProfiles(type: AdProfileType, bidderId: number) {
    if (bidderId) {
        return backend.get<AdProfile[]>(`/bidder/${bidderId}/adprofile/${type}`);
    } else {
        return backend.get<AdProfile[]>(`/adprofile/${type}`);
    }
}

export function toggleAdProfile(type: AdProfileType, id: number, active: boolean) {
    return backend.request<any>({url: `/adprofile/${type}/${id}/active`, method: active ? 'POST' : 'DELETE'});
}

export function createAdProfile(type: AdProfileType, adProfile: AdProfile) {
    return backend.post<VideoAdProfile>(`/bidder/${adProfile.bidderId}/adprofile/${type}`, adProfile)
}

export function deleteAdProfile(type: AdProfileType, id: number) {
    return backend.delete(`/adprofile/${type}/${id}`)
}

export async function updateAdProfile(type: AdProfileType, id: number, adProfile: AdProfile) {
    return backend.post<VideoAdProfile>(`/adprofile/${type}/${id}`, {
        ...adProfile,
        id: undefined
    });
}

//
// Ad Spaces
//

export function requestAdSpaces(type: AdSpaceType, sellerId: number): AxiosPromise<AdSpace[]> {
    return backend.get<AdSpace[]>(`/seller/${sellerId}/adspace/${type}`);
}

export function createAdSpace(type: AdSpaceType, sellerId: number, adSpace: AdSpace): AxiosPromise<AdSpace> {
    return backend.post<AdSpace>(`/seller/${sellerId}/adspace/${type}`, adSpace);
}

export function updateAdSpace(type: AdSpaceType, id: number, adSpace: AdSpace): AxiosPromise<AdSpace> {
    return backend.post<AdSpace>(`/adspace/${type}/${id}`, {
        ...adSpace,
        id: undefined
    });
}

export function deleteAdSpace(type: AdSpaceType, id: number): AxiosPromise<any> {
    return backend.delete(`/adspace/${type}/${id}`);
}

export function toggleAdSpace(type: AdSpaceType, id: number, active: boolean) {
    return backend.request({url: `/adspace/${type}/${id}/active`, method: active ? 'POST' : 'DELETE'});
}

export interface Dimension {
    value: any
    label: string
}

export function getDimensions(collection: Collection, startDate?: string, endDate?: string): AxiosPromise<Dimension[]> {

    const endpoint = `/performance/${collection}?start=${startDate}&end=${endDate}`;

    return backend.get<Dimension[]>(endpoint);
}

export function requestPerformance(startDate: string,
                                   endDate: string,
                                   collection?: Collection,
                                   granularity: Granularity = 'day',
                                   dimensions?: string[]): AxiosPromise<Performance> {
    const body = {
        interval: `${startDate}/${endDate}`,
        granularity
    };

    if (collection && dimensions) {
        if (collection === 'agency') {
            body['agency'] = dimensions;
        } else if (collection === 'app') {
            body['appId'] = dimensions;
        } else if (collection === 'seller') {
            body['sellerIds'] = dimensions;
        } else {
            body[collection] = dimensions;
        }
    }
    return backend.post<Performance>(`/performance`, body)
}

export function requestGraphPerformance(startDate: string,
                                        endDate: string,
                                        collection: Collection,
                                        dimension: string,
                                        values: string): AxiosPromise<any> {
    return backend.get<any>(`/performance/${collection}/graph/${dimension}?start=${startDate}&end=${endDate}&values=${values}`);
}

export interface Settings {
    bannerAppodealxFee: number;
    videoAppodealxFee: number;
    nativeAppodealxFee: number;
    interstitialAppodealxFee: number;
}

export function getSettings(): AxiosPromise<Settings> {
    return backend.get<Settings>('/settings');
}

export function setSettings(settings: Settings): AxiosPromise<Settings> {
    return backend.post<Settings>('/settings', settings);
}
