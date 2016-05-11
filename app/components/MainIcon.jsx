import React from 'react';
import classNames from 'classnames/bind';
import Icon from 'components/Icon';

import styles from 'css/common/layout';
const cx = classNames.bind( styles );

export default function MainIcon() {
	const clsWrap = cx( ['mainInit', 'inside'] );

	return (
		<div className={ clsWrap }><Icon type="rss" /></div>
	);
}
