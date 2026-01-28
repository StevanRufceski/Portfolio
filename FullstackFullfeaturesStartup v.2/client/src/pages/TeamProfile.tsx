import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { fetchPublicProfile, PublicProfile } from "../api/profile";
import "../styles/profile.css";

export default function TeamProfile() {
  // Get ID from URL
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(false);

    // Call backend /profile/public/:id
    fetchPublicProfile(id)
      .then((res) => {
        setProfile(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch profile:", err);
        setError(true);
        setLoading(false);
      });
  }, [id]);

  if (error) {
    return <Navigate to="/team" />;
  }

  if (loading) return <h3>Loading...</h3>;

  if (!profile) return <h3>Profile not found</h3>;

  return (
    <div className="profile-container">
      <img
        src={profile.picture || "/default-user-icon.png"}
        alt={profile.full_name}
        className="profile-img"
      />
      <h1>{profile.full_name}</h1>
      {profile.title && <h3>{profile.title}</h3>}
      {profile.description && <p>{profile.description}</p>}
    </div>
  );
}
