import React, { PropTypes } from 'react';
import { requestLogin } from 'actions/session';
import Icon from 'components/Icon';
import styles from 'css/components/form';


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
		let btnAttrs;
		let iconAttrs;

		if ( this.props.isAsking ) {
			btnAttrs  = { disabled: 'disabled' };
			iconAttrs = { type: 'spinner', spin: true };
		} else {
			btnAttrs  = {};
			iconAttrs = { type: 'login' };
		}

		return (
			<button { ...btnAttrs }><Icon { ...iconAttrs } /> Login</button>
		);
	}

	render() {
		const { user, password, url } = this.state;

		return (
			<form className={ styles.form } onSubmit={ this.submitForm }>
				<h1><Icon type="rss" /> Tiny Tiny RSS Reader</h1>

				<div className={ styles.formRow }>
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
				<div className={ styles.formRow }>
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
				<div className={ styles.formRow }>
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
				<div className={ styles.submitRow }>
					{ this.renderButton() }
				</div>
			</form>
		);
	}
}
