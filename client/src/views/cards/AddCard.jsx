import React, { useEffect, useState } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import Select from 'react-select'; // Import react-select

const AddCards = () => {
  const [numcard, setNumcard] = useState(0);
  const [monthnum, seMonthNum] = useState();

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

  // Card No. creation
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const generateCardNo = async () => {
    const date = new Date();
    let month = months[date.getMonth()];
    let val = numcard + 1;
    setValue((prev) => ({ ...prev, cardno: `${month}-${val}` }));
  };

  const getCardNo = async () => {
    try {
      const cardcountnum = await axios.get('/api/cardcountget');
      setNumcard(cardcountnum.data.cardcount[0].cardcount);
      seMonthNum(cardcountnum.data.cardcount[0].lastUpdatedMonth);
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    getCardNo();
    getStudentList();
  }, []);

  useEffect(() => {
    if (monthnum && monthnum !== new Date().getMonth() + 1) {
      monthupd();
    }
  }, [monthnum]);

  useEffect(() => {
    generateCardNo();
  }, [numcard]);

  // Count payable amount
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

  // Get Student List
  const [studentlist, setStudentList] = useState([]);
  const [options, setOptions] = useState([]); // Options for react-select

  const getStudentList = async () => {
    try {
      const res = await axios.get('/api/getstudent');
      setStudentList(res.data.students);
      // Transform student list to options format for react-select
      const studentOptions = res.data.students.map(student => ({
        value: student._id,
        label: student.fullname
      }));
      setOptions(studentOptions);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnchange = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value
    });
  };

  const handleStudentChange = (selectedOption) => {
    setValue({
      ...value,
      studentid: selectedOption ? selectedOption.value : ''
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

  const monthupd = async () => {
    try {
      let currentmnth = new Date().getMonth() + 1;
      const updatemnth = await axios.put(`/api/cardcount/677963a976ba3326d3b2ea74`, {
        cardcount: 0,
        lastUpdatedMonth: currentmnth
      });
      if (updatemnth.data.success) {
        console.log("✅ Month & count Updated Successfully!");
        await getCardNo(); // Fetch the latest data again
      } else {
        console.log("❌ Failed to update lastUpdatedMonth");
      }
    } catch (error) {
      console.log("Error Updating Month:", error.response ? error.response.data : error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authorization token is missing. Please log in again.');
        return;
      }

      const res = await axios.post('/api/createcard', value, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast.success(res.data.message);

      if (res.data.success === true) {
        try {
          const updateres = await axios.put(`/api/cardcount/677963a976ba3326d3b2ea74`, {
            cardcount: numcard + 1,
          });

          if (updateres.data.success) {
            resetForm();
            await getCardNo();
          } else {
            toast.error('Failed to update card count');
          }
        } catch (error) {
          if (error.response) {
            toast.error(error.response.data.message || 'Server error occurred');
          } else {
            toast.error('Internal server error');
          }
          console.error(error);
        }
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || 'Something went wrong. Please try again.');
      } else {
        toast.error('Network error or server is unreachable');
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
                  <Select
                    options={options}
                    value={options.find(option => option.value === value.studentid)}
                    onChange={handleStudentChange}
                    placeholder="--Select Student--"
                    isClearable
                  />
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