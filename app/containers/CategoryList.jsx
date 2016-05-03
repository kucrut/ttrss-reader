import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { categoriesShape } from 'reducers/categories';
import { getCategories } from 'actions/categories';
import CategoryItem from 'components/CategoryItem';
import Spinner from 'components/Spinner';
import styles from 'css/containers/category-list';


class CategoryList extends React.Component {
	static propTypes = {
		categories: PropTypes.shape( categoriesShape ).isRequired,
		dispatch:   PropTypes.func.isRequired
	}

	componentDidMount() {
		this.props.dispatch( getCategories() );
	}

	renderSpinner() {
		return (
			<li className={ styles.placeholder }><Spinner /> Loading Categories</li>
		);
	}

	renderNoCategories() {
		return (
			<li className={ styles.placeholder }>No categories found.</li>
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
			<ul className={ styles.categoryList }>
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
