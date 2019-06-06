import dotProp = require("dot-prop");
import merge from 'deepmerge'

export interface FieldConfig {
    disabled?: boolean
    hidden?: boolean
    value?: any
}

export interface FieldsConfig {
    [field: string]: FieldConfig;
}

export interface AdProfileTemplateConfig {
    id: string
    name: string
    fields: FieldsConfig
}

export function valuesFromTemplate(template: AdProfileTemplateConfig, defaults) {
    const fields = template.fields;
    return merge(defaults, Object.keys(fields).reduce((result, field) => {
        let config = fields[field];
        if (config.hasOwnProperty('value')) dotProp.set(result, field, config.value);
        return result
    }, {}), {arrayMerge: (_d, s) => (s)});
}


export const BannerDefaults = {
    'interstitial': {hidden: true},
    'allowCache': {value: true, hidden: true},
    'allowCloseDelay': {value: 0, hidden: true},
    'debug': {hidden: true},
    'ad.btype': {hidden: true},
    'ad.battr': {hidden: true},
    'ad.pos': {hidden: true},
    'ad.mimes': {disabled: true},
    'ad.topframe': {hidden: true},
    'ad.expdir': {hidden: true},
    'ad.api': {value: [3, 5]},
    'title': {disabled: true},
    'ad.w': {disabled: true},
    'ad.h': {disabled: true},
};

export const InterstitialDefaults = {
    'interstitial': {disabled: true, value: true},
    'allowCache': {value: true, hidden: true},
    'allowCloseDelay': {value: 0, hidden: true},
    'debug': {hidden: true},
    'ad.btype': {hidden: true},
    'ad.battr': {hidden: true},
    'ad.pos': {hidden: true},
    'ad.mimes': {disabled: true},
    'ad.topframe': {hidden: true},
    'ad.expdir': {hidden: true},
    'ad.api': {disabled: true, value: [3, 5]},
    'title': {disabled: true},
    'ad.w': {disabled: true},
    'ad.h': {disabled: true},
};

export const BannerTemplates = <AdProfileTemplateConfig[]>[
    {
        id: 'b565f3b0-2925-4876-bae9-2619b68847e0',
        name: 'Banner 320x50',
        fields: {
            ...BannerDefaults,
            'template': {value: 'b565f3b0-2925-4876-bae9-2619b68847e0', hidden: true},
            'title': {value: 'Banner 320x50', disabled: true},
            'ad.w': {value: 320, disabled: true},
            'ad.h': {value: 50, disabled: true},
        }
    },
    {
        id: '226627fc-5ec1-4926-998f-0b111f703835',
        name: 'Banner 728x90',
        fields: {
            ...BannerDefaults,
            'template': {value: '226627fc-5ec1-4926-998f-0b111f703835', hidden: true},
            'title': {value: 'Banner 728x90', disabled: true},
            'ad.w': {value: 728, disabled: true},
            'ad.h': {value: 90, disabled: true},
        }
    } as AdProfileTemplateConfig,
    {
        id: '2df77b09-2e5b-4670-8d10-f72927747daa',
        name: 'Interstitial 320x480',
        fields: {
            ...InterstitialDefaults,
            'template': {value: '2df77b09-2e5b-4670-8d10-f72927747daa', hidden: true},
            'title': {value: 'Interstitial 320x480', disabled: true},
            'ad.w': {value: 320, disabled: true},
            'ad.h': {value: 480, disabled: true},
        }
    } as AdProfileTemplateConfig,
    {
        id: '9bf27b1f-fe0f-4908-8ed6-c9ae90779925',
        name: 'Interstitial 480x320',
        fields: {
            ...InterstitialDefaults,
            'template': {value: '9bf27b1f-fe0f-4908-8ed6-c9ae90779925', hidden: true},
            'title': {value: 'Interstitial 480x320', disabled: true},
            'ad.w': {value: 480, disabled: true},
            'ad.h': {value: 320, disabled: true},
        }
    },
    {
        id: '8e029f92-de00-448c-9d16-920563b79c2f',
        name: 'Interstitial 768x1024',
        fields: {
            ...InterstitialDefaults,
            'template': {value: '8e029f92-de00-448c-9d16-920563b79c2f', hidden: true},
            'title': {value: 'Interstitial 768x1024', disabled: true},
            'ad.w': {value: 768, disabled: true},
            'ad.h': {value: 1024, disabled: true},
        }
    },
    {
        id: 'd2a1d9b7-23db-4f29-9ada-04146ea433a5',
        name: 'Interstitial 1024x768',
        fields: {
            ...InterstitialDefaults,
            'template': {value: 'd2a1d9b7-23db-4f29-9ada-04146ea433a5', hidden: true},
            'title': {value: 'Interstitial 1024x768', disabled: true},
            'ad.w': {value: 1024, disabled: true},
            'ad.h': {value: 768, disabled: true},
        }
    }
];

