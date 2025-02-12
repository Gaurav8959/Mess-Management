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
    roomno: '',
    branch: '',
    mobile: '',
    year: '',
    email: ''
  };

  const [student, setStudent] = useState(emptyStudent);
  const [profilePhoto, setProfilePhoto] = useState(null); // New state for file input
  const [previewPhoto, setPreviewPhoto] = useState(null); // For showing preview before upload
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Student Data by ID
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const res = await axios.get(`/api/getstudent?stdId=${studentUid}`);
        setStudent(res.data.students);
        setPreviewPhoto(res.data.students.profilephoto); // Set current profile photo
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch student data.');
      }
    };

    if (studentUid) {
      fetchStudentData();
    }
  }, [studentUid]);

  // Handle input field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudent({ ...student, [name]: value });
  };

  // Handle profile photo change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePhoto(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewPhoto(reader.result); // Show preview
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      // Append form fields except password (only send if updated)
      Object.keys(student).forEach((key) => {
        if (key !== 'password' || student[key]) {
          formData.append(key, student[key]);
        }
      });

      // Append only if a new profile photo is selected
      if (profilePhoto) {
        formData.append('profilephoto', profilePhoto);
      }

      const res = await axios.put(`/api/updatestudent/${studentUid}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.status === 200) {
        toast.success(res.data.message);
        setStudent(res.data.student); // Update student data
        setPreviewPhoto(res.data.student.profilephoto); // Update preview only if changed
        handleUclose();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Internal server error');
    }
    setIsLoading(false);
  };

  if (!student) return null;

  return (
    <>
      <Modal show={show} onHide={handleUclose}>
        <Modal.Header closeButton className="theme-bg">
          <Modal.Title style={{ color: 'white' }}>Update Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={12}>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3 row">
                  <Col md={6}>
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="fullname"
                      value={student.fullname}
                      onChange={handleInputChange}
                      placeholder="Enter Full Name..."
                      required
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Father Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="fathername"
                      value={student.fathername}
                      onChange={handleInputChange}
                      placeholder="Enter Father Name..."
                      required
                    />
                  </Col>
                </Form.Group>

                <Form.Group className="mb-3 row">
                  <Col md={6}>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={student.email}
                      onChange={handleInputChange}
                      placeholder="Enter Your Email..."
                      required
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={student.password || ''}
                      onChange={handleInputChange}
                      placeholder="Enter New Password..."
                    />
                  </Col>
                </Form.Group>

                <Form.Group className="mb-3 row">
                  <Col md={6}>
                    <Form.Label>Room No.</Form.Label>
                    <Form.Control
                      type="text"
                      name="roomno"
                      value={student.roomno}
                      onChange={handleInputChange}
                      placeholder="Enter Your Room No..."
                      required
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Select Branch</Form.Label>
                    <Form.Control as="select" name="branch" onChange={handleInputChange} value={student.branch}>
                      <option value="">--Select Branch--</option>
                      <option value="CS">CS</option>
                      <option value="IT">IT</option>
                      <option value="EC">EC</option>
                      <option value="EX">EX</option>
                      <option value="MCA">MCA</option>
                      <option value="Mpharma">Mpharma</option>
                      <option value="Polytechnic">Polytechnic</option>
                    </Form.Control>
                  </Col>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Upload Profile</Form.Label>
                  <Form.Control type="file" name="profilephoto" value={student.profilePhoto} onChange={handleFileChange} accept="image/*" />
                  {previewPhoto && <img src={previewPhoto} alt="Profile Preview" width="120px" height="120px" className="mt-2 rounded" />}
                </Form.Group>

                <Modal.Footer>
                  <Button variant="primary" className="theme-bg" type="submit" disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Submit'}
                  </Button>
                  <Button variant="secondary" onClick={handleUclose}>
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
