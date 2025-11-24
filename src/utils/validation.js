export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function required(value) {
  return value !== undefined && value !== null && String(value).trim() !== "";
}

export function minLength(value, len) {
  return String(value).trim().length >= len;
}
