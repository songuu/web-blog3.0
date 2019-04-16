import axios from '@/lib/api.request'

export const getAllbooks = (payload) => {
	return axios.request({
		url: '/api/books',
		params: payload,
		method: 'get'
	})
}

export const getNewbooks = (payload) => {
	return axios.request({
		url: '/api/books',
		params: payload,
		method: 'get'
	})
}

export const searchBooks = (payload) => {
	return axios.request({
		url: '/api/somebooks',
		params: payload,
		method: 'get'
	})
}

export const saveBook = (session, rid, payload) => {
	payload.session = session
	if(rid) {
		return axios.request({
			url: '/api/book/' + rid,
			params: payload,
			method: 'patch'
		})
	} else {
		return axios.request({
			url: '/api/book',
			params: payload,
			method: 'post'
		})
	}
}

export const delBook = (session, rid) => {
	return axios.request({
		url: '/api/book/' + rid,
		params: {
			'session': session,
			'rid': rid
		},
		method: 'delete'
	})
}

export const getBook = (rid) => {
	return axios.request({
		url: '/api/book/' + rid,
		params: {
			'rid': rid
		},
		method: 'get'
	})
}

export const getAllmusics = (payload) => {
	return axios.request({
		url: '/api/musics',
		params: payload,
		method: 'get'
	})
}

export const getNewmusics = (payload) => {
	return axios.request({
		url: '/api/musics',
		params: payload,
		method: 'get'
	})
}

export const searchMusics = (payload) => {
	return axios.request({
		url: '/api/somemusics',
		params: payload,
		method: 'get'
	})
}

export const saveMusic = (session, bid, payload) => {
	payload.session = session
	if(bid) {
		return axios.request({
			url: '/api/music/' + bid,
			params: payload,
			method: 'patch'
		})
	} else {
		return axios.request({
			url: '/api/music',
			params: payload,
			method: 'post'
		})
	}
}

export const delMusic = (session, bid) => {
	return axios.request({
		url: '/api/music/' + bid,
		params: {
			'session': session,
			'bid': bid
		},
		method: 'delete'
	})
}

export const getMusic = (bid) => {
	return axios.request({
		url: '/api/music/' + bid,
		params: {
			'bid': bid
		},
		method: 'get'
	})
}

export const getAllmovies = (payload) => {
	return axios.request({
		url: '/api/movies',
		params: payload,
		method: 'get'
	})
}

export const getNewmovies = (payload) => {
	return axios.request({
		url: '/api/movies',
		params: payload,
		method: 'get'
	})
}

export const searchMovies = (payload) => {
	return axios.request({
		url: '/api/somemovies',
		params: payload,
		method: 'get'
	})
}

export const saveMovie = (session, cid, payload) => {
	payload.session = session
	if(cid) {
		return axios.request({
			url: '/api/movie/' + cid,
			params: payload,
			method: 'patch'
		})
	} else {
		return axios.request({
			url: '/api/movie',
			params: payload,
			method: 'post'
		})
	}
}

export const delMovie = (session, cid) => {
	return axios.request({
		url: '/api/movie/' + cid,
		params: {
			'session': session,
			'cid': cid
		},
		method: 'delete'
	})
}

export const getMovie = (cid) => {
	return axios.request({
		url: '/api/movie/' + cid,
		params: {
			'cid': cid
		},
		method: 'get'
	})
}