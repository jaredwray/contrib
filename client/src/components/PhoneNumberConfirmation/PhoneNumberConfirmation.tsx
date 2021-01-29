import { Form } from 'react-bootstrap'

import SimpleLayout from '../SimpleLayout/SimpleLayout'

import './PhoneNumberConfirmation.scss'

export default function PhoneNumberConfirmation() {
  return (
    <SimpleLayout>
      <a href="/phone-verification" className="back-link pt-5 text-label text-all-cups" title="Back">
        <span className="back-link-arrows">&#171;&#32;&#32;</span>back
      </a>
      <div className="text-headline pt-3">Please, confirm your phone number</div>

      <Form className="pt-3">
        <Form.Group>
          <Form.Label>Confirmation number for phone number:<br/>+123456789</Form.Label>
          <Form.Control placeholder="Confirmation number" />
          <Form.Text className="text-muted">
            you will able to request another confirmation number after<br/><b>1 minute 10 seconds</b>.
          </Form.Text>
        </Form.Group>

        <a href="/" className="btn submit-btn">Confirm</a>
      </Form>
    </SimpleLayout>
  )
}
