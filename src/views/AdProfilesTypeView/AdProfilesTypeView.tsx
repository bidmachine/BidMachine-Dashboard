import * as React from 'react';
import {ClassAttributes} from 'react';
import {connect} from 'react-redux';

import {State} from '../../reducers';
import {AdProfile, AdProfileType, BannerAdProfile, NativeAdProfile, VideoAdProfile} from '../../models/auction';

import {
  createAdProfileAction,
  deleteAdProfileAction,
  requestAdProfilesAction,
  toggleAdProfileAction,
  updateAdProfileAction
} from '../../reducers/adProfiles';
import {openConfirmYesNo} from '../../reducers/confirm';

import {AppView} from '../../components/AppView';
import {Button} from '../../components/Button';
import {BannerAdProfileFormBidder, BannerAdProfileFormEdit} from '../../forms/BannerAdProfileForm';
import {NativeAdProfileFormBidder, NativeAdProfileFormEdit} from '../../forms/NativeAdProfileForm';
import {VideoAdProfileFormBidder, VideoAdProfileFormEdit} from '../../forms/VideoAdProfileForm';
import * as Modal from 'react-modal';
import {Column, DataTableSorted, renderBoolean} from '../../components/DataTable';
import {Progress} from '../../components/Progress';
import {AdProfileTemplateConfig, templateById, templatesByType} from "../../models/auction/AdProfieleTempate";
import {Link} from "react-router";

interface AdProfilesTypeViewProps extends ClassAttributes<AdProfilesTypeViewComponent> {
    type: AdProfileType;
    bidderId?: number;
}

interface StateProps {
    loading: boolean;
    profiles: AdProfile[];
    profilesMap: Map<number, AdProfile>;
}

interface DispatchProps {
    requestProfiles: (type: AdProfileType, bidderId: number) => any;
    createProfile: (profile: AdProfile) => any;
    updateProfile: (id: number, profile: AdProfile) => any;
    toggleProfile: (id: number, active: boolean) => any;
    deleteProfile: (id: number) => any;
}

const adProfileColumns = (self) => [{
    value: 'id',
    label: 'Id',
    width: 44
}, {
    value: 'externalId',
    label: 'External Id',
    width: 44
}, {
    value: 'bidderId',
    label: 'Bidder',
    render: (profile: AdProfile) => <Link
        to={`/bidders/${profile.bidderId}`}>{profile.bidder ? profile.bidder.title : profile.bidderId}</Link>
}, {
    value: 'debug',
    label: 'Debug',
    width: 44,
    render: renderBoolean
}, {
    value: 'reward',
    label: 'Rewared',
    render: renderBoolean
}, {
    value: 'delayedNotification',
    label: 'Delayed Notification',
    width: 44,
    render: renderBoolean
}, {
    value: 'title',
    label: 'Title'
}
];

const bannerColumns = [
    {
        value: 'interstitial',
        label: 'Interstitial',
        width: 44,
        render: renderBoolean
    },
    {
        value: 'size',
        label: 'Size',
        width: 70,
        render: (profile: BannerAdProfile) => <span>{profile.ad.w} x {profile.ad.h}</span>,
        getValue: (profile: BannerAdProfile) => `${profile.ad.w} x ${profile.ad.h}`
    },
];

const nativeColumns = [
    {
        value: 'ver',
        label: 'Version',
        width: 44,
        render: (profile: NativeAdProfile) => {
            return profile.ad.ver;
        },
        getValue: (profile: NativeAdProfile) => profile.ad.ver
    }
];

const videoColumns = [
    {
        value: 'minduration',
        label: 'Min duration',
        width: 44,
        render: (profile: VideoAdProfile) => {
            return profile.ad.minduration;
        },
        getValue: (profile: VideoAdProfile) => profile.ad.minduration
    }, {
        value: 'maxduration',
        label: 'Max duration',
        width: 44,
        render: (profile: VideoAdProfile) => {
            return profile.ad.maxduration;
        },
        getValue: (profile: VideoAdProfile) => profile.ad.maxduration
    }
];

