/** @format */
import React, { useContext } from 'react'
import { Link, NavLink, withRouter } from 'react-router-dom'
import { Button, Tooltip, OverlayTrigger, Table } from 'react-bootstrap'

import UserContext from './UserContext'

function IssueTable({ issues, deleteIssue, closeIssue }) {
	const issueRows = issues.map((issue, index) => (
		<IssueRow
			key={issue.id}
			issue={issue}
			deleteIssue={deleteIssue}
			closeIssue={closeIssue}
			index={index}
		/>
	))

	return (
		<Table bordered condensed="true" hover responsible>
			<thead>
				<tr>
					<th>ID</th>
					<th>Status</th>
					<th>Owner</th>
					<th>Created</th>
					<th>Effort</th>
					<th>Due Date</th>
					<th>Title</th>
					<th>Action</th>
				</tr>
			</thead>
			<tbody>{issueRows}</tbody>
		</Table>
	)
}

const IssueRow = withRouter(
	({ issue, closeIssue, deleteIssue, index, location: { search } }) => {
		const { id, title, status, owner, effort, created, due } = issue
		const selectLocation = { pathname: `/issues/${id}`, search }

		const user = useContext(UserContext)
		const editTooltip = (
			<Tooltip id="close-tooltip" placement="top">
				Edit Issue
			</Tooltip>
		)
		const closeTooltip = (
			<Tooltip id="close-tooltip" placement="top">
				Close Issue
			</Tooltip>
		)
		const deleteTooltip = (
			<Tooltip id="delete-tooltip" placement="top">
				Delete Issue
			</Tooltip>
		)
		const onClose = (e) => {
			e.preventDefault()
			closeIssue(index)
		}
		const onDelete = (e) => {
			e.preventDefault()
			deleteIssue(index)
		}
		return (
			<tr>
				<td>{id}</td>
				<td>{status}</td>
				<td>{owner}</td>
				<td>{created.toDateString()}</td>
				<td>{effort}</td>
				<td>{due ? due.toDateString() : ' '}</td>
				<td>{title}</td>
				<td>
					<Link to={`/edit/${id}`}>
						<OverlayTrigger delay={1000} overlay={editTooltip}>
							<Button type="button" bssize="xsmall">
								Edit
							</Button>
						</OverlayTrigger>
					</Link>
					{' | '}
					<OverlayTrigger delay={1000} overlay={closeTooltip}>
						<Button
							type="button"
							disabled={!user.signedIn}
							bssize="xsmall"
							onClick={onClose}
						>
							Close
						</Button>
					</OverlayTrigger>
					{' | '}
					<NavLink to={selectLocation}>
						<Button type="button" bssize="xsmall">
							Select
							{' | '}
						</Button>
					</NavLink>
					{' | '}
					<OverlayTrigger delay={1000} overlay={deleteTooltip}>
						<Button
							type="button"
							disabled={!user.signedIn}
							bssize="xsmall"
							onClick={onDelete}
						>
							Delete
						</Button>
					</OverlayTrigger>
				</td>
			</tr>
		)
	}
)

export default IssueTable
