import React from 'react';
import { Row, Col, Tabs, Tab } from 'react-bootstrap';
import AllSalary from './AllSalary';
import AddSalary from './AddSalary';
import { ToastContainer } from 'react-toastify';

const Expenses = () => {
  return (
    <Row>
      <Col>
        <h5 className="mt-4">Add, Manage & Update Salary</h5>
        <hr />
        <Tabs variant="pills" defaultActiveKey="all-salary" className="mb-3 tab-pill-center">
          <Tab eventKey="all-salary" title="All-SALARY">
            <AllSalary />
          </Tab>
          <Tab eventKey="add-salary" title="PAY-SALARY">
            <AddSalary />
          </Tab>
        </Tabs>
        <ToastContainer />
      </Col>
    </Row>
  );
};

export default Expenses;
