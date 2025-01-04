import React, { useEffect, useState } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

const AddCards = () => {
  const [value, setValue] = useState({
    studentid: '',
    amount: '',
    status: '',
    date: '',
    cardno: '',
    cardenddate: '',
    payableamount: "",
    paidamount: ""
  });

  //Get Staff Name
  const [studentlist, setStudentList] = useState([]);

  const getStudentList = async () => {
    try {
      const res = await axios.get('http://localhost:8009/api/getstudent');
      setStudentList(res.data.students);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getStudentList();
  }, []);

  const handleOnchange = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setValue({
      studentid: '',
      amount: '',
      status: '',
      date: '',
      cardno: '',
      cardenddate: '',
      payableamount: "",
      paidamount: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:8009/api/createcard', value, {
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
        <Card.Title as="h5">Add Card</Card.Title>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={12}>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3 row">
                <Form.Group className="col-12 col-md-6" controlId="formBasicBranch">
                  <Form.Label>Select Student</Form.Label>
                  <Form.Control as="select" name="studentid" onChange={handleOnchange} value={value.studentid}>
                    <option value="">--Select Student--</option>
                    {studentlist.map((student) => (
                      <option key={student._id} value={student._id}>
                        {student.fullname}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group className="col-12 col-md-6">
                  <Form.Label>Card No.</Form.Label>
                  <Form.Control
                    type="text"
                    name="cardno"
                    value={value.cardno}
                    onChange={handleOnchange}
                    placeholder="Enter Card No..."
                    readOnly
                  />
                </Form.Group>
              </Form.Group>
              <Form.Group className="mb-3 row">
                <Form.Group className="col-12 col-md-6">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control type="date" name="date" value={value.date} onChange={handleOnchange} required />
                </Form.Group>
                <Form.Group className="col-12 col-md-6">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="cardenddate"
                    value={value.cardenddate}
                    onChange={handleOnchange}
                    required
                  />
                </Form.Group>
              </Form.Group>
              {value.cardenddate ? (
                <Form.Group className="mb-3 row">
                <Form.Group className="col-12 col-md-6">
                  <Form.Label>Payable Amount</Form.Label>
                  <Form.Control type="number" name="payableamount" value={value.payableamount}  readOnly />
                </Form.Group>
                <Form.Group className="col-12 col-md-6">
                  <Form.Label>Paid Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="paidamount"
                    value={value.paidamount}
                    onChange={handleOnchange}
                    required
                  />
                </Form.Group>
              </Form.Group>
              ) : ''}
              {value.paidamount ? (
                <Form.Group className="mb-3 row">
                <Form.Group className="col-12 col-md-6">
                  <Form.Label>Due Amount</Form.Label>
                  <Form.Control type="number" name=""  readOnly />
                </Form.Group>
                <Form.Group className="col-12 col-md-6">
                  <Form.Label>Status</Form.Label>
                  <Form.Control
                    type="number"
                    name=""
                    readOnly
                  />
                </Form.Group>
              </Form.Group>
              ) : ''}

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

export default AddCards;
