// import './DetailedAdSpacesView.scss';
import * as React from 'react';
import {ClassAttributes, Component} from 'react';
import {connect} from 'react-redux';

import {AdSpace, AdSpaceType} from '../../../models/AdSpace';
import {BannerAdSpace} from '../../../models/BannerAdSpace';
import {NativeAdSpace} from '../../../models/NativeAdSpace';
import {VideoAdSpace} from '../../../models/VideoAdSpace';
import {State} from '../../../reducers';
import {
  createAdSpaceAction,
  deleteAdSpaceAction,
  requestAdSpacesAction,
  toggleAdSpaceAction,
  updateAdSpaceAction
} from '../../../reducers/adSpaces';
import {openConfirmYesNo} from '../../../reducers/confirm';

import {AppView} from '../../../components/AppView';
import {Button} from '../../../components/Button';
import * as Modal from 'react-modal';
import {Progress} from '../../../components/Progress';
import {Column, DataTableSorted, renderBoolean} from '../../../components/DataTable';
import {BannerAdSpaceForm} from '../../../forms/BannerAdSpaceForm/BannerAdSpaceForm';
import {BannerAdSpaceFormEdit} from '../../../forms/BannerAdSpaceForm/BannerAdSpaceFormEdit';
import {NativeAdSpaceForm} from '../../../forms/NativeAdSpaceForm/NativeAdSpaceForm';
import {NativeAdSpaceFormEdit} from '../../../forms/NativeAdSpaceForm/NativeAdSpaceFormEdit';
import {VideoAdSpaceForm} from '../../../forms/VideoAdSpaceForm/VideoAdSpaceForm';
import {VideoAdSpaceFormEdit} from '../../../forms/VideoAdSpaceForm/VideoAdSpaceFormEdit';

interface DetailedAdSpacesViewProps extends ClassAttributes<DetailedAdSpacesViewComponent> {
    sellerId: number;
    type: AdSpaceType;
}

interface StateProps {
    loading: boolean;
    adSpaces: any[];
    adSpacesMap: Map<number, AdSpace>;
}

interface DispatchProps {
    requestAdSpaces: (sellerId: number) => any;
    createAdSpace: (adSpace: AdSpace) => any;
    deleteAdSpace: (adSpaceId: number) => any;
    updateAdSpace: (adSpaceId: number, adSpace: AdSpace) => any;
    toggleAdSpace: (adSpaceId: number, active: boolean) => any;
}

const baseColumns: Column[] = [{
    value: 'id',
    label: 'Id',
    width: 32
}, {
    value: 'sellerId',
    label: 'Seller Id',
    width: 32
}, {
    value: 'debug',
    label: 'Debug',
    width: 32,
    render: renderBoolean
}, {
    value: 'displayManager',
    label: 'Display Manager'
}, {
    value: 'reward',
    label: 'Rewared',
    render: renderBoolean
}, {
    value: 'title',
    label: 'Title'
}];

const controlColumns = self => ([
    {
        value: 'active',
        label: 'Active',
        width: 100,
        render: (adSpace: AdSpace) => <Button
            className='icon'
            style={{color: adSpace.active ? 'green' : 'red'}}
            iconRight={`fa fa-${adSpace.active ? 'toggle-on' : 'toggle-off'}`}
            onClick={() => self.props.toggleAdSpace(adSpace.id, !adSpace.active)}/>
    }, {
        value: '',
        label: '',
        className: 'column-right',
        width: 100,
        nosort: true,
        render: (adSpace: AdSpace) => <div>
            <Button
                className='small control'
                iconLeft='fa fa-edit'
                onClick={() => self.openUpdateModal(adSpace.id)}>edit</Button>
            <Button
                className='primary small control'
                iconLeft='fa fa-trash'
                onClick={() => self.openDeleteModal(adSpace.id)}>delete</Button>
        </div>
    }]);

