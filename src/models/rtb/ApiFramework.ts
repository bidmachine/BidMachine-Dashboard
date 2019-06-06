import {enumValues} from '../../lib/enum';

export enum ApiFramework {
    vpaid_1 = 1,
    vpaid_2,
    mraid_1,
    ormma,
    mraid_2
}

export const apiFrameworkLabels = {
    [ApiFramework.vpaid_1]: 'VPAID 1.0',
    [ApiFramework.vpaid_2]: 'VPAID 2.0',
    [ApiFramework.mraid_1]: 'MRAID-1',
    [ApiFramework.ormma]: 'ORMMA',
    [ApiFramework.mraid_2]: 'MRAID-2'
};

export const apiFrameworks = enumValues(ApiFramework, apiFrameworkLabels);
