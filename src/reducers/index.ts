import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';

import * as confirm from './confirm';
import * as statistics from './statistics';
import * as agenciesSelect from './agenciesSelect';
import * as agenciesList from './agenciesList';
import * as SSPList from './SSPList';
import * as agencyWizard from './agencyWizard';
import * as biddersSelect from './biddersSelect';
import * as biddersList from './biddersList';
import * as adProfiles from './adProfiles';
import * as adSpaces from './adSpaces';
import * as refresh from './refresh';
import * as SSPSelect from './SSPSelect';

export interface State {
    confirm: confirm.State;
    statistics: statistics.State;
    agenciesSelect: agenciesSelect.State;
    agenciesList: agenciesList.State;
    SSPList: SSPList.State;
    SSPSelect: SSPSelect.State;
    agencyWizard: agencyWizard.State;
    biddersSelect: biddersSelect.State;
    biddersList: biddersList.State;
    adProfiles: adProfiles.State;
    adSpaces: adSpaces.State;
    refresh: refresh.State;
}

export const reducer = combineReducers({
    form: formReducer,
    confirm: confirm.reducer,
    statistics: statistics.reducer,
    agenciesSelect: agenciesSelect.reducer,
    agenciesList: agenciesList.reducer,
    SSPList: SSPList.reducer,
    SSPSelect: SSPSelect.reducer,
    agencyWizard: agencyWizard.reducer,
    biddersSelect: biddersSelect.reducer,
    biddersList: biddersList.reducer,
    adProfiles: adProfiles.reducer,
    adSpaces: adSpaces.reducer,
    refresh: refresh.reducer
});
