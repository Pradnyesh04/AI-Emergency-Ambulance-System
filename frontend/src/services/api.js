const API_BASE_URL = 'http://localhost:8080/api';

async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = `HTTP error! Status: ${response.status}`;
    try {
      const text = await response.text();
      if (text) {
        try {
          const json = JSON.parse(text);
          errorMessage = json.message || json.error || text;
        } catch {
          errorMessage = text;
        }
      }
    } catch (e) {
      // Use default error
    }
    throw new Error(errorMessage);
  }
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
}

export const api = {
  // Health
  getHealth: () => fetch(`${API_BASE_URL}/health`).then(handleResponse),

  // Emergency Requests
  getEmergencyRequests: () => fetch(`${API_BASE_URL}/emergency`).then(handleResponse),
  getEmergencyRequestById: (id) => fetch(`${API_BASE_URL}/emergency/${id}`).then(handleResponse),
  createEmergencyRequest: (data) =>
    fetch(`${API_BASE_URL}/emergency`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  deleteEmergencyRequest: (id) =>
    fetch(`${API_BASE_URL}/emergency/${id}`, { method: 'DELETE' }).then(handleResponse),

  // Ambulances
  getAmbulances: () => fetch(`${API_BASE_URL}/ambulances`).then(handleResponse),
  getAvailableAmbulances: () => fetch(`${API_BASE_URL}/ambulances/available`).then(handleResponse),
  getNearestAmbulance: (lat, lon) =>
    fetch(`${API_BASE_URL}/ambulances/nearest?latitude=${lat}&longitude=${lon}`).then(handleResponse),
  createAmbulance: (data) =>
    fetch(`${API_BASE_URL}/ambulances`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  updateAmbulance: (id, data) =>
    fetch(`${API_BASE_URL}/ambulances/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  deleteAmbulance: (id) =>
    fetch(`${API_BASE_URL}/ambulances/${id}`, { method: 'DELETE' }).then(handleResponse),

  // Assignments
  getAssignments: () => fetch(`${API_BASE_URL}/assignments`).then(handleResponse),
  getAssignmentById: (id) => fetch(`${API_BASE_URL}/assignments/${id}`).then(handleResponse),
  createAssignment: (data) =>
    fetch(`${API_BASE_URL}/assignments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  autoAssignAmbulance: (emergencyId) =>
    fetch(`${API_BASE_URL}/assignments/auto/${emergencyId}`, { method: 'POST' }).then(handleResponse),
  smartDispatch: (emergencyId) =>
    fetch(`${API_BASE_URL}/assignments/smart/${emergencyId}`, { method: 'POST' }).then(handleResponse),
  updateAssignmentStatus: (id, status) =>
    fetch(`${API_BASE_URL}/assignments/${id}/status?status=${encodeURIComponent(status)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).then(handleResponse),
};
