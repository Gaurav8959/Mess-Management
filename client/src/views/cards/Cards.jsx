import React, { useState } from 'react';
import '../combine.css';
import { Row, Col, Form, Tabs, Button, Tab, Card, Table, Pagination, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import avatar1 from '../../assets/images/user/avatar-1.jpg';
import avatar2 from '../../assets/images/user/avatar-2.jpg';
import avatar3 from '../../assets/images/user/avatar-3.jpg';

const Cards = () => {
  let active = 3;
  let activeItems = [];
  for (let number = 1; number <= 5; number++) {
    activeItems.push(
      <Pagination.Item key={number} active={number === active}>
        {number}
      </Pagination.Item>
    );
  }
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <React.Fragment>
      <Row>
        <Col>
          <h5 className="mt-4">Add, Manage & Update Students</h5>
          <hr />
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Update Student</Modal.Title>
            </Modal.Header>
            <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleClose}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
          <Tabs variant="pills" defaultActiveKey="all-cards" className="mb-3 tab-pill-center">
            <Tab eventKey="all-cards" title="CARDS">
              <Col md={12} xl={12}>
                <Card className="Recent-Users widget-focus-lg">
                  <Card.Header>
                    <Card.Title as="h5">All Cards</Card.Title>
                  </Card.Header>
                  <Card.Body className="px-0 py-2">
                    <Table responsive hover className="recent-users">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Icone</th>
                          <th>User-Info</th>
                          <th>Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="unread">
                          <th scope="row">1</th>
                          <td>
                            <img className="rounded-circle" style={{ width: '40px' }} src={avatar1} alt="activity-user" />
                          </td>
                          <td>
                            <h6 className="mb-1">Isabella Christensen</h6>
                            <p className="m-0">Lorem Ipsum is simply dummy text of…</p>
                          </td>
                          <td>
                            <h6 className="text-muted">
                              <i className="fa fa-circle text-c-green f-10 m-r-15" />
                              11 MAY 12:56
                            </h6>
                          </td>
                          <td>
                            <Link to="#" className="label theme-bg text-white f-12" onClick={handleShow}>
                              Update
                            </Link>
                            <Link to="#" className="label theme-bg2 text-white f-12">
                              Reject
                            </Link>
                          </td>
                        </tr>
                        <tr className="unread">
                          <th scope="row">2</th>
                          <td>
                            <img className="rounded-circle" style={{ width: '40px' }} src={avatar2} alt="activity-user" />
                          </td>
                          <td>
                            <h6 className="mb-1">Mathilde Andersen</h6>
                            <p className="m-0">Lorem Ipsum is simply dummy text of…</p>
                          </td>
                          <td>
                            <h6 className="text-muted">
                              <i className="fa fa-circle text-c-red f-10 m-r-15" />
                              11 MAY 10:35
                            </h6>
                          </td>
                          <td>
                            <Link to="#" className="label theme-bg text-white f-12">
                              Update
                            </Link>
                            <Link to="#" className="label theme-bg2 text-white f-12">
                              Reject
                            </Link>
                          </td>
                        </tr>
                        <tr className="unread">
                          <th scope="row">3</th>
                          <td>
                            <img className="rounded-circle" style={{ width: '40px' }} src={avatar3} alt="activity-user" />
                          </td>
                          <td>
                            <h6 className="mb-1">Karla Sorensen</h6>
                            <p className="m-0">Lorem Ipsum is simply dummy text of…</p>
                          </td>
                          <td>
                            <h6 className="text-muted">
                              <i className="fa fa-circle text-c-green f-10 m-r-15" />9 MAY 17:38
                            </h6>
                          </td>
                          <td>
                            <Link to="#" className="label theme-bg text-white f-12">
                              Update
                            </Link>
                            <Link to="#" className="label theme-bg2 text-white f-12">
                              Reject
                            </Link>
                          </td>
                        </tr>
                        <tr className="unread">
                          <th scope="row">4</th>
                          <td>
                            <img className="rounded-circle" style={{ width: '40px' }} src={avatar1} alt="activity-user" />
                          </td>
                          <td>
                            <h6 className="mb-1">Ida Jorgensen</h6>
                            <p className="m-0">Lorem Ipsum is simply dummy text of…</p>
                          </td>
                          <td>
                            <h6 className="text-muted f-w-300">
                              <i className="fa fa-circle text-c-red f-10 m-r-15" />
                              19 MAY 12:56
                            </h6>
                          </td>
                          <td>
                            <Link to="#" className="label theme-bg text-white f-12">
                              Update
                            </Link>
                            <Link to="#" className="label theme-bg2 text-white f-12">
                              Reject
                            </Link>
                          </td>
                        </tr>
                        <tr className="unread">
                          <th scope="row">5</th>
                          <td>
                            <img className="rounded-circle" style={{ width: '40px' }} src={avatar2} alt="activity-user" />
                          </td>
                          <td>
                            <h6 className="mb-1">Albert Andersen</h6>
                            <p className="m-0">Lorem Ipsum is simply dummy text of…</p>
                          </td>
                          <td>
                            <h6 className="text-muted">
                              <i className="fa fa-circle text-c-green f-10 m-r-15" />
                              21 July 12:56
                            </h6>
                          </td>
                          <td>
                            <Link to="#" className="label theme-bg text-white f-12">
                              Update
                            </Link>
                            <Link to="#" className="label theme-bg2 text-white f-12">
                              Reject
                            </Link>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                  <Pagination style={{ justifyContent: 'center' }}>{activeItems}</Pagination>
                </Card>
              </Col>
            </Tab>
            <Tab eventKey="add-cards" title="ADD-CARDS">
              <Col sm={12}>
                <Card>
                  <Card.Header>
                    <Card.Title as="h5">Add Cards</Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={12}>
                        <Form>
                          <Form.Group className="mb-3 row" controlId="formBasicEmail">
                            <Form.Group className="col-12 col-md-6 mb-3 mb-md-0" controlId="formBasicEmail">
                              <Form.Label>Full Name</Form.Label>
                              <Form.Control type="text" name="fullname" id="fullname" placeholder="Enter Full Name..." />
                            </Form.Group>
                            <Form.Group className="col-12 col-md-6" controlId="formBasicEmail">
                              <Form.Label>Father Name</Form.Label>
                              <Form.Control type="text" name="fathername" id="fathername" placeholder="Enter Father Name..." />
                            </Form.Group>
                          </Form.Group>

                          <Form.Group className="mb-3 row" controlId="formBasicEmail">
                            <Form.Group className="col-12 col-md-6 mb-3 mb-md-0" controlId="formBasicEmail">
                              <Form.Label>Email</Form.Label>
                              <Form.Control type="email" name="email" id="email" placeholder="Enter Your Email..." />
                            </Form.Group>
                            <Form.Group className="col-12 col-md-6" controlId="formBasicEmail">
                              <Form.Label>Password</Form.Label>
                              <Form.Control type="password" name="password" id="password" placeholder="Password..." />
                            </Form.Group>
                          </Form.Group>

                          <Form.Group className="mb-3 row" controlId="formBasicEmail">
                            <Form.Group className="col-12 col-md-6 mb-3 mb-md-0" controlId="formBasicEmail">
                              <Form.Label>Room No.</Form.Label>
                              <Form.Control type="text" name="roomno" id="roomno" placeholder="Enter Your Room No..." />
                            </Form.Group>
                            <Form.Group className="col-12 col-md-6" controlId="formBasicEmail">
                              <Form.Label>Select Branch</Form.Label>
                              <Form.Control as="select">
                                <option>CS</option>
                                <option>IT</option>
                                <option>EC</option>
                                <option>EX</option>
                                <option>MCA</option>
                                <option>Mpharma</option>
                                <option>Polytechnic</option>
                              </Form.Control>
                            </Form.Group>
                          </Form.Group>

                          <Form.Group className="mb-3 row" controlId="formBasicEmail">
                            <Form.Group className="col-12 col-md-6 mb-3 mb-md-0" controlId="formBasicEmail">
                              <Form.Label>Mobile No.</Form.Label>
                              <Form.Control type="number" name="mobile" id="mobile" placeholder="Enter Your Mobile No..." />
                            </Form.Group>
                            <Form.Group className="col-12 col-md-6" controlId="formBasicEmail">
                              <Form.Label>Acadmic Year</Form.Label>
                              <Form.Control type="number" name="year" id="year" placeholder="Enter Achademic Year..." />
                            </Form.Group>
                          </Form.Group>

                          <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Upload Profile</Form.Label>
                            <Form.Control type="file" name="profilephoto" id="profilephoto" />
                          </Form.Group>

                          <Button variant="primary">Submit</Button>
                        </Form>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Cards;
