import { useStoreValue } from './hooks.js';

/** Subscribe to a query group's snapshot (requires strike-fw). */
export function useQueryGroup(client, groupName) {
	useStoreValue(client._tick);
	return client.getGroup(groupName);
}
