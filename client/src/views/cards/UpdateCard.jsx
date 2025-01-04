import Modal from 'react-bootstrap/Modal';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../combine.css';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

const UpdateCard = ({ show, handleUclose, CardUid }) => {
  const emptyCard = {
    startdate: '',
    enddate: '',
    extendays: ''
  };
  const [card, setCard] = useState(emptyCard);

  const calculateDifferenceInDays = (startdate, enddate) => {
    if (!startdate || !enddate) return '';
    const start = new Date(startdate);
    const end = new Date(enddate);
    const differenceInMs = end - start;
    return differenceInMs >= 0 ? Math.ceil(differenceInMs / (1000 * 60 * 60 * 24)) : '';
  };

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        const res = await axios.get(`http://localhost:8009/api/getcard?cardId=${CardUid}`);
        const fetchedCard = res.data.cards;
        const formattedCard = {
          ...fetchedCard,
          startdate: formatDate(fetchedCard.startdate), // Format date for compatibility
          enddate: formatDate(fetchedCard.enddate)
        };
        formattedCard.extendays = calculateDifferenceInDays(formattedCard.startdate, formattedCard.enddate);
        setCard(formattedCard);
      } catch (error) {
        console.log(error);
        toast.error('Failed to fetch card data.');
      }
    };

    if (CardUid) {
      fetchCardData();
    }
  }, [CardUid]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Extract yyyy-MM-dd
  };

  const handleinputChange = (e) => {
    const { name, value } = e.target;
    const updatedCard = { ...card, [name]: value };

    // Recalculate extendays dynamically
    if (name === 'startdate' || name === 'enddate') {
      updatedCard.extendays = calculateDifferenceInDays(updatedCard.startdate, updatedCard.enddate);
    }

    setCard(updatedCard);
  };

  const handleUpdClose = () => {
    handleUclose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`http://localhost:8009/api/extendcard/${CardUid}`, card, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.status === 200) {
        toast.success(res.data.message);
        handleUclose();
      } else {
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
  };

  return (
    <>
      <Modal show={show} onHide={handleUpdClose}>
        <Modal.Header closeButton className="theme-bg2">
          <Modal.Title style={{ color: 'white' }}>Extend Card</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={12}>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3 row">
                  <Form.Group className="col-12 col-md-6 mb-3 mb-md-0">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="startdate"
                      value={card.startdate}
                      onChange={handleinputChange}
                      id="startdate"
                      autoComplete="startdate"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="col-12 col-md-6">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="enddate"
                      value={card.enddate}
                      onChange={handleinputChange}
                      autoComplete="enddate"
                      id="enddate"
                      required
                    />
                  </Form.Group>
                </Form.Group>
                <Form.Group className="col-12 col-md-12 mb-3 mb-md-0">
                  <Form.Label>Total Days</Form.Label>
                  <Form.Control
                    type="number"
                    name="extendays"
                    value={card.extendays}
                    readOnly
                    id="extendays"
                    placeholder="Extended Days..."
                  />
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

export default UpdateCard;
