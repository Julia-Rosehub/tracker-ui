/** @format */

import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { Card, Accordion, Pagination } from 'react-bootstrap'
import URLSearchParams from 'url-search-params'

import IssueTable from './IssueTable.jsx'
import { IssueDetail } from './IssueDetail.jsx'
import graphQLFetch from './graphQLFetch'
import IssueFilter from './IssueFilter.jsx'
import store from './store'
import withToast from './withToast.jsx'

const SECTION_SIZE = 5

function PageLink({ params, page, activePage, children }) {
	params.set('page', page)
	if (page === 0) return React.cloneElement(children, { disabled: true })
	return (
		<NavLink
			isActive={() => page === activePage}
			to={{ search: `?${params.toString()}` }}
		>
			{children}
		</NavLink>
	)
}

function IssueList({
	location: { pathname, search },
	history,
	match,
	showError,
	showSuccess,
}) {
	const [issues, setIssues] = useState(
		store.initialData ? store.initialData.issueList.issues : []
	)
	const [selectedIssue, setSelectedIssue] = useState(
		store.initialData ? store.initialData.issue : 0
	)
	const [pages, setPages] = useState(
		store.initialData ? store.initialData.issueList.pages : null
	)

	delete store.initialData

	const loadData = async () => {
		const data = await IssueList.fetchData(match, search, showError)
		if (data) {
			setIssues(data.issueList.issues)
			setPages(data.issueList.pages)
			if (data.issue) setSelectedIssue(data.issue)
		}
	}

	const closeIssue = async (index) => {
		const query = `
		mutation issueClose($id: Int!) {
			issueUpdate(id: $id, changes: {status: Closed}) {
				id title status owner
				effort created due description
			}
		}`

		const data = await graphQLFetch(
			query,
			{ id: parseInt(issues[index].id) },
			showError
		)
		if (data) {
			issues.map((issue) => {
				if (issue.id === issues[index].id) {
					issue = data.issueUpdate
					return issue
				} else return issue
			})
			setIssues(issues)
		} else {
			loadData()
		}
	}

	const deleteIssue = async (index) => {
		const query = `mutation issueDelete($id: Int!) {
			issueDelete(id: $id)
		}`

		const data = await graphQLFetch(
			query,
			{ id: parseInt(issues[index].id) },
			showError
		)
		if (data && data.issueDelete) {
			if (pathname === `/issues/${id}`) {
				history.push({ pathname: '/issues', search })
			}
			setIssues([issues.splice(index, 1)])
		} else {
			loadData()
		}
	}

	useEffect(() => {
		loadData()
	}, [search, issues])

	// useEffect(() => {
	// 	loadData()
	// }, [props.match.params])

	useEffect(() => {
		if (issues == null) loadData()
	}, [])

	const params = new URLSearchParams(search)
	let page = parseInt(params.get('page'), 10)
	if (Number.isNaN(page)) page = 1
	const startPage = Math.floor((page - 1) / SECTION_SIZE) * SECTION_SIZE + 1
	const endPage = startPage + SECTION_SIZE - 1
	const prevSection = startPage === 1 ? 0 : startPage - SECTION_SIZE
	const nextSection = endPage >= pages ? 0 : startPage + SECTION_SIZE
	const items = []
	for (let i = startPage; i <= Math.min(endPage, pages); i += 1) {
		params.set('page', i)
		items.push(
			<PageLink key={i} params={params} activePage={page} page={i}>
				<Pagination.Item>{i}</Pagination.Item>
			</PageLink>
		)
	}

	if (issues == null) {
		return null
	}

	return (
		<>
			<h1>Issue Tracker</h1>
			<Accordion defaultActiveKey="0">
				<Card>
					<Accordion.Toggle as={Card.Header} eventKey="1">
						Filter
					</Accordion.Toggle>
					<Accordion.Collapse eventKey="1">
						<Card.Body>
							<IssueFilter urlBase="/issues" />
						</Card.Body>
					</Accordion.Collapse>
				</Card>
			</Accordion>
			<hr />
			<IssueTable
				issues={issues}
				deleteIssue={deleteIssue}
				closeIssue={closeIssue}
			/>
			<hr />
			<IssueDetail issue={selectedIssue} />
			<Pagination>
				<PageLink params={params} page={prevSection}>
					<Pagination.Item>{'<'}</Pagination.Item>
				</PageLink>
				{items}
				<PageLink params={params} page={nextSection}>
					<Pagination.Item>{'>'}</Pagination.Item>
				</PageLink>
			</Pagination>
		</>
	)
}

IssueList.fetchData = async (match, search, showError) => {
	const params = new URLSearchParams(search)
	const vars = { hasSelection: false, selectedId: 0 }
	if (params.get('status')) vars.status = params.get('status')

	const effortMin = parseInt(params.get('effortMin'), 10)
	if (!Number.isNaN(effortMin)) vars.effortMin = effortMin
	const effortMax = parseInt(params.get('effortMax'), 10)
	if (!Number.isNaN(effortMax)) vars.effortMax = effortMax

	const {
		params: { id },
	} = match
	const idInt = parseInt(id, 10)
	if (!Number.isNaN(idInt)) {
		vars.hasSelection = true
		vars.selectedId = idInt
	}

	let page = parseInt(params.get('page'), 10)
	if (Number.isNaN(page)) page = 1
	vars.page = page
	const query = `query issueList(
			$status: StatusType
			$effortMin: Int
			$effortMax: Int
			$hasSelection: Boolean!
			$selectedId: Int!
			$page: Int
			) {
      issueList (
				status: $status
				effortMin: $effortMin
				effortMax: $effortMax
				page: $page
				) {
					issues {
						id title status owner
						created effort due
					}
					pages
      }
		    issue(id: $selectedId) @include (if : $hasSelection) {
        id description
		 }
    }`

	const data = await graphQLFetch(query, vars, showError)
	return data
}

const IssueListWithToast = withToast(IssueList)
IssueListWithToast.fetchData = IssueList.fetchData
export default IssueListWithToast
