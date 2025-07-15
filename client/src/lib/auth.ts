export function requireAuth() {
  // This will be used by components that need authentication
  return true;
}

export function redirectToLogin() {
  window.location.href = "/login";
}
