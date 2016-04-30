import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { getAllCategories } from 'actions/categories';
import { subscribeToFeed, closeSubscriptionForm } from 'actions/subscription';


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

		this.submitForm = this.submitForm.bind( this );
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
				break;

			case 4:
				feedsUrls = _.keys( status.feeds );
				feeds     = feedsUrls.map( feedUrl => ({
					url:   feedUrl,
					title: status.feeds[ url ]
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

	submitForm( e ) {
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
				<label className="iwrap">
					<i className="fa-spinner animate-spin" /> Loading Categories
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
		const classes = isSubscribing ? 'fa-spinner animate-spin' : 'fa-eye';

		let attrs   = {};
		if ( ! url || isSubscribing ) {
			attrs = { disabled: 'disabled' };
		}

		return (
			<button type="submit" { ...attrs }><i className={ classes } /> Subscribe</button>
		);
	}

	render() {
		return (
			<form className="login-form" onSubmit={ this.submitForm }>
				<h1><i className="fa-rss" /> Subscribe to Feed</h1>
				{ this.renderMessage() }
				<div className="form-row">
					<label htmlFor="s-url">Feed URL</label>
					{ this.renderUrlField() }
				</div>
				<div className="form-row">
					<label htmlFor="s-category">Category</label>
					{ this.renderCategories() }
				</div>
				<div className="form-row submit-row">
					{ this.renderButton() }
				</div>

				<a className="fa-cancel close" title="Close" onClick={ this.handleClickClose } />
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
