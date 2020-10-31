import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism'

import {
    Card,
    CardBody,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane
} from 'reactstrap'

import classnames from 'classnames'

export default () => {
    const [tab, setTab] = React.useState('1')

    
    return (
        <div id="navs" className="docs-item element">
            <h5 className="text-uppercase mb-4">Navs</h5>
            <div className="docs-desc"><p className="lead">Documentation and examples for how to use Bootstrap’s included navigation components. See the <a href="https://reactstrap.github.io/components/navs/">ReactStrap documentation</a> for more details. </p></div>
            <div className="mt-5">
                <Card className="mb-3">
                    <CardBody>
                        <h6 className="title-decorative">Horizontal</h6>
                        <Nav>
                            <NavItem><NavLink href="#" active>Active</NavLink></NavItem>
                            <NavItem><NavLink href="#">Link</NavLink></NavItem>
                            <NavItem><NavLink href="#">Link</NavLink></NavItem>
                            <NavItem><NavLink href="#" disabled>Disabled</NavLink></NavItem>
                        </Nav>
                    </CardBody>
                </Card>
                <Card className="mb-3">
                    <CardBody>
                        <h6 className="title-decorative">Vertical</h6>
                        <Nav className="flex-md-column">
                            <NavLink href="#" className="active">Active</NavLink>
                            <NavLink href="#">Link</NavLink>
                            <NavLink href="#">Link</NavLink>
                            <NavLink href="#" disabled>Disabled</NavLink>
                        </Nav>
                    </CardBody>
                </Card>
                <Card className="mb-3">
                    <CardBody>
                        <h6 className="mb-4">Tabs</h6>
                        <Nav tabs>
                            <NavItem>
                                <NavLink
                                    style={{ cursor: "pointer" }}
                                    className={classnames({ active: tab === '1' })}
                                    onClick={() => setTab('1')}
                                >
                                    Tab One
                                                    </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    style={{ cursor: "pointer" }}
                                    className={classnames({ active: tab === '2' })}
                                    onClick={() => setTab('2')}
                                >
                                    Tab Two
                                                    </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    style={{ cursor: "pointer" }}
                                    className={classnames({ active: tab === '3' })}
                                    onClick={() => setTab('3')}
                                >
                                    Tab Three
                                                    </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={tab} className="py-5 px-3">
                            <TabPane tabId="1">
                                <p className="text-muted">One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections</p>
                            </TabPane>
                            <TabPane tabId="2">
                                <p className="text-muted">The bedding was hardly able to cover it and seemed ready to slide off any moment. His many legs, pitifully thin compared with the size of the rest of him, waved about helplessly as he looked. "What's happened to me?" he thought. It wasn't a dream.</p>
                            </TabPane>
                            <TabPane tabId="3">
                                <p className="text-muted">His room, a proper human room although a little too small, lay peacefully between its four familiar walls. A collection of textile samples lay spread out on the table.</p>
                            </TabPane>
                        </TabContent>
                    </CardBody>
                </Card>
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
    `import { Nav, NavItem, NavLink } from 'reactstrap'

export default () => {
    return (
        <Nav>
            <NavItem><NavLink href="#" active>Active</NavLink></NavItem>
            <NavItem><NavLink href="#">Link</NavLink></NavItem>
            <NavItem><NavLink href="#">Link</NavLink></NavItem>
            <NavItem><NavLink href="#" disabled>Disabled</NavLink></NavItem>
        </Nav>
    )
}`