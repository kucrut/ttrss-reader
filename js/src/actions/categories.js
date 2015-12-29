import Api        from '../api'
import { addLog } from './log'

export const REQUESTED_CATEGORIES = 'REQUESTED_CATEGORIES'
export const RECEIEVED_CATEGORIES = 'RECEIEVED_CATEGORIES'

function logError( dispatch, error ) {
	dispatch( addLog({
		source:  'categories',
		type:    'error',
		message: error.message
	}) )

	dispatch({
		type: REQUESTED_CATEGORIES,
		isFetching: false
	})
}

export function getCategories() {
	return function( dispatch, getState ) {
		const { session, settings } = getState()
		const { unreadOnly } = settings
		const { url, sid } = session

		dispatch({
			type: REQUESTED_CATEGORIES,
			isFetching: true
		})

		return Api.request( url, {
			op:          'getCategories',
			sid:         sid,
			unread_only: 0 < unreadOnly
		})
			.then( response => response.json() )
			.then( json => {
				dispatch({
					type: RECEIEVED_CATEGORIES,
					categories: json.content
				})
			})
			.catch( err => logError( dispatch, err ) )
	}
}
