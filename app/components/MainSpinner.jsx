import React from 'react';
import Icon from 'components/Icon';
import styles from 'css/common/layout';


export default function MainSpinner() {
	return (
		<div className={ styles[ 'main-init' ] }>
			<Icon type="spinner" spin={ true } />
		</div>
	);
}
