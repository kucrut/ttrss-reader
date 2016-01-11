import {
	OPENED_SETTINGS_FORM,
	UPDATED_SETTINGS,
	UPDATED_SORT_ORDER,
	CLOSED_SETTINGS_FORM
} from '../actions/settings'

const initialState = {
	isEditing:    false,
	limit:        parseInt( localStorage.getItem( 'ttrssSettingLimit' ), 10 ) || 23,
	unreadOnly:   parseInt( (localStorage.getItem( 'ttrssSettingUnreadOnly' ) || 0), 10 ),
	dateReverse:  parseInt( (localStorage.getItem( 'ttrssSettingDateReverse' ) || 0), 10 ),
	noPagination: parseInt( (localStorage.getItem( 'ttrssSettingNoPagination' ) || 0), 10 )
}

export default function settings( state = initialState, action ) {
	switch ( action.type ) {
		case OPENED_SETTINGS_FORM:
			return Object.assign( {}, state, {
				isEditing: true
			})

		case UPDATED_SETTINGS:
			return Object.assign( {}, state, {
				isEditing:    false,
				limit:        action.settings.limit,
				unreadOnly:   action.settings.unreadOnly,
				noPagination: action.settings.noPagination
			})

		case UPDATED_SORT_ORDER:
			return Object.assign( {}, state, {
				dateReverse: action.dateReverse
			})

		case CLOSED_SETTINGS_FORM:
			return Object.assign( {}, state, {
				isEditing: false
			})

		default:
			return state
	}
}
