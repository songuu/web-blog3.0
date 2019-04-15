import {setSession} from '@/lib/utils'

export default {
	// login
	set_user: (state, user) => { //设置缓存数据
		/*localStorage.setItem('token', user.token)
		localStorage.setItem('userName', user.name)*/
		state.user = user
		state.session = user.token
		setSession(user.token)
	},
	unset_user: (state) => {
		/*localStorage.removeItem('token')
		localStorage.removeItem('userName')*/
		state.user = {}
		state.session = ''
		setSession('')
	},
	//article
	set_article: (state, article) => {
		state.article = article
	},
	update_post_content: (state, content) => {
		state.article.content = content
	},
	update_post_title: (state, title) => {
		state.article.title = title
	},
	update_post_tags: (state, tags) => {
		state.article.tags = tags
	},
	update_post_imgUrl: (state, imgUrl) => {
		state.article.imgUrl = imgUrl
	},
	isSaving_ctl: (state, isSaving) => {
		state.isSaving = isSaving
	},
	set_all_articles: (state, articles) => {
		state.articles = articles
	},
	isLoading_toggle: (state, isLoading) => {
		state.isLoading = isLoading
	},
	loadMore_toggle: (state, loadMore) => {
		state.loadMore = loadMore
	},
	moreArticle_toggle: (state, flag) => {
		state.moreArticle = flag
	},
	noMore_toggle: (state, flag) => {
		state.noMore = flag
	},
	add_articles: (state, articles) => {
        state.articles = state.articles.concat(articles)
   	},
    set_aids: (state, aids) => {
    	state.aids = aids
    },
    //comment
    set_comments: (state, comments) => {
        state.comments = comments
    },
   	set_allcomments: (state, allcomments) => {
    	state.allcomments = allcomments
    },
    /*set_lastComments: (state, lastcomments) => {
    	state.lastcomments = lastcomments
    },*/
   	set_commentNum: (state, commentNum) => {
   		state.commentNum = commentNum
   	},
    //tags
    set_tags: (state, tags) => {
        state.tags = tags
    },
    set_curtag: (state, tag) => {
        state.curTag = tag
    },
    
    //测试
    set_dialog: (state, payload) => {
        state.dialog = payload
        state.dialog.resolveFn = () => {}
        state.dialog.rejectFn = () => {}
    },
    
    //设置待办事项计划
    set_deal: (state,todoList) => {
    	state.todoList = todoList
    },  
    set_plan: (state,todoItem) => {
    	state.todoItem = todoItem
    },
    set_all_plans: (state,todoList) => {
    	state.todoList = todoList
    },
	morePlan_toggle: (state, flag) => {
		state.morePlan = flag
	},
	
	//设置资源的获得
	set_all_books: (state,books) => {
		state.books = books
	},
	set_new_books: (state,newbooks) => {
		state.newbooks = newbooks
	},
	set_all_musics: (state,musics) => {
		state.musics = musics
	},
	set_new_musics: (state,newmusics) => {
		state.newmusics = newmusics
	},
	set_all_movies: (state,movies) => {
		state.movies = movies
	},
	set_new_movies: (state,newmovies) => {
		state.newmovies = newmovies
	},
	set_book: (state,book) => {
		state.book = book
	},
	set_music: (state,music) => {
		state.music = music
	},
	set_movie: (state,movie) => {
		state.movie = movie
	},
	moreBook_toggle: (state, flag) => {
		state.moreBook = flag
	},
	moreMusic_toggle: (state, flag) => {
		state.moreMusic = flag
	},
	moreMovie_toggle: (state, flag) => {
		state.moreMovie = flag
	},
	set_all_files: (state, files) => {
		state.files = files
	},
	
	//设置通知
	set_messageBox: (state, messageBox) => {
		state.messageBox = messageBox
	}
}