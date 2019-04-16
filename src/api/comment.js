import axios from '@/lib/api.request'

export const getAllComments = (payload) => {
	return axios.request({
		url: '/api/comments',
		params: payload,
		method: 'get'
	})
}

export const getComments = () => {
	return axios.request({
		url: '/api/allcomments',
		method: 'get'
	})
}

export const getCommentsNum = () => {
	return axios.request({
		url: '/api/commetsNum',
		method: 'get'
	})
}

export const summitComment = (payload) => {
	if(payload.date) {
		return axios.request({
			url: '/api/commentss',
			params: payload,
			method: 'patch'
		})
	} else {
		return axios.request({
			url: '/api/comment',
			params: payload,
			method: 'post'
		})
	}
}

export const updateLike = (payload) => {
	return axios.request({
		url: '/api/comments/' + payload.id,
		params: payload,
		method: 'patch'
	})
}
