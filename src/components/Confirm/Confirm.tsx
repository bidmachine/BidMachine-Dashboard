import './Confirm.scss';
import * as React from 'react';
import {ClassAttributes, Component} from 'react';
import {connect, Dispatch} from 'react-redux';

import {State} from '../../reducers';
import {closeConfirm, ConfirmModel} from '../../reducers/confirm';

import * as Modal from 'react-modal';
import {Button} from '../Button';

interface ConfirmProps extends ClassAttributes<ConfirmComponent> {

}

interface StateProps extends ConfirmModel {
    open: boolean;
}

interface DispatchProps {
    close: () => any;
}

export class ConfirmComponent extends Component<StateProps & DispatchProps & ConfirmProps, {}> {
    render() {
        const {open, title, body, actions, close} = this.props;
        return <Modal
            className='ReactModal__Content '
            overlayClassName='ReactModal__Overlay Confirm-modal'
            contentLabel=''
            isOpen={open}
            closeTimeoutMS={300}
            onRequestClose={close}>
            {title && <h1>{title}</h1>}
            {body}
            <div className='Confirm-modal__Actions'>
                {actions.map((action, i) => <Button key={i} className={action.className} onClick={action.action}>
                    {action.label}
                </Button>)}
            </div>
        </Modal>;
    }
}

export const Confirm = connect<StateProps, DispatchProps, ConfirmProps>(
    (state: State) => {
        return {
            ...state.confirm
        };
    },
    (dispatch: Dispatch<any>) => {
        return {
            close: () => dispatch(closeConfirm())
        };
    }
)(ConfirmComponent);
