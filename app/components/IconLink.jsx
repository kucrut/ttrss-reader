import React, { PropTypes } from 'react';
import classNames from 'classnames/bind';

import stlFa from 'css/common/fa';
import stlElements from 'css/common/elements';
const styles = Object.assign({}, stlFa, stlElements );
const cx = classNames.bind( styles );


export default function IconLink( props ) {
	const { text, title, type, handler, hideText, extraClass } = props;
	const cls = cx( ['fa', `fa-${type}`].concat( extraClass ) );
	let textEl;

	if ( true === hideText ) {
		textEl = ( <span className={ styles.screenReaderText }>{ text }</span> );
	} else {
		textEl = text;
	}

	return (
		<a onClick={ handler } title={ title } className={ cls }>{ textEl }</a>
	);
}

IconLink.propTypes = {
	type:       PropTypes.string.isRequired,
	text:       PropTypes.string,
	title:      PropTypes.string,
	handler:    PropTypes.func,
	hideText:   PropTypes.bool,
	extraClass: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.arrayOf( PropTypes.string )
	])
};
