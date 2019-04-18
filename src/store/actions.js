import Vue from 'vue'
import router from '../router'

import { login, logout, resetUser } from '@/api/user'
import { getAllArticles, saveArticle, delArticle, getArticle, searchArticles, getAllaids } from '@/api/article'
import { sendMail, getAllTags, updateMessage, getArchives, getArchNum } from '@/api/common'
import { getComments, getCommentsNum, summitComment, updateLike, getAllComments } from '@/api/comment'
import { getAllplans, delPlan, savePlan } from '@/api/plan'
import { getAllbooks, getAllmusics, getAllmovies, saveBook, saveMusic, saveMovie, delBook, delMusic, delMovie, getNewbooks, getNewmovies, getNewmusics, getBook, getMusic, getMovie, searchBooks, searchMovies, searchMusics } from '@/api/resource'

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
		return sendMail(payload).catch((err) => {
			console.log(err)
		})
	},
	//  article的http请求
	saveArticle({
		state,
		commit
	}, aid) {
		//commit('isSaving_ctl', false)
		return saveArticle(state.session, aid, state.article).catch((err) => {
			console.log(err)
		})
	},
	getAllArticles({
		commit
	}, payload) {
		commit('moreArticle_toggle', true)
		const startTime = beginLoading(commit, payload.add)
		if(payload.value) {
			commit('isLoading_toggle', false)
		}
		getAllArticles(payload).then((res) => {
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
		getArticle(aid).then((res) => {
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
		searchArticles(payload).then((res) => {
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
	getAllaids({
		commit
	}) {
		getAllaids().then((res) => {
			if(res.status === 200) {
				commit('set_aids', res.data)
			} else {
				console.log('获取失败')
			}
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
		commit
	}, payload) {
		commit('moreBook_toggle', true)
		const startTime = beginLoading(commit, payload.add)
		if(payload.value) {
			commit('isLoading_toggle', false)
		}
		getNewbooks(payload).then((res) => {
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
		commit
	}, payload) {
		commit('moreMusic_toggle', true)
		const startTime = beginLoading(commit, payload.add)
		if(payload.value) {
			commit('isLoading_toggle', false)
		}
		getAllmusics(payload).then((res) => {
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
		commit
	}, payload) {
		commit('moreMusic_toggle', true)
		const startTime = beginLoading(commit, payload.add)
		if(payload.value) {
			commit('isLoading_toggle', false)
		}
		getNewmusics(payload).then((res) => {
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
		commit
	}, payload) {
		commit('moreMovie_toggle', true)
		const startTime = beginLoading(commit, payload.add)
		if(payload.value) {
			commit('isLoading_toggle', false)
		}
		getAllmovies(payload).then((res) => {
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
		commit
	}, payload) {
		commit('moreMovie_toggle', true)
		const startTime = beginLoading(commit, payload.add)
		if(payload.value) {
			commit('isLoading_toggle', false)
		}
		getNewmovies(payload).then((res) => {
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
		searchBooks(payload).then((res) => {
			if(res.stutas === 200) {
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
	searchMusics({
		commit
	}, payload) {
		commit('moreMusic_toggle', true)
		const startTime = beginLoading(commit, payload.add)
		if(payload.value) {
			commit('isLoading_toggle', false)
		}
		searchMusics(payload).then((res) => {
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
	searchMovies({
		commit
	}, payload) {
		commit('moreMovie_toggle', true)
		const startTime = beginLoading(commit, payload.add)
		if(payload.value) {
			commit('isLoading_toggle', false)
		}
		searchMovies(payload).then((res) => {
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
	getBook({
		commit,
		state
	}, rid) {
		getBook(rid).then((res) => {
			if(res.status === 200) {
				commit('set_book', res.data)
			} else {
				console.log('获取失败')
			}
		}).catch((err) => {
			console.log(err)
		})
	},
	getMusic({
		commit,
		state
	}, bid) {
		getMusic(bid).then((res) => {
			if(res.status === 200) {
				commit('set_music', res.data)
			} else {
				console.log('获取失败')
			}
		}).catch((err) => {
			console.log(err)
		})
	},
	getMovie({
		commit,
		state
	}, cid) {
		getMovie(cid).then((res) => {
			if(res.status === 200) {
				commit('set_movie', res.data)
			} else {
				console.log('获取失败')
			}
		}).catch((err) => {
			console.log(err)
		})
	},

	//更新消息的阅读状态
	updateMessage({}, payload) {
		return updateMessage(payload)
	},

	//tags
	getAllTags({
		commit
	}) {
		getAllTags().then((res) => {
			if(res.status === 200) {
				commit('set_tags', res.data)
			} else {
				console.log('获取失败')
			}
		}).catch((err) => {
			console.log(err)
		})
	},
	getCommentsNum({
		commit
	}) {
		getCommentsNum().then((res) => {
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
		return summitComment(payload).catch((err) => {
			console.log(err)
		})
	},
	getAllComments({
		commit
	}, payload) {
		getAllComments(payload).then((res) => {
			if(res.status === 200) {
				commit('set_comments', res.data)
			} else {
				console.log('获取失败')
			}
		}).catch((err) => {
			console.log(err)
		})
	},
	getComments({
		commit,
		state
	}) {
		getComments().then((res) => {
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
		return updateLike(payload).catch((err) => {
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
	getArchives({
		commit
	}, payload) {
		return getArchives(payload).then((res) => {
			if(res.status === 200) {
				commit('set_archives', res.data)
			} else {
				console.log('获取失败')
			}
		}).catch((err) => {
			console.log(err)
		})
	},
	getArchNum({
		commit
	}) {
		return getArchNum().then((res) => {
			if(res.status === 200) {
				commit('set_archNum', res.data)
			} else {
				console.log('获取失败')
			}
		}).catch((err) => {
			console.log(err)
		})
	}
}