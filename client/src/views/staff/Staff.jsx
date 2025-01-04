import React from 'react';
import { Row, Col, Tabs, Tab } from 'react-bootstrap';
import AllStaff from './AllStaff';
import AddStaff from './AddStaff';
import { ToastContainer } from 'react-toastify';

const Staff = () => {
  return (
    <Row>
      <Col>
        <h5 className="mt-4">Add, Manage & Update Staff</h5>
        <hr />
        <Tabs variant="pills" defaultActiveKey="all-staff" className="mb-3 tab-pill-center">
          <Tab eventKey="all-staff" title="All-STAFF">
            <AllStaff />
          </Tab>
          <Tab eventKey="add-student" title="ADD-STUDENT">
            <AddStaff />
          </Tab>
        </Tabs>
        <ToastContainer />
      </Col>
    </Row>
  );
};

export default Staff;
