import { createClient } from "@/utils/supabase/server";
import { redirect } from 'next/navigation';

const ProfilePage = async () => {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Redirect if not authenticated
  if (!user) {
    redirect('/login');
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      
      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <div className="flex items-center space-x-2">
          <div className="bg-green-500 rounded-full w-2 h-2"></div>
          <span className="text-sm text-gray-600">Signed In</span>
        </div>

        <div className="space-y-3">
          <div>
            <strong className="text-gray-700">Email:</strong>
            <span className="ml-2">{user.email}</span>
          </div>
          
          <div>
            <strong className="text-gray-700">User ID:</strong>
            <span className="ml-2">{user.id}</span>
          </div>

          <div>
            <strong className="text-gray-700">Last Sign In:</strong>
            <span className="ml-2">
              {user.last_sign_in_at 
                ? new Date(user.last_sign_in_at).toLocaleString()
                : 'Never'}
            </span>
          </div>

          {session?.expires_at && (
            <div>
              <strong className="text-gray-700">Session Expires:</strong>
              <span className="ml-2">
                {new Date(session.expires_at * 1000).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
