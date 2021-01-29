import { Form } from 'react-bootstrap'
import PhoneInput from 'react-phone-input-2'

import SimpleLayout from '../SimpleLayout/SimpleLayout'

import './PhoneNumberVerification.scss'
import 'react-phone-input-2/lib/style.css'

export default function PhoneNumberVerification() {
  return (
    <SimpleLayout>
      <a href="/" className="back-link pt-5 text-label text-all-cups" title="Back">
        <span className="back-link-arrows">&#171;&#32;&#32;</span>back
      </a>
      <div className="text-headline pt-3">Please, enter your phone number</div>

      <Form className="pt-3">
        <Form.Group>
          <PhoneInput country={'us'} />
        </Form.Group>
        <a href="/phone-confirmation" className="btn submit-btn">Confirm</a>
      </Form>
    </SimpleLayout>
  )
}