export class DetailedAdSpacesViewComponent extends Component<DetailedAdSpacesViewProps & StateProps & DispatchProps, {
    createModal?: boolean;
    editModal?: boolean;
    adSpaceId?: number;
}> {
    state = {
        createModal: false,
        editModal: false,
        adSpaceId: null
    };
    private columns: { [key: string]: Column[] } = {
        banner: [
            ...baseColumns,
            ...[
                {
                    value: 'interstitial',
                    label: 'Interstitial',
                    width: 32,
                    render: renderBoolean
                },
                {
                    value: '',
                    label: 'Size',
                    width: 70,
                    render: (adspace: BannerAdSpace) => <span>{adspace.ad.w} x {adspace.ad.h}</span>,
                    getValue: (adspace: BannerAdSpace) => `${adspace.ad.w} x ${adspace.ad.h}`
                },
            ],
            ...controlColumns(this)
        ],
        native: [
            ...baseColumns,
            ...[
                {
                    value: 'ver',
                    label: 'Version',
                    width: 32,
                    render: (adSpace: NativeAdSpace) => {
                        return adSpace.ad.ver;
                    },
                    getValue: (adSpace: NativeAdSpace) => adSpace.ad.ver
                }
            ],
            ...controlColumns(this)
        ],
        video: [
            ...baseColumns,
            ...[
                {
                    value: 'minduration',
                    label: 'Min duration',
                    width: 32,
                    render: (adSpace: VideoAdSpace) => {
                        return adSpace.ad.minduration;
                    },
                    getValue: (adSpace: VideoAdSpace) => {
                        return adSpace.ad.minduration;
                    }
                }, {
                    value: 'maxduration',
                    label: 'Max duration',
                    width: 32,
                    render: (adSpace: VideoAdSpace) => {
                        return adSpace.ad.maxduration;
                    },
                    getValue: (adSpace: VideoAdSpace) => {
                        return adSpace.ad.maxduration;
                    }
                }
            ],
            ...controlColumns(this)
        ]
    };

    openUpdateModal = (adSpaceId: number) => this.setState({
        editModal: true,
        adSpaceId
    } as any);

    closeUpdateModal = () => this.setState({
        editModal: false,
        adSpaceId: null
    } as any);

    openDeleteModal = (adSpaceId) => {
        this.props.deleteAdSpace(adSpaceId);
    };

    componentDidMount() {
        this.props.requestAdSpaces(this.props.sellerId);
    }

    componentWillReceiveProps(next: DetailedAdSpacesViewProps) {
        if (next.sellerId !== this.props.sellerId) {
            this.props.requestAdSpaces(next.sellerId);
        }
    }

    render() {
        const {adSpaces, loading} = this.props;
        return <AppView padding={false}>
            <div className='toolbar'>
                <div className='title' style={{textTransform: 'capitalize'}}>{this.props.type} Ad Spaces</div>
                <div className='flex-space'/>
                <Button
                    className='primary'
                    iconLeft='fa fa-plus-circle'
                    onClick={this.openCreateModal}
                    style={{textTransform: 'capitalize'}}>
                    Create {this.props.type} Ad Space
                </Button>
            </div>

            <Modal
                className='ReactModal__Content'
                overlayClassName='ReactModal__Overlay'
                contentLabel=''
                closeTimeoutMS={300}
                isOpen={this.state.createModal}
                onRequestClose={this.closeCreateModal}>
                <h1>Create <span style={{textTransform: 'capitalize'}}>{this.props.type}</span> Ad Space</h1>
                {this.renderForm()}
            </Modal>

            <Modal
                className='ReactModal__Content'
                overlayClassName='ReactModal__Overlay'
                contentLabel=''
                closeTimeoutMS={300}
                isOpen={this.state.editModal}
                onRequestClose={this.closeUpdateModal}>
                <h1>Edit <span style={{textTransform: 'capitalize'}}>{this.props.type}</span> Ad Space</h1>
                {this.renderEditForm()}
            </Modal>

            {
                loading
                    ? <Progress/>
                    : <DataTableSorted columns={this.columns[this.props.type]} data={adSpaces}/>
            }
        </AppView>;
    }

    private openCreateModal = () => this.setState({createModal: true} as any);

    private closeCreateModal = () => this.setState({createModal: false} as any);

    private createAdSpace = async (adSpace) => {
        let flag = true;
        let countExt = 1;
        adSpace.ad['ext'] = {};
        while (flag) {
            let key = adSpace[`name${countExt}`];
            let value = adSpace[`value${countExt}`];
            if (key && value) {
                adSpace.ad.ext[key] = value;
                countExt++;
            } else {
                flag = false;
            }
        }
        ;
        await this.props.createAdSpace(adSpace);
        this.closeCreateModal();
    };

    private editAdSpace = async (adSpace) => {
        let flag = true;
        let countExt = 1;
        adSpace.ad['ext'] = {};
        let names = new Map();
        let values = new Map();
        for (let key in adSpace) {
            if (key.indexOf('name') > -1 && adSpace[key] !== '') {
                names.set(key.replace('name', ''), adSpace[key]);
            }
            if (key.indexOf('value') > -1 && adSpace[key] !== '') {
                values.set(key.replace('value', ''), adSpace[key]);
            }
        }
        Array.from(names.keys()).map(val => {
            adSpace['ad']['ext'][names.get(val)] = values.get(val);
        })
        while (flag) {
            let key = adSpace[`name${countExt}`];
            let value = adSpace[`value${countExt}`];
            if (key && value) {
                adSpace.ad.ext[key] = value;
                countExt++;
            } else {
                flag = false;
            }
        }
        ;
        await this.props.updateAdSpace(adSpace.id, adSpace);
        this.closeUpdateModal();
    };

    private renderEditForm() {
        const {adSpaceId} = this.state;
        const {adSpacesMap} = this.props;
        if (adSpaceId && adSpacesMap.has(adSpaceId)) {
            const adSpace = adSpacesMap.get(adSpaceId);
            switch (this.props.type) {
                case 'banner': {
                    return <BannerAdSpaceFormEdit
                        adSpace={adSpace}
                        onSubmit={this.editAdSpace}
                        onCancel={this.closeUpdateModal}/>;
                }
                case 'native': {
                    return <NativeAdSpaceFormEdit
                        adSpace={adSpace}
                        onSubmit={this.editAdSpace}
                        onCancel={this.closeUpdateModal}/>;
                }
                case 'video': {
                    return <VideoAdSpaceFormEdit
                        adSpace={adSpace}
                        onSubmit={this.editAdSpace}
                        onCancel={this.closeUpdateModal}/>;
                }
                default: {
                    return null;
                }
            }
        }
    }

    private renderForm() {
        switch (this.props.type) {
            case 'banner': {
                return <BannerAdSpaceForm
                    onSubmit={this.createAdSpace}
                    onCancel={this.closeCreateModal}/>;
            }
            case 'native': {
                return <NativeAdSpaceForm
                    onSubmit={this.createAdSpace}
                    onCancel={this.closeCreateModal}/>;
            }
            case 'video': {
                return <VideoAdSpaceForm
                    onSubmit={this.createAdSpace}
                    onCancel={this.closeCreateModal}/>;
            }
            default: {
                return null;
            }
        }
    }
}

