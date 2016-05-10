import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import CategoryList from 'containers/CategoryList';
import SidebarActions from 'components/SidebarActions';

import styles from 'css/containers/sidebar';
const cx = classNames.bind( styles );

function Sidebar( props ) {
	const { isVisible } = props;
	const sidebarClass = cx({
		sidebar:      true,
		'is-visible': isVisible
	});

	return (
		<div className={ sidebarClass }>
			<SidebarActions />
			<div className={ styles.inside }>
				<CategoryList />
			</div>
		</div>
	);
}

Sidebar.propTypes = {
	isVisible: PropTypes.bool.isRequired
};

function mapStateToProps( state ) {
	return {
		isVisible: state.ui.isSidebarVisible
	};
}

export default connect( mapStateToProps )( Sidebar );
