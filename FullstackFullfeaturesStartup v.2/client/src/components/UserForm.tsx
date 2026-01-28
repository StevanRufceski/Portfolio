import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth, User } from "../context/AuthContext";
import { fetchUserById, updateUserById } from "../api/users";
import { updateProfile } from "../api/profile";
import "../styles/userform.css";

/* ---------------- Cloudinary upload (frontend-only) ---------------- */
const uploadToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  );

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) throw new Error("Cloudinary upload failed");
  return res.json();
};

/* ------------------------------------------------------------------ */

export default function UserForm() {
  const { id } = useParams();
  const { user: currentUser, setUser } = useAuth();

  const [user, setLocalUser] = useState<User | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const targetId = id || currentUser?.id;
  const isSelf = currentUser?.id === targetId;
  const isAdmin = currentUser?.role === "Administrator";

  /* ---------------- Load user ---------------- */
  useEffect(() => {
    if (!targetId) return;

    fetchUserById(targetId)
      .then(setLocalUser)
      .catch((err) => console.error("Failed to load user:", err));
  }, [targetId]);

  if (!user) return <h3>Loading...</h3>;

  /* ---------------- Image handling ---------------- */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const file = e.target.files[0];
    setSelectedFile(file);

    // Preview image
    setLocalUser({
      ...user,
      picture: URL.createObjectURL(file),
    });
  };

  /* ---------------- Save ---------------- */
  const save = async () => {
    try {
      let picture = user.picture;

      // Upload image if selected
      if (selectedFile) {
        const uploaded = await uploadToCloudinary(selectedFile);
        picture = uploaded.secure_url;
      }

      /* ---------------- Payloads ---------------- */

      // Self profile update → STRICT profile fields only
      const selfPayload = {
        full_name: user.full_name,
        phone: user.phone ?? undefined,
        description: user.description ?? undefined,
        picture: picture ?? undefined,
      };


      // Admin update → full user control
      const adminPayload: Partial<User> = {
        full_name: user.full_name,
        title: user.title ?? undefined,
        phone: user.phone ?? undefined,
        description: user.description ?? undefined,
        picture: picture ?? undefined,
        status: user.status,
        promoted: user.promoted ?? undefined,         
        promo_number: user.promo_number ?? undefined, 
      };


      /* ---------------- API call ---------------- */
      let updated: User;

      if (isSelf) {
        // 🔐 Own profile
        updated = await updateProfile(selfPayload);
        setUser(updated); // keep auth context in sync
      } else {
        // 👑 Admin editing another user
        updated = await updateUserById(user.id, adminPayload);
      }

      setLocalUser(updated);
      setSelectedFile(null);
      alert("Saved successfully");
    } catch (err) {
      console.error("Failed to save user:", err);
      alert("Failed to save user");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="user-form">
      <h2>User Details</h2>

      <div>
        <label>ID:</label>
        <input value={user.id} disabled />
      </div>

      <div>
        <label>Created At:</label>
        <input
          value={
            user.created_at
              ? new Date(user.created_at).toLocaleString()
              : ""
          }
          disabled
        />
      </div>

      <div>
        <label>Full Name:</label>
        <input
          value={user.full_name}
          onChange={(e) =>
            setLocalUser({ ...user, full_name: e.target.value })
          }
          disabled={!isSelf && !isAdmin}
        />
      </div>

      <div>
        <label>Title:</label>
        <input
          value={user.title || ""}
          onChange={(e) =>
            setLocalUser({ ...user, title: e.target.value })
          }
          disabled={!isAdmin}
        />
      </div>

      <div>
        <label>Role:</label>
        <input value={user.role} disabled />
      </div>

      <div>
        <label>Email:</label>
        <input value={user.email} disabled />
      </div>

      <div>
        <label>Phone:</label>
        <input
          value={user.phone || ""}
          onChange={(e) =>
            setLocalUser({ ...user, phone: e.target.value })
          }
          disabled={!isSelf && !isAdmin}
        />
      </div>

      <div>
        <label>Description:</label>
        <textarea
          value={user.description || ""}
          onChange={(e) =>
            setLocalUser({ ...user, description: e.target.value })
          }
          disabled={!isSelf && !isAdmin}
        />
      </div>

      <div>
        <label>Picture:</label>
        <div style={{ marginBottom: 5 }}>
          <img
            src={user.picture || "/default-user-icon.png"}
            alt="User"
            style={{
              width: 120,
              height: 120,
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={!isSelf && !isAdmin}
        />
      </div>

      <div>
        <label>Status:</label>
        {isAdmin && user.email !== "admin@system.local" ? (
          <select
            value={user.status}
            onChange={(e) =>
              setLocalUser({
                ...user,
                status: e.target.value as "active" | "deactivated",
              })
            }
          >
            <option value="active">Active</option>
            <option value="deactivated">Deactivated</option>
          </select>
        ) : (
          <input value={user.status || ""} disabled />
        )}
      </div>
      <div>
        <label>promo_number:</label>
        <input
          value={user.promo_number || ""}
          onChange={(e) =>
            setLocalUser({ ...user, promo_number: e.target.value })
          }
          disabled={!isAdmin}
        />
      </div>
      <div>
        <label>Promoted:</label>
        {isAdmin ? (
          <select
            value={user.promoted?.toString() || "false"}
            onChange={(e) =>
              setLocalUser({
                ...user,
                promoted: e.target.value === "true", // convert string to boolean
              })
            }
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        ) : (
          <input value={user.promoted ? "True" : "False"} disabled />
        )}
      </div>

      <button onClick={save}>Save</button>
    </div>
  );
}
