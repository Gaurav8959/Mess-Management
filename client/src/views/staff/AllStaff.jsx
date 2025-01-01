import React, { useState } from 'react';
import { Table, Card, Pagination, Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import avatar1 from '../../assets/images/user/avatar-1.jpg';
import avatar2 from '../../assets/images/user/avatar-2.jpg';
import avatar3 from '../../assets/images/user/avatar-3.jpg';

const AllStaff = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let active = 3;
  let activeItems = [];
  for (let number = 1; number <= 5; number++) {
    activeItems.push(
      <Pagination.Item key={number} active={number === active}>
        {number}
      </Pagination.Item>
    );
  }

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Staff</Modal.Title>
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
      <Card className="Recent-Users widget-focus-lg">
        <Card.Header>
          <Card.Title as="h5">All Staff</Card.Title>
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
              {/* Sample rows */}
              {[avatar1, avatar2, avatar3].map((avatar, index) => (
                <tr className="unread" key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>
                    <img className="rounded-circle" style={{ width: '40px' }} src={avatar} alt="activity-user" />
                  </td>
                  <td>
                    <h6 className="mb-1">User {index + 1}</h6>
                    <p className="m-0">Lorem Ipsum is simply dummy text...</p>
                  </td>
                  <td>
                    <h6 className="text-muted">
                      <i className="fa fa-circle text-c-green f-10 m-r-15" />
                      Date
                    </h6>
                  </td>
                  <td>
                    <Link to="#" className="label theme-bg text-white f-12" onClick={handleShow}>
                      Update
                    </Link>
                    <Link to="#" className="label theme-bg2 text-white f-12">
                      Delete
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
        <Pagination style={{ justifyContent: 'center' }}>{activeItems}</Pagination>
      </Card>
    </>
  );
};

export default AllStaff;
