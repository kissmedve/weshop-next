import React from "react";

function SelectUsers({
  users,
  label,
  handleChange,
  selectedUser,
  withSelectSelect,
  withSelectAll,
}) {
  const notSelectedUsers = selectedUser
    ? users.filter((user) => user._id !== selectedUser._id)
    : users;

  return (
    <>
      <div className="field">
        <label htmlFor="user" className="label">
          {label}
        </label>
        <div className="select is-normal">
          <select name="user" value={selectedUser._id} onChange={handleChange}>
            {withSelectSelect && <option value="all">Select</option>}
            {withSelectAll && <option value="all">All</option>}
            {selectedUser && (
              <option key={selectedUser._id} value={selectedUser._id}>
                {selectedUser.lastName}, {selectedUser.firstName}
              </option>
            )}
            {notSelectedUsers.map((user) => (
              <option key={user._id} value={user._id}>
                {user.lastName}, {user.firstName}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}

export default SelectUsers;
