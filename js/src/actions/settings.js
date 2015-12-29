import { getCategories } from './categories'

export const REQUESTED_SETTINGS_FORM = 'REQUESTED_SETTINGS_FORM'
export const UPDATED_SETTINGS = 'UPDATED_SETTINGS'
export const UPDATED_SORT_ORDER = 'UPDATED_SORT_ORDER'

export function editSettings() {
	return function( dispatch ) {
		dispatch({
			type: REQUESTED_SETTINGS_FORM,
			isEditing: true
		})
	}
}

export function saveSettings( settings ) {
	localStorage.setItem( 'ttrssSettingUnreadOnly', settings.unreadOnly )
	localStorage.setItem( 'ttrssSettingLimit', settings.limit )

	return function( dispatch ) {
		dispatch({
			type: UPDATED_SETTINGS,
			settings
		})
		dispatch( getCategories() )
	}
}

export function updateSortOrder( dateReverse ) {
	localStorage.setItem( 'ttrssSettingDateReverse', dateReverse )

	return function( dispatch ) {
		dispatch({
			type: UPDATED_SORT_ORDER,
			dateReverse
		})
	}
}
