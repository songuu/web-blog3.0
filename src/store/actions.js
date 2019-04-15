import Vue from 'vue'
import router from '../router'

import { login, logout, resetUser } from '@/api/user'
import { getAllArticles, saveArticle, delArticle, getArticle } from '@/api/article'
import { getMessageBox } from '@/api/common'
import { getComments, getCommentsNum } from '@/api/comment'
import { getAllplans, delPlan, savePlan } from '@/api/plan'
import { getAllbooks, getAllmusics, getAllmovies, saveBook, saveMusic, saveMovie, delBook, delMusic, delMovie } from '@/api/resource'

const beginLoading = (commit, add) => {
	add ? commit('loadMore_toggle', true) : commit('isLoading_toggle', true)
	return Date.now()
}

const endLoading = (commit, startTime, toggle) => {
	const leftTime = 500 - (Date.now() - startTime)
	leftTime > 0 ? setTimeout(commit(toggle, false), leftTime) : commit(toggle, false)
}

export default {
	//用户
	login({
		commit
	}, payload) {
		return login(payload)
	},
	logout({
		commit
	}) {

	},
	resetUser({
		state,
		commit
	}, payload) {
		resetUser(state.session, payload).then((res) => {
			if(res.status === 200) {
				console.log(res.msg)
				commit('unset_user')
				router.go({
					name: 'login'
				})
			} else {
				console.log(res.msg)
			}
		}).catch((err) => {
			console.log(err)
		})
	},
	// email
	sendMail({
		commit
	}, payload) {
		return Vue.http.post('/api/mail', payload).catch((err) => {
			console.log(err)
		})
	},
	//  article的http请求
	saveArticle({
		state,
		commit
	}, aid) {
		//commit('isSaving_ctl', false)
		saveArticle(state.session, aid, state.article).then((res) => {
			if(res.status === 200) {
				commit('isSaving_ctl', true)
				router.push({
					name: 'essay'
				})
			} else {
				alert('保存失败')
			}
		})
	},
	getAllArticles({
		state,
		commit
	}, payload) {
		commit('moreArticle_toggle', true)
		const startTime = beginLoading(commit, payload.add)
		if(payload.value) {
			commit('isLoading_toggle', false)
		}
		getAllArticles(state.session, payload).then((res) => {
			if(res.status === 200) {
				if(res.data.length === 0) {
					commit('moreArticle_toggle', false)
					commit('noMore_toggle', true)
				} else {
					commit('noMore_toggle', false)
				}
				if(payload.add) {
					commit('add_articles', res.data)
					endLoading(commit, startTime, 'loadMore_toggle')
				} else {
					commit('set_all_articles', res.data)
					endLoading(commit, startTime, 'isLoading_toggle')
				}
			}
		}).catch((err) => {
			console.log(err)
		})
	},
	getArticle({
		commit,
		state
	}, aid) {
		getArticle(state.session, aid).then((res) => {
			if(res.status === 200) {
				commit('set_article', res.data)
				document.title = state.article.title
			} else {
				console.log('获取失败')
			}
		}).catch((err) => {
			console.log(err)
		})
	},
	delArticle({
		state,
		dispatch
	}, payload) {
		delArticle(state.session, payload.aid).then((res) => {
			if(res.status === 200) {
				if(payload.route.name === 'essay') {
					dispatch('getAllArticles', {
						page: payload.page,
						limit: 5
					})
					return true
				}
			} else {
				return false
			}
		}).catch((err) => {
			console.log(err)
		})
	},
	searchArticles({
		commit
	}, payload) {
		commit('moreArticle_toggle', true)
		const startTime = beginLoading(commit, payload.add)
		return Vue.http.get('/api/someArticles', {
				params: {
					payload
				}
			})
			.then(response => response.json())
			.then(articles => {
				if(articles.length === 0) {
					commit('moreArticle_toggle', false)
					commit('noMore_toggle', true)
				} else {
					commit('noMore_toggle', false)
				}
				if(payload.add) {
					commit('add_articles', articles)
					endLoading(commit, startTime, 'loadMore_toggle')
				} else {
					commit('set_all_articles', articles)
					endLoading(commit, startTime, 'isLoading_toggle')
				}
			}).catch((err) => {
				console.log(err)
			})
	},
	getAllaids({
		commit
	}) {
		return Vue.http.get('/api/aids')
			.then(response => {
				commit('set_aids', response.data)
			}).catch((err) => {
				console.log(err)
			})
	},
	//计划的请求
	savePlan({
		state
	}, id) {
		savePlan(state.session, id, state.todoItem).then((res) => {
			if(res.status === 200) {
				router.push({
					name: 'management'
				})
			} else {
				console.log('获取失败')
			}
		}).catch((err) => {
			console.log(err)
		})
	},
	delPlan({
		state,
		dispatch
	}, payload) {
		delPlan(state.session, payload.id).then((res) => {
			if(res.status === 200) {
				if(payload.route.name === 'management') {
					dispatch('getAllplans', {
						limit: 10
					})
				}
			} else {
				console.log('获取失败')
			}
		}).catch((err) => {
			console.log(err)
		})
	},
	getAllplans({
		state,
		commit
	}, payload) {
		commit('morePlan_toggle', true)
		const startTime = beginLoading(commit, payload.add)
		if(payload.value) {
			commit('isLoading_toggle', false)
		}
		getAllplans(state.session, payload).then((res) => {
			if(res.status === 200) {
				if(payload.add) {
					endLoading(commit, startTime, 'loadMore_toggle')
				} else {
					commit('set_all_plans', res.data)
					endLoading(commit, startTime, 'isLoading_toggle')
				}
			} else {
				console.log('获取失败')
			}
		}).catch((err) => {
			console.log(err)
		})
	},

	//资源的请求   
	getAllbooks({
		state,
		commit
	}, payload) {
		commit('moreBook_toggle', true)
		const startTime = beginLoading(commit, payload.add)
		if(payload.value) {
			commit('isLoading_toggle', false)
		}
		getAllbooks(state.session, payload).then((res) => {
			if(res.status === 200) {
				if(payload.add) {
					endLoading(commit, startTime, 'loadMore_toggle')
				} else {
					commit('set_all_books', res.data)
					endLoading(commit, startTime, 'isLoading_toggle')
				}
			} else {
				console.log('获取失败')
			}
		}).catch((err) => {
			console.log(err)
		})
	},
	getNewbooks({
		state,
		commit
	}, payload) {
		commit('moreBook_toggle', true)
		const startTime = beginLoading(commit, payload.add)
		if(payload.value) {
			commit('isLoading_toggle', false)
		}
		getNewbooks(state.session, payload).then((res) => {
			if(res.status === 200) {
				if(payload.add) {
					endLoading(commit, startTime, 'loadMore_toggle')
				} else {
					commit('set_new_books', res.data)
					endLoading(commit, startTime, 'isLoading_toggle')
				}
			} else {
				console.log('获取失败')
			}
		}).catch((err) => {
			console.log(err)
		})
	},
	getAllmusics({
		state,
		commit
	}, payload) {
		commit('moreMusic_toggle', true)
		const startTime = beginLoading(commit, payload.add)
		if(payload.value) {
			commit('isLoading_toggle', false)
		}
		getAllmusics(state.session, payload).then((res) => {
			if(res.status === 200) {
				if(payload.add) {
					endLoading(commit, startTime, 'loadMore_toggle')
				} else {
					commit('set_all_musics', res.data)
					endLoading(commit, startTime, 'isLoading_toggle')
				}
			} else {
				console.log('获取失败')
			}
		}).catch((err) => {
			console.log(err)
		})
	},
	getNewmusics({
		state,
		commit
	}, payload) {
		commit('moreMusic_toggle', true)
		const startTime = beginLoading(commit, payload.add)
		if(payload.value) {
			commit('isLoading_toggle', false)
		}
		getNewmusics(state.session, payload).then((res) => {
			if(res.status === 200) {
				if(payload.add) {
					endLoading(commit, startTime, 'loadMore_toggle')
				} else {
					commit('set_new_musics', res.data)
					endLoading(commit, startTime, 'isLoading_toggle')
				}
			} else {
				console.log('获取失败')
			}
		}).catch((err) => {
			console.log(err)
		})
	},
	getAllmovies({
		state,
		commit
	}, payload) {
		commit('moreMovie_toggle', true)
		const startTime = beginLoading(commit, payload.add)
		if(payload.value) {
			commit('isLoading_toggle', false)
		}
		getAllmovies(state.session, payload).then((res) => {
			if(res.status === 200) {
				if(payload.add) {
					endLoading(commit, startTime, 'loadMore_toggle')
				} else {
					commit('set_all_movies', res.data)
					endLoading(commit, startTime, 'isLoading_toggle')
				}
			} else {
				console.log('获取失败')
			}
		}).catch((err) => {
			console.log(err)
		})
	},
	getNewmovies({
		state,
		commit
	}, payload) {
		commit('moreMovie_toggle', true)
		const startTime = beginLoading(commit, payload.add)
		if(payload.value) {
			commit('isLoading_toggle', false)
		}
		getNewmovies(state.session, payload).then((res) => {
			if(res.status === 200) {
				if(payload.add) {
					endLoading(commit, startTime, 'loadMore_toggle')
				} else {
					commit('set_new_movies', res.data)
					endLoading(commit, startTime, 'isLoading_toggle')
				}
			} else {
				console.log('获取失败')
			}
		}).catch((err) => {
			console.log(err)
		})
	},
	saveBook({
		state
	}, rid) {
		saveBook(state.session, rid, state.book).then((res) => {
			if(res.status === 200) {
				router.push({
					name: 'resourceinput'
				})
			} else {
				console.log('保存失败')
			}
		}).catch((err) => {
			console.log(err)
		})
	},
	saveMusic({
		state
	}, bid) {
		saveMusic(state.session, bid, state.music).then((res) => {
			if(res.status === 200) {
				router.push({
					name: 'resourceinput'
				})
			} else {
				console.log('保存失败')
			}
		}).catch((err) => {
			console.log(err)
		})
	},
	saveMovie({
		state
	}, cid) {
		saveMovie(state.session, cid, state.movie).then((res) => {
			if(res.status === 200) {
				router.push({
					name: 'resourceinput'
				})
			} else {
				console.log('保存失败')
			}
		}).catch((err) => {
			console.log(err)
		})
	},
	delBook({
		state,
		dispatch
	}, payload) {
		delBook(state.session, payload.rid).then((res) => {
			if(res.status === 200) {
				if(payload.route.name === 'resourceinput') {
					dispatch('getAllbooks', {
						limit: 5
					})
					return true
				}
			} else {
				console.log('删除失败')
				return false
			}
		}).catch((err) => {
			console.log(err)
		})
	},
	delMusic({
		state,
		dispatch
	}, payload) {
		delMusic(state.session, payload.bid).then((res) => {
			if(res.status === 200) {
				if(payload.route.name === 'resourceinput') {
					dispatch('getAllmusics', {
						limit: 5
					})
					return true
				}
			} else {
				console.log('删除失败')
				return false
			}
		}).catch((err) => {
			console.log(err)
		})
	},
	delMovie({
		state,
		dispatch
	}, payload) {
		delMovie(state.session, payload.cid).then((res) => {
			if(res.status === 200) {
				if(payload.route.name === 'resourceinput') {
					dispatch('getAllmovies', {
						limit: 5
					})
					return true
				}
			} else {
				console.log('删除失败')
				return false
			}
		}).catch((err) => {
			console.log(err)
		})
	},
	searchBooks({
		commit
	}, payload) {
		commit('moreBook_toggle', true)
		const startTime = beginLoading(commit, payload.add)
		if(payload.value) {
			commit('isLoading_toggle', false)
		}
		return Vue.http.get('/api/somebooks', {
				params: {
					payload
				}
			})
			.then(response => response.json())
			.then(books => {
				if(payload.add) {
					endLoading(commit, startTime, 'loadMore_toggle')
				} else {
					commit('set_all_books', books)
					endLoading(commit, startTime, 'isLoading_toggle')
				}
			}).catch((err) => {
				console.log(err)
			})
	},
	searchMusics({
		commit
	}, payload) {
		commit('moreMusic_toggle', true)
		const startTime = beginLoading(commit, payload.add)
		if(payload.value) {
			commit('isLoading_toggle', false)
		}
		return Vue.http.get('/api/somemusics', {
				params: {
					payload
				}
			})
			.then(response => response.json())
			.then(musics => {
				if(payload.add) {
					endLoading(commit, startTime, 'loadMore_toggle')
				} else {
					commit('set_all_musics', musics)
					endLoading(commit, startTime, 'isLoading_toggle')
				}
			}).catch((err) => {
				console.log(err)
			})
	},
	searchMovies({
		commit
	}, payload) {
		commit('moreMovie_toggle', true)
		const startTime = beginLoading(commit, payload.add)
		if(payload.value) {
			commit('isLoading_toggle', false)
		}
		return Vue.http.get('/api/somemovies', {
				params: {
					payload
				}
			})
			.then(response => response.json())
			.then(movies => {
				if(payload.add) {
					endLoading(commit, startTime, 'loadMore_toggle')
				} else {
					commit('set_all_movies', movies)
					endLoading(commit, startTime, 'isLoading_toggle')
				}
			}).catch((err) => {
				console.log(err)
			})
	},
	getBook({
		commit,
		state
	}, rid) {
		return Vue.http.get('/api/book/' + rid)
			.then(response => {
				commit('set_book', response.data)
			}).catch((err) => {
				console.log(err)
			})
	},
	getMusic({
		commit,
		state
	}, bid) {
		return Vue.http.get('/api/music/' + bid)
			.then(response => {
				commit('set_music', response.data)
			}).catch((err) => {
				console.log(err)
			})
	},
	getMovie({
		commit,
		state
	}, cid) {
		return Vue.http.get('/api/movie/' + cid)
			.then(response => {
				commit('set_movie', response.data)
			}).catch((err) => {
				console.log(err)
			})
	},
	//消息的获取
	getMessageBox({
		commit,
		state
	}) {
		getMessageBox(state.session).then((res) => {
			if(res.status === 200) {
				commit('set_messageBox', res.data)
			} else {
				console.log('获取失败')
			}
		}).catch((err) => {
			console.log(err)
		})
	},

	//tags
	getAllTags({
		commit
	}) {
		return Vue.http.get('/api/tags')
			.then(response => {
				commit('set_tags', response.data)
			}).catch((err) => {
				console.log(err)
			})
	},
	getCommentsNum({
		state,
		commit
	}) {
		getCommentsNum(state.session).then((res) => {
			if(res.status === 200) {
				commit('set_commentNum', res.data)
			} else {
				console.log('获取失败')
			}
		})
	},
	//评论的提交
	summitComment({
		commit
	}, payload) {
		if(payload.date) {
			return Vue.http.patch('/api/commentss/', payload)
		} else {
			return Vue.http.post('/api/comment', payload)
		}
	},
	getAllComments({
		commit
	}, payload) {
		return Vue.http.get('/api/comments', {
				params: {
					payload
				}
			})
			.then(response => response.json())
			.then(comments => {
				commit('set_comments', comments)
			}).catch((err) => {
				console.log(err)
			})
	},
	getComments({
		commit,
		state
	}) {
		getComments(state.session).then((res) => {
			if(res.status === 200) {
				commit('set_allcomments', res.data)
			} else {
				console.log('获取失败')
			}
		}).catch((err) => {
			console.log(err)
		})
	},
	updateLike({
		commit
	}, payload) {
		return Vue.http.patch('/api/comments/' + payload.id, {
				option: payload.option
			})
			.catch((err) => {
				console.log(err)
			})
	},
	getAllFiles({
		commit
	}, payload) {
		return Vue.http.get('/api/commonFiles', {
				params: {
					payload
				}
			})
			.then(response => response.json())
			.then(files => {
				if(files.length === 0) {
					commit('noMore_toggle', true)
				} else {
					commit('set_all_files', files)
				}
			}).catch((err) => {
				console.log(err)
			})
	},
}