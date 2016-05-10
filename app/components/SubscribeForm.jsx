import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getAllCategories } from 'actions/categories';
import { subscribeToFeed, closeSubscriptionForm } from 'actions/subscription';
import Icon from 'components/Icon';
import IconLink from 'components/IconLink';
import styles from 'css/components/form';


class SubscribeForm extends React.Component {
	static propTypes = {
		allCategories: PropTypes.object.isRequired,
		subscription:  PropTypes.object.isRequired,
		dispatch:      PropTypes.func.isRequired
	}

	constructor( props ) {
		super( props );

		this.state = {
			url:      '',
			category: 0,
			feeds:    []
		};

		this.handleSubmit = this.handleSubmit.bind( this );
		this.handleChange = this.handleChange.bind( this );
		this.handleClickClose = this.handleClickClose.bind( this );
	}

	componentDidMount() {
		this.props.dispatch( getAllCategories() );
	}

	componentWillReceiveProps( nextProps ) {
		const { url }    = this.state;
		const { status } = nextProps.subscription;

		let feeds;
		let feedsUrls;
		let state = {};

		switch ( status.code ) {
			case 0:
			case 1:
				state = {
					url:   '',
					feeds: []
				};

				if ( 1 === status.code ) {
					/**
					 * TODO:
					 * - Refresh categories.
					 * - Fetch feeds of the category where the new feed was added to.
					 */
				}
				break;

			case 4:
				feedsUrls = Object.keys( status.feeds );
				feeds     = feedsUrls.map( feedUrl => ({
					url:   feedUrl,
					title: status.feeds[ feedUrl ]
				}) );

				state.feeds = feeds;
				if ( 0 > feedsUrls.indexOf( url ) ) {
					state.url = feedsUrls[ 0 ];
				}
				break;

			default:
				state.feeds = [];
		}

		this.setState( state );
	}

	handleChange( e ) {
		this.setState({ [ e.target.name ]: e.target.value });
	}

	handleClickClose() {
		this.props.dispatch( closeSubscriptionForm() );
	}

	handleSubmit( e ) {
		const { url, category } = this.state;

		e.preventDefault();
		this.props.dispatch( subscribeToFeed( url, category ) );
	}

	renderMessage() {
		const { message } = this.props.subscription;
		let element;

		if ( message ) {
			element = (
				<p className="message">{ message }</p>
			);
		}

		return element;
	}

	renderUrlField() {
		const { url, feeds } = this.state;
		let element;

		if ( feeds.length ) {
			element = (
				<select id="s-url" name="url" value={ url } onChange={ this.handleChange }>
					{ feeds.map( feed =>
						<option key={ feed.url } value={ feed.url }>{ feed.title }</option>
					) }
				</select>
			);
		} else {
			element = (
				<input
					id="s-url"
					type="url"
					name="url"
					required
					value={ url }
					onChange={ this.handleChange }
				/>
			);
		}

		return element;
	}

	renderCategories() {
		const { category }      = this.state;
		const { allCategories } = this.props;
		let element;

		if ( allCategories.isFetching ) {
			element = (
				<label className={ styles.iwrap }>
					<Icon type="spinner" spin={ true } /> Loading Categories
				</label>
			);
		} else {
			element = (
				<select id="s-category" name="category" value={ category } onChange={ this.handleChange }>
					{ allCategories.items.map( item =>
						<option key={ item.id } value={ item.id }>{ item.title }</option>
					) }
				</select>
			);
		}

		return element;
	}

	renderButton() {
		const { url }           = this.state;
		const { isSubscribing } = this.props.subscription;
		const iconAttrs = isSubscribing ? { type: 'spinner', spin: true } : { type: 'eye' };
		const btnAttrs  = ( ! url || isSubscribing ) ? { disabled: 'disabled' } : {};

		return (
			<button type="submit" { ...btnAttrs }><Icon { ...iconAttrs } /> Subscribe</button>
		);
	}

	render() {
		return (
			<form className={ styles.form } onSubmit={ this.handleSubmit }>
				<Icon type="rss" tagName="h1" text="Subscribe to Feed" />

				{ this.renderMessage() }

				<div className={ styles.formRow }>
					<label htmlFor="s-url">Feed URL</label>
					{ this.renderUrlField() }
				</div>
				<div className={ styles.formRow }>
					<label htmlFor="s-category">Category</label>
					{ this.renderCategories() }
				</div>
				<div className={ styles.submitRow }>
					{ this.renderButton() }
				</div>

				<IconLink
					type="cancel"
					text="Close"
					title="Close"
					handler={ this.handleClickClose }
					hideText={ true }
					extraClass={ styles.close }
				/>
			</form>
		);
	}
}

function mapStateToProps( state ) {
	return {
		allCategories: state.allCategories,
		subscription:  state.subscription
	};
}

export default connect( mapStateToProps )( SubscribeForm );
