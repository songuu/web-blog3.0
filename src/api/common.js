import axios from '@/lib/api.request'

export const getMessageBox = (session) => {
	return axios.request({
		url: '/api/isReadcomments',
		params: {
			'session': session
		},
		method: 'get'
	})
}

