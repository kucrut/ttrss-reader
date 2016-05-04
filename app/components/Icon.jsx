import React, { PropTypes } from 'react';
import classNames from 'classnames/bind';

import stlFa from 'css/common/fa';
import stlElements from 'css/common/elements';
const styles = Object.assign({}, stlFa, stlElements );
const cx = classNames.bind( styles );

export default function Icon({ type, spin }) {
	const types = ['fa', `fa-${type}`];
	if ( spin ) {
		types.push( 'animate-spin' );
	}
	const cls = cx( types );

	return (
		<i className={ cls } />
	);
}

Icon.propTypes = {
	type: PropTypes.string.isRequired,
	spin: PropTypes.bool
};
