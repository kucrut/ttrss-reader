import React, { PropTypes } from 'react';
import classNames from 'classnames/bind';
import styles from 'css/common/fa';

export default function IconLink({ text, title, type, handler }) {
	const cx  = classNames.bind( styles );
	const cls = cx( ['fa', `fa-${type}`] );

	return (
		<a onClick={ handler } title={ title } className={ cls }>{ text }</a>
	);
}

IconLink.propTypes = {
	type:    PropTypes.string.isRequired,
	text:    PropTypes.string,
	title:   PropTypes.string,
	handler: PropTypes.func
};
