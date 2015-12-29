import * as _ from 'lodash'
import { REQUESTED_LOGOUT } from '../actions/session'
import { UPDATED_SETTINGS } from '../actions/settings'
import { REQUESTED_ARTICLES, RECEIEVED_ARTICLES,
	SELECTED_ARTICLE, UPDATED_ARTICLES, CLEARED_ARTICLES } from '../actions/articles'

const initialState = {
	feedId:       '',
	currentId:    '',
	currentIndex: '',
	items:        [],
	isFetching:   false,
	hasMore:      false
}

function normalizeArticle( article ) {
	return Object.assign( {}, article, {
		id:      parseInt( article.id, 10 ),
		score:   parseInt( article.score, 10 ),
		feed_id: parseInt( article.feed_id, 10 )
	});
}

export default function articles( state = initialState, action ) {
	switch ( action.type ) {
		case REQUESTED_ARTICLES:
			return Object.assign( {}, state, {
				isFetching: action.status
			})

		case RECEIEVED_ARTICLES:
			state = Object.assign( {}, state, {
				isFetching: false
			});

			if ( action.feed.id !== state.feedId ) {
				state = Object.assign( {}, initialState, {
					feedId: action.feed.id
				})
			}

			if ( ! action.items || ! action.items.length ) {
				return Object.assign( {}, state, {
					hasMore: false
				})
			}

			let allItems = state.items.concat( action.items.map( normalizeArticle ) )

			state = Object.assign( {}, state, {
				items:   allItems,
				hasMore: action.hasMore
			})

			return state

		case SELECTED_ARTICLE:
			let currentIndex

			if ( '' === action.currentId ) {
				currentIndex = ''
			} else {
				currentIndex = state.items.findIndex( ( article, index ) => {
					if ( action.currentId === article.id ) {
						return article
					}
				});
			}

			return Object.assign( {}, state, {
				currentId:    action.currentId,
				currentIndex: currentIndex
			})

		case UPDATED_ARTICLES:
			state = Object.assign( {}, state, {
				isFetching: false
			})

			if ( ! action.items || ! action.items.length ) {
				return state
			}

			let newItems = action.items.map( normalizeArticle )

			_.each( newItems, ( item ) => {
				let index = _.findIndex( state.items, { id: item.id } )

				if ( -1 < index ) {
					state.items[ index ] = item
				}
			})

			return state

		case CLEARED_ARTICLES:
			return Object.assign( {}, state, {
				feedId:       state.feedId,
				currentId:    '',
				currentIndex: '',
				items:        [],
				hasMore:      false
			})

		case REQUESTED_LOGOUT:
		case UPDATED_SETTINGS:
			return Object.assign( {}, initialState )

		default:
			return state
	}
}
