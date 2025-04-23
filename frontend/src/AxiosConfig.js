import axios from 'axios';
import Cookies from 'js-cookie';
// FOR BASE URL: USE 'http://localhost:8000'
const axiosInstance = axios.create({
  baseURL: 'https://broncohacks2025-production.up.railway.app/',
  withCredentials: true,  // Important to include cookies (sessionid & csrftoken)
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken'
});

axiosInstance.get('api/accounts/get_csrf_cookie/')
  .then(() => console.log('CSRF cookie set'))
  .catch(err => console.error('Could not get CSRF cookie', err));


axiosInstance.interceptors.request.use(
config => {
	const csrfToken = Cookies.get('csrftoken');
	console.log("CSRF Token in Interceptor:", csrfToken);  // Debugging
	if (csrfToken) 
	{
		config.headers['X-CSRFToken'] = csrfToken;  // Add CSRF token to request header
	}
	else
	{
		console.log('No CSRF token found.');
	}
	return config;
},
error => Promise.reject(error)
);

export default axiosInstance;