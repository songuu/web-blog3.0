import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions.js'
import getters from './getters.js'
import mutations from './mutations.js'
import {getSession} from '@/lib/utils'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		isLoading: false,
		user: {},
		session: getSession(),
		article: {},
		articles: [],
		comments: [],
		allcomments: [],
		commentNum: [],
		tags: [],
		curTag: '',
		aids: [],
		todoList: [],
		todoItem: {},
		dialog: {
			isUpdate: false,
            resolveFn: () => {},
            rejectFn: () => {}
       	},
       	moreArticle: true,
       	morePlan: true,
       	moreBook: true,
       	moreMusic: true,
       	moreMovie: true,
        loadMore: false,
        isSaving: false,
        noMore: false,
        books: [],
        musics: [],
        movies: [],
        newbooks: [],
        newmusics: [],
        newmovies: [],
        book: {},
        music: {},
        movie: {},
        files: [],
		messageBox: [],
		login_message: {
			time: 10,
			position: '自贡'
		},
		position: '',
		person_message: {
			motto: '严峻的生活把他赶上了这条尘土飞扬的路',
			school: '四川理工学院',
			gratudation: '2019年7月12日',
			email: 'songuu.teen@gmail.com',
			homeplace: '四川.德阳',
			address: '四川.自贡',
			hobby: '足球.阅读.旅游'
		}
	},
	getters,
	actions,
	mutations
})
export default store