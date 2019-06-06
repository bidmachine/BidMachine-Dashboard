import {Action, Dispatch} from 'redux';
import {Agency} from '../models/auction/Agency';

import {requestAgencies} from '../lib/api';

export const REQUEST_AGENCIES = '/agenciesSelect/request';
export const REQUEST_AGENCIES_SUCCESS = '/agenciesSelect/request/success';
export const REQUEST_AGENCIES_FAILURE = '/agenciesSelect/request/failure';

export type Actions = Action;

export interface State {
    loading: boolean;
    agencies: Agency[];
}

const initialState: State = {
    loading: false,
    agencies: []
};

export function reducer(state: State = initialState, action: Actions) {
    switch (action.type) {
        case REQUEST_AGENCIES: {
            return {
                ...state,
                loading: true,
                agencies: []
            };
        }
        case REQUEST_AGENCIES_SUCCESS: {
            const agencies: Agency[] = (action as any).agencies;
            return {
                ...state,
                loading: false,
                agencies
            };
        }
        case REQUEST_AGENCIES_FAILURE: {
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

export const requestAgenciesAction = () => (dispatch: Dispatch<any>) => {
    dispatch({
        type: REQUEST_AGENCIES,
    });

    return requestAgencies()
        .then(response => dispatch({
            type: REQUEST_AGENCIES_SUCCESS,
            agencies: response.data
        } as any))
        .catch(e => dispatch({
            type: REQUEST_AGENCIES_FAILURE
        }));
};
