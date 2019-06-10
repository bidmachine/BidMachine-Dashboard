// import './SettingsView.scss';
import * as React from 'react';
import {ClassAttributes, Component} from 'react';

import {AppView} from '../../components/AppView';
import {getSettings, setSettings, Settings} from '../../lib/api';
import {Button} from '../../components/Button';
import {FormField} from '../../components/FormField';

interface SettingsViewProps extends ClassAttributes<SettingsView> {
}

export class SettingsView extends Component<SettingsViewProps, {
    loading?: boolean;
    settings: Settings;
}> {
    state = {
        loading: false,
        settings: null as Settings
    };
    setSettingsField = (field, value) => {
        this.setState(prev => ({
            ...prev,
            settings: {
                ...prev.settings,
                [field]: value
            } as any
        }));
    }
    save = async () => {
        this.setState({loading: true} as any);
        await setSettings(this.state.settings);
        this.setState({loading: false} as any);
    }

    componentDidMount() {
        getSettings().then(response => this.setState({settings: response.data} as any));
    }

    render() {
        return <AppView>
            <div className='toolbar'>
                <div className='title'>Fee commission, %</div>
                <div className='flex-space'/>
            </div>

            {
                this.state.settings && !this.state.loading ? <div className='model-form'>
                    <FormField label='Banner' value={this.state.settings.bannerAppodealxFee}
                               onChange={v => this.setSettingsField('bannerAppodealxFee', v)}/>
                    <FormField label='Interstitial' value={this.state.settings.interstitialAppodealxFee}
                               onChange={v => this.setSettingsField('interstitialAppodealxFee', v)}/>
                    <FormField label='Native' value={this.state.settings.nativeAppodealxFee}
                               onChange={v => this.setSettingsField('nativeAppodealxFee', v)}/>
                    <FormField label='Video' value={this.state.settings.videoAppodealxFee}
                               onChange={v => this.setSettingsField('videoAppodealxFee', v)}/>
                    <div className='form-field'>
                        <label/>
                        <div className='form-controls'>
                            <Button onClick={this.save}>Save</Button>
                        </div>
                    </div>
                </div> : 'loading'
            }
        </AppView>;
    }
}
