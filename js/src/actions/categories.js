import Api        from '../api'
import { addLog } from './log'

export const REQUESTED_CATEGORIES = 'REQUESTED_CATEGORIES'
export const RECEIEVED_CATEGORIES = 'RECEIEVED_CATEGORIES'
export const REQUESTED_ALL_CATEGORIES = 'REQUESTED_ALL_CATEGORIES'
export const RECEIEVED_ALL_CATEGORIES = 'RECEIEVED_ALL_CATEGORIES'

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

export function getAllCategories() {
	return function( dispatch, getState ) {
		const { url, sid } = getState().session

		dispatch({
			type: REQUESTED_ALL_CATEGORIES,
			isFetching: true
		})

		return Api.request( url, {
			op:            'getCategories',
			sid:           sid,
			include_empty: true
		})
			.then( response => response.json() )
			.then( json => {
				dispatch({
					type: RECEIEVED_ALL_CATEGORIES,
					categories: json.content
				})
			})
			.catch( err => logError( dispatch, err ) )
	}
}
