import {connect} from 'react-redux';

import {State} from '../../reducers';
import {AgencyForm} from './';

export const AgencyFormEdit: any = connect((state: State) => ({
    initialValues: {
        ...state.agenciesList.selected
    }
}))(AgencyForm);
