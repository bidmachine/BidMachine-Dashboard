import {enumValues} from '../../lib/enum';

export enum ContentDeliveryMethod {
    streaming = 1,
    progressive
}

export const contentDeliveryMethods = enumValues(ContentDeliveryMethod);
