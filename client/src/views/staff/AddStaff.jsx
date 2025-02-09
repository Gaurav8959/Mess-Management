import React, { useState } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

const AddStaff = () => {
  const [value, setValue] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    desigination: ''
  });

  const handleOnchange = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setValue({
      name: '',
      email: '',
      mobile: '',
      address: '',
      desigination: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/createstaff', value, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      resetForm();
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
      resetForm();
    }
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title as="h5">Add Staff</Card.Title>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={12}>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3 row">
                <Form.Group className="col-12 col-md-6">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={value.name}
                    onChange={handleOnchange}
                    placeholder="Enter Full Name..."
                    required
                  />
                </Form.Group>
                <Form.Group className="col-12 col-md-6">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={value.email}
                    onChange={handleOnchange}
                    placeholder="Enter Email Address..."
                    required
                  />
                </Form.Group>
              </Form.Group>
              <Form.Group className="mb-3 row">
                <Form.Group className="col-12 col-md-6">
                  <Form.Label>Mobile No.</Form.Label>
                  <Form.Control
                    type="number"
                    name="mobile"
                    value={value.mobile}
                    onChange={handleOnchange}
                    placeholder="Enter Mobile No..."
                    required
                  />
                </Form.Group>
                <Form.Group className="col-12 col-md-6">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={value.address}
                    onChange={handleOnchange}
                    placeholder="Enter Address..."
                    required
                  />
                </Form.Group>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Desigination</Form.Label>
                <Form.Control
                  type="text"
                  name="desigination"
                  value={value.desigination}
                  onChange={handleOnchange}
                  placeholder="Enter Designation..."
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            <ToastContainer />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default AddStaff;
