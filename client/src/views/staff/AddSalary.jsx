import React, { useEffect, useState } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import Select from 'react-select';

const AddSalary = () => {
  const [value, setValue] = useState({
    staffId: '',
    date: '',
    amount: '',
    note: ''
  });

  // Get Staff Name
  const [stafflist, setStaffList] = useState([]);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const getStaffList = async () => {
      try {
        const res = await axios.get('/api/getstaff');
        setStaffList(res.data.staffs);
        // Transform staff list to options format for react-select
        const staffOptions = res.data.staffs.map(staff => ({
          value: staff._id,
          label: staff.name
        }));
        setOptions(staffOptions);
      } catch (error) {
        console.log(error);
      }
    };
    getStaffList();
  }, []);

  const handleOnchange = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value
    });
  };

  const handleStaffChange = (selectedOption) => {
    setValue({
      ...value,
      staffId: selectedOption ? selectedOption.value : ''
    });
  };

  const resetForm = () => {
    setValue({
      staffId: '',
      date: '',
      amount: '',
      note: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/staffsalary', value, {
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
        <Card.Title as="h5">Add Salary</Card.Title>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={12}>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3 row">
                <Form.Group className="col-12 col-md-6" controlId="formBasicBranch">
                  <Form.Label>Select Staff</Form.Label>
                  <Select
                    options={options}
                    value={options.find(option => option.value === value.staffId)}
                    onChange={handleStaffChange}
                    placeholder="--Select Staff--"
                    isClearable
                  />
                </Form.Group>
                <Form.Group className="col-12 col-md-6">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="amount"
                    value={value.amount}
                    onChange={handleOnchange}
                    placeholder="Enter Amount..."
                    required
                  />
                </Form.Group>
              </Form.Group>
              <Form.Group className="mb-3 row">
                <Form.Group className="col-12 col-md-6">
                  <Form.Label>Note</Form.Label>
                  <Form.Control type="text" name="note" value={value.note} onChange={handleOnchange} placeholder="Enter Note..." required />
                </Form.Group>
                <Form.Group className="col-12 col-md-6">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={value.date}
                    onChange={handleOnchange}
                    placeholder="Select Date..."
                    required
                  />
                </Form.Group>
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

export default AddSalary;