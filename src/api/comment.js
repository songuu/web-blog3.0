import axios from '@/lib/api.request'

export const getComments = (session) => {
	return axios.request({
		url: '/api/allcomments',
		params: {
			'session': session
		},
		method: 'get'
	})
}

export const getCommentsNum = (session) => {
	return axios.request({
		url: '/api/commetsNum',
		params: {
			'session': session
		},
		method: 'get'
	})
}
