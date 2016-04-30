import React, { PropTypes } from 'react';
import { requestLogin } from 'actions/session';


export default class LoginForm extends React.Component {
	static propTypes = {
		isAsking: PropTypes.bool.isRequired,
		dispatch: PropTypes.func.isRequired
	}

	constructor( props ) {
		super( props );

		this.state = {
			user:     '',
			password: '',
			url:      window.location.origin,
		};

		this.handleChange = this.handleChange.bind( this );
		this.submitForm = this.submitForm.bind( this );
	}

	handleChange( e ) {
		this.setState({ [ e.target.name ]: e.target.value });
	}

	submitForm( e ) {
		const { dispatch } = this.props;

		e.preventDefault();
		dispatch( requestLogin( this.state ) );
	}

	renderButton() {
		let iconClass;
		let attrs = {};

		if ( this.props.isAsking ) {
			attrs     = { disabled: 'disabled' };
			iconClass = 'fa-spinner animate-spin';
		} else {
			iconClass = 'fa-login';
		}

		return (
			<button { ...attrs }><i className={ iconClass } /> Login</button>
		);
	}

	render() {
		const { user, password, url } = this.state;

		return (
			<form className="login-form" onSubmit={ this.submitForm }>
				<h1><i className="fa-rss" /> Tiny Tiny RSS Reader</h1>
				<div className="form-row">
					<label htmlFor="login-user">Username</label>
					<input
						id="login-user"
						type="text"
						name="user"
						value={ user }
						onChange={ this.handleChange }
						required
						autoFocus
					/>
				</div>
				<div className="form-row">
					<label htmlFor="login-password">Password</label>
					<input
						id="login-password"
						type="password"
						name="password"
						value={ password }
						onChange={ this.handleChange }
						required
					/>
				</div>
				<div className="form-row">
					<label htmlFor="login-url">URL</label>
					<input
						id="login-url"
						type="url"
						name="url"
						value={ url }
						onChange={ this.handleChange }
						required
					/>
				</div>
				<div className="form-row submit-row">
					{ this.renderButton() }
				</div>
			</form>
		);
	}
}
