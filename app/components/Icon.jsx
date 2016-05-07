import React, { PropTypes } from 'react';
import classNames from 'classnames/bind';

import stlFa from 'css/common/fa';
import stlElements from 'css/common/elements';
const styles = Object.assign({}, stlFa, stlElements );
const cx = classNames.bind( styles );

export default function Icon({ type, spin, text, extraClass }) {
	let classes = ['fa', `fa-${type}`];
	if ( spin ) {
		classes.push( 'animate-spin' );
	}
	if ( extraClass ) {
		classes = [].concat( classes );
	}
	const cls = cx( classes );

	let element;
	if ( text ) {
		element = ( <span className={ cls }>{ text }</span> );
	} else {
		element = ( <i className={ cls } /> );
	}

	return element;
}

Icon.propTypes = {
	type:       PropTypes.string.isRequired,
	spin:       PropTypes.bool,
	text:       PropTypes.string,
	extraClass: PropTypes.array
};
