import fetch from 'isomorphic-fetch'

module.exports = {
	request: function( url, params ) {

		return fetch( url, {
			method: 'post',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify( params )
		})
	}
}
