import React, { useEffect, useState } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

const AddCards = () => {
  const [numcard, setNumcard] = useState(0);

  const [value, setValue] = useState({
    studentid: '',
    status: '',
    date: '',
    cardno: '',
    cardenddate: '',
    payableamount: '',
    paidamount: '',
    dueamount: ''
  });

  //Card No. creation
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const generateCardNo = async () => {
    const date = new Date();
    let month = months[date.getMonth()];
    value.cardno = `${month}` + '-' + numcard;

    setNumcard(numcard + 1);
    console.log(numcard);
  };
  
  
  useEffect(() => {
    const getCardNo = async () => {
      try {
        const cardcountnum = await axios.get('http://localhost:8009/api/cardcountget');
        setNumcard(cardcountnum.data.cardcount[0].cardcount);
        console.log(cardcountnum.data.cardcount[0].cardcount);
        console.log(numcard);
      } catch (error) {
        return error;
      }
    };
    getCardNo();
    
  }, []);


  //Count payable amount
  const payable = (date, cardenddate) => {
    let amt = 0; // Initialize amt
    const startDate = new Date(date);
    const endDate = new Date(cardenddate);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1; // Calculate days

    if (days <= 15) {
      amt = days * 100;
    } else {
      amt = days * 84;
    }

    return amt;
  };

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
      status: '',
      date: '',
      cardno: '',
      cardenddate: '',
      payableamount: '',
      paidamount: '',
      dueamount: ''
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
    try {
      const res = await axios.put(`http://localhost:8009/api/cardcount/677963a976ba3326d3b2ea74`, numcard);
      if (res.status === 200) {
        toast.success(res.data.message);
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
                  <Form.Control type="date" name="cardenddate" value={value.cardenddate} onChange={handleOnchange} required />
                </Form.Group>
              </Form.Group>

              {value.cardenddate
                ? ((value.payableamount = payable(value.date, value.cardenddate)),
                  (
                    <Form.Group className="mb-3 row">
                      <Form.Group className="col-12 col-md-6">
                        <Form.Label>Payable Amount</Form.Label>
                        <Form.Control type="number" name="payableamount" value={value.payableamount} onChange={handleOnchange} readOnly />
                      </Form.Group>
                      <Form.Group className="col-12 col-md-6">
                        <Form.Label>Paid Amount</Form.Label>
                        <Form.Control type="number" name="paidamount" value={value.paidamount} onChange={handleOnchange} required />
                      </Form.Group>
                    </Form.Group>
                  ))
                : ''}
              {value.paidamount ? (
                <Form.Group className="mb-3 row">
                  <Form.Group className="col-12 col-md-6">
                    <Form.Label>Due Amount</Form.Label>
                    <Form.Control
                      type="number"
                      name="dueamount"
                      value={(value.dueamount = value.payableamount - value.paidamount)}
                      onChange={handleOnchange}
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group className="col-12 col-md-6">
                    <Form.Label>Status</Form.Label>
                    <Form.Control
                      type="text"
                      name="status"
                      value={(value.status = value.dueamount ? 'Unpaid' : 'Paid')}
                      onChange={handleOnchange}
                      readOnly
                    />
                  </Form.Group>
                </Form.Group>
              ) : (
                ''
              )}

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