const controlColumns = (self) => [
    {
        value: 'active',
        label: 'Active',
        width: 100,
        render: (profile: AdProfile) => <Button
            className='icon'
            style={{color: profile.active ? 'green' : 'red'}}
            iconRight={`fa fa-${profile.active ? 'toggle-on' : 'toggle-off'}`}
            onClick={() => self.props.toggleProfile(profile.id, !profile.active)}/>
    }, {
        value: '',
        label: '',
        className: 'column-right',
        width: 100,
        nosort: true,
        render: (profile: AdProfile) => (<div>
            <Button
                className='small control'
                disabled={!profile.template}
                iconLeft='fa fa-edit'
                onClick={() => self.openEditModal(profile.id)}>edit</Button>
            <Button
                className='primary small control'
                iconLeft='fa fa-trash'
                onClick={() => self.props.deleteProfile(profile.id)}>delete</Button>
        </div>)
    }
];

export class AdProfilesTypeViewComponent extends React.Component<StateProps & DispatchProps & AdProfilesTypeViewProps, {
    createModal?: boolean;
    editModal?: boolean;
    chooseTemplate?: boolean;
    profileId?: number;
    template?: AdProfileTemplateConfig
}> {
    state = {
        createModal: false,
        editModal: false,
        chooseTemplate: false,
        profileId: null,
        template: null
    };
    private columns: { [id: string]: Column[] } = {
        banner: [
            ...adProfileColumns(this),
            ...bannerColumns,
            ...controlColumns(this)
        ],
        native: [
            ...adProfileColumns(this),
            ...nativeColumns,
            ...controlColumns(this)
        ],
        video: [
            ...adProfileColumns(this),
            ...videoColumns,
            ...controlColumns(this)
        ]
    };

    openEditModal = (profileId: number) => this.setState({editModal: true, profileId} as any);

    componentDidMount() {
        this.props.requestProfiles(this.props.type, this.props.bidderId);
    }

    componentWillReceiveProps(next: AdProfilesTypeViewProps) {
        if (next.bidderId !== this.props.bidderId || next.type !== this.props.type) {
            this.props.requestProfiles(next.type, next.bidderId);
        }
    }

    renderTemplates() {
        let variants = templatesByType[this.props.type];
        return (
            <ul className="choose-adprofile-templates">
                {variants.map(template => (<li key={template.name}>
                    <Button className='primary' onClick={() => this.setState({
                        template: template,
                        chooseTemplate: false
                    } as any, () => this.openCreateModal())
                    }>{template.name}</Button>
                </li>))}
            </ul>
        )
    }

    render() {
        const {profiles, loading, type} = this.props;
        return <AppView padding={false}>
            <div className='toolbar'>
                <div className='title'><span style={{textTransform: 'capitalize'}}>{type}</span> Ad Profiles</div>
                <div className='flex-space'/>
                <Button
                    className='primary'
                    iconLeft='fa fa-plus-circle'
                    onClick={this.openChooseTemplateModal}>
                    Create Ad Profile
                </Button>
            </div>

            <Modal
                className='ReactModal__Content'
                overlayClassName='ReactModal__Overlay Confirm-modal'
                contentLabel=''
                closeTimeoutMS={300}
                isOpen={this.state.chooseTemplate}
                onRequestClose={this.closeChooseTemplateModal}>
                {this.renderTemplates()}
            </Modal>

            <Modal
                className='ReactModal__Content'
                overlayClassName='ReactModal__Overlay'
                contentLabel=''
                closeTimeoutMS={300}
                isOpen={this.state.createModal}
                onRequestClose={this.closeCreateModal}>
                <h1>Create Ad Profile</h1>
                {this.renderForm()}
            </Modal>

            <Modal
                className='ReactModal__Content'
                overlayClassName='ReactModal__Overlay'
                contentLabel=''
                closeTimeoutMS={300}
                isOpen={this.state.editModal}
                onRequestClose={this.closeEditModal}>
                <h1>Edit Ad Profile</h1>
                {this.renderEditForm()}
            </Modal>

            {
                loading
                    ? <Progress/>
                    : <DataTableSorted columns={this.columns[this.props.type]} data={profiles}/>
            }
        </AppView>;
    }

    private openCreateModal = () => this.setState({createModal: true} as any);

    private closeCreateModal = () => this.setState({createModal: false} as any);

    private openChooseTemplateModal = () => this.setState({chooseTemplate: true} as any);

    private closeChooseTemplateModal = () => this.setState({chooseTemplate: false} as any);

    private closeEditModal = () => this.setState({editModal: false, profileId: null} as any);

    private editAdProfile = async (adProfile: AdProfile) => {
        await this.props.updateProfile(adProfile.id, adProfile);
        this.closeEditModal();
    };

    private createProfile = async (profile: AdProfile) => {
        await this.props.createProfile(profile);
        this.closeCreateModal();
    };

    private renderEditForm = () => {
        const {profileId} = this.state;
        const {profilesMap} = this.props;
        if (profilesMap.has(profileId)) {
            const adProfile = profilesMap.get(profileId);
            switch (this.props.type) {
                case 'banner': {
                    return <BannerAdProfileFormEdit
                        adProfile={adProfile}
                        bidderId={this.props.bidderId}
                        onSubmit={this.editAdProfile}
                        onCancel={this.closeEditModal}
                        template={templateById(adProfile.template)}/>;
                }
                case 'native': {
                    return <NativeAdProfileFormEdit
                        adProfile={adProfile}
                        bidderId={this.props.bidderId}
                        onSubmit={this.editAdProfile}
                        onCancel={this.closeEditModal}
                        template={templateById(adProfile.template)}/>;
                }
                case 'video': {
                    return <VideoAdProfileFormEdit
                        adProfile={adProfile}
                        bidderId={this.props.bidderId}
                        onSubmit={this.editAdProfile}
                        onCancel={this.closeEditModal}
                        template={templateById(adProfile.template)}/>;
                }
                default: {
                    return null;
                }
            }
        } else {
            return null;
        }
    };

    private renderForm = () => {
        switch (this.props.type) {
            case 'banner': {
                return <BannerAdProfileFormBidder
                    bidderId={this.props.bidderId}
                    onSubmit={this.createProfile}
                    onCancel={this.closeCreateModal}
                    template={this.state.template}
                />;
            }
            case 'native': {
                return <NativeAdProfileFormBidder
                    bidderId={this.props.bidderId}
                    onSubmit={this.createProfile}
                    onCancel={this.closeCreateModal}
                    template={this.state.template}
                />;
            }
            case 'video': {
                return <VideoAdProfileFormBidder
                    bidderId={this.props.bidderId}
                    onSubmit={this.createProfile}
                    onCancel={this.closeCreateModal}
                    template={this.state.template}
                />;
            }
            default: {
                return null;
            }
        }
    };
}

export const AdProfilesTypeView = connect<StateProps, DispatchProps, AdProfilesTypeViewProps>(
    (state: State) => {
        return {
            loading: state.adProfiles.loading,
            profiles: Array.from(state.adProfiles.map.values()),
            profilesMap: state.adProfiles.map
        };
    }, (dispatch, props) => {
        return {
            requestProfiles: (type: AdProfileType, bidderId: number) => dispatch(requestAdProfilesAction(type, bidderId)),
            createProfile: (profile: AdProfile) => dispatch(createAdProfileAction(props.type, profile)),
            toggleProfile: (id: number, active: boolean) => dispatch(openConfirmYesNo(`${active ? 'Activate' : 'Deactivate'} ad profile?`, () => {
                dispatch(toggleAdProfileAction(props.type, id, active));
            })),
            updateProfile: (id: number, profile: AdProfile) => dispatch(updateAdProfileAction(props.type, id, profile)),
            deleteProfile: (id: number) => dispatch(openConfirmYesNo('Delete Ad Profile?', () => {
                dispatch(deleteAdProfileAction(props.type, id));
            }))
        };
    }
)(AdProfilesTypeViewComponent);
