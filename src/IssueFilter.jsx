/** @format */
import React, { useState } from 'react'
import URLSearchParams from 'url-search-params'
import { withRouter } from 'react-router-dom'
import {
	Button,
	ButtonToolbar,
	Form,
	InputGroup,
	Row,
	Col,
} from 'react-bootstrap'

const IssueFilter = ({ urlBase, history, location: { search } }) => {
	const params = new URLSearchParams(search)

	const [status, setStatus] = useState(params.get('status') || '')
	const [effortMin, setEffortMin] = useState(params.get('effortMin') || '')
	const [effortMax, setEffortMax] = useState(params.get('effortMax') || '')
	const [changed, setChanged] = useState(false)

	const onChangeEffortMin = (e) => {
		const effortString = e.target.value
		if (effortString.match(/^\d*$/)) {
			setEffortMin(e.target.value)
			setChanged(true)
		}
	}

	const onChangeEffortMax = (e) => {
		const effortString = e.target.value
		if (effortString.match(/^\d*$/)) {
			setEffortMax(e.target.value)
			setChanged(true)
		}
	}

	const showOriginalFilter = () => {
		setStatus(params.get('status') || '')
		setChanged(false)
	}

	const applyFilter = () => {
		const params = new URLSearchParams()
		if (status) params.set('status', status)
		if (effortMin) params.set('effortMin', effortMin)
		if (effortMax) params.set('effortMax', effortMax)
		const search = params.toString() ? `?${params.toString()}` : ''
		history.push({ pathname: urlBase, search })
		setChanged(false)
	}

	const onChangeStatus = (e) => {
		setChanged(true)
		setStatus(e.target.value)
	}
	return (
		<>
			<Row>
				<Col xs={6} sm={4} md={3} lg={6}>
					<Form.Group>
						<Form.Label>Status:</Form.Label>
						<Form.Control as="select" value={status} onChange={onChangeStatus}>
							<option value="">(All)</option>
							<option value="New">New</option>
							<option value="Assigned">Assigned</option>
							<option value="Fixed">Fixed</option>
							<option value="Closed">Closed</option>
						</Form.Control>
					</Form.Group>
				</Col>
				<Col sx={6} sm={4} md={3} lg={2}>
					<Form.Group>
						<Form.Label>Effort between:</Form.Label>
						<InputGroup>
							<Form.Control value={effortMin} onChange={onChangeEffortMin} />
							<InputGroup.Text>-</InputGroup.Text>
							<Form.Control value={effortMax} onChange={onChangeEffortMax} />
						</InputGroup>
					</Form.Group>
				</Col>
				<Col sx={6} sm={4} md={3} lg={2}>
					<Form.Group>
						<Form.Label>&nbsp;</Form.Label>
						<ButtonToolbar>
							<Button bsstyle="primary" type="button" onClick={applyFilter}>
								Apply
							</Button>
							{' | '}
							<Button
								bsstyle="primary"
								type="button"
								onClick={showOriginalFilter}
								disabled={!changed}
							>
								Reset
							</Button>
						</ButtonToolbar>
					</Form.Group>
				</Col>
			</Row>
		</>
	)
}

export default withRouter(IssueFilter)
