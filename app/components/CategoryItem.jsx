import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import FeedList from 'containers/FeedList';
import { getCount } from 'helpers';


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
				<span className="count">{ getCount( category.unread ) }</span>
			);
		}

		return count;
	}

	render() {
		const { isOpen } = this.state;
		const { category } = this.props;

		let itemClass = classNames({ 'is-open': isOpen });
		let iconClass = classNames({
			'fa-folder':            ( 0 < category.unread && ! isOpen ),
			'fa-folder-open':       ( 0 < category.unread && isOpen ),
			'fa-folder-empty':      ( 0 === category.unread && ! isOpen ),
			'fa-folder-open-empty': ( 0 === category.unread && isOpen )
		});

		return (
			<li className={ itemClass } key={ category.id }>
				<a onClick={ this.handleClick }>
					<i className={ iconClass } />
					<span className="name">{ category.title }</span>
					{ this.renderCount() }
				</a>
				<FeedList category={ category } />
			</li>
		);
	}
}

export default ( CategoryItem );
