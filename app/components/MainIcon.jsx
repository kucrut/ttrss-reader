import React from 'react';
import classNames from 'classnames/bind';

import stlFa from 'css/common/fa';
import stlLayout from 'css/common/layout';
const cx = classNames.bind( Object.assign({}, stlFa, stlLayout ) );

export default function MainIcon() {
	const clsWrap = cx( ['main-init', 'inside'] );
	const clsIcon = cx( ['fa', 'fa-rss'] );

	return (
		<div className={ clsWrap }><i className={ clsIcon } /></div>
	);
}
