import React, { PropTypes } from 'react'
import { connect }          from 'react-redux'
import classNames           from 'classnames'
import { getCategories }    from '../actions/categories'
import CategoryItem         from '../components/CategoryItem'
import Spinner              from '../components/Spinner'

class CategoryList extends React.Component {
	componentDidMount() {
		this.props.dispatch( getCategories() )
	}

	renderSpinner() {
		return (
			<li className="placeholder"><Spinner /> Loading Categories</li>
		)
	}

	renderNoCategories() {
		return (
			<li className="placeholder">No categories found.</li>
		)
	}

	renderList() {
		return (
			this.props.categories.items.map( category =>
				<CategoryItem key={ category.id } category={ category } />
			)
		)
	}

	render() {
		const { isFetching, items } = this.props.categories

		let listItems

		if ( items.length ) {
			listItems = this.renderList()
		} else {
			if ( isFetching ) {
				listItems = this.renderSpinner()
			} else {
				listItems = this.renderNoCategories()
			}
		}

		return (
			<ul className="category-list">
				{ listItems }
			</ul>
		)
	}
}

CategoryList.propTypes = {
	categories: PropTypes.object.isRequired,
	dispatch:   PropTypes.func.isRequired
}

export default connect( state => ({ categories: state.categories }) )( CategoryList )
