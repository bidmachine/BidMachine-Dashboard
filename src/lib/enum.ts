export interface EnumOption {
    value: number;
    label: string;
}

/**
 * get Select.Option array from enum
 * @param e enum declaration
 * @param labels enum of labels for items from e
 */
export function enumValues(e: any, labels?: any): EnumOption[] {
    const values = [];

    for (const i in e) {
        if (typeof e[i] === 'string') {
            const value = e[i];
            values.push({
                value: Number(i),
                label: labels ? (labels[e[value]] || value) : value
            });
        }
    }

    return values;
}
