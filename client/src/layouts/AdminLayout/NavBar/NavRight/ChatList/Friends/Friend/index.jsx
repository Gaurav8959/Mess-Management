import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import avatar1 from 'assets/images/user/avatar-1.jpg';
import axios from 'axios';

const Friend = ({ clicked }) => {
  const [data, setData] = useState([]);

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

  return (
    <React.Fragment>
      {/* eslint-disable-next-line */}
      <Card
        className='userlist-box mb-0 shadow-none'
        style={{ flexDirection: 'row', backgroundColor: 'unset' }}
        onClick={clicked}
        onKeyDown={clicked}
      >
        <Link to="#" className="media-left">
          {' '}
          <img className="media-object img-radius" src={avatar1} alt={"Gaurav"} />
          <div className="live-status">{1}</div>
        </Link>
        <Card.Body className="p-0">
          <h6 className="chat-header">
            {"Gaurav"}
            {/* {time} */}
          </h6>
        </Card.Body>
      </Card>
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
