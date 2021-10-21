/** @format */

import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import routes from './routes'

export const Contents = () => (
	<Switch>
		<Redirect exact from="/" to="/issues" />
		{routes.map((attrs) => (
			<Route {...attrs} key={attrs.path} />
		))}
	</Switch>
)
