import moment from 'moment'

export function getCount( num ) {
	let count = 1000 < num ? '999+' : num;

	return count
}

/**
 * Get article date
 *
 * TODO: Display relative time if < 1 week
 *
 * @param  {number}  date  Article date (unix timestamp).
 * @return {string}
 */
export function getArticleDate( date ) {
	return moment( date * 1000 ).format( 'D MMMM YYYY @ hh:mm' )
}
