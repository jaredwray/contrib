import React from 'react'
import { Container } from 'react-bootstrap'

export default function Footer() {
  return (
    <footer className="position-relative z-index-10 d-print-none" >
      <div className="py-6 bg-darkgrey text-muted">
        <Container>
          <p className="text-sm text-sage font-bold text-uppercase mb-md-0">Copyright 2021 Contrib Inc.</p>
          <p className="text-sm text-sage font-bold text-uppercase mb-md-0">Privacy and Terms &gt;&gt;</p>
        </Container>
      </div>
    </footer>
  )
}
