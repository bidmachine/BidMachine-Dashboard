import {Action, Dispatch} from 'redux';
import {Agency} from '../models/auction/Agency';
import {Bidder} from '../models/auction/Bidder';

import {createAgency, createBidder} from '../lib/api';

export const RESET_WIZARD = 'agencyWizard/reset';
export const SET_STEP = 'agencyWizard/step';
export const CREATE_AGENCY = 'agencyWizard/createAgency';
export const CREATE_AGENCY_SUCCESS = 'agencyWizard/createAgency/success';
export const CREATE_AGENCY_FAILURE = 'agencyWizard/createAgency/failure';
export const CREATE_BIDDER = 'agencyWizard/createBidder';
export const CREATE_BIDDER_SUCCESS = 'agencyWizard/createBidder/success';
export const CREATE_BIDDER_FAILURE = 'agencyWizard/createBidder/failure';

export type Actions = Action;

export enum Steps {
    createAgency,
    createBidder,
    createBidderProfiles
}

export interface State {
    step: Steps;
    agency: Agency | null;
    agencyProcess: boolean;
    bidder: Bidder | null;
    bidderProcess: boolean;
    errorMessage: string | null;
}

const initialState: State = {
    step: Steps.createAgency,
    agency: null,
    agencyProcess: false,
    bidder: null,
    bidderProcess: false,
    errorMessage: null
};

export function reducer(state: State = initialState, action: Actions) {
    switch (action.type) {
        case RESET_WIZARD: {
            return initialState;
        }

        case SET_STEP: {
            return {
                ...state,
                step: (action as any).step
            };
        }

        case CREATE_AGENCY: {
            return {
                ...state,
                agencyProcess: true
            };
        }
        case CREATE_AGENCY_SUCCESS: {
            const {agency} = (action as any);
            return {
                ...state,
                step: Steps.createBidder,
                agency,
                agencyProcess: false
            };
        }
        case CREATE_AGENCY_FAILURE: {
            return {
                ...state,
                agencyProcess: false,
                errorMessage: (action as any).errorMessage
            };
        }

        case CREATE_BIDDER: {
            return {
                ...state,
                bidderProcess: true
            };
        }
        case CREATE_BIDDER_SUCCESS: {
            const {bidder} = (action as any);
            return {
                ...state,
                step: Steps.createBidderProfiles,
                bidder,
                bidderProcess: false
            };
        }
        case CREATE_BIDDER_FAILURE: {
            return {
                ...state,
                bidderProcess: false,
                errorMessage: (action as any).errorMessage
            };
        }
        default: {
            return state;
        }
    }
}

export const resetAction = () => ({
    type: RESET_WIZARD
});

export const setStepAction = (step: Steps) => ({
    type: SET_STEP,
    step
});

export const createAgencyAction = (agency: Agency) => (dispatch: Dispatch<any>) => {
    dispatch({
        type: CREATE_AGENCY,
        agency: agency
    } as any);

    return createAgency(agency)
        .then(response => dispatch({
            type: CREATE_AGENCY_SUCCESS,
            agency: response.data
        } as any))
        .catch((error) => dispatch({
            type: CREATE_AGENCY_FAILURE,
            errorMessage: error.response.data.message
        }));
};

export const createBidderAction = (bidder: Bidder) => (dispatch: Dispatch<any>) => {
    dispatch({
        type: CREATE_BIDDER,
        bidder: bidder
    } as any);

    return createBidder(bidder)
        .then(response => dispatch({
            type: CREATE_BIDDER_SUCCESS,
            bidder: response.data
        } as any))
        .catch((error) => dispatch({
            type: CREATE_BIDDER_FAILURE,
            errorMessage: error.response.data.message
        }));
};
