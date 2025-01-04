import Modal from 'react-bootstrap/Modal';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../combine.css';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

const UpdateStaff = ({ show, handleUclose, expensesUid }) => {
  const emptyExpenses = {
    amount: '',
    date: '',
    note: ''
  };
  const [expenses, setExpenses] = useState(emptyExpenses);

  // Utility function to format date as yyyy-MM-dd
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Extract yyyy-MM-dd
  };

  const handleinputChange = (e) => {
    const { name, value } = e.target;
    setExpenses({ ...expenses, [name]: value });
  };

  useEffect(() => {
    const fetchExpensesData = async () => {
      try {
        const res = await axios.get(`http://localhost:8009/api/readexpenses?expenseId=${expensesUid}`);
        const fetchedExpenses = res.data.expenses;
        setExpenses({
          ...fetchedExpenses,
          date: formatDate(fetchedExpenses.date) // Format date for compatibility
        });
      } catch (error) {
        console.log(error);
        toast.error('Failed to fetch expenses data.');
      }
    };

    if (expensesUid) {
      fetchExpensesData();
    }
  }, [expensesUid]);

  const handleUpdClose = () => {
    handleUclose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `http://localhost:8009/api/updateexpenses/${expensesUid}`,
        expenses,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (res.status === 200) {
        toast.success(res.data.message);
        handleUclose();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || 'Server error occurred');
      } else {
        toast.error('Internal server error');
      }
      console.error(error);
    }
  };

  if (!expenses) {
    return null; // Return null or a loading indicator until the expenses data is fetched
  }

  return (
    <>
      <Modal show={show} onHide={handleUpdClose}>
        <Modal.Header closeButton className="theme-bg2">
          <Modal.Title style={{ color: 'white' }}>Update Expenses</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={12}>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="col-12 col-md-12 mb-3 mb-md-3">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="amount"
                    value={expenses.amount}
                    onChange={handleinputChange}
                    id="amount"
                    autoComplete="amount"
                    placeholder="Enter Amount..."
                    required
                  />
                </Form.Group>
                <Form.Group className="col-12 col-md-12 mb-3 mb-md-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={expenses.date}
                    onChange={handleinputChange}
                    id="date"
                    autoComplete="date"
                    placeholder="Enter Date..."
                    required
                  />
                </Form.Group>
                <Form.Group className="col-12 col-md-12 mb-3 mb-md-3">
                  <Form.Label>Note</Form.Label>
                  <Form.Control
                    type="text"
                    name="note"
                    value={expenses.note}
                    onChange={handleinputChange}
                    id="note"
                    autoComplete="note"
                    placeholder="Enter Note..."
                    required
                  />
                </Form.Group>

                <Modal.Footer>
                  <Button variant="primary" className="theme-bg2" type="submit">
                    Submit
                  </Button>
                  <Button variant="secondary" onClick={handleUpdClose}>
                    Close
                  </Button>
                </Modal.Footer>
              </Form>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UpdateStaff;
