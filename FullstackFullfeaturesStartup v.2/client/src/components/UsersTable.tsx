import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUsers } from "../api/users";
import { User } from "../context/AuthContext";
import "../styles/userstable.css";

interface Props {
  allowedRoleFilter?: string;
}

export default function UsersTable({ allowedRoleFilter }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers(allowedRoleFilter);
        setUsers(data);
      } catch (err) {
        console.error("Failed to load users", err);
      }
    };

    loadUsers();
  }, [allowedRoleFilter]); // ✅ auto refresh when role changes

  return (
    <div className="users-table">
      <table>
        <thead>
          <tr>
            <th>Full name</th>
            <th>Role</th>
            <th>Title</th>
            <th>E-mail</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Created_at</th>
            <th>Created_by</th>
            <th>Promoted</th>
            <th>Pr_No</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.full_name}</td>
              <td>{u.role}</td>
              <td>{u.title || "-"}</td>
              <td>{u.email}</td>
              <td>{u.phone}</td>
              <td>{u.status}</td>
              <td>{new Date(u.created_at!).toLocaleDateString()}</td>
              <td>{u.created_by}</td>
              <td>{u.promoted ? "True" : "False"}</td>
              <td>{u.promo_number}</td>
              <td>
                <button onClick={() => navigate(`/users/${u.id}`)}>Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
