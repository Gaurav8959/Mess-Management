import React from 'react';
import axios from 'axios';
import '../combine.css';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

const DeleteSalary = ({ show, salaryId,handleClose }) => {
  //Delete Student

  const Delete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(`/api/deletestaffsalary/${id}`, {
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
      console.error('Error deleting Staff Salary:', error);
      toast.error(error || 'An error occurred');
    }
  };

//   const [del, setDel] = useState(show);
//   const [stdid, setStdId] = useState(studentId);
  const handledelClose = () => {
    handleClose();
  };

  const handlecnfrm = async () => {
    await Delete(salaryId);
    handleClose();
  };

  return (
    <>
      <Modal show={show} onHide={handledelClose}>
        <Modal.Header closeButton className="theme-bg5">
          <Modal.Title style={{ color: 'white' }}>Delete Salary</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: 'red' }}>ARE YOU SURE TO DELETE</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handledelClose}>
            No
          </Button>
          <Button variant="primary" className='theme-bg5' onClick={handlecnfrm}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteSalary;
