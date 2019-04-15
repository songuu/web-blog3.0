import axios from '@/lib/api.request'

export const getAllplans = (session, payload) => {
	return axios.request({
		url: '/api/plans',
		params: {
			'limit': payload.limit ? payload.limit : payload,
			'session': session
		},
		method: 'get'
	})
}

export const delPlan = (session, id) => {
	return axios.request({
		url: '/api/plan/' + id,
		params: {
			'session': session,
			'id': id
		},
		method: 'delete'
	})	
}

export const savePlan = (session, id, payload) => {
	payload.session = session
	if(id) {
		return axios.request({
			url: '/api/plan/' + id,
			params: payload,
			method: 'patch'
		})
	} else {
		return axios.request({
			url: '/api/plan',
			params: payload,
			method: 'post'
		})
	}
}