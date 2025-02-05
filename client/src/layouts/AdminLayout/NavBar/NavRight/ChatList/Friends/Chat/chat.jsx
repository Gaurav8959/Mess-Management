import avatar1 from 'assets/images/user/avatar-1.jpg';

const chat = [
  {
    friend_id: 1,
    friend_photo: avatar1,
    messages: [
      {
        type: 1,
        msg: "I'm just looking around. Will you tell me something about yourself?",
        time: '8:20 a.m'
      },
      {
        type: 0,
        msg: 'Ohh! very nice',
        time: '8:22 a.m'
      },
      {
        type: 1,
        msg: 'can you come with me?',
        time: '8:22 a.m'
      }
    ]
  },
];

export default chat;
