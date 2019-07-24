export type SHUTTLE_CONTAINER_TYPES = ['source', 'target'];

/**
 * Global IDs of the containers. This allows us to quickly reference the containers
 * in the DOM in the event `getItemProps()` is not passed to `Shuttle.Item`.
 */
export const SHUTTLE_CONTAINERS: SHUTTLE_CONTAINER_TYPES = ['source', 'target'];
