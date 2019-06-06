import {Action, Dispatch} from 'redux';
import {Agency} from '../models/auction/Agency';
import {
    initialItemsList,
    ItemsListState,
    receiveItemsList,
    removeById,
    SortDirection,
    updateItem
} from '../lib/ItemsListState';

import {deleteAgency, requestAgencies, requestAgency, toggleAgency, updateAgency} from '../lib/api';
import {openInfo} from './confirm';

export const REQUEST_AGENCIES = 'agenciesList/items/request';
export const REQUEST_AGENCIES_SUCCESS = 'agenciesList/items/request/success';
export const REQUEST_AGENCIES_FAILURE = 'agenciesList/items/request/failure';
export const REQUEST_AGENCY = 'agenciesList/agency/request';
export const REQUEST_AGENCY_SUCCESS = 'agenciesList/agency/request/success';
export const REQUEST_AGENCY_FAILURE = 'agenciesList/agency/request/failure';
export const DELETE_AGENCY = 'agenciesList/agency/delete';
export const DELETE_AGENCY_SUCCESS = 'agenciesList/agency/delete/success';
export const DELETE_AGENCY_FAILURE = 'agenciesList/agency/delete/failure';
export const UPDATE_AGENCY = 'agenciesList/agency/update';
export const UPDATE_AGENCY_SUCCESS = 'agenciesList/agency/update/success';
export const UPDATE_AGENCY_FAILURE = 'agenciesList/agency/update/failure';
export const TOGGLE_AGENCY = 'agenciesList/agency/toggle';
export const TOGGLE_AGENCY_SUCCESS = 'agenciesList/agency/toggle/failure';
export const TOGGLE_AGENCY_FAILURE = 'agenciesList/agency/toggle/failure';

export type Actions = Action;

export type State = ItemsListState<number, Agency>;

const initialState: State = initialItemsList<number, Agency>({});

export function reducer(state: State = initialState, action: Actions): State {
    switch (action.type) {
        case REQUEST_AGENCIES: {
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

        case REQUEST_AGENCIES_SUCCESS: {
            const agencies: Agency[] = (action as any).agencies;
            return {
                ...state,
                ...receiveItemsList<number, Agency>(agencies)
            };
        }

        case REQUEST_AGENCIES_FAILURE: {
            return {
                ...state,
                loading: false
            };
        }

        case REQUEST_AGENCY: {
            return {
                ...state,
                selected: null,
                loadingSelected: true
            };
        }

        case REQUEST_AGENCY_SUCCESS: {
            const agency: Agency = (action as any).agency;
            return {
                ...state,
                selected: agency,
                loadingSelected: false
            };
        }

        case REQUEST_AGENCY_FAILURE: {
            return {
                ...state,
                loadingSelected: false
            };
        }

        case DELETE_AGENCY_SUCCESS: {
            const id: number = (action as any).id;
            return removeById(state, id);
        }

        case TOGGLE_AGENCY_SUCCESS: {
            const {id, active} = (action as any);
            return updateItem(state, id, {active});
        }

        default: {
            return state;
        }
    }
}

export const requestAgenciesAction = (sortColumn?: string, sortDirection?: SortDirection) => (dispatch: Dispatch<any>) => {
    dispatch({
        type: REQUEST_AGENCIES,
        sortColumn,
        sortDirection
    } as any);

    return requestAgencies()
        .then(response => dispatch({
            type: REQUEST_AGENCIES_SUCCESS,
            agencies: response.data
        } as any))
        .catch(() => dispatch({
            type: REQUEST_AGENCIES_FAILURE
        }));
};

export const requestAgencyAction = (id: number) => (dispatch: Dispatch<any>) => {
    dispatch({
        type: REQUEST_AGENCY
    });

    return requestAgency(id)
        .then(response => dispatch({
            type: REQUEST_AGENCY_SUCCESS,
            agency: response.data
        } as any))
        .catch(() => dispatch({
            type: REQUEST_AGENCY_FAILURE
        }));
};

export const updateAgencyAction = (id: number, agency: Agency) => (dispatch: Dispatch<any>) => {
    dispatch({
        type: UPDATE_AGENCY
    });

    return updateAgency(id, agency)
        .then(result => {
            dispatch(openInfo('Agency was successfully saved.'));
            return dispatch({
                type: UPDATE_AGENCY_SUCCESS,
                result,
                id
            } as any)
        })
        .catch(error => {
            dispatch(openInfo(`${error.response.data.message} Try later.`));
            return dispatch({
                type: UPDATE_AGENCY_FAILURE,
                error: error.response.data
            })
        });
};

export const deleteAgencyAction = (id: number) => (dispatch: Dispatch<any>) => {
    dispatch({
        type: DELETE_AGENCY
    });

    return deleteAgency(id)
        .then(result => dispatch({
            type: DELETE_AGENCY_SUCCESS,
            result,
            id
        } as any))
        .catch(error => dispatch({
            type: DELETE_AGENCY_FAILURE,
            error: error.response.data
        }));
};

export const toggleAgencyAction = (id: number, active: boolean) => (dispatch: Dispatch<any>) => {
    dispatch({
        type: TOGGLE_AGENCY
    });

    toggleAgency(id, active)
        .then(() => dispatch({
            type: TOGGLE_AGENCY_SUCCESS,
            active,
            id
        } as any))
        .catch(error => dispatch({
            type: TOGGLE_AGENCY_FAILURE,
            error: error.response.data
        } as any));
};
