import axios from '@/lib/api.request'

export const login = (payload) => {
	return axios.request({
		url: '/api/login',
		params: payload,
		method: 'post'
	})
}

export const logout = (token) => {
	return axios.request({
		url: '/api/logout',
		method: 'post'
	})
}

export const resetUser = (session, payload) => {	
	payload.session = session
	return axios.request({
		url: '/api/user',
		params: payload,
		method: 'post'
	})
}
