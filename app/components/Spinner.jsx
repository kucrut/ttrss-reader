import React from 'react';
import classNames from 'classnames/bind';

import stlFa from 'css/common/fa';
import stlElements from 'css/common/elements';
const styles = Object.assign({}, stlFa, stlElements );
const cx = classNames.bind( styles );

export default function Spinner() {
	const clsIcon = cx( ['fa-spinner', 'animate-spin'] );

	return (
		<i className={ clsIcon } />
	);
}
