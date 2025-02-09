import React, { useState } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

const AddExpenses = () => {
  const [value, setValue] = useState({
    amount: '',
    date: '',
    note: ''
  });

  const handleOnchange = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setValue({
      amount: '',
      date: '',
      note: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/createexpenses', value, {
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
        <Card.Title as="h5">Add Expenses</Card.Title>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={12}>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3 row">
                <Form.Group className="col-12 col-md-6">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    id="amount"
                    type="text"
                    name="amount"
                    value={value.amount}
                    onChange={handleOnchange}
                    placeholder="Enter Amount..."
                    required
                  />
                </Form.Group>
                <Form.Group className="col-12 col-md-6">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    id="date"
                    type="date"
                    name="date"
                    value={value.date}
                    onChange={handleOnchange}
                    placeholder="Select Date..."
                    required
                  />
                </Form.Group>
              </Form.Group>
              <Form.Group className="col-12 col-md-12 mb-3">
                  <Form.Label>Note</Form.Label>
                  <Form.Control
                  id='note'
                    type="text"
                    name="note"
                    value={value.note}
                    onChange={handleOnchange}
                    placeholder="Enter Note..."
                    required
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

export default AddExpenses;
