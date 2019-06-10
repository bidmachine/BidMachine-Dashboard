import * as React from 'react';

import {AgenciesView} from '../AgenciesView/AgenciesView';
import {SSPView} from '../SSPView/SSPView';

export class ClientsTypeView extends React.Component<{ type: string; }, {}> {
    render() {
        return <div>
            {this.props.type === 'agency' ? <AgenciesView/> : <SSPView/>}
        </div>;
    }
}
