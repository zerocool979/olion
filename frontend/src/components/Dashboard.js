import { useEffect, useState } from "react";
import { getDiscussions } from "../api/discussions";

export default function Dashboard({ token }) {
  const [discussions, setDiscussions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDiscussions(token);
      setDiscussions(data);
    };
    fetchData();
  }, [token]);

  return (
    <div>
      <h1>Dashboard</h1>
      <ul>
        {discussions.map(d => (
          <li key={d.id}>{d.title}</li>
        ))}
      </ul>
    </div>
  );
}
