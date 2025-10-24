import http from './http-common';

const volunteerService = {
  // Get volunteer assignments
  getAssignments: () => {
    return http.get('/api/events/volunteer-assignments/');
  },

  // Check in for a shift
  checkIn: (shiftId) => {
    return http.post('/api/events/volunteer-check-in/', { shift_id: shiftId });
  },

  // Verify participant by chess number
  verifyParticipant: (chessNumber, eventId, notes = '') => {
    return http.post('/api/events/verify-participant/', {
      chess_number: chessNumber,
      event_id: eventId,
      notes: notes
    });
  },

  // Get participant verifications
  getVerifications: () => {
    return http.get('/api/events/participant-verifications/');
  },

  // Get volunteer shifts
  getShifts: () => {
    return http.get('/volunteers/shifts/');
  },

  // Get volunteer assignments
  getVolunteerAssignments: () => {
    return http.get('/volunteers/assignments/');
  }
};

export default volunteerService;