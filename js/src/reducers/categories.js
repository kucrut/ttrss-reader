import _ from 'lodash'
import { REQUESTED_LOGOUT } from '../actions/session'
import {
	REQUESTED_CATEGORIES,
	RECEIEVED_CATEGORIES,
	REQUESTED_ALL_CATEGORIES,
	RECEIEVED_ALL_CATEGORIES
} from '../actions/categories'

const initialState = {
	isFetching: true,
	items:      []
}

function normalizeCategory( category ) {
	return Object.assign({}, category, {
		id:     parseInt( category.id, 10 ),
		unread: parseInt( category.unread, 10 )
	})
}

export function categories( state = initialState, action ) {
	switch ( action.type ) {
		case REQUESTED_CATEGORIES:
			return Object.assign( {}, state, {
				isFetching: action.isFetching
			})

		case RECEIEVED_CATEGORIES:
			let categories = action.categories.map( normalizeCategory )
			let specialIdx = _.findIndex( categories, { id: -1 } )

			if ( 0 < specialIdx ) {
				categories.splice( 0, 0, categories.splice( specialIdx, 1 )[0] )
			}

			return Object.assign( {}, state, {
				isFetching: false,
				items: categories
			})

		case REQUESTED_LOGOUT:
			return Object.assign( {}, initialState )

		default:
			return state
	}
}

const _allCategories = {
	isFetching: false,
	items: []
}

export function allCategories( state = _allCategories, action ) {
	switch ( action.type ) {
		case REQUESTED_ALL_CATEGORIES:
			return Object.assign( {}, state, {
				isFetching: action.isFetching
			})

		case RECEIEVED_ALL_CATEGORIES:
			return Object.assign( {}, state, {
				isFetching: false,
				items: _.filter( action.categories.map( normalizeCategory ), function( item ) {
					return -1 < item.id
				})
			})

		default:
			return state
	}
}