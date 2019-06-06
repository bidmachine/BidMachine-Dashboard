export const SET_TIMER = 'refresh/set/timer';
export const CLEAR_TIMER = 'refresh/clear/timer';

export interface State {
    timer: any;
}

const initialState: State = {
    timer: null
};

export function reducer(state: State = initialState, action) {
    switch (action.type) {
        case SET_TIMER: {
            if (state.timer) {
                clearTimeout(state.timer);
            }
            return {
                ...state,
                timer: action.timer
            };
        }
        case CLEAR_TIMER: {
            if (state.timer) {
                clearTimeout(state.timer);
            }
            return {
                ...state,
                timer: null
            };
        }
        default: {
            return state;
        }
    }
}

export const setTimerAction = (timer) => ({
    type: SET_TIMER,
    timer
});

export const clearTimerAction = () => ({
    type: CLEAR_TIMER
});
