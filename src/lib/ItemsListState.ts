export type SortDirection = -1 | 0 | 1;

export interface ItemsListState<Id, T> {
    loading: boolean;
    items: Id[];
    map: Map<Id, T>;
    loadingSelected: boolean;
    selected: T | null;
    sortColumn: string;
    sortDirection: SortDirection;
    errorMessage: string;
}

/**
 * create initial state
 * @param extender Object
 */
export function initialItemsList<Id, T>(extender: any) {
    return {
        ...extender,
        loading: false,
        items: [] as Id[],
        map: new Map<Id, T>(),
        loadingSelected: false,
        selected: null,
        sortColumn: null,
        sortDirection: 0,
        errorMessage: null
    } as ItemsListState<Id, T>;
}

/**
 * modify state with received items list of type T
 * @param items received items array
 * @param getId id getter, by default is i => i.id
 */
export function receiveItemsList<Id, T>(items: T[],
                                        getId: (item: T) => Id = i => (i as any).id) {
    return {
        loading: false,
        items: items.map(getId),
        map: items.reduce((map, item) => {
            map.set(getId(item), item);
            return map;
        }, new Map())
    };
}

/**
 * remove item by id from state
 * @param state current state
 * @param id item id
 */
export function removeById<Id, T>(state: ItemsListState<Id, T>, id: Id) {
    const index = state.items.indexOf(id);
    if (index !== -1) {
        const items = [
            ...state.items.slice(0, index),
            ...state.items.slice(index + 1),
        ];
        return {
            ...state,
            items,
            map: items.reduce((map, i) => {
                if (i !== id) {
                    map.set(i, state.map.get(i));
                }
                return map;
            }, new Map())
        };
    } else {
        return state;
    }
}

export function addItem<Id, T>(state: ItemsListState<Id, T>,
                               newItem: T,
                               getId: (item: T) => Id = i => (i as any).id) {
    const id = getId(newItem);
    const items = [...state.items, id];
    return {
        ...state,
        items,
        map: items.reduce((map, i) => {
            if (i !== id) {
                map.set(i, state.map.get(i));
            } else {
                map.set(i, newItem);
            }
            return map;
        }, new Map())
    };
}

export function updateItem<Id, T>(state: ItemsListState<Id, T>,
                                  id: Id,
                                  item: any) {
    const items = state.items;
    const old = state.map.get(id) as any;
    return {
        ...state,
        map: items.reduce((map, i) => {
            if (i !== id) {
                map.set(i, state.map.get(i));
            } else {
                map.set(i, {
                    ...old,
                    ...item
                });
            }
            return map;
        }, new Map())
    };
}

export function updateItemAdSpace<Id, T>(state: ItemsListState<Id, T>,
                                         id: Id,
                                         item: any) {
    const items = state.items;
    return {
        ...state,
        map: items.reduce((map, i) => {
            if (i !== id) {
                map.set(i, state.map.get(i));
            } else {
                map.set(i, {
                    ...item
                });
            }
            return map;
        }, new Map())
    };
}
