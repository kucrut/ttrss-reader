import React, { PropTypes } from 'react';
import classNames from 'classnames/bind';

import stlFa from 'css/common/fa';
import stlElements from 'css/common/elements';
const styles = Object.assign({}, stlFa, stlElements );
const cx = classNames.bind( styles );

export default function Icon( props ) {
	const { type, spin, tagName, text, extraClass } = props;
	let classes = ['fa', `fa-${type}`];
	let element;

	if ( spin ) {
		classes.push( 'animate-spin' );
	}
	if ( extraClass ) {
		classes = [].concat( classes, extraClass );
	}
	const cls = cx( classes );

	if ( text ) {
		element = React.createElement( tagName || 'span', {
			children:  text,
			className: cls
		});
	} else {
		element = ( <i className={ cls } /> );
	}

	return element;
}

Icon.propTypes = {
	type:       PropTypes.string.isRequired,
	spin:       PropTypes.bool,
	tagName:    PropTypes.string,
	text:       PropTypes.string,
	extraClass: PropTypes.oneOfType( [
		PropTypes.string,
		PropTypes.arrayOf( PropTypes.string )
	] )
};
