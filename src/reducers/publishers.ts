import {Action} from 'redux';

export const DEFAULT_ACTION = '/default';

export type Actions = Action;

export interface State {

}

const initialState: State = {};

export function reducer(state: State = initialState, action: Actions) {
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
