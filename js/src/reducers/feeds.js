import _ from 'lodash'
import { REQUESTED_LOGOUT } from '../actions/session'
import { RECEIEVED_FEEDS, SELECTED_FEED } from '../actions/feeds'

const initialState = {
	current: {},
	items:   [],
	groups:  {}
}

function normalizeFeed( feed ) {
	return Object.assign({}, feed, {
		id:     parseInt( feed.id, 10 ),
		cat_id: parseInt( feed.cat_id, 10 ),
		unread: parseInt( feed.unread, 10)
	})
}

function groupify( feeds ) {
	return _.groupBy( feeds, ( feed ) => {
		return 'c' + feed.cat_id
	})
}

export default function feeds( state = initialState, action ) {
	switch ( action.type ) {
		case RECEIEVED_FEEDS:
			const { category } = action
			let newItems, allItems, current

			// Remove current category feeds from `items` so we don't have duplicates.
			_.remove( state.items, { cat_id: category.id } )

			newItems = action.items.map( normalizeFeed )
			if ( -1 < category.id ) {
				newItems.unshift({
					id:        'c'+category.id,
					title:     'All articles',
					cat_id:    category.id,
					// Custom
					is_cat:    true,
					cat_title: category.title,
					unread:    0 // No need
				})
			}

			allItems = state.items.concat( newItems )

			// Update the `current` feed object.
			if ( state.current.id ) {
				current = _.find( allItems, { id: state.current.id } )

				// Current feed has been removed, simply update its `unread` count.
				if ( ! current ) {
					current = Object.assign( {}, state.current, {
						unread: 0
					})
				}

				state.current = current
			}

			return Object.assign( {}, state, {
				items:  allItems,
				groups: groupify( allItems )
			})

		case SELECTED_FEED:
			// We need a copy of the current feed object, so we can still use it
			// even when it's been removed from `items`.
			return Object.assign({}, state, {
				current: Object.assign( {}, _.find( state.items, { id: action.id } ) )
			})

		case REQUESTED_LOGOUT:
			return Object.assign( {}, initialState )

		default:
			return state
	}
}
