export const ADDED_LOG = 'ADDED_LOG'
export const REMOVED_LOG = 'REMOVED_LOG'

export function addLog( item ) {
	return function( dispatch, getState ) {
		dispatch({
			type: ADDED_LOG,
			item
		})
	}
}

export function removeLog() {
	return function( dispatch, getState ) {
		dispatch({ type: REMOVED_LOG })
	}
}
