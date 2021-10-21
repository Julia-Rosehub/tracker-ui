/** @format */

import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { Nav, Navbar, Container } from 'react-bootstrap'

import { Contents } from './Contents.jsx'
import Search from './Search.jsx'
import UserContext from './UserContext'
import IssueAddNavItem from './IssueAddNavItem.jsx'
import SignInNavItem from './SignInNavItem.jsx'
import graphQLFetch from './graphQLFetch'
import store from './store'

const NavBar = ({ user, onUserChange }) => (
	<>
		<Navbar bg="light">
			<Nav>
				<NavLink to="/">Home</NavLink>
				<NavLink to="/issues">Issues</NavLink>
				<NavLink to="/report">Report</NavLink>
			</Nav>
			<Nav>
				<IssueAddNavItem user={user} />
				<SignInNavItem user={user} onUserChange={onUserChange} />
			</Nav>
		</Navbar>
	</>
)

export default function Page() {
	const [user, setUser] = useState(store.userData ? store.userData.user : null)

	const onUserChange = (user) => {
		setUser(user)
	}

	useEffect(async () => {
		if (user == null) {
			const data = await Page.fetchData()
			setUser(data.user)
		}
	}, [])

	if (user == null) return null
	return (
		<div>
			<NavBar user={user} onUserChange={onUserChange} />
			<Search />
			<Container fluid>
				<UserContext.Provider value={user}>
					<Contents />
				</UserContext.Provider>
			</Container>
		</div>
	)
}

Page.fetchData = async (cookie) => {
	const query = `query {user {
			signedIn givenName
		}}`
	const data = await graphQLFetch(query, null, null, cookie)
	return data
}
