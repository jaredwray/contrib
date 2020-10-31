import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism'

import {
    Modal,
    ModalBody,
    ModalFooter,
    Button
} from 'reactstrap'

export default () => {
    const [modal, setModal] = React.useState(false)

    const onClick = () => {
        setModal(!modal)
    }
    return (
        <div id="modal" className="docs-item element">
            <h5 className="text-uppercase mb-4">Modal</h5>
            <div className="docs-desc"><p className="lead">Use Bootstrap’s JavaScript modal plugin to add dialogs to your site for lightboxes, user notifications, or completely custom content. See the <a href="https://reactstrap.github.io/components/modals/">ReactStrap documentation</a> for more details. </p></div>
            <div className="mt-5">
                <Button color="primary" onClick={onClick}>Launch demo modal</Button>
                <Modal isOpen={modal} toggle={onClick} fade>
                    <ModalBody>
                        <Button color="ooo" onClick={onClick} className="close"><span aria-hidden="true">× </span></Button>
                        <h2 className="modal-title mb-3">Modal title</h2>
                        <p className="text-muted"><strong>Pellentesque habitant morbi tristique</strong> senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. <em>Aenean ultricies mi vitae est.</em> Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, <code>commodo vitae</code>, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. <a href="#">Donec non enim</a> in turpis pulvinar facilisis. Ut felis.</p>
                    </ModalBody>
                    <ModalFooter className="justify-content-end">
                        <Button color="primary" onClick={onClick}>Save changes</Button>
                        <Button color="outline-muted" onClick={onClick}>Close</Button>
                    </ModalFooter>
                </Modal>
            </div>
            <div className="mt-4">
                <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded shadow p-4">
                    {highlightCode}
                </SyntaxHighlighter>
            </div>
        </div>
    )
}

const highlightCode =
    `import { Modal,  ModalBody, ModalFooter, Button } from 'reactstrap'

export default () => {
    const [modal, setModal] = React.useState(false)

    const onClick = () => {
        setModal(!modal)
    }
    return (
        <>
            <Button color="primary" onClick={onClick}>Launch demo modal</Button>
            <Modal isOpen={modal} toggle={onClick} fade>
                <ModalBody>
                    <Button color="ooo" onClick={onClick} className="close"><span aria-hidden="true">×</span></Button>
                    <h2>Modal title</h2>
                    <p>Modal text</p>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={onClick}>Save changes</Button>
                    <Button color="outline-muted" onClick={onClick}>Close</Button>
                </ModalFooter>
            </Modal>
        <>
    )
}`