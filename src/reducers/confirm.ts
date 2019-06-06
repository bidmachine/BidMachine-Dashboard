import {Action, Dispatch} from 'redux';

export const OPEN_CONFIRM = 'confirm/open';
export const CLOSE_CONFIRM = 'confirm/close';

export type Actions = Action;

export interface ConfirmModel {
    title: string;
    body: string | JSX.Element;
    actions: ConfirmAction[];
    style: {
        overlay?: any,
        content?: any
    };
}

export interface ConfirmAction {
    label: string;
    className?: string;
    action: () => any;
}

export interface State extends ConfirmModel {
    open: boolean;
}

const initialState: State = {
    open: false,
    title: '',
    body: '',
    actions: [],
    style: {}
};

export function reducer(state: State = initialState, action: Actions) {
    switch (action.type) {
        case OPEN_CONFIRM: {
            const params: ConfirmModel = (action as any).params;
            return {
                ...state,
                open: true,
                ...params
            };
        }
        case CLOSE_CONFIRM: {
            return initialState;
        }
        default: {
            return state;
        }
    }
}

export const openConfirm = (params: ConfirmModel) => ({
    type: OPEN_CONFIRM,
    params
});

export const closeConfirm = () => ({
    type: CLOSE_CONFIRM
});

export const openConfirmYesNo = (text: string, onOk: () => any) => (dispatch: Dispatch<any>) => {
    dispatch(openConfirm({
        title: text,
        body: '',
        style: {
            overlay: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            },
            content: {
                position: 'relative'
            }
        },
        actions: [{
            label: 'Ok',
            className: 'primary',
            action: async () => {
                await onOk();
                dispatch(closeConfirm());
            }
        }, {
            label: 'Cancel',
            action: () => dispatch(closeConfirm())
        }]
    }));
};

export const openInfo = (text: string) => (dispatch: Dispatch<any>) => {
    dispatch(openConfirm({
        title: text,
        body: '',
        style: {
            overlay: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            },
            content: {
                position: 'relative'
            }
        },
        actions: [{
            label: 'Ok',
            className: 'primary',
            action: () => dispatch(closeConfirm())
        }]
    }));
};
