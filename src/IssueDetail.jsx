/** @format */

import React from 'react'

export const IssueDetail = ({ issue }) => {
	if (issue) {
		return (
			<div>
				<h3>Description</h3>
				<pre>{issue.description}</pre>
			</div>
		)
	}
	return null
}
