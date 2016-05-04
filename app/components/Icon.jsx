import React, { PropTypes } from 'react';
import classNames from 'classnames/bind';

import styles from 'css/common/fa';
const cx = classNames.bind( styles );

export default function Icon({ type }) {
	const cls = cx( ['fa', `fa-${type}`] );

	return (
		<i className={ cls } />
	);
}

Icon.propTypes = {
	type: PropTypes.string.isRequired
};
