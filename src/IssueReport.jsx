/** @format */

import React, { useState, useEffect } from 'react'
import { Card, Table, Accordion } from 'react-bootstrap'

import IssueFilter from './IssueFilter.jsx'
import withToast from './withToast.jsx'
import graphQLFetch from './graphQLFetch'
import store from './store'

const statuses = ['New', 'Assigned', 'Fixed', 'Closed']

function IssueReport({ location: { search }, match, showError }) {
	const [stats, setStats] = useState(
		store.initialData ? store.initialData.issueCounts : null
	)
	delete store.initialData
	const loadData = async () => {
		const data = await IssueReport.fetchData(match, search, showError)
		if (data) {
			setStats(data.issueCounts)
		}
	}

	useEffect(() => {
		if (stats == null) loadData()
	}, [])

	useEffect(() => {
		loadData()
	}, [search])

	if (stats == null) return null
	const headerColumns = statuses.map((status) => <th key={status}>{status}</th>)
	const statRows = stats.map((counts) => (
		<tr key={counts.owner}>
			<td>{counts.owner}</td>
			{statuses.map((status) => (
				<td key={status}>{counts[status]}</td>
			))}
		</tr>
	))
	return (
		<>
			<Accordion defaultActiveKey="0">
				<Card>
					<Card.Header>
						<Accordion.Toggle as={Card.Header} eventKey="1">
							Filter
						</Accordion.Toggle>
					</Card.Header>
					<Accordion.Collapse eventKey="1">
						<Card.Body>
							<IssueFilter urlBase="/report" />
						</Card.Body>
					</Accordion.Collapse>
				</Card>
			</Accordion>

			<Table bordered condensed="true" hover responsive>
				<thead>
					<tr>
						<th />
						{headerColumns}
					</tr>
				</thead>
				<tbody>{statRows}</tbody>
			</Table>
		</>
	)
}

IssueReport.fetchData = async (match, search, showError) => {
	const params = new URLSearchParams(search)
	const vars = {}
	if (params.get('status')) vars.status = params.get('status')
	const effortMin = parseInt(params.get('effortMin'), 10)
	if (!Number.isNaN(effortMin)) vars.effortMin = effortMin
	const effortMax = parseInt(params.get('effortMax'), 10)
	if (!Number.isNaN(effortMax)) vars.effortMax = effortMax
	const query = `query issueList(
		$status: StatusType
		$effortMin: Int
		$effortMax: Int
	) {
		issueCounts(
			status: $status
			effortMin: $effortMin
			effortMax: $effortMax
		) {
			owner New Assigned Fixed Closed
		}
	}`
	const data = await graphQLFetch(query, vars, showError)
	return data
}

const IssueReportWithToast = withToast(IssueReport)
IssueReportWithToast.fetchData = IssueReport.fetchData
export default IssueReportWithToast
