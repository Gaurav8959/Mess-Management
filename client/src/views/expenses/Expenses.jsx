import React from 'react';
import { Row, Col, Tabs, Tab } from 'react-bootstrap';
import AllExpenses from './AllExpenses';
import AddExpenses from './AddExpenses';
import { ToastContainer } from 'react-toastify';

const Expenses = () => {
  return (
    <Row>
      <Col>
        <h5 className="mt-4">Add, Manage & Update Expenses</h5>
        <hr />
        <Tabs variant="pills" defaultActiveKey="all-expenses" className="mb-3 tab-pill-center">
          <Tab eventKey="all-expenses" title="All-Expenses">
            <AllExpenses />
          </Tab>
          <Tab eventKey="add-expenses" title="PAY-Expenses">
            <AddExpenses />
          </Tab>
        </Tabs>
        <ToastContainer />
      </Col>
    </Row>
  );
};

export default Expenses;
