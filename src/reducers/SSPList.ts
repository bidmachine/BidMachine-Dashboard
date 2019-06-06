import {Action, Dispatch} from 'redux';
import {SSP} from '../models/auction/SSP';
import {ItemsListState, receiveItemsList, SortDirection} from '../lib/ItemsListState';

import {createSSP, deleteSSP, requestSeller, requestSSP, updateSSP} from '../lib/api';
import {openInfo} from './confirm';

export const CREATE_SSP = 'sellersList/seller/create';
export const CREATE_SSP_SUCCESS = 'sellersList/seller/create/success';
export const CREATE_SSP_FAILURE = 'sellersList/seller/create/failure';
export const REQUEST_SSP = 'sellersList/items/request';
export const REQUEST_SSP_SUCCESS = 'sellersList/items/request/success';
export const REQUEST_SSP_FAILURE = 'sellersList/items/request/failure';
export const REQUEST_SELLER = 'sellersList/seller/request';
export const REQUEST_SELLER_SUCCESS = 'sellersList/seller/request/success';
export const REQUEST_SELLER_FAILURE = 'sellersList/seller/request/failure';
export const DELETE_SSP = 'sellersList/seller/delete';
export const DELETE_SSP_SUCCESS = 'sellersList/seller/delete/success';
export const DELETE_SSP_FAILURE = 'sellersList/seller/delete/failure';
export const UPDATE_SSP = 'sellersList/seller/update';
export const UPDATE_SSP_SUCCESS = 'sellersList/seller/update/success';
export const UPDATE_SSP_FAILURE = 'sellersList/seller/update/failure';
export const TOGGLE_SSP = 'sellersList/seller/toggle';
export const TOGGLE_SSP_SUCCESS = 'sellersList/seller/toggle/failure';
export const TOGGLE_SSP_FAILURE = 'sellersList/seller/toggle/failure';
export const SET_TAB = 'sellersList/seller/settab';

export type Actions = Action;

interface SSPListState extends ItemsListState<number, SSP> {
    tab: string;
}

export type State = SSPListState;

const initialState: State = {
    loading: false,
    items: [] as number[],
    map: new Map<number, SSP>(),
    loadingSelected: false,
    selected: null,
    sortColumn: null,
    sortDirection: 0,
    errorMessage: null,
    tab: 'agency'
}

function removeById(state: State, id: number) {
    const index = state.items.indexOf(id);
    if (index !== -1) {
        const items = [
            ...state.items.slice(0, index),
            ...state.items.slice(index + 1),
        ];
        return {
            ...state,
            items,
            map: items.reduce((map, i) => {
                if (i !== id) {
                    map.set(i, state.map.get(i));
                }
                return map;
            }, new Map())
        };
    } else {
        return state;
    }
}


function updateItem(state: State,
                    id: number,
                    item: any) {
    const items = state.items;
    const old = state.map.get(id) as any;
    return {
        ...state,
        map: items.reduce((map, i) => {
            if (i !== id) {
                map.set(i, state.map.get(i));
            } else {
                map.set(i, {
                    ...old,
                    ...item
                });
            }
            return map;
        }, new Map())
    };
}

export function reducer(state: State = initialState, action: Actions): State {
    switch (action.type) {
        case REQUEST_SSP: {
            const {sortColumn, sortDirection} = (action as any);
            return {
                ...state,
                loading: true,
                items: [],
                map: new Map(),
                sortColumn,
                sortDirection
            } as any;
        }

        case REQUEST_SSP_SUCCESS: {
            const sellers: SSP[] = (action as any).sellers;
            return {
                ...state,
                ...receiveItemsList<number, SSP>(sellers)
            };
        }

        case REQUEST_SSP_FAILURE: {
            return {
                ...state,
                loading: false
            };
        }

        case REQUEST_SELLER: {
            return {
                ...state,
                selected: null,
                loadingSelected: true,
                errorMessage: null
            };
        }

        case REQUEST_SELLER_SUCCESS: {
            const seller: SSP = (action as any).seller;
            return {
                ...state,
                selected: seller,
                loadingSelected: false
            };
        }

        case DELETE_SSP_SUCCESS: {
            const id: number = (action as any).id;
            return removeById(state, id);
        }

        case UPDATE_SSP_SUCCESS: {
            const {id, active} = (action as any);
            return updateItem(state, id, {active});
        }

        case SET_TAB: {
            const {tab} = (action as any);
            return {
                ...state,
                tab
            }
        }
        case CREATE_SSP_FAILURE: {
            return {
                ...state,
                errorMessage: (action as any).errorMessage
            }
        }
        default: {
            return state;
        }
    }
}

export const requestSSPAction = (sortColumn?: string, sortDirection?: SortDirection) => (dispatch: Dispatch<any>) => {
    dispatch({
        type: REQUEST_SSP,
        sortColumn,
        sortDirection
    } as any);

    return requestSSP()
        .then(response => dispatch({
            type: REQUEST_SSP_SUCCESS,
            sellers: response.data
        } as any))
        .catch(() => dispatch({
            type: REQUEST_SSP_FAILURE
        }));
};

export const requestSellerAction = (id: number) => (dispatch: Dispatch<any>) => {
    dispatch({
        type: REQUEST_SELLER
    });

    return requestSeller(id)
        .then(response => dispatch({
            type: REQUEST_SELLER_SUCCESS,
            seller: response.data
        } as any))
        .catch(() => dispatch({
            type: REQUEST_SELLER_FAILURE
        }));
};

export const updateSSPAction = (id: number, seller: SSP) => (dispatch: Dispatch<any>) => {
    dispatch({
        type: UPDATE_SSP
    });
    return updateSSP(id, seller)
        .then(result => {
            dispatch(openInfo('Seller was successfully saved.'));
            return dispatch({
                type: UPDATE_SSP_SUCCESS,
                active: seller.active,
                result,
                id
            } as any)
        })
        .catch(error => {
            dispatch(openInfo(`${error.response.data.message} Try later.`))
            return dispatch({
                type: UPDATE_SSP_FAILURE,
                error: error.response.data
            })
        });
};

export const toggleSSPAction = (id: number, seller: SSP) => (dispatch: Dispatch<any>) => {
    dispatch({
        type: UPDATE_SSP
    });

    return updateSSP(id, seller)
        .then(result => dispatch({
            type: UPDATE_SSP_SUCCESS,
            active: seller.active,
            result,
            id
        } as any))
        .catch(error => {
            dispatch(openInfo(`${error.response.data.message} Try later.`))
            return dispatch({
                type: UPDATE_SSP_FAILURE,
                error: error.response.data
            })
        });
};

export const deleteSSPAction = (id: number) => (dispatch: Dispatch<any>) => {
    dispatch({
        type: DELETE_SSP
    });

    return deleteSSP(id)
        .then(result => dispatch({
            type: DELETE_SSP_SUCCESS,
            result,
            id
        } as any))
        .catch(error => dispatch({
            type: DELETE_SSP_FAILURE,
            error: error.response.data
        }));
};

export const createSSPAction = (seller: SSP) => (dispatch: Dispatch<any>) => {
    dispatch({
        type: CREATE_SSP,
        seller: seller
    } as any);
    seller.active = false;
    return createSSP(seller)
        .then(response => dispatch({
            type: CREATE_SSP_SUCCESS,
            seller: response.data
        } as any))
        .catch((error) => dispatch({
            type: CREATE_SSP_FAILURE,
            errorMessage: error.response.data.message
        }));
};

export const setTab = (tab: string) => (dispatch: Dispatch<any>) => dispatch({
    type: SET_TAB,
    tab
})
