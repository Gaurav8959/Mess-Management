import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../combine.css';
import { Col, Card, Table, Pagination, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DeleteStudent from './DeleteStudent';
import UpdateStudent from './UpdateStudent';

const AllStudents = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentIdToDelete, setStudentIdToDelete] = useState(null);
  const [info, setInfo] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showUpdateModel, setShowUpdateModel] = useState(false);
  const [studentUid, setstUdentUid] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const student = await axios.get('/api/getstudent');
        const res = student.data;
        setData(res.students || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [data]);

  const filteredData = data.filter((student) => student.fullname.toLowerCase().includes(searchQuery.toLowerCase()));

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = (id) => {
    setStudentIdToDelete(id);
    setShowDeleteModal(true);
  };
  const handleUpdate = (stdUid) => {
    if(stdUid){
    setstUdentUid(stdUid);
    setShowUpdateModel(true);
    }
  }

  const handleView = (student) => {
    setSelectedStudent(student);
    setInfo(true);
  };

  const closeInfoModal = () => {
    setInfo(false);
    setSelectedStudent(null);
  };

  return (
    <>
      <Modal show={info} onHide={closeInfoModal}>
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
                <strong>Mobile No.:</strong> {selectedStudent.mobile}
              </p>
              <p>
                <strong>Room No.:</strong> {selectedStudent.roomno}
              </p>
              <p>
                <strong>Branch Name:</strong> {selectedStudent.branch}
              </p>
              <p>
                <strong>Academic Year:</strong> {selectedStudent.year}
              </p>
            </div>
          ) : (
            <p>Loading student details...</p>
          )}
        </Modal.Body>
      </Modal>

      <UpdateStudent show={showUpdateModel} handleUclose={() => setShowUpdateModel(false)} studentUid={studentUid}/>

      <DeleteStudent show={showDeleteModal} handleClose={() => setShowDeleteModal(false)} studentId={studentIdToDelete} />

      <Col xs={12} md={12} lg={12} className="mb-4">
        <Card className="Recent-Users widget-focus-lg shadow-lg">
          <Card.Header className="d-flex justify-content-between mobile-flex-container align-items-center">
            <Card.Title as="h5">All Students</Card.Title>
            <Form.Control
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-bar w-auto w-md-auto allstd"
            />
          </Card.Header>
          <Card.Body className="px-0 py-2">
            <div className="table-responsive">
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
                  {paginatedData.length > 0 ? (
                    paginatedData.map((student, index) => (
                      <tr key={student.id || index} className="unread">
                        <td>{startIndex + index + 1}</td>
                        <td>
                          <img
                            className="rounded-circle"
                            style={{ width: '40px', height: '40px' }}
                            src={
                              student.profilephoto
                                ? `/src/assets/images/students/${student.profilephoto}`
                                : `/src/assets/images/user/avatar-1.jpg`
                            }
                            alt={student.fullname || 'Student'}
                          />
                        </td>
                        <td>
                          <h6 className="mb-1">{student.fullname}</h6>
                        </td>
                        <td>
                          <Link to="#" className="label theme-bg3 text-white f-12" onClick={() => handleView(student)}>
                            View
                          </Link>
                        </td>
                        <td>
                          <Link to="#" className="label theme-bg text-white f-12" onClick={() => handleUpdate(student._id)}>
                            Update
                          </Link>
                          <Link to="#" className="label theme-bg5 text-white f-12" onClick={() => handleDelete(student._id)}>
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
            </div>
            <Pagination className="justify-content-center">
              <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
              <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => handlePageChange(index + 1)}>
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
              <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
            </Pagination>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
};

export default AllStudents;
