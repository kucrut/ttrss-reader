export const ADDED_LOG = 'ADDED_LOG';
export const REMOVED_LOG = 'REMOVED_LOG';

export function addLog( item ) {
	return ( dispatch ) => {
		dispatch({
			type: ADDED_LOG,
			item
		});
	};
}

export function removeLog() {
	return ( dispatch ) => {
		dispatch({ type: REMOVED_LOG });
	};
}
