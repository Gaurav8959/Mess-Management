import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '../combine.css';
import { Col, Button, Card, Table, Pagination, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DeleteStudent from './DeleteStudent';
import NavSearch from 'layouts/AdminLayout/NavBar/NavLeft/NavSearch';

const AllStudents = () => {
  //Get Student
  const [data, setData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentIdToDelete, setStudentIdToDelete] = useState(null);

  useEffect(() => {
    async function FecthData() {
      try {
        const student = await axios.get('http://localhost:8009/api/getstudent');
        const res = student.data;
        setData(res);
      } catch (error) {
        console.log(error);
      }
    }
    FecthData();
  }, [data]);

  //Delete Student Logic
  const handledelete = (id) => {
    setStudentIdToDelete(id);
    setShowDeleteModal(true);
  };

  //Pageing Logic
  let active = 1;
  let activeItems = [];
  for (let number = 1; number <= 5; number++) {
    activeItems.push(
      <Pagination.Item key={number} active={number === active}>
        {number}
      </Pagination.Item>
    );
  }
  //Update Model
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //Info Model
  const [info, setInfo] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const handleView = (student) => {
    setSelectedStudent(student);
    setInfo(true);
  };
  const closeHandle = () => {
    setInfo(false);
    setSelectedStudent(false);
  };

  return (
    <>
      {/* Update Model */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton className="theme-bg">
          <Modal.Title style={{ color: 'white' }}>Update Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Student Details model */}
      <Modal show={info} onHide={closeHandle}>
        <Modal.Header closeButton className="modelstyle">
          <Modal.Title style={{ color: 'white' }}>Student Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStudent ? (
            <div>
              <p>
                <strong>Name:</strong> {selectedStudent.fullname}
              </p>
              <p>
                <strong>Father Name:</strong> {selectedStudent.fathername}
              </p>
              <p>
                <strong>Email:</strong> {selectedStudent.email}
              </p>
              <p>
                <strong>Mobile No. :</strong> {selectedStudent.mobile}
              </p>
              <p>
                <strong>Room No. :</strong> {selectedStudent.roomno}
              </p>
              <p>
                <strong>Branch Name:</strong> {selectedStudent.branch}
              </p>
              <p>
                <strong>Acadmic Year:</strong> {selectedStudent.year}
              </p>
            </div>
          ) : (
            <p>Loading student details...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          {/* <Button variant="secondary" onClick={closeHandle}>
                Close
              </Button> */}
        </Modal.Footer>
      </Modal>
      {/* Delete Student confirmetion popup */}
      <DeleteStudent
        show={showDeleteModal}
        handleClose={() => {
          setShowDeleteModal(false);
          setStudentIdToDelete(false);
        }}
        studentId={studentIdToDelete}
      />
      <Col md={12} xl={12}>
        <Card className="Recent-Users widget-focus-lg">
          <Card.Header>
            <Card.Title as="h5">All Students</Card.Title>
          </Card.Header>
          <Card.Body className="px-0 py-2">
            <Table responsive hover className="recent-users">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Icone</th>
                  <th>Students-Name</th>
                  <th>Students-Details</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.students && data.students.length > 0 ? (
                  data.students.map((elem, index) => (
                    <tr key={elem.id || index} className="unread">
                      <th scope="row">{index + 1}</th>
                      <td>
                        <img
                          className="rounded-circle"
                          style={{ width: '40px', height: '40px' }}
                          src={
                            elem.profilephoto ? `/src/assets/images/students/${elem.profilephoto}` : `/src/assets/images/user/avatar-1.jpg` // Fallback to default image
                          }
                          alt={elem.fullname || 'Student'}
                        />
                      </td>
                      <td>
                        <h6 className="mb-1">{elem.fullname}</h6>
                      </td>
                      <td>
                        <Link to="#" className="label theme-bg3 text-white f-12" onClick={() => handleView(elem)}>
                          View
                        </Link>
                      </td>
                      <td>
                        <Link to="#" className="label theme-bg text-white f-12" onClick={handleShow}>
                          Update
                        </Link>
                        <Link to="#" className="label theme-bg2 text-white f-12" onClick={() => handledelete(elem._id)}>
                          Delete
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center" style={{ color: 'red' }}>
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
          <Pagination style={{ justifyContent: 'center' }}>{activeItems}</Pagination>
        </Card>
      </Col>
    </>
  );
};

export default AllStudents;
