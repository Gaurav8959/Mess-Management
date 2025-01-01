import React, { useState } from 'react';
import axios from 'axios';
import '../combine.css';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

const DeleteStudent = ({ show, studentId,handleClose }) => {
  //Delete Student

  const Delete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(`/api/deletestd/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.data.success === true) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error(error.res.data.message || 'An error occurred');
    }
  };

//   const [del, setDel] = useState(show);
//   const [stdid, setStdId] = useState(studentId);
  const handledelClose = () => {
    handleClose();
  };

  const handlecnfrm = async () => {
    await Delete(studentId);
    handleClose();
  };

  return (
    <>
      <Modal show={show} onHide={handledelClose}>
        <Modal.Header closeButton className="theme-bg2">
          <Modal.Title style={{ color: 'white' }}>Delete Student</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: 'red' }}>ARE YOU SURE TO DELETE</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handledelClose}>
            No
          </Button>
          <Button variant="primary" onClick={handlecnfrm}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteStudent;
