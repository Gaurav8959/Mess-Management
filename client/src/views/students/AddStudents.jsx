import React, { useState, useRef } from 'react';
import axios from 'axios';
import '../combine.css';
import { Row, Col, Form, Button, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';

const AddStudents = () => {
  //Add Student Logic
  const [value, setValue] = useState({
    fullname: '',
    fathername: '',
    email: '',
    mobile: '',
    roomno: '',
    branch: '',
    year: '',
    profilephoto: null, // Change this to null for file handling
    password: ''
  });

  const handleOnchange = (e) => {
    const { name, value: inputValue, files } = e.target;

    if (name === 'profilephoto' && files) {
      const file = files[0];
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only JPEG and PNG files are allowed');
        return;
      }
    }

    setValue((prev) => ({
      ...prev,
      [name]: files ? files[0] : inputValue
    }));
  };
  const fileInputRef = useRef(null);

  const restForm = () => {
    setValue({
      fullname: '',
      fathername: '',
      email: '',
      mobile: '',
      roomno: '',
      branch: '',
      year: '',
      profilephoto: null, // Reset file input
      password: ''
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      Object.keys(value).forEach((key) => {
        formData.append(key, value[key]);
      });

      const res = await axios.post('http://localhost:8009/api/createstudent', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.status === 200) {
        toast.success(res.data.message);
        restForm();
      } else {
        toast.error(res.data.message || 'An error occurred');
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || 'Server error occurred');
      } else {
        toast.error('Internal server error');
      }
      console.error(error);
    }
  }; //Add Student Logic ens here
  return (
    <>
      <Col sm={12}>
        <Card>
          <Card.Header>
            <Card.Title as="h5">Add Student</Card.Title>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={12}>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3 row">
                    <Form.Group className="col-12 col-md-6 mb-3 mb-md-0">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="fullname"
                        value={value.fullname}
                        onChange={handleOnchange}
                        id="fullname"
                        autoComplete="name"
                        placeholder="Enter Full Name..."
                        required
                      />
                    </Form.Group>
                    <Form.Group className="col-12 col-md-6">
                      <Form.Label>Father Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="fathername"
                        value={value.fathername}
                        onChange={handleOnchange}
                        autoComplete="family-name"
                        id="fathername"
                        placeholder="Enter Father Name..."
                        required
                      />
                    </Form.Group>
                  </Form.Group>

                  <Form.Group className="mb-3 row">
                    <Form.Group className="col-12 col-md-6 mb-3 mb-md-0">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={value.email}
                        onChange={handleOnchange}
                        autoComplete="email"
                        id="email"
                        placeholder="Enter Your Email..."
                        required
                      />
                    </Form.Group>
                    <Form.Group className="col-12 col-md-6">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={value.password}
                        onChange={handleOnchange}
                        id="password"
                        autoComplete="password"
                        placeholder="Password..."
                        required
                      />
                    </Form.Group>
                  </Form.Group>

                  <Form.Group className="mb-3 row">
                    <Form.Group className="col-12 col-md-6 mb-3 mb-md-0">
                      <Form.Label>Room No.</Form.Label>
                      <Form.Control
                        type="text"
                        name="roomno"
                        value={value.roomno}
                        onChange={handleOnchange}
                        id="roomno"
                        autoComplete="roomno"
                        placeholder="Enter Your Room No..."
                        required
                      />
                    </Form.Group>
                    <Form.Group className="col-12 col-md-6" controlId="formBasicBranch">
                      <Form.Label>Select Branch</Form.Label>
                      <Form.Control as="select" name="branch" onChange={handleOnchange} value={value.branch}>
                        <option value="">--Select Branch--</option>
                        <option value="CS">CS</option>
                        <option value="IT">IT</option>
                        <option value="EC">EC</option>
                        <option value="EX">EX</option>
                        <option value="MCA">MCA</option>
                        <option value="Mpharma">Mpharma</option>
                        <option value="Polytechnic">Polytechnic</option>
                      </Form.Control>
                    </Form.Group>
                  </Form.Group>

                  <Form.Group className="mb-3 row">
                    <Form.Group className="col-12 col-md-6 mb-3 mb-md-0">
                      <Form.Label>Mobile No.</Form.Label>
                      <Form.Control
                        type="number"
                        name="mobile"
                        value={value.mobile}
                        onChange={handleOnchange}
                        id="mobile"
                        autoComplete="mobile"
                        placeholder="Enter Your Mobile No..."
                        required
                      />
                    </Form.Group>
                    <Form.Group className="col-12 col-md-6">
                      <Form.Label>Acadmic Year</Form.Label>
                      <Form.Control
                        type="number"
                        name="year"
                        value={value.year}
                        onChange={handleOnchange}
                        autoComplete="year"
                        id="year"
                        placeholder="Enter Achademic Year..."
                        required
                      />
                    </Form.Group>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Upload Profile</Form.Label>
                    <Form.Control type="file" ref={fileInputRef} name="profilephoto" onChange={handleOnchange} id="profilephoto" />
                  </Form.Group>

                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </Form>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
};

export default AddStudents;
