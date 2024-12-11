const userApiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

if (!process.env.REACT_APP_API_BASE_URL) {
  console.warn(
    'REACT_APP_USER_API_BASE_URL is not defined. Using the default value:'+ userApiBaseUrl
  );
}

const config = {
  apiBaseUrl: userApiBaseUrl,
};

export default config;