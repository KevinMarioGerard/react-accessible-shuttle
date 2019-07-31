import * as React from 'react';
import { toSet } from '../../../utils/utils';
import { composeReducers, move, moveAll, selectItem } from '../reducers/index';

function init({
    source,
    target,
    selections,
}: {
    source: any[];
    target: any[];
    selections: {
        source: number[];
        target: number[];
    };
}) {
    if (!selections.source) {
        throw new Error('Initial selection "source" must be an array');
    }

    if (!selections.target) {
        throw new Error('Initial selection "target" must be an array');
    }

    return {
        source,
        target,
        selected: {
            source: toSet(selections.source),
            target: toSet(selections.target),
        },
    };
}

/**
 * useShuttleState allows you to own the state of the Shuttle. Pass in custom
 * data without trying to remember what prop needs to be set and with what params.
 * Save this result in a variable and spread ot back to `<Shuttle>`. Let the Shuttle
 * know:
 *
 * 1. What your data is
 * 2. What (if any) items need to be pre-selected
 * 3. What (if any) custom state reducers you want to process -- you can even override Shuttle state reducers here too!
 * @param initialState
 * @param initialSelections
 * @param reducers
 */
export function useShuttleState(
    initialState: {
        source: any[];
        target: any[];
    } = {
        source: [],
        target: [],
    },
    initialSelections: {
        source: number[];
        target: number[];
    } = {
        source: [],
        target: [],
    },
    reducers: { [key: string]: Function } = {}
) {
    const [shuttleState, setShuttleState] = React.useReducer(
        composeReducers({ move, moveAll, selectItem, ...reducers }),
        {
            ...initialState,
            selections: initialSelections,
        },
        init
    );

    return { shuttleState, setShuttleState };
}