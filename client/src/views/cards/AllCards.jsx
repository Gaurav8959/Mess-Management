import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../combine.css';
import { Col, Card, Table, Pagination, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DeleteCard from './DeleteCard';
import UpdateCard from './UpdateCard';

const AllSalary = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cardIdToDelete, setCardIdToDelete] = useState(null);
  const [showUpdateModel, setShowUpdateModel] = useState(false);
  const [stdUid, setStdUid] = useState(null);
  const [cardId, setCardId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cards = await axios.get('http://localhost:8009/api/getcard');
        const res = cards.data;
        setData(res.cards || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [data]);

  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // Adjust locale as needed ('en-US' for MM/DD/YYYY, 'en-GB' for DD/MM/YYYY)
  };

  const filteredData = data.filter((cards) => cards.status.toLowerCase().includes(searchQuery.toLowerCase()));

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = (id) => {
    setCardIdToDelete(id);
    setShowDeleteModal(true);
  };
  const handleUpdate = (stdUid, cardId) => {
    if (stdUid && cardId) {
      setStdUid(stdUid);
      setCardId(cardId);
      setShowUpdateModel(true);
    }
  };

  return (
    <>
      <UpdateCard show={showUpdateModel} handleUclose={() => setShowUpdateModel(false)} CardUId={cardId} StdUid={stdUid} />

      <DeleteCard show={showDeleteModal} handleClose={() => setShowDeleteModal(false)} cardId={cardIdToDelete} />

      <Col xs={12} md={12} lg={12} className="mb-4">
        <Card className="Recent-Users widget-focus-lg shadow-lg">
          <Card.Header className="d-flex justify-content-between mobile-flex-container align-items-center">
            <Card.Title as="h5">All Cards</Card.Title>
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
                    <th>Student-Name</th>
                    <th>Card No.</th>
                    <th>Amount</th>
                    <th>Card-Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((cards, index) => (
                      <tr key={cards.id || index} className="unread">
                        <td>{startIndex + index + 1}</td>
                        <td>
                          <h6 className="mb-1">{cards.studentid.fullname}</h6>
                        </td>
                        <td>
                          <h6 className="mb-1">{cards.cardno}</h6>
                        </td>
                        <td>
                          <h6 className="mb-1">Paid: {cards.paidamount}</h6>
                          <h6 className="mb-1">Due: {cards.dueamount}</h6>
                        </td>
                        <td>
                          <h6 className="mb-1">Start Date:{formatDate(cards.date)}</h6>
                          <h6 className="mb-1">End Date:{formatDate(cards.cardenddate)}</h6>
                        </td>
                        <td>
                          {cards.status === 'Paid' ? (
                            <>
                              <i className="fa fa-circle text-c-green f-10 m-r-15" /> Paid
                            </>
                          ) : cards.status === 'Hold' ? (
                            <>
                              <i className="fa fa-circle text-c-yellow f-10 m-r-15" /> Hold
                            </>
                          ) : (
                            <>
                              <i className="fa fa-circle text-c-red f-10 m-r-15" /> Unpaid
                            </>
                          )}
                        </td>
                        <td>
                          <Link
                            to="#"
                            className="label theme-bg text-white f-12"
                            onClick={() => handleUpdate(cards.studentid._id, cards._id)}
                          >
                            Update
                          </Link>
                          <Link to="#" className="label theme-bg5 text-white f-12" onClick={() => handleDelete(cards._id)}>
                            Delete
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center" style={{ color: 'red' }}>
                        No Cards found.
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

export default AllSalary;
