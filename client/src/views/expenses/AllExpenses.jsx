import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../combine.css';
import { Col, Card, Table, Pagination, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DeleteExpenses from './DeleteExpenses';
import UpdateExpenses from './UpdateExpenses';

const AllStaff = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expenseIdToDelete, setExpenseIdToDelete] = useState(null);
  const [showUpdateModel, setShowUpdateModel] = useState(false);
  const [expensesUid, setExpesnsesUid] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const expenses = await axios.get('http://localhost:8009/api/readexpenses');
        const res = expenses.data;
        setData(res.expenses || []);
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

  const filteredData = data.filter((expenses) => expenses.date.toLowerCase().includes(searchQuery.toLowerCase()));

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const handleDelete = (id) => {
        setExpenseIdToDelete(id);
      setShowDeleteModal(true);
    };
  const handleUpdate = (expenseUid) => {
    if (expenseUid) {
      setExpesnsesUid(expenseUid);
      setShowUpdateModel(true);
    }
  };

  return (
    <>
      <UpdateExpenses show={showUpdateModel} handleUclose={() => setShowUpdateModel(false)} expensesUid={expensesUid} />

      <DeleteExpenses show={showDeleteModal} handleClose={() => setShowDeleteModal(false)} expenseId={expenseIdToDelete} />

      <Col xs={12} md={12} lg={12} className="mb-4">
        <Card className="Recent-Users widget-focus-lg shadow-lg">
          <Card.Header className="d-flex justify-content-between mobile-flex-container align-items-center">
            <Card.Title as="h5">All Expenses</Card.Title>
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
                    <th>Amount</th>
                    <th>Note</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((expenses, index) => (
                      <tr key={expenses.id || index} className="unread">
                        <td>{startIndex + index + 1}</td>
                        <td>
                          <h6 className="mb-1">{expenses.amount}</h6>
                        </td>
                        <td>
                          <h6 className="mb-1">{expenses.note}</h6>
                        </td>
                        <td>
                          <h6 className="mb-1">{formatDate(expenses.date)}</h6>
                        </td>
                        <td>
                          <Link to="#" className="label theme-bg2 text-white f-12" onClick={() => handleUpdate(expenses._id)}>
                            Update
                          </Link>
                          <Link to="#" className="label theme-bg text-white f-12" onClick={() => handleDelete(expenses._id)}>
                            Delete
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center" style={{ color: 'red' }}>
                        No Expenses found.
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

export default AllStaff;
