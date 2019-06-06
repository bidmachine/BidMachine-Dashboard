import {enumValues} from '../../lib/enum';

export enum Protocol {
    vast_1 = 1,
    vast_2,
    vast_3,
    vast_1_wrapper,
    vast_2_wrapper,
    vast_3_wrapper
}

export const protocolLabels = {
    [Protocol.vast_1]: 'VAST 1.0',
    [Protocol.vast_2]: 'VAST 2.0',
    [Protocol.vast_3]: 'VAST 3.0',
    [Protocol.vast_1_wrapper]: 'VAST 1.0 Wrapper',
    [Protocol.vast_2_wrapper]: 'VAST 2.0 Wrapper',
    [Protocol.vast_3_wrapper]: 'VAST 3.0 Wrapper'
};

export const protocols = enumValues(Protocol, protocolLabels);
