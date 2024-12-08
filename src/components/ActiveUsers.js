import React from 'react';

const ActiveUsers = ({ users }) => {
  return (
    <div className="active-users">
      <h2>Active Users</h2>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>
    </div>
  );
};

export default ActiveUsers;
