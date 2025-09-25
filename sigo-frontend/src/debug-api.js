// Debug file to check API URL
console.log('🔍 DEBUG API URL:');
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('NODE_ENV:', import.meta.env.NODE_ENV);
console.log('PROD:', import.meta.env.PROD);

const resolveBaseURL = () => {
  const env = import.meta.env.VITE_API_URL && String(import.meta.env.VITE_API_URL).trim();
  if (env) return env;
  if (import.meta.env.PROD) return 'https://sistema-sigo.onrender.com/api';
  return 'http://localhost:3001/api';
};

console.log('Resolved baseURL:', resolveBaseURL());
