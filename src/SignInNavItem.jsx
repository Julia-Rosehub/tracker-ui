/** @format */

import React, { useState, useEffect } from 'react'
import { NavItem, Modal, Button, NavDropdown } from 'react-bootstrap'

import withToast from './withToast.jsx'

function SignInNavItem({
	user: { signedIn, givenName },
	onUserChange,
	showError,
}) {
	const [showing, setShowing] = useState(false)
	const [disabled, setDisabled] = useState(true)

	const showModal = () => {
		const clientId = window.ENV.GOOGLE_CLIENT_ID
		if (!clientId) {
			showError('Missing environment variable GOOGLE_CLIENT_ID')
			return
		}
		setShowing(true)
	}

	const hideModal = () => setShowing(false)

	const signIn = async () => {
		hideModal()
		let googleToken
		try {
			const auth2 = window.gapi.auth2.getAuthInstance()
			const googleUser = await auth2.signIn()

			googleToken = googleUser.getAuthResponse().id_token
		} catch (error) {
			showError(`Error authenticating with Google: ${error.error}`)
		}

		try {
			const apiEndpoint = window.ENV.UI_AUTH_ENDPOINT
			const response = await fetch(`${apiEndpoint}/signin`, {
				method: 'POST',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ google_token: googleToken }),
			})
			const body = await response.text()
			const result = JSON.parse(body)
			const { signedIn, givenName } = result
			onUserChange({ signedIn, givenName })
		} catch (error) {
			showError(`Error signing into the app: ${error}`)
		}
	}

	const signOut = async () => {
		const apiEndpont = window.ENV.UI_AUTH_ENDPOINT
		try {
			await fetch(`${apiEndpont}/signout`, {
				method: 'POST',
				credentials: 'include',
			})
			const auth2 = window.gapi.auth2.getAuthInstance()
			await auth2.signOut()
		} catch (error) {
			showError(`Error signing out: ${error}`)
		}
		onUserChange({ signedIn: false, givenName: '' })
	}

	useEffect(() => {
		const clientId = window.ENV.GOOGLE_CLIENT_ID
		if (!clientId) return
		window.gapi.load('auth2', () => {
			if (!window.gapi.auth2.getAuthInstance()) {
				window.gapi.auth2.init({ client_id: clientId }).then(() => {
					setDisabled(false)
				})
			}
		})
	}, [])

	if (signedIn)
		return (
			<NavDropdown id="user" title={givenName}>
				<NavItem onClick={signOut}>Sign out</NavItem>
			</NavDropdown>
		)
	return (
		<>
			<NavItem onClick={showModal}>Sign in</NavItem>
			<Modal show={showing} onHide={hideModal} bssize="sm">
				<Modal.Header>
					<Modal.Title>Sign in</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Button
						type="button"
						block
						disabled={disabled}
						bsstyle="primary"
						onClick={signIn}
					>
						<img
							src="https://developers.google.com/identity/images/btn_google_signin_light_normal_web.png"
							alt="Sign In"
						/>
					</Button>
				</Modal.Body>
				<Modal.Footer>
					<Button type="button" bsstyle="link" onClick={hideModal}>
						Cancel
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}

export default withToast(SignInNavItem)
