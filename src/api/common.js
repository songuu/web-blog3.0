import axios from '@/lib/api.request'

export const updateMessage = (payload) => {
	return axios.request({
		url: '/api/commentss',
		params: payload,
		method: 'patch'
	})
}

export const sendMail = (payload) => {
	return axios.request({
		url: '/api/mail',
		params: payload,
		method: 'post'
	})
}

export const getAllTags = () => {
	return axios.request({
		url: '/api/tags',
		method: 'get'
	})
}
