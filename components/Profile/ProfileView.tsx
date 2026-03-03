import { Info } from "./Info";
import { UserProfile } from "./profile.type";

interface ProfileViewProps {
  user: UserProfile;
  onEdit: () => void;
}
export function ProfileView({ user, onEdit }: ProfileViewProps) {
  return (
    <>
      <Info label="Email" value={user.user.email} />
      <Info label="Name" value={user.user.name} />
      <Info label="Phone" value={user.phone ?? "—"} />

      <button
        onClick={onEdit}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg"
      >
        Edit Profile
      </button>
    </>
  );
}
