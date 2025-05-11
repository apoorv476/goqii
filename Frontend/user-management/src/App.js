import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
    password: "",
  });
  const [editUserId, setEditUserId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getUsers();
  }, []);

  const schema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    dob: Yup.date()
      .max(new Date(), "Date of Birth can't be in future")
      .required("DOB is required"),
    password: Yup.string()
      .min(6, "Minimum 6 characters")
      .required("Password is required"),
  });

  const getUsers = async () => {
    const res = await fetch("http://localhost/Goquii_assigment/Backend/api.php?action=read");
    const data = await res.json();
    setUsers(data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await schema.validate(formData, { abortEarly: false });

      const action = editUserId ? "update" : "create";
      const payload = editUserId ? { id: editUserId, ...formData } : formData;

      const res = await fetch(
        `http://localhost/Goquii_assigment/Backend/api.php?action=${action}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await res.json();

      if (result.success) {
        toast.success(`User ${editUserId ? "updated" : "added"} successfully`);
        setFormData({ name: "", email: "", dob: "", password: "" });
        setEditUserId(null);
        setShowForm(false);
        getUsers();
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (err) {
      if (err.name === "ValidationError") {
        err.errors.forEach((msg) => toast.error(msg));
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const handleEdit = (user) => {
    setFormData(user);
    setEditUserId(user.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost/Goquii_assigment/Backend/api.php?action=delete&id=${id}`, {
      method: "POST",
    });
    toast.success("User deleted");
    getUsers();
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", dob: "", password: "" });
    setEditUserId(null);
    setShowForm(false);
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h4 className="text-center mb-4">User Management</h4>

      {!showForm ? (
        <>
          <button className="btn btn-primary mb-3" onClick={() => setShowForm(true)}>
            Add User
          </button>
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>DOB</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.dob}</td>
                    <td>
                      <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(user)}>
                        Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      ) : (
        <div className="row justify-content-center">
          <div className="col-md-6">
            <h5 className="text-center">{editUserId ? "Edit User" : "Add User"}</h5>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <input
                type="date"
                className="form-control mb-2"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
              <input
                type="password"
                className="form-control mb-3"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <button type="submit" className="btn btn-success me-2">
                {editUserId ? "Update" : "Add"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
