import Api               from '../api'
import { addLog }        from './log'
import { getCategories } from './categories'
import { fetchFeeds }    from './feeds'

function logError( dispatch, error ) {
	dispatch( addLog({
		source:  'subsciption',
		type:    'error',
		message: error.message
	}) )

	dispatch({
		type: REQUESTED_SUBSCRIPTION,
		isSubscribing: false
	})
}

export const REQUESTED_SUBSCRIPTION = 'REQUESTED_SUBSCRIPTION'
export const RECEIVED_SUBSCRIPTION = 'RECEIVED_SUBSCRIPTION'
export const ADDED_SUBSCRIPTION = 'ADDED_SUBSCRIPTION'
export const OPENED_SUBSCRIPTION = 'OPENED_SUBSCRIPTION'
export const CLOSED_SUBSCRIPTION = 'CLOSED_SUBSCRIPTION'

export function subscribeToFeed( feedUrl, catId ) {
	return function( dispatch, getState ) {
		const { url, sid } = getState().session
		let status

		catId = parseInt( catId, 10 )

		dispatch({
			type: REQUESTED_SUBSCRIPTION,
			isSubscribing: true
		})

		return Api.request( url, {
			op:          'subscribeToFeed',
			sid:         sid,
			feed_url:    feedUrl,
			category_id: catId
		})
			.then( response => response.json() )
			.then( json => {
				status = json.content.status

				dispatch({
					type: RECEIVED_SUBSCRIPTION,
					status: status
				})

				// Feed added
				if ( 1 === status.code ) {
					dispatch( fetchFeeds( catId ) )
				}
			})
			.catch( err => logError( dispatch, err ) )
	}
}

export function openSubscriptionForm() {
	return function( dispatch ) {
		dispatch({
			type: OPENED_SUBSCRIPTION
		})
	}
}

export function closeSubscriptionForm() {
	return function( dispatch ) {
		dispatch( getCategories() )
		dispatch({
			type: CLOSED_SUBSCRIPTION
		})
	}
}