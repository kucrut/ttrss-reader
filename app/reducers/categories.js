import { PropTypes } from 'react';
import { filter, findIndex, sortBy } from 'lodash';
import { LOGOUT } from 'actions/session';
import {
	GET_CATEGORIES_REQUEST,
	GET_CATEGORIES_SUCCESS,
	GET_ALL_CATEGORIES_REQUEST,
	GET_ALL_CATEGORIES_SUCCESS
} from 'actions/categories';


const initialState = {
	isFetching: true,
	items:      []
};

export const categoriesShape = {
	isFetching: PropTypes.bool,
	items:      PropTypes.array
};

function normalizeCategory( category ) {
	return Object.assign({}, category, {
		id:     parseInt( category.id, 10 ),
		unread: parseInt( category.unread, 10 )
	});
}

export function categories( state = initialState, action ) {
	let feedCategories;
	let specialIdx;

	switch ( action.type ) {
		case GET_CATEGORIES_REQUEST:
			return Object.assign({}, state, {
				isFetching: true
			});

		case GET_CATEGORIES_SUCCESS:
			feedCategories = action.req.data.content.map( normalizeCategory );
			specialIdx     = findIndex( feedCategories, { id: -1 });

			if ( 0 < specialIdx ) {
				feedCategories.splice( 0, 0, feedCategories.splice( specialIdx, 1 )[ 0 ] );
			}

			return Object.assign({}, state, {
				items:      feedCategories,
				isFetching: false
			});

		case LOGOUT:
			return Object.assign({}, initialState );

		default:
			return state;
	}
}

export function allCategories( state = initialState, action ) {
	let feedCategories;

	switch ( action.type ) {
		case GET_ALL_CATEGORIES_REQUEST:
			return Object.assign({}, state, {
				isFetching: true
			});

		case GET_ALL_CATEGORIES_SUCCESS:
			feedCategories = action.req.data.content.map( normalizeCategory );
			feedCategories = filter( feedCategories, ( item ) => -1 < item.id );
			feedCategories = sortBy( feedCategories, 'title' );

			return Object.assign({}, state, {
				isFetching: false,
				items:      feedCategories
			});

		default:
			return state;
	}
}
