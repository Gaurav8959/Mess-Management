import React from 'react';
import '../combine.css';
import { Row, Col, Tabs, Tab } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import AllStudents from './AllStudents';
import AddStudents from './AddStudents';
const Students = () => {
  return (
    <React.Fragment>
      <Row>
        <Col>
          <h5 className="mt-4">Add, Manage & Update Students</h5>
          <hr />
          <Tabs variant="pills" defaultActiveKey="all-students" className="mb-3 tab-pill-center">
            <Tab eventKey="all-students" title="STUDENT">
              <AllStudents />
            </Tab>
            <Tab eventKey="add-student" title="ADD-STUDENT">
              <AddStudents />
            </Tab>
          </Tabs>
          <ToastContainer />
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Students;
