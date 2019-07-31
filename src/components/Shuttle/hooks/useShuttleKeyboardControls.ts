import * as React from 'react';
import { ShuttleReducer, ShuttleState } from '../Shuttle';
import { useShuttleItemClick } from './useShuttleItemClick';
import { getIndexFromItem, getContainerMetadata, removeDisabledIndexes } from '../../../utils/utils';
import { SELECT_ITEM_REDUCER_ACTION } from '../reducers/selectItemReducer';

enum ARROWS {
    UP_ARROW = 38,
    DOWN_ARROW = 40,
}

type Options = {
    setShuttleState: (args: ShuttleReducer) => void;
    shuttleState: ShuttleState;
};

export function useShuttleKeyboardControls({ setShuttleState, shuttleState }: Options) {
    const shiftKeyPressed = React.useRef(false);
    const ctrlKeyPressed = React.useRef(false);
    const metaKeyPressed = React.useRef(false);

    const { onClick: defaultClickHandler } = useShuttleItemClick({ setShuttleState, shuttleState });

    const onKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        e.preventDefault();

        shiftKeyPressed.current = e.shiftKey;
        ctrlKeyPressed.current = e.ctrlKey;
        metaKeyPressed.current = e.metaKey;
    }, []);

    const onKeyUp = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        e.preventDefault();

        shiftKeyPressed.current = e.shiftKey;
        ctrlKeyPressed.current = e.ctrlKey;
        metaKeyPressed.current = e.metaKey;

        if (e.keyCode === ARROWS.UP_ARROW || e.keyCode === ARROWS.DOWN_ARROW) {
            const target = e.target as HTMLDivElement;

            if (target.className.includes('shuttle__item')) {
                const itemIndex = getIndexFromItem(target);
                const increment = e.keyCode === ARROWS.UP_ARROW;
                const container = target.closest('.shuttle__container');

                if (container) {
                    const { containerName } = getContainerMetadata(container);

                    if (itemIndex >= 0 && itemIndex < shuttleState[containerName].length) {
                        let selectionArray = Array.from(shuttleState.selected[containerName]);

                        const payload: SELECT_ITEM_REDUCER_ACTION = {
                            type: 'SELECT_ITEM',
                            container: containerName,
                        };

                        if (shiftKeyPressed.current) {
                            const lastItemInArray = selectionArray[selectionArray.length - 1];

                            if (increment) {
                                if (selectionArray.indexOf(lastItemInArray - 1) === -1) {
                                    selectionArray.push(lastItemInArray - 1);
                                } else {
                                    selectionArray.pop();
                                }
                            } else {
                                if (selectionArray.indexOf(lastItemInArray + 1) === -1) {
                                    selectionArray.push(lastItemInArray + 1);
                                } else {
                                    selectionArray.pop();
                                }
                            }

                            // selectionArray = removeDisabledIndexes(container.children, selectionArray);

                            (container.children[
                                selectionArray[selectionArray.length - 1]
                            ] as HTMLElement).focus();

                            payload.index = selectionArray;
                        } else {
                            let [index] = selectionArray;
                            index = index + (increment ? -1 : 1);

                            while (index >= 0 && index < container.children.length &&
                                (container.children[index] as HTMLElement).hasAttribute(
                                    'data-disabled'
                                )
                            ) {
                                index = index + (increment ? -1 : 1);
                            }

                            if (index <= 0 || index >= container.children.length) {
                                return;
                            }

                            (container.children[index] as HTMLElement).focus();
                            payload.index = index;
                        }

                        setShuttleState(payload);
                    }
                }
            }
        }
    }, []);

    const onClick = React.useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (ctrlKeyPressed.current || metaKeyPressed.current || shiftKeyPressed.current) {
                const target = e.target as HTMLDivElement;
                const index = getIndexFromItem(target);
                const container = target.closest('.shuttle__container');

                if (container) {
                    const { containerName } = getContainerMetadata(container);

                    const payload: SELECT_ITEM_REDUCER_ACTION = {
                        type: 'SELECT_ITEM',
                        container: containerName,
                        index: Array.from(shuttleState.selected[containerName]),
                    };

                    let selectionArray = Array.from(shuttleState.selected[containerName]);
                    const lastItemInArray = selectionArray[selectionArray.length - 1];

                    if (shiftKeyPressed.current) {
                        if (index < lastItemInArray) {
                            let i = lastItemInArray;

                            while(i-- > index) {
                                selectionArray.push(i);
                            }
                        } else if (index > lastItemInArray) {
                            let i = lastItemInArray;

                            while (i++ < index) {
                                selectionArray.push(i);
                            }
                        }

                        selectionArray = removeDisabledIndexes(container.children, selectionArray);
                    } else {
                        const foundIndex = selectionArray.indexOf(index);

                        if (foundIndex === -1) {
                            selectionArray.push(index);
                        } else {
                            selectionArray.splice(foundIndex, 1);
                        }
                    }

                    payload.index = selectionArray;
                    setShuttleState(payload);
                }
            } else {
                defaultClickHandler(e);
            }
        },
        [defaultClickHandler]
    );

    return { onKeyDown, onKeyUp, onClick };
}
