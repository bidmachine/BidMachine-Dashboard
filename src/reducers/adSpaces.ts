import {Action, Dispatch} from 'redux';
import {AdSpace, AdSpaceType} from '../models/AdSpace';
import {
    addItem,
    initialItemsList,
    ItemsListState,
    receiveItemsList,
    removeById,
    updateItem,
    updateItemAdSpace
} from '../lib/ItemsListState';

import {createAdSpace, deleteAdSpace, requestAdSpaces, toggleAdSpace, updateAdSpace} from '../lib/api';

export const REQUEST_AD_SPACES = '/adSpaces/request';
export const REQUEST_AD_SPACES_SUCCESS = '/adSpaces/request/success';
export const REQUEST_AD_SPACES_FAILURE = '/adSpaces/request/failure';
export const CREATE_AD_SPACE = '/adSpaces/create';
export const CREATE_AD_SPACE_SUCCESS = '/adSpaces/create/success';
export const CREATE_AD_SPACE_FAILURE = '/adSpaces/create/failure';
export const UPDATE_AD_SPACE = '/adSpaces/update';
export const UPDATE_AD_SPACE_SUCCESS = '/adSpaces/update/success';
export const UPDATE_AD_SPACE_FAILURE = '/adSpaces/update/failure';
export const DELETE_AD_SPACE = '/adSpaces/delete';
export const DELETE_AD_SPACE_SUCCESS = '/adSpaces/delete/success';
export const DELETE_AD_SPACE_FAILURE = '/adSpaces/delete/failure';
export const TOGGLE_AD_SPACE = '/adSpaces/toggle';
export const TOGGLE_AD_SPACE_SUCCESS = '/adSpaces/toggle/success';
export const TOGGLE_AD_SPACE_FAILURE = '/adSpaces/toggle/failure';

export type Actions = Action;

export type State = ItemsListState<number, AdSpace>;

const initialState = initialItemsList<number, AdSpace>({});

export function reducer(state: State = initialState, action: Actions) {
    switch (action.type) {
        case REQUEST_AD_SPACES: {
            return {
                ...state,
                loading: true,
                items: [],
                map: new Map()
            };
        }

        case REQUEST_AD_SPACES_SUCCESS: {
            let spaces: AdSpace[] = (action as any).spaces;
            spaces = spaces.map((value) => {
                const newObj = {};
                let count = 1;
                if (value['ad']['ext']) {
                    for (const key of Object.keys(value['ad']['ext'])) {
                        newObj[`name${count}`] = key;
                        newObj[`value${count}`] = value['ad']['ext'][key];
                        count++;
                    }
                    return Object.assign(value, newObj);
                } else {
                    return value;
                }
            });
            return {
                ...state,
                ...receiveItemsList<number, AdSpace>(spaces)
            };
        }

        case REQUEST_AD_SPACES_FAILURE: {
            return {
                ...state,
                loading: false
            };
        }

        case CREATE_AD_SPACE_SUCCESS: {
            const space: AdSpace = (action as any).space;
            const newObj = {};
            let count = 1;
            for (const key of Object.keys(space['ad']['ext'])) {
                newObj[`name${count}`] = key;
                newObj[`value${count}`] = space['ad']['ext'][key];
                count++;
            }
            Object.assign(space, newObj);
            return addItem(state, space);
        }

        case UPDATE_AD_SPACE_SUCCESS: {
            const {id, adSpace} = (action as any);
            const newObj = {};
            let count = 1;
            for (const key in adSpace) {
                if (key.indexOf('name') > -1 || key.indexOf('value') > -1) {
                    delete adSpace[key];
                }
            }
            for (const key of Object.keys(adSpace['ad']['ext'])) {
                    newObj[`name${count}`] = key;
                    newObj[`value${count}`] = adSpace['ad']['ext'][key];
                    count++;
            }
            Object.assign(adSpace, newObj);
            return updateItemAdSpace(state, id, adSpace);
        }

        case TOGGLE_AD_SPACE_SUCCESS: {
            const {id, active} = (action as any);
            return updateItem(state, id, {active});
        }

        case DELETE_AD_SPACE_SUCCESS: {
            const {id} = (action as any);
            return removeById(state, id);
        }

        default: {
            return state;
        }
    }
}

