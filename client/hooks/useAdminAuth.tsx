import { useAuth } from "./useAuth";

// Authorized admin emails
const ADMIN_EMAILS = [
  "amansinghdev.101@gmail.com"
];

export const useAdminAuth = () => {
  const { currentUser, loading } = useAuth();

  const isAdmin = currentUser?.email ? ADMIN_EMAILS.includes(currentUser.email) : false;
  
  const isAuthorized = !loading && currentUser && isAdmin;
  
  const checkAdminAccess = () => {
    if (loading) return { authorized: false, reason: "loading" };
    if (!currentUser) return { authorized: false, reason: "not_authenticated" };
    if (!isAdmin) return { authorized: false, reason: "not_admin" };
    return { authorized: true, reason: "authorized" };
  };

  return {
    isAdmin,
    isAuthorized,
    checkAdminAccess,
    adminEmail: currentUser?.email,
    loading
  };
};