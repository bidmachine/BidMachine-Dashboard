import {Action, Dispatch} from 'redux';
import {SSP} from '../models/auction/SSP';

import {requestSSP} from '../lib/api';

export const REQUEST_SSP = '/SSPSelect/request';
export const REQUEST_SSP_SUCCESS = '/SSPSelect/request/success';
export const REQUEST_SSP_FAILURE = '/SSPSelect/request/failure';

export type Actions = Action;

export interface State {
    loading: boolean;
    sellers: SSP[];
}

const initialState: State = {
    loading: false,
    sellers: []
};

export function reducer(state: State = initialState, action: Actions) {
    switch (action.type) {
        case REQUEST_SSP: {
            return {
                ...state,
                loading: true,
                sellers: []
            };
        }
        case REQUEST_SSP_SUCCESS: {
            const sellers: SSP[] = (action as any).sellers;
            return {
                ...state,
                loading: false,
                sellers
            };
        }
        case REQUEST_SSP_FAILURE: {
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

export const requestSSPAction = () => (dispatch: Dispatch<any>) => {
    dispatch({
        type: REQUEST_SSP
    });
    return requestSSP()
        .then(response => dispatch({
            type: REQUEST_SSP_SUCCESS,
            sellers: response.data
        } as any))
        .catch(e => dispatch({
            type: REQUEST_SSP_FAILURE
        }));
};
