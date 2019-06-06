import {Action, Dispatch} from 'redux';
import {Bidder} from '../models/auction/Bidder';

import {requestBidders} from '../lib/api';

export const REQUEST_BIDDERS = '/biddersSelect/request';
export const REQUEST_BIDDERS_SUCCESS = '/biddersSelect/request/success';
export const REQUEST_BIDDERS_FAILURE = '/biddersSelect/request/failure';

export type Actions = Action;

export interface State {
    loading: boolean;
    bidders: Bidder[];
}

const initialState: State = {
    loading: false,
    bidders: []
};

export function reducer(state: State = initialState, action: Actions) {
    switch (action.type) {
        case REQUEST_BIDDERS: {
            return {
                ...state,
                loading: true,
                bidders: []
            };
        }
        case REQUEST_BIDDERS_SUCCESS: {
            const bidders: Bidder[] = (action as any).bidders;
            return {
                ...state,
                loading: false,
                bidders
            };
        }
        case REQUEST_BIDDERS_FAILURE: {
            return {
                ...state,
                loading: false
            };
        }
        default: {
            return state;
        }
    }
}

export const requestBiddersAction = () => (dispatch: Dispatch<any>) => {
    dispatch({
        type: REQUEST_BIDDERS,
    });

    return requestBidders()
        .then(response => dispatch({
            type: REQUEST_BIDDERS_SUCCESS,
            bidders: response.data
        } as any))
        .catch(() => dispatch({
            type: REQUEST_BIDDERS_FAILURE
        }));
};
