import './user.css';

const Users = ({ user }) => (
  <div className="user-card">
    <img
      src={user.avatar || 'https://ui-avatars.com/api/?name=' + user.name}
      alt="avatar"
      className="user-avatar"
    />
    <div className="user-info">
      <div className="user-name">{user.name}</div>
      <div className="user-email">{user.email}</div>
    </div>
  </div>
);

export default Users;