export const DetailedAdSpacesView = connect<StateProps, DispatchProps, DetailedAdSpacesViewProps>(
    (state: State) => {
        return {
            loading: state.adSpaces.loading,
            adSpaces: Array.from(state.adSpaces.map.values()),
            adSpacesMap: state.adSpaces.map
        };
    },
    (dispatch, props) => {
        return {
            requestAdSpaces: (sellerId: number) => {
                return dispatch(requestAdSpacesAction(props.type, sellerId));
            },
            createAdSpace: (adSpace: AdSpace) => {
                return dispatch(createAdSpaceAction(props.type, props.sellerId, adSpace));
            },
            deleteAdSpace: (adSpaceId: number) => {
                return dispatch(openConfirmYesNo('Delete Ad Space?', () => {
                    dispatch(deleteAdSpaceAction(props.type, adSpaceId));
                }));
            },
            updateAdSpace: (adSpaceId: number, adSpace: AdSpace) => {
                return dispatch(updateAdSpaceAction(props.type, adSpaceId, adSpace));
            },
            toggleAdSpace: (adSpaceId: number, active: boolean) => {
                dispatch(openConfirmYesNo(`${active ? 'Activate' : 'Deactivate'} ad space?`, () => {
                    dispatch(toggleAdSpaceAction(props.type, adSpaceId, active));
                }));
            }
        };
    }
)(DetailedAdSpacesViewComponent);
