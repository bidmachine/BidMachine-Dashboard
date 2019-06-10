import {Action} from 'redux';

export const DEFAULT_ACTION = '/default';

export type Actions = Action;

const initialState = {};

export function reducer(state = initialState, action: Actions) {
    switch (action.type) {
        case DEFAULT_ACTION: {
            return state;
        }
        default: {
            return state;
        }
    }
}

export const defaultAction = () => ({
    type: DEFAULT_ACTION
});