export const requestAdSpacesAction = (adSpaceType: AdSpaceType, sellerId: number) => (dispatch: Dispatch<any>) => {
    dispatch({
        type: REQUEST_AD_SPACES,
        adSpaceType,
        sellerId
    } as any);

    requestAdSpaces(adSpaceType, sellerId)
        .then(response => dispatch({
            type: REQUEST_AD_SPACES_SUCCESS,
            adSpaceType,
            spaces: response.data
        } as any))
        .catch(error => dispatch({
            type: REQUEST_AD_SPACES_FAILURE,
            error: error.response.data
        }));
};

export const createAdSpaceAction = (adSpaceType: AdSpaceType, sellerId: number, space: AdSpace) => (dispatch: Dispatch<any>) => {
    dispatch({
        type: CREATE_AD_SPACE,
        adSpaceType,
        sellerId,
        space
    } as any);
    for (const key in space) {
        if (key.indexOf('name') > -1 || key.indexOf('value') > -1) {
            delete space[key];
        }
    }
    if (Object.keys(space['ad']['ext']).length === 0) {
        delete space['ad']['ext'];
    }
    createAdSpace(adSpaceType, sellerId, space)
        .then(response => dispatch({
            type: CREATE_AD_SPACE_SUCCESS,
            adSpaceType,
            space: response.data
        } as any))
        .catch(error => {
            return dispatch({
                type: CREATE_AD_SPACE_FAILURE,
                error: error.response.data
            });
        });
};

export const updateAdSpaceAction = (adSpaceType: AdSpaceType, id: number, adSpace: AdSpace) => (dispatch: Dispatch<any>) => {
    dispatch({
        type: UPDATE_AD_SPACE,
        adSpaceType,
        id,
        adSpace
    } as any);
    for (const key in adSpace) {
        if (key.indexOf('name') > -1 || key.indexOf('value') > -1) {
            delete adSpace[key];
        }
    }
    for (const key in adSpace['ad']) {
        if (key === 'w' || key === 'h') {
            if (adSpace['ad'][key] === '') {
                delete adSpace['ad'][key];
            }
        }
    }
    if (Object.keys(adSpace['ad']['ext']).length === 0) {
        delete adSpace['ad']['ext'];
    }
    updateAdSpace(adSpaceType, id, adSpace)
        .then(response => dispatch({
            type: UPDATE_AD_SPACE_SUCCESS,
            adSpaceType,
            id,
            adSpace: response.data
        } as any))
        .catch(error => dispatch({
            type: UPDATE_AD_SPACE_FAILURE,
            error: error.response.data
        }));
};

export const deleteAdSpaceAction = (adSpaceType: AdSpaceType, id: number) => (dispatch: Dispatch<any>) => {
    dispatch({
        type: DELETE_AD_SPACE,
        adSpaceType,
        id
    } as any);

    deleteAdSpace(adSpaceType, id)
        .then(() => dispatch({
            type: DELETE_AD_SPACE_SUCCESS,
            adSpaceType,
            id
        } as any))
        .catch(error => dispatch({
            type: DELETE_AD_SPACE_FAILURE,
            error: error.response.data
        }));
};

export const toggleAdSpaceAction = (type: AdSpaceType, id: number, active: boolean) => (dispatch: Dispatch<any>) => {
    dispatch({
        type: TOGGLE_AD_SPACE
    });

    toggleAdSpace(type, id, active)
        .then(() => dispatch({
            type: TOGGLE_AD_SPACE_SUCCESS,
            active,
            id
        } as any))
        .catch(error => dispatch({
            type: TOGGLE_AD_SPACE_FAILURE,
            error: error.response.data
        } as any));
};
