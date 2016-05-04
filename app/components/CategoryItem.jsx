import React, { PropTypes, Component } from 'react';
import classNames from 'classnames/bind';
import FeedList from 'containers/FeedList';
import Icon from 'components/Icon';
import { getCount } from 'helpers';

import styles from 'css/containers/category-list';
const cx = classNames.bind( styles );

class CategoryItem extends Component {
	static propTypes = {
		category: PropTypes.object.isRequired
	}

	constructor( props ) {
		super( props );
		this.state = { isOpen: false };
		this.handleClick = this.handleClick.bind( this );
	}

	handleClick() {
		this.setState({ isOpen: ! this.state.isOpen });
	}

	renderCount() {
		const { category } = this.props;
		let count;

		if ( 0 < category.unread ) {
			count = (
				<span className={ styles.count }>{ getCount( category.unread ) }</span>
			);
		}

		return count;
	}

	render() {
		const { isOpen } = this.state;
		const { category } = this.props;
		const itemClass = cx({ 'is-open': isOpen });
		let iconType;

		if ( 0 < category.unread && ! isOpen ) {
			iconType = 'folder';
		} else if ( 0 < category.unread && isOpen ) {
			iconType = 'folder-open';
		} else if ( 0 === category.unread && ! isOpen ) {
			iconType = 'folder-empty';
		} else if ( 0 === category.unread && isOpen ) {
			iconType = 'folder-open-empty';
		}

		return (
			<li className={ itemClass } key={ category.id }>
				<a onClick={ this.handleClick }>
					<Icon type={ iconType } />
					<span className={ styles.name }>{ category.title }</span>
					{ this.renderCount() }
				</a>
				<FeedList category={ category } isOpen={ isOpen } />
			</li>
		);
	}
}

export default ( CategoryItem );
