import format from 'date-fns/format';

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
	return format( date * 1000, 'D MMMM YYYY @ hh:mm' );
}
