import React from 'react';
import { Row, Col, Tabs, Tab } from 'react-bootstrap';
import AllCards from './AllCards';
import AddCards from './AddCard';
import { ToastContainer } from 'react-toastify';

const Cards = () => {
  return (
    <Row>
      <Col>
        <h5 className="mt-4">Add, Manage & Update Cards</h5>
        <hr />
        <Tabs variant="pills" defaultActiveKey="all-cards" className="mb-3 tab-pill-center">
          <Tab eventKey="all-cards" title="All-CARDS">
            <AllCards />
          </Tab>
          <Tab eventKey="add-cards" title="ADD-CARDS">
            <AddCards />
          </Tab>
        </Tabs>
        <ToastContainer />
      </Col>
    </Row>
  );
};

export default Cards;
