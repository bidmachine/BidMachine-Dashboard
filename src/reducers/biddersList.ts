import {Action, Dispatch} from 'redux';
import {Bidder} from '../models/auction/Bidder';
import {initialItemsList, ItemsListState, receiveItemsList, removeById} from '../lib/ItemsListState';

import {
    createBidder,
    deleteBidder,
    requestAgencyBidders,
    requestBidder,
    requestBidders,
    updateBidder
} from '../lib/api';
import {openInfo} from './confirm';

export const REQUEST_BIDDERS = 'biddersList/items/request';
export const REQUEST_AGENCY_BIDDERS = 'biddersList/items/request/agency';
export const REQUEST_BIDDERS_SUCCESS = 'biddersList/items/request/success';
export const REQUEST_BIDDERS_FAILURE = 'biddersList/items/request/failure';
export const REQUEST_BIDDER = 'biddersList/bidder/request';
export const REQUEST_BIDDER_SUCCESS = 'biddersList/bidder/request/success';
export const REQUEST_BIDDER_FAILURE = 'biddersList/bidder/request/failure';
export const DELETE_BIDDER = 'biddersList/bidder/delete';
export const DELETE_BIDDER_SUCCESS = 'biddersList/bidder/delete/success';
export const DELETE_BIDDER_FAILURE = 'biddersList/bidder/delete/failure';
export const CREATE_BIDDER = 'biddersList/bidder/create';
export const CREATE_BIDDER_SUCCESS = 'biddersList/bidder/create/success';
export const CREATE_BIDDER_FAILURE = 'biddersList/bidder/create/failure';
export const UPDATE_BIDDER = 'biddersList/bidder/update';
export const UPDATE_BIDDER_SUCCESS = 'biddersList/bidder/update/success';
export const UPDATE_BIDDER_FAILURE = 'biddersList/bidder/update/failure';

export type Actions = Action;

export type State = ItemsListState<number, Bidder>;

const initialState: State = initialItemsList<number, Bidder>({});

export function reducer(state: State = initialState, action: Actions) {
    switch (action.type) {
        case REQUEST_BIDDERS:
        case REQUEST_AGENCY_BIDDERS: {
            return {
                ...state,
                loading: true,
                items: [],
                map: new Map()
            };
        }

        case REQUEST_BIDDERS_SUCCESS: {
            const bidders: Bidder[] = (action as any).bidders;
            return {
                ...state,
                ...receiveItemsList<number, Bidder>(bidders)
            };
        }

        case REQUEST_BIDDERS_FAILURE: {
            return {
                ...state,
                loading: false
            };
        }

        case REQUEST_BIDDER: {
            return {
                ...state,
                selected: null,
                loadingSelected: true,
                errorMessage: null
            };
        }

        case REQUEST_BIDDER_SUCCESS: {
            const bidder: Bidder = (action as any).bidder;
            return {
                ...state,
                selected: bidder,
                loadingSelected: false
            };
        }

        case REQUEST_BIDDER_FAILURE: {
            return {
                ...state,
                loadingSelected: false
            };
        }

        case DELETE_BIDDER_SUCCESS: {
            const id: number = (action as any).id;
            return removeById(state, id);
        }

        case CREATE_BIDDER_FAILURE: {
            return {
                ...state,
                errorMessage: (action as any).errorMessage
            };
        }
        default: {
            return state;
        }
    }
}

export const requestAgencyBiddersAction = (id: number) => (dispatch: Dispatch<any>) => {
    dispatch({
        type: REQUEST_BIDDERS
    });

    return requestAgencyBidders(id)
        .then(response => dispatch({
            type: REQUEST_BIDDERS_SUCCESS,
            bidders: response.data
        } as any))
        .catch(() => dispatch({
            type: REQUEST_BIDDERS_FAILURE
        }));
};

export const requestBiddersAction = () => (dispatch: Dispatch<any>) => {
    dispatch({
        type: REQUEST_AGENCY_BIDDERS
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

export const requestBidderAction = (id: number) => (dispatch: Dispatch<any>) => {
    dispatch({
        type: REQUEST_BIDDER
    });

    return requestBidder(id)
        .then(response => dispatch({
            type: REQUEST_BIDDER_SUCCESS,
            bidder: response.data
        } as any))
        .catch(() => dispatch({
            type: REQUEST_BIDDER_FAILURE
        }));
};

export const createBidderAction = (bidder: Bidder) => (dispatch: Dispatch<any>) => {
    dispatch({
        type: CREATE_BIDDER,
        bidder
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

export const updateBidderAction = (id: number, bidder: Bidder) => (dispatch: Dispatch<any>) => {
    dispatch({
        type: UPDATE_BIDDER
    });

    return updateBidder(id, bidder)
        .then(response => {
            dispatch(openInfo('Bidder was successfully saved.'));
            return dispatch({
                type: UPDATE_BIDDER_SUCCESS,
                result: response.data,
                id
            } as any);
        })
        .catch(error => {
            dispatch(openInfo(`${error.response.data.message} Try later.`));
            return dispatch({
                type: UPDATE_BIDDER_FAILURE,
                error: error.response.data
            });
        });
};

export const deleteBidderAction = (id: number) => (dispatch: Dispatch<any>) => {
    dispatch({
        type: DELETE_BIDDER
    });

    return deleteBidder(id)
        .then(response => dispatch({
            type: DELETE_BIDDER_SUCCESS,
            result: response.data,
            id
        } as any))
        .catch(error => dispatch({
            type: DELETE_BIDDER_FAILURE,
            error: error.response.data
        }));
};
