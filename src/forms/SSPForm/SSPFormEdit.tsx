import {connect} from 'react-redux';

import {State} from '../../reducers';
import {SSPForm} from './';

export const SSPFormEdit: any = connect((state: State) => ({
    initialValues: {
        ...state.SSPList.selected
    }
}))(SSPForm);
