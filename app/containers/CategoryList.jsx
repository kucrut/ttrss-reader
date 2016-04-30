import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getCategories } from 'actions/categories';
import CategoryItem from 'components/CategoryItem';
import Spinner from 'components/Spinner';


class CategoryList extends React.Component {
	static propTypes = {
		categories: PropTypes.object.isRequired,
		dispatch:   PropTypes.func.isRequired
	}

	componentDidMount() {
		this.props.dispatch( getCategories() );
	}

	renderSpinner() {
		return (
			<li className="placeholder"><Spinner /> Loading Categories</li>
		);
	}

	renderNoCategories() {
		return (
			<li className="placeholder">No categories found.</li>
		);
	}

	renderList() {
		return (
			this.props.categories.items.map( category =>
				<CategoryItem key={ category.id } category={ category } />
			)
		);
	}

	render() {
		const { isFetching, items } = this.props.categories;
		let listItems;

		if ( items.length ) {
			listItems = this.renderList();
		} else {
			if ( isFetching ) {
				listItems = this.renderSpinner();
			} else {
				listItems = this.renderNoCategories();
			}
		}

		return (
			<ul className="category-list">
				{ listItems }
			</ul>
		);
	}
}

function mapStateToProps( state ) {
	return {
		categories: state.categories
	};
}

export default connect( mapStateToProps )( CategoryList );
