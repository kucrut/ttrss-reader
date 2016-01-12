import Api               from '../api'
import lodash            from 'lodash'
import { addLog }        from './log'
import { getCategories } from './categories'

export const updateFields = [
	'marked',
	'published',
	'unread',
	'note'
]

export const REQUESTED_ARTICLES = 'REQUESTED_ARTICLES'
export const RECEIEVED_ARTICLES = 'RECEIEVED_ARTICLES'
export const SELECTED_ARTICLE = 'SELECTED_ARTICLE'
export const UPDATED_ARTICLES = 'UPDATED_ARTICLES'
export const CLEARED_ARTICLES = 'CLEARED_ARTICLES'

function logError( dispatch, error ) {
	dispatch( addLog({
		source:  'articles',
		type:    'error',
		message: error.message
	}) )

	dispatch({
		type:   REQUESTED_ARTICLES,
		status: false
	})
}

export function fetchFeedArticles( feed, clearExisting = true, params = {} ) {
	return function( dispatch, getState ) {
		const { session, settings } = getState()
		const { limit, unreadOnly, dateReverse } = settings
		const { url, sid } = session

		params = Object.assign( {}, params, {
			op:           'getHeadlines',
			sid:          sid,
			feed_id:      feed.id,
			limit:        limit,
			view_mode:    unreadOnly ? 'unread' : 'adaptive',
			show_excerpt: true,
			show_content: true
		})

		if ( dateReverse ) {
			params.order_by = 'date_reverse'
		}

		dispatch({
			type:   REQUESTED_ARTICLES,
			status: true
		})

		if ( clearExisting ) {
			dispatch( clearArticles( feed.id ) )
		}

		return Api.request( url, params )
			.then( response => {
				return response.json()
			})
			.then( json => {
				let items = json.content

				// TODO: Check if `items` is empty

				dispatch({
					type:    RECEIEVED_ARTICLES,
					feed:    feed,
					items:   items,
					hasMore: items.length >= limit
				})
			})
			.catch( err => logError( dispatch, err ) )
	}
}

export function clearArticles( feedId ) {
	return function ( dispatch, getState ) {
		return dispatch({
			type: CLEARED_ARTICLES,
			feedId
		})
	}
}

export function fetchArticles( ids ) {
	return function( dispatch, getState ) {
		const { url, sid } = getState().session

		dispatch({
			type:   REQUESTED_ARTICLES,
			status: true
		})

		return Api.request( url, {
			sid:        sid,
			op:         'getArticle',
			article_id: ids
		})
			.then( response => response.json() )
			.then( json => {
				dispatch({
					type:  UPDATED_ARTICLES,
					items: json.content
				})
				dispatch( getCategories() )
			})
			.catch( err => logError( dispatch, err ) )
	}
}

/**
 * @param  {number}  ids    Article ID, separate multiple IDs with commas.
 * @param  {number}  field  Field to update {
 *     0: starred
 *     1: published
 *     2: unread
 *     3: article note
 * }
 * @param  {number}  mode   Update mode {
 *     0: set to false
 *     1: set to true
 *     2: toggle
 * }
 * @return void
 */
export function updateArticle( ids, field, mode ) {
	return function( dispatch, getState ) {
		const { url, sid } = getState().session

		return Api.request( url, {
			sid:         sid,
			op:          'updateArticle',
			article_ids: ids,
			field:       updateFields.indexOf( field ),
			mode:        mode
		})
			.then( response => response.json() )
			.then( json => {
				dispatch( fetchArticles( ids ) )
			})
			.catch( err => logError( dispatch, err ) )
	}
}

/**
 * Mark articles as read
 *
 * @param  {array} ids Article IDs
 * @return void
 */
export function markArticlesRead( ids ) {
	return function( dispatch, getState ) {
		let items = []

		_.each( getState().articles.items, ( item ) => {
			if ( -1 < ids.indexOf( item.id ) ) {
				item.unread = false
				items.push( item )
			}
		})

		dispatch({
			type:  UPDATED_ARTICLES,
			items: items
		})

		dispatch( updateArticle( ids.join( ',' ), 'unread', 0 ) )
	}
}

export function selectArticle( currentId ) {
	return function( dispatch ) {
		dispatch({
			type: SELECTED_ARTICLE,
			currentId
		})
	}
}
