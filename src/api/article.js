import axios from '@/lib/api.request'

//保存文章
export const saveArticle = (session, aid, article) => {
	article.session = session
	if(aid) {
		return axios.request({
			url: '/api/article/' + aid,
			params: article,
			method: 'patch'
		})
	} else {
		return axios.request({
			url: '/api/article',
			params: article,
			method: 'post'
		})
	}
}

//获取所有的文章
export const getAllArticles = (payload) => {
	return axios.request({
		url: '/api/articles',
		params: payload,
		method: 'post'
	})
}

//获取单个的文章
export const getArticle = (aid) => {
	return axios.request({
		url: '/api/article/' + aid,
		params: {
			'aid': aid
		},
		method: 'get'
	})
}

//删除文章
export const delArticle = (session, aid) => {
	return axios.request({
		url: '/api/article/' + aid,
		params: {
			'session': session,
			'aid': aid
		},
		method: 'delete'
	})
}

//搜索文章
export const searchArticles = (payload) => {
	return axios.request({
		url: '/api/someArticles',
		params: payload,
		method: 'get'
	})
}

export const getAllaids = () => {
	return axios.request({
		url: '/api/aids',
		method: 'get'
	})
}
