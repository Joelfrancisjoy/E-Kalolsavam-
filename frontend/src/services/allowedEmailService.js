import http from './http-common';

const getAllowedEmails = () => {
  return http.get('/allowed-emails/');
};

const addAllowedEmail = (email) => {
  return http.post('/allowed-emails/', { email });
};

const bulkAddAllowedEmails = (emails) => {
  return http.post('/allowed-emails/bulk/', { emails });
};

const toggleEmailStatus = (id) => {
  return http.patch(`/allowed-emails/${id}/toggle/`);
};

const deleteAllowedEmail = (id) => {
  return http.delete(`/allowed-emails/${id}/`);
};

export default {
  getAllowedEmails,
  addAllowedEmail,
  bulkAddAllowedEmails,
  toggleEmailStatus,
  deleteAllowedEmail
};