export const NativeTemplates = <AdProfileTemplateConfig[]>[
    {
        id: 'd2afef46-867f-4a44-9151-c3e3cba74c4e',
        name: 'Native',
        fields: {
            'template': {value: 'd2afef46-867f-4a44-9151-c3e3cba74c4e', hidden: true},
            'interstitial': {hidden: true},
            'debug': {hidden: true},
            'title': {disabled: true, value: 'Native ads'},
            'ad.ver': {value: '1.1', disabled: true},
            'ad.api': {hidden: true},
            'ad.battr': {hidden: true}
        }
    }
];

export const VideoDefaults = {
    'active': {value: false},
    'interstitial': {value: true, disabled: true},
    'allowCache': {value: true, hidden: true},
    'allowCloseDelay': {value: 0, hidden: true},
    'debug': {hidden: true},
    'delayedNotification': {value: true},
    'ad.mimes': {disabled: true},
    'ad.minduration': {value: 5, disabled: true},
    'ad.maxduration': {value: 30, disabled: true},
    'ad.protocol': {hidden: true},
    'ad.protocols': {disabled: true},
    'ad.w': {hidden: true},
    'ad.h': {hidden: true},
    'ad.startdelay': {hidden: true},
    'ad.linearity': {disabled: true},
    'ad.battr': {hidden: true},
    'ad.maxextended': {hidden: true},
    'ad.minbitrate': {hidden: true},
    'ad.maxbitrate': {hidden: true},
    'ad.boxingallowed': {hidden: true},
    'ad.playbackmethod': {hidden: true},
    'ad.delivery': {hidden: true},
    'ad.pos': {hidden: true},
    'ad.api': {hidden: true}
};

export const VideoTemplates = <AdProfileTemplateConfig[]>[
    {
        id: '95857226-dab5-4b16-b272-2ae4754161f0',
        name: 'Skippable video',
        fields: {
            ...VideoDefaults,
            'template': {value: '95857226-dab5-4b16-b272-2ae4754161f0', hidden: true},
            'title': {value: 'Skippable video', disabled: true},
        }
    },
    {
        id: 'b0c6d86f-310a-4a97-8ec1-37f8409252e7',
        name: 'Non skippable video',
        fields: {
            ...VideoDefaults,
            'template': {value: 'b0c6d86f-310a-4a97-8ec1-37f8409252e7', hidden: true},
            'title': {value: 'Non skippable video', disabled: true},
        }
    }
];

export const templatesForSelect = [...BannerTemplates, ...NativeTemplates, ...VideoTemplates].map(template => ({
    label: template.name,
    value: template.id
}));

export const templatesByType = {
    'banner': BannerTemplates,
    'native': NativeTemplates,
    'video': VideoTemplates
};

export function templateById(id: string): AdProfileTemplateConfig {
    return [...BannerTemplates, ...NativeTemplates, ...VideoTemplates].find(template => template.id == id)
}
