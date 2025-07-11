export function handleApiError({ response, ...error }: any) {
  const status = response?.status || error.status || 500;
  const message =
    error.friendlyMessage ||
    response?.data?.message ||
    error.message ||
    response?.statusText;

  response?.status > 404 ? console.error(response?.data || error) : console.warn(response?.data || error);

  return { status, message };
}