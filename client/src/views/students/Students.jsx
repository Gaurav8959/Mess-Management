import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '../combine.css';
import { Row, Col, Form, Tabs, Button, Tab, Card, Table, Pagination, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const Students = () => {
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

  //Get Student
  const [data, setData] = useState([]);

  useEffect(() => {
    async function FecthData() {
      try {
        const student = await axios.get('/api/getstudent');
        const res = student.data;
        setData(res);
      } catch (error) {
        console.log(error);
      }
    }
    FecthData();
  }, [data]);

  //Delete Student Logic
  const [del, setDel] = useState(false);
  const [stdid, setStdId] = useState(null);
  const handledelClose = () => {
    setDel(false);
    setStdId(false);
  }

  const handledelete = (id) => {
    setDel(true);
    setStdId(id);
    //console.log(stdid);
  } 
const handlecnfrm = async() => {
  await DeleteStudent(stdid);
  setDel(false);
  setStdId(null);
}
  const DeleteStudent = async(id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(`/api/deletestd/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.status === 200 ){
        toast.success(res.data.message);
      }else{
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error(error.message);
    }
  };



  //Pageing Logic
  let active = 3;
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
    <React.Fragment>
      <Row>
        <Col>
          <h5 className="mt-4">Add, Manage & Update Students</h5>
          <hr />
          {/* Update Model */}
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton className='theme-bg'>
              <Modal.Title style={{color: 'white'}}>Update Student</Modal.Title>
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
            <Modal.Header closeButton className='modelstyle'>
              <Modal.Title style={{color: 'white'}}>Student Details</Modal.Title>
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
          <Modal show={del} onHide={handledelClose}>
            <Modal.Header closeButton className='theme-bg2'>
              <Modal.Title style={{color: 'white'}}>Update Student</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{color: 'red'}}>ARE YOU SURE TO DELETE</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handledelClose}>
                No
              </Button>
              <Button variant="primary" onClick={handlecnfrm}>
                Yes
              </Button>
            </Modal.Footer>
          </Modal>

          <Tabs variant="pills" defaultActiveKey="all-students" className="mb-3 tab-pill-center">
            <Tab eventKey="all-students" title="STUDENT">
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
                                    elem.profilephoto
                                      ? `/src/assets/images/students/${elem.profilephoto}`
                                      : `/src/assets/images/user/avatar-1.jpg` // Fallback to default image
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
                            <td colSpan="5" className="text-center">
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
            </Tab>
            <Tab eventKey="add-student" title="ADD-STUDENT">
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
                        <ToastContainer />
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Students;
