import Api               from '../api'
import { clearArticles } from './articles'

export const RECEIEVED_FEEDS = 'RECEIEVED_FEEDS'
export const SELECTED_FEED = 'SELECTED_FEED'

export function fetchFeeds( category ) {
	return function( dispatch, getState ) {
		const { session, settings, categories } = getState()
		const { unreadOnly } = settings
		const { url, sid } = session

		if ( 'number' === typeof category ) {
			category = _.find( categories.items, { id: category } )
		}

		return Api.request( url, {
			op:          'getFeeds',
			sid:         sid,
			cat_id:      category.id,
			unread_only: 0 < unreadOnly
		})
			.then( response => response.json() )
			.then( json => {
				dispatch({
					type:  RECEIEVED_FEEDS,
					items: json.content,
					category
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

