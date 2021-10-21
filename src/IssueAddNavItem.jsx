/** @format */
import React, { useState } from 'react'
import {
	Form,
	Nav,
	OverlayTrigger,
	Tooltip,
	ButtonToolbar,
	Button,
	Modal,
} from 'react-bootstrap'
import { withRouter } from 'react-router'

import withToast from './withToast.jsx'
import graphQLFetch from './graphQLFetch'

function IssueAddNavItem({ history, showError, user }) {
	const [showing, setShowing] = useState(false)

	const showModal = () => setShowing(true)
	const hideModal = () => setShowing(false)

	const handleSubmit = async (e) => {
		e.preventDefault()
		hideModal()
		const form = document.forms.issueAdd
		const issue = {
			owner: form.owner.value,
			title: form.title.value,
			due: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10),
		}

		const query = `mutation issueAdd($issue: IssueInputs!) {
      issueAdd(issue: $issue) {
        id
      }
    }`

		const data = await graphQLFetch(query, { issue }, showError)
		if (data) {
			history.push(`/edit/${data.issueAdd.id}`)
		}
		form.owner.value = ''
		form.title.value = ''
	}

	return (
		<>
			<Nav>
				<OverlayTrigger
					placement="left"
					delay={1000}
					overlay={<Tooltip id="create-issue">Create Issue</Tooltip>}
				>
					<Button
						type="button"
						disabled={!user.signedIn}
						bssize="xsmall"
						onClick={showModal}
					>
						Create
					</Button>
				</OverlayTrigger>
			</Nav>
			<Modal keyboard show={showing} onHide={hideModal}>
				<Modal.Header>
					<Modal.Title>Create Issue</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form name="issueAdd">
						<Form.Group>
							<Form.Label>Owner:</Form.Label>
							<Form.Control
								type="text"
								name="owner"
								autoFocus
								placeholder="Owner"
							/>
						</Form.Group>
						<Form.Group>
							<Form.Label>Title:</Form.Label>
							<Form.Control type="text" name="title" placeholder="Title" />
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<ButtonToolbar>
						<Button type="button" variant="primary" onClick={handleSubmit}>
							Submit
						</Button>
						{'  '}
						<Button onClick={hideModal}>Cancel</Button>
					</ButtonToolbar>
				</Modal.Footer>
			</Modal>
		</>
	)
}

export default withToast(withRouter(IssueAddNavItem))
