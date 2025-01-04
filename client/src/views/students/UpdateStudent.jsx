import Modal from 'react-bootstrap/Modal';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../combine.css';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

const UpdateStudent = ({ show, handleUclose, studentUid }) => {
  const emptyStudent = {
    fullname: '',
    fathername: '',
    password: '',
    roomno: '',
    branch: '',
    mobile: '',
    year: '',
    email: '',
  }
  const [student, setStudent] = useState(emptyStudent);
  const [profilePhoto, setProfilePhoto] = useState(null); // New state for file input


  const handleinputChange = (e) => {
    const {name, value} = e.target;
    setStudent({...student, [name]: value});
  }
  const handleFileChange = (e) => {
    setProfilePhoto(e.target.files[0]); // Handle file input
  };

  // Get Student by Id
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const res = await axios.get(`http://localhost:8009/api/getstudent?stdId=${studentUid}`);
        setStudent(res.data.students); // Make sure this matches the response data structure
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch student data.");
      }
    };

    if (studentUid) {
      fetchStudentData();
    }
  }, [studentUid]);

  const handleUpdClose = () => {
    handleUclose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      Object.keys(student).forEach((key) => {
        formData.append(key, student[key]);
      });
      if (profilePhoto) {
        formData.append('profilephoto', profilePhoto);
      }
      const res = await axios.put(`http://localhost:8009/api/updatestudent/${studentUid}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.status === 200) {
        toast.success(res.data.message);
        handleUclose();
      }else{
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
  }

  if (!student) {
    return null; // Return null or a loading indicator until the student data is fetched
  }

  return (
    <>
      <Modal show={show} onHide={handleUpdClose}>
        <Modal.Header closeButton className="theme-bg2">
          <Modal.Title style={{ color: 'white' }}>Update Student</Modal.Title>
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
                      name="fullname"
                      value={student.fullname}
                      onChange={handleinputChange}
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
                      value={student.fathername}
                      onChange={handleinputChange}
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
                      value={student.email}
                      onChange={handleinputChange}
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
                      value={student.password}
                      onChange={handleinputChange}
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
                      value={student.roomno}
                      onChange={handleinputChange}
                      id="roomno"
                      autoComplete="roomno"
                      placeholder="Enter Your Room No..."
                      required
                    />
                  </Form.Group>
                  <Form.Group className="col-12 col-md-6" controlId="formBasicBranch">
                    <Form.Label>Select Branch</Form.Label>
                    <Form.Control as="select" name="branch" onChange={handleinputChange} value={student.branch}>
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
                      value={student.mobile}
                      onChange={handleinputChange}
                      id="mobile"
                      autoComplete="mobile"
                      placeholder="Enter Your Mobile No..."
                      required
                    />
                  </Form.Group>
                  <Form.Group className="col-12 col-md-6">
                    <Form.Label>Academic Year</Form.Label>
                    <Form.Control
                      type="number"
                      name="year"
                      value={student.year}
                      onChange={handleinputChange}
                      autoComplete="year"
                      id="year"
                      placeholder="Enter Academic Year..."
                      required
                    />
                  </Form.Group>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Upload Profile</Form.Label>
                  <Form.Control type="file" name="profilephoto" onChange={handleFileChange} id="profilephoto" />
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

export default UpdateStudent;
