import { find, groupBy, reject } from 'lodash';
import {
	GET_FEEDS_SUCCESS,
	SELECTED_FEED
} from 'actions/feeds';
import { LOGOUT } from 'actions/session';


const initialState = {
	current: {},
	items:   [],
	groups:  {}
};

function normalizeFeed( feed ) {
	return Object.assign({}, feed, {
		id:     parseInt( feed.id, 10 ),
		cat_id: parseInt( feed.cat_id, 10 ),
		unread: parseInt( feed.unread, 10 ),
		is_cat: false
	});
}

function groupify( items ) {
	return groupBy( items, ( item ) => `c${item.cat_id}` );
}

export default function feeds( state = initialState, action ) {
	let category;
	let oldItems;
	let newItems;
	let allItems;
	let current;
	let newState;

	switch ( action.type ) {
		case GET_FEEDS_SUCCESS:
			category = action.category;
			newState = Object.assign({}, state );

			// Remove current category feeds from `items` so we don't have duplicates.
			oldItems = reject( state.items, { cat_id: category.id });
			newItems = action.req.data.content.map( normalizeFeed );

			// Add "All Articles" feed to all categories.
			if ( -1 < category.id ) {
				newItems.unshift({
					id:        `c${category.id}`,
					title:     'All articles',
					cat_id:    category.id,
					// Custom.
					is_cat:    true,
					cat_title: category.title,
					unread:    0 // No need.
				});
			}

			allItems = oldItems.concat( newItems );

			// Update the `current` feed object.
			if ( state.current.id ) {
				current = find( allItems, { id: state.current.id });

				// Current feed has been removed, simply update its `unread` count.
				if ( ! current ) {
					current = Object.assign({}, state.current, {
						unread: 0
					});
				}

				newState = Object.assign({}, newState, { current });
			}

			return Object.assign({}, newState, {
				items:  allItems,
				groups: groupify( allItems )
			});

		case SELECTED_FEED:
			// We need a copy of the current feed object, so we can still use it
			// even when it's been removed from `items`.
			return Object.assign({}, state, {
				current: Object.assign({}, find( state.items, { id: action.id }) )
			});

		case LOGOUT:
			return Object.assign({}, initialState );

		default:
			return state;
	}
}
