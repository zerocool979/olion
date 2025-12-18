



// =========================================
// FILE: src/components/UserTable.js
// Use Case: Tabel user + role management
// =========================================
export default function UserTable({ users, onUpdateRole }) {
  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-t">
              <td className="p-3">{u.email}</td>
              <td className="p-3">{u.role}</td>
              <td className="p-3">
                <select
                  value={u.role}
                  onChange={e => onUpdateRole(u.id, e.target.value)}
                  className="border rounded p-1"
                >
                  <option value="USER">USER</option>
                  <option value="PAKAR">PAKAR</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
