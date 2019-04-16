import Vue from 'vue'
import Router from 'vue-router'
import Store from '../store'

const Test = resolve => require(['@/components/test4'], resolve)

const Index = resolve => require(['@/components/front/index'], resolve)
const Life = resolve => require(['@/components/front/Life'], resolve)
const Blog = resolve => require(['@/components/front/Articles'], resolve)
const article = resolve => require(['@/components/front/article'], resolve)
const Resource = resolve => require(['@/components/front/Resource'], resolve)
const search = resolve => require(['@/components/front/search'], resolve)
const Error403 = resolve => require(['@/components/front/component/Error403'], resolve)
const Error404 = resolve => require(['@/components/front/component/Error404'], resolve)
const book = resolve => require(['@/components/front/component/book'], resolve)
const music = resolve => require(['@/components/front/component/music'], resolve)
const movie = resolve => require(['@/components/front/component/movie'], resolve)
const download = resolve => require(['@/components/front/component/download'], resolve)
const share = resolve => require(['@/components/front/component/share'], resolve)
const contact = resolve => require(['@/components/front/component/contact'], resolve)
const about = resolve => require(['@/components/front/component/about'], resolve)

const Login = resolve => require(['@/components/back/login'], resolve)
const Admin = resolve => require(['@/components/back/admin'], resolve)
const Account = resolve => require(['@/components/back/account'], resolve)
const Essay = resoleve => require(['@/components/back/essay'], resoleve)
const editor = resolve => require(['@/components/back/editor'], resolve)
const ResourceInput = resolve => require(['@/components/back/resourceInput'], resolve)
const Person = resolve => require(['@/components/back/Person'], resolve)
const Tour = resolve => require(['@/components/back/component/Tour'], resolve)
const Notify = resolve => require(['@/components/back/component/notify'], resolve)
const Management = resolve => require(['@/components/back/management'], resolve)
const CommonFile = resolve => require(['@/components/back/commonFile'], resolve)

Vue.use(Router)

const router = new Router({
	mode: 'hash',
	saveScrollPosition: true, // 指定能够恢复到上一次进来的位置   但是在vue2中间已经取消   但是可以指定允许使用  saveScrollPosition: true
	scrollBehavior(to, from, savedPosition) {
		if(to.hash) {
			return {
				selector: to.hash
			}
		} else {
			return {
				x: 0,
				y: 0
			}
		}
	},
	routes: [{
			path: '/',
			name: 'index',
			redirect: 'blog',
			component: Index,
			children: [{
					path: 'blog',
					name: 'blog',
					component: Blog,
					meta: {
						title: '文章'
					}
				},
				{
					path: 'blog/:id',
					name: 'article',
					component: article,
					meta: {
						title: '文章'
					}
				},
				{
					path: 'life',
					name: 'life',
					component: Life,
					meta: {
						title: '生活'
					}
				},
				{
					path: 'book',
					name: 'book',
					component: book,
					meta: {
						title: '图书资源'
					}
				},
				{
					path: 'music',
					name: 'music',
					component: music,
					meta: {
						title: '音乐资源'
					}
				},
				{
					path: 'movie',
					name: 'movie',
					component: movie,
					meta: {
						title: '电影资源'
					}
				},
				{
					path: 'download',
					name: 'down',
					component: download,
					meta: {
						title: '下载'
					}
				},
				{
					path: 'download/:type/:id',
					name: 'download',
					component: download,
					meta: {
						title: '下载'
					}
				},
				{
					path: 'share/:type/:id',
					name: 'share',
					component: share,
					meta: {
						title: '分享'
					}
				},
				{
					path: 'contact',
					name: 'contact',
					component: contact,
					meta: {
						title: '联系站长'
					}
				},
				{
					path: 'about',
					name: 'about',
					component: about,
					meta: {
						title: '关于我'
					}
				}
			]
		},
		{
			path: '/test',
			name: 'test',
			component: Test,
			meta: {
				title: '测试'
			}
		},
		{
			path: '/login',
			name: 'login',
			component: Login,
			meta: {
				title: '登陆界面'
			}
		},
		{
			path: '/admin',
			name: 'admin',
			component: Admin,
			redirect: '/management',
			meta: {
				requireAuth: true,
				title: '用户首页'
			},
			children: [{
					path: '/management',
					meta: {
						requireAuth: true,
						title: '网站信息管理'
					},
					name: 'management',
					component: Management
				},
				{
					path: '/account',
					meta: {
						requireAuth: true,
						title: '添加用户'
					},
					name: 'account',
					component: Account
				}, {
					path: '/essay',
					meta: {
						requireAuth: true,
						title: '文章管理'
					},
					name: 'essay',
					component: Essay,
				}, {
					path: '/editor',
					meta: {
						requireAuth: true,
						title: '文章编辑'
					},
					name: 'editor',
					component: editor,
				}, {
					path: '/resourceinput',
					meta: {
						requireAuth: true,
						title: '资源管理'
					},
					name: 'resourceinput',
					component: ResourceInput
				},
				{
					path: '/person',
					meta: {
						requireAuth: true,
						title: '个人管理'
					},
					name: 'person',
					component: Person
				},
				{
					path: '/tour',
					meta: {
						requireAuth: true,
						title: '个人旅游管理'
					},
					name: 'tour',
					component: Tour
				},
				{
					path: '/notify',
					meta: {
						requireAuth: true,
						title: '消息通知'
					},
					name: 'notify',
					component: Notify
				},{
					path: '/commonFile',
					meta: {
						requireAuth: true,
						title: '通用资源管理'
					},
					name: 'commonFile',
					component: CommonFile
				}
			]
		}, 
		{
			path: '/error403',
			name: 'error403',
			component: Error403
		},
		{
			path: '/error404',
			name: 'error404',
			component: Error404
		},
		{
			path: '*',
			redirect: '/error404'
		}
	]
})

router.beforeEach((to, from, next) => {
	document.title = to.meta.title
	if(Store.state.session && to.name === 'login') {
		next({
			name: 'admin'
		})
	} else if(!Store.state.session && to.meta.requireAuth) {
		next({
			name: 'login'
		})
	} else {
		next()
	}
})

export default router