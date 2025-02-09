import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const AttendanceDetails = () => {
  const { stdId } = useParams(); // Get student ID from URL
  const [data, setData] = useState(null); // Store a single student object instead of an array

  // Fetch data from the API
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:8009/api/getcard?stdId=${stdId}`);
      const cardsData = response.data.cards.filter(card => card.status === "Paid");
      if (cardsData.length > 0) {
        setData(cardsData[0]); // Set only the first matched record
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (stdId) {
      fetchData();
    }
  }, [data]); // Re-fetch if student ID changes

  return (
    <Row>
      <Col>
        <Card>
          <Card.Header>
            <Card.Title as="h5">Attendance Details</Card.Title>
            <span className="d-block m-t-5">
              <code>{data ? data.studentid.fullname : "Loading..."}</code>
            </span>
          </Card.Header>
          <Card.Body>
            <Table responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Meal Type</th>
                </tr>
              </thead>
              <tbody>
                {data && data.meals ? (
                  Object.keys(data.meals).map((date, index) => (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>{new Date(date).toLocaleDateString("en-GB")}</td>
                      <td>{data.meals[date].join(", ")}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No attendance records found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default AttendanceDetails;
