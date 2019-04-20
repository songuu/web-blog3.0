import axios from '@/lib/api.request'

export const getAllfiles = (payload) =>{
	return axios.request({
		url: '/api/commonFiles',
		params: payload,
		method: 'get'
	})
}

export const delFile = (session, fid) => {
	return axios.request({
		url: '/api/commonFile/' + fid,
		params: {
			"session": session,
			"fid": fid
		},
		method: 'delete'
	})
}

// 使用前端检索
/*export const searchFiles = (payload) => {
	return axios.request({
		url: '/api/serchFiles',
		params: payload,
		method: 'get'
	})
}*/

export const getFilesNum = () => {
	return axios.request({
		url: '/api/commonNum',
		method: 'get'
	})
}
