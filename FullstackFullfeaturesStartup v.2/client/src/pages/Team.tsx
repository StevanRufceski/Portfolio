import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPublicTeam, PublicProfile } from "../api/profile";
import "../styles/team.css";

export default function Team() {
  const [team, setTeam] = useState<PublicProfile[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPublicTeam().then(setTeam);
  }, []);

  return (
    <section className="team-section">
      <h1>Our Team</h1>

      <div className="team-grid">
        {team.map((m) => (
          <div
            key={m.id}
            className="team-card"
            onClick={() => navigate(`/profile/public/${m.id}`)}
          >
            <img
              src={m.picture || "/avatar.png"}
              alt={m.full_name}
              className="team-card-img"
            />
            <h3>{m.full_name}</h3>
            {m.title && <p className="title">{m.title}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
