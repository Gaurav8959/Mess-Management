import Modal from 'react-bootstrap/Modal';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../combine.css';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

const UpdateStaff = ({ show, handleUclose, staffId, salaryUid }) => {
  const emptyStaff = {
    staffId: '',
    amount: '',
    date: '',
    note: ''
  };
  const [salary, setSalary] = useState(emptyStaff);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Extract yyyy-MM-dd
  };

  const handleinputChange = (e) => {
    const { name, value } = e.target;
    setSalary({ ...salary, [name]: value });
  };

  const fetchStaffData = async () => {
    try {
      const res = await axios.get(`http://localhost:8009/api/readsalary?staffId=${staffId}`);
      const fetchedSalary = res.data.salarys[0];
      setSalary({
        ...fetchedSalary,
        date: formatDate(fetchedSalary.date) // Format date for compatibility
      }); // Make sure this matches the response data structure
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch student data.');
    }
  };
  // Get staff by Id
  useEffect(() => {
    if (staffId) {
      fetchStaffData();
    }
  }, [staffId]);

  const handleUpdClose = () => {
    handleUclose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`http://localhost:8009/api/updatesalary/${salaryUid}`, salary, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
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

  if (!salary) {
    return null; // Return null or a loading indicator until the student data is fetched
  }

  return (
    <>
      <Modal show={show} onHide={handleUpdClose}>
        <Modal.Header closeButton className="theme-bg">
          <Modal.Title style={{ color: 'white' }}>Update Salary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={12}>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3 row">
                  <Form.Group className="col-12 col-md-6 mb-3 mb-md-0">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="staffId"
                      value={salary.staffId ? salary.staffId.name : ''}
                      onChange={handleinputChange}
                      id="staffId"
                      autoComplete="staffId"
                      placeholder="Enter Full Name..."
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group className="col-12 col-md-6">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                      type="number"
                      name="amount"
                      value={salary.amount}
                      onChange={handleinputChange}
                      autoComplete="amount"
                      id="email"
                      placeholder="Enter Amount..."
                      required
                    />
                  </Form.Group>
                </Form.Group>

                <Form.Group className="mb-3 row">
                  <Form.Group className="col-12 col-md-6 mb-3 mb-md-0">
                    <Form.Label>Note</Form.Label>
                    <Form.Control
                      type="text"
                      name="note"
                      value={salary.note}
                      onChange={handleinputChange}
                      autoComplete="note"
                      id="note"
                      placeholder="Enter Your Note..."
                      required
                    />
                  </Form.Group>
                  <Form.Group className="col-12 col-md-6">
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="date"
                      value={salary.date}
                      onChange={handleinputChange}
                      id="date"
                      autoComplete="date"
                      placeholder="Date..."
                      required
                    />
                  </Form.Group>
                </Form.Group>

                <Modal.Footer>
                  <Button variant="primary" className="theme-bg" type="submit">
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
