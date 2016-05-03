import React, { PropTypes, Component } from 'react';
import classNames from 'classnames/bind';
import FeedList from 'containers/FeedList';
import { getCount } from 'helpers';

import stlFa from 'css/common/fa';
import stlCategoryList from 'css/containers/category-list';
const styles = Object.assign({}, stlFa, stlCategoryList );
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

		let itemClass = cx({ 'is-open': isOpen });
		let iconClass = cx({
			fa:                     true,
			'fa-folder':            ( 0 < category.unread && ! isOpen ),
			'fa-folder-open':       ( 0 < category.unread && isOpen ),
			'fa-folder-empty':      ( 0 === category.unread && ! isOpen ),
			'fa-folder-open-empty': ( 0 === category.unread && isOpen )
		});

		return (
			<li className={ itemClass } key={ category.id }>
				<a onClick={ this.handleClick }>
					<i className={ iconClass } />
					<span className={ styles.name }>{ category.title }</span>
					{ this.renderCount() }
				</a>
				<FeedList category={ category } isOpen={ isOpen } />
			</li>
		);
	}
}

export default ( CategoryItem );
