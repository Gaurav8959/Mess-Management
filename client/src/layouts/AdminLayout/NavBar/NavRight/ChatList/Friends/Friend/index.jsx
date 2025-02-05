import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import avatar1 from 'assets/images/user/avatar-1.jpg';
import axios from 'axios';
import Form from 'react-bootstrap/Form';

const Friend = () => {
  const [data, setData] = useState([]);
  const [switchStates, setSwitchStates] = useState({});

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
  const handleSwitchChange = (id) => {
    setSwitchStates((prevStates) => ({
      ...prevStates,
      [id]: !prevStates[id], // Toggle state
    }));
  };
  return (
    <React.Fragment>
      {/* eslint-disable-next-line */}
      {data?.map((elem, index) => {
        return (
          <Card className="userlist-box mb-0 shadow-none" style={{ flexDirection: 'row', backgroundColor: 'unset' }} key={elem.id || index}>
            <Link to="#" className="media-left">
              {' '}
              <img
                className="media-object img-radius"
                style={{ height: '50px' }}
                src={elem.studentid.profilephoto ? `/src/assets/images/students/${elem.studentid.profilephoto}` : avatar1}
                alt={'Gaurav'}
              />
              <div className="live-status">
              <Form>
                <Form.Check
                  type="switch"
                  id={`custom-switch-${elem.id}`}
                  checked={switchStates[elem.id] || false}
                  onChange={() => handleSwitchChange(elem.id)}
                />
              </Form>
              </div>
            </Link>
            <Card.Body className="p-0">
              <h6 className="chat-header">
                {elem.studentid.fullname}
                {/* {time} */}
              </h6>
            </Card.Body>
          </Card>
        );
      })}
    </React.Fragment>
  );
};

// Friend.propTypes = {
//   data: PropTypes.object,
//   activeId: PropTypes.number,
//   clicked: PropTypes.func,
//   photo: PropTypes.string,
//   id: PropTypes.number,
//   status: PropTypes.string,
//   time: PropTypes.string,
//   new: PropTypes.string,
//   name: PropTypes.string
// };

export default Friend;
