const API_BASE = '/api';

export const api = {
  async signup(data) {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Signup failed');
    return json;
  },
  async verify(email, code) {
    const res = await fetch(`${API_BASE}/auth/verify`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, code }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Verification failed');
    return json;
  },
  async resendVerify(email) {
    const res = await fetch(`${API_BASE}/auth/resend-verify`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Resend failed');
    return json;
  },
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Login failed');
    return json;
  },
  async forgotPassword(email) {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Request failed');
    return json;
  },
  async resetPassword(email, code, newPassword) {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, code, newPassword }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Reset failed');
    return json;
  },
  async getMe(token) {
    const res = await fetch(`${API_BASE}/auth/me`, { headers: { 'Authorization': `Bearer ${token}` } });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed');
    return json;
  },
};