import Api               from '../api'
import { clearArticles } from './articles'

export const RECEIEVED_FEEDS = 'RECEIEVED_FEEDS'
export const SELECTED_FEED = 'SELECTED_FEED'

export function fetchFeeds( catId ) {
	return function( dispatch, getState ) {
		const { session, settings } = getState()
		const { unreadOnly } = settings
		const { url, sid } = session

		return Api.request( url, {
			op:          'getFeeds',
			sid:         sid,
			cat_id:      catId,
			unread_only: 0 < unreadOnly
		})
			.then( response => response.json() )
			.then( json => {
				dispatch({
					type:  RECEIEVED_FEEDS,
					items: json.content,
					catId
				})
			})
	}
}

export function selectFeed( id ) {
	return function( dispatch ) {
		dispatch({
			type: SELECTED_FEED,
			id
		})
		dispatch( clearArticles( id ) )
	}
}

