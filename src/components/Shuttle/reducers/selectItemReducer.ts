import { ShuttleState } from '../Shuttle';

// eslint-disable-next-line @typescript-eslint/class-name-casing
export interface SELECT_ITEM_REDUCER_ACTION {
    type?: 'SELECT_ITEM';
    index?: number | number[];
    container: 'source' | 'target';
}

export const selectItem = (state: ShuttleState, action: SELECT_ITEM_REDUCER_ACTION) => {
    if (action.type === 'SELECT_ITEM') {
        if (
            (typeof action.index === 'number' || Array.isArray(action.index)) &&
            !action.container
        ) {
            throw new Error(`'container' is required when items are passed to the reducer`);
        }

        state.selected[action.container].clear();

        if (Array.isArray(action.index)) {
            action.index.forEach(i => {
                state.selected[action.container].add(i);
            });
        } else if (typeof action.index === 'number') {
            state.selected[action.container].add(action.index);
        }
    }

    return { ...state };
};
