import {Action, Dispatch} from 'redux';
import {AdProfile, AdProfileType} from '../models/auction/AdProfile';
import {
    addItem,
    initialItemsList,
    ItemsListState,
    receiveItemsList,
    removeById,
    updateItem
} from '../lib/ItemsListState';

import {createAdProfile, deleteAdProfile, requestAdProfiles, toggleAdProfile, updateAdProfile} from '../lib/api';

export const REQUEST_AD_PROFILES = '/adProfiles/request';
export const REQUEST_AD_PROFILES_SUCCESS = '/adProfiles/request/success';
export const REQUEST_AD_PROFILES_FAILURE = '/adProfiles/request/failure';
export const CREATE_AD_PROFILE = '/adProfiles/create';
export const CREATE_AD_PROFILE_SUCCESS = '/adProfiles/create/success';
export const CREATE_AD_PROFILE_FAILURE = '/adProfiles/create/failure';
export const UPDATE_AD_PROFILE = '/adProfiles/update';
export const UPDATE_AD_PROFILE_SUCCESS = '/adProfiles/update/success';
export const UPDATE_AD_PROFILE_FAILURE = '/adProfiles/update/failure';
export const DELETE_AD_PROFILE = '/adProfiles/delete';
export const DELETE_AD_PROFILE_SUCCESS = '/adProfiles/delete/success';
export const DELETE_AD_PROFILE_FAILURE = '/adProfiles/delete/failure';
export const TOGGLE_AD_PROFILE = '/adProfiles/toggle';
export const TOGGLE_AD_PROFILE_SUCCESS = '/adProfiles/toggle/success';
export const TOGGLE_AD_PROFILE_FAILURE = '/adProfiles/toggle/failure';

export type Actions = Action;

export type State = ItemsListState<number, AdProfile>;

const initialState = initialItemsList<number, AdProfile>({});

export function reducer(state: State = initialState, action: Actions) {
    switch (action.type) {
        case REQUEST_AD_PROFILES: {
            return {
                ...state,
                loading: true,
                items: [],
                map: new Map()
            };
        }

        case REQUEST_AD_PROFILES_SUCCESS: {
            const profiles: AdProfile[] = (action as any).profiles;
            return {
                ...state,
                ...receiveItemsList<number, AdProfile>(profiles)
            };
        }

        case REQUEST_AD_PROFILES_FAILURE: {
            return {
                ...state,
                loading: false
            };
        }

        case CREATE_AD_PROFILE_SUCCESS: {
            const profile: AdProfile = (action as any).profile;
            return addItem(state, profile);
        }

        case TOGGLE_AD_PROFILE_SUCCESS: {
            const {id, active} = (action as any);
            return updateItem(state, id, {active});
        }

        case UPDATE_AD_PROFILE_SUCCESS: {
            const {id, adProfile} = (action as any);
            return updateItem(state, id, adProfile);
        }

        case DELETE_AD_PROFILE_SUCCESS: {
            const id: number = (action as any).id;
            return removeById(state, id);
        }

        default: {
            return state;
        }
    }
}

export const requestAdProfilesAction = (type: AdProfileType, bidderId: number) => (dispatch: Dispatch<any>) => {
    dispatch({
        type: REQUEST_AD_PROFILES
    });

    requestAdProfiles(type, bidderId)
        .then(response => dispatch({
            type: REQUEST_AD_PROFILES_SUCCESS,
            profiles: response.data
        } as any))
        .catch(error => {
            console.log(error);
            return dispatch({
                type: REQUEST_AD_PROFILES_FAILURE,
                error: error.response.data
            } as any);
        });
};

export const createAdProfileAction = (type: AdProfileType, profile: AdProfile) => (dispatch: Dispatch<any>) => {
    dispatch({
        type: CREATE_AD_PROFILE
    });
    createAdProfile(type, profile)
        .then(response => dispatch({
            type: CREATE_AD_PROFILE_SUCCESS,
            profile: response.data
        } as any))
        .catch(error => dispatch({
            type: CREATE_AD_PROFILE_FAILURE,
            error: error.response.data
        } as any));
};

export const toggleAdProfileAction = (type: AdProfileType, id: number, active: boolean) => (dispatch: Dispatch<any>) => {
    dispatch({
        type: TOGGLE_AD_PROFILE
    } as any);

    toggleAdProfile(type, id, active)
        .then(() => dispatch({
            type: TOGGLE_AD_PROFILE_SUCCESS,
            active,
            id
        } as any))
        .catch(error => dispatch({
            type: TOGGLE_AD_PROFILE_FAILURE,
            error: error.response.data
        } as any));
};

export const updateAdProfileAction = (type: AdProfileType, id: number, adProfile: AdProfile) => (dispatch: Dispatch<any>) => {
    dispatch({
        type: UPDATE_AD_PROFILE,
        adProfile,
        id
    } as any);

    updateAdProfile(type, id, adProfile)
        .then(() => dispatch({
            type: UPDATE_AD_PROFILE_SUCCESS,
            adProfile,
            id
        } as any))
        .catch(error => dispatch({
            type: UPDATE_AD_PROFILE_FAILURE,
            error: error.response.data
        } as any));
};

export const deleteAdProfileAction = (type: AdProfileType, id: number) => (dispatch: Dispatch<any>) => {
    dispatch({
        type: DELETE_AD_PROFILE
    });

    deleteAdProfile(type, id)
        .then(response => dispatch({
            type: DELETE_AD_PROFILE_SUCCESS,
            result: response.data,
            id
        } as any))
        .catch(error => dispatch({
            type: DELETE_AD_PROFILE_FAILURE,
            error: error.response.data
        } as any));
};
