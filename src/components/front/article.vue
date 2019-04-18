<template>
	<div id="articleBox">
		<div class="article">
			<div class="crumbs">
				<el-breadcrumb separator=">>">
					<el-breadcrumb-item>
						<i class="el-icon-tickets"></i>
						<router-link :to="{name: 'blog'}" tag="i">文章列表</router-link>
					</el-breadcrumb-item>
					<el-breadcrumb-item>
						<i>文章</i>
					</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
			<div id="content">
				<h1 class="title">{{data.title}}</h1>
				<div class="appendInfo">
					<time>
	                    <i class="iconfont icon-shijian"></i>{{data.date | toDate}}
	                </time>
					<span>
	                    <i class="iconfont icon-label"></i>{{data.tags | toTag}}
	                </span>
					<a class="commentCount" href="#comment">
						<i class="iconfont icon-huifu"></i>{{data.comment_n}}
					</a>
				</div>
				<article-list class="list"></article-list>
				<div class="content" v-html="Vmark" v-highlight></div>
				<div class="director">
					<div class="last">
						<router-link :to="{name: 'article', params: {id: articles[prepage].aid, index: prepage, page: $route.params.page}}" v-if="articles[prepage]" tag="p" class="left">
							{{articles[prepage].title}}
							<i class="iconfont icon-left"></i>
						</router-link>
						<router-link :to="{name: 'article', params: {id: articles[nextpage].aid,index: nextpage, page: $route.params.page}}" v-if="articles[nextpage]" tag="p" class="right">
							<i class="iconfont icon-right"></i> {{articles[nextpage].title}}
						</router-link>
					</div>
				</div>
				<article-comment class="comment"></article-comment>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapState, mapActions } from 'vuex'
	import marked from 'marked'
	import hljs from 'mavon-editor/dist/highlightjs/highlight.min.js'
	import ArticleComment from './component/ArticleComment'
	import ArticleList from './component/ArticleList'

	marked.setOptions({
		highlight: function(code) {
			return hljs.highlightAuto(code).value
		},
		sanitize: true
	})

	const renderer = new marked.Renderer()
	renderer.heading = function(text, level) {
		return '<h' + level +
			' id="' + text + '">' + text + '</h' + level + '>'
	}

	export default {
		data() {
			return {
				prepage: 0,
				nextpage: 0
			}
		},
		created() {
			const id = this.$route.params.id
			this.getAllaids().then(() => {
				if(id && this.aids) {
					return this.getData(id)
				} else {
					this.$router.push({
						name: 'error404'
					})
				}
			})
			this.initpage()
		},
		directives: {
			focus: {
				inserted: (el) => {
					el.focus()
				}
			},
			highlight(el) {
				let blocks = el.querySelectorAll('pre code');
				blocks.forEach((block) => {
					hljs.highlightBlock(block)
				})
			}
		},
		beforeRouteUpdate(to, from, next) {
			this.getArticle(to.params.id)
			if(to.params.index === 0) {
				this.prepage = -1
				this.nextpage = 1
			} else if(to.params.index === this.articles.length - 1) {
				this.prepage = to.params.index - 1
				//获取更多的文章
				this.getAllArticles({
					value: this.curTag,
					add: true,
					page: ++to.params.page
				})
				this.nextpage = to.params.index + 1
			} else {
				this.prepage = to.params.index - 1
				this.nextpage = parseInt(to.params.index) + 1
			}
			next()
		},
		filters: {
			toDate(input) {
				var d = new Date(input);
				var year = d.getFullYear();
				var month = d.getMonth() + 1;
				var day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();
				return year + '-' + month + '-' + day;
			},
			toTag(arr) {
				if(Array.isArray(arr)) {
					return arr.join(',')
				}
			}
		},
		computed: {
			...mapState(['articles', 'curTag', 'article', 'aids']),
			data() {
				return this.article
			},
			Vmark() {
				return marked(this.article.content || '', {
					renderer: renderer
				})
			}
		},
		methods: {
			...mapActions(['getArticle', 'getAllArticles', 'getAllaids']),
			mark: marked,
			getData(id) {
				var aidBox = []
				this.aids.forEach((item) => {
					aidBox.push(item.aid)
				})
				if(aidBox.indexOf(id) > -1) {
					this.getArticle(id)
				} else {
					this.$router.push({
						name: 'blog'
					})
				}
			},
			initpage() { //初始化页数信息
				const index = this.$route.params.index - 0
				let page = this.$route.params.page - 0 || 1
				if(index === 0) {
					this.prepage = -1
					this.nextpage = 1
				} else if(index === this.articles.length - 1) {
					this.prepage = index - 1
					//设置加载更多的文章
					this.getAllArticles({
						value: this.curTag,
						add: true,
						page: ++page
					})
					this.nextpage = index + 1
				} else {
					this.prepage = index - 1
					this.nextpage = index + 1
				}
			}
		},
		components: {
			ArticleComment,
			ArticleList
		}
	}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	#articleBox {
		width: 100%;
		.article {
			width: 64rem;
			display: inline-block;
			.crumbs {
				i {
					color: #000000;
				}
				i:nth-child(2) {
					font-weight: bold;
					color: #000000;
					cursor: pointer;
				}
			}
			#content {
				width: 100%;
				h1 {
					margin-bottom: 1.05rem;
					text-align: center;
					color: #000000;
				}
				.content {
					margin-top: 1rem;
					text-align: left;
					color: #000000;
					white-space: pre-wrap;
					word-wrap: break-word;
					text-indent: 2em;
					p {
						img {
							max-width: 100%;
						}
					}
				}
				.director {
					margin-top: 3.125rem;
					.last {
						color: #fff;
						font-size: 1.25rem;
						position: relative;
						width: 100%;
						display: flex;
						/*只是用来占据位置*/
						/*						flex-wrap: wrap;
						justify-content: space-between;*/
						margin-top: 1.25rem;
						i {
							font-size: 1.725rem;
							color: rgb(129, 216, 208);
						}
						i.icon-left {
							margin-right: 0.625rem;
						}
						i.icon-right {
							margin-left: 0.625rem;
						}
						p {
							/*flex-wrap: nowrap;*/
							color: #88b04b;
							display: inline-block;
							padding: 0 0.625rem;
							transition: 1s;
							margin-top: 1rem;
						}
						p.left {
							/*flex-basis: 40%;*/
							position: absolute;
							left: 0;
							text-align: left;
							&:hover {
								cursor: pointer;
								transition: 1s;
								padding-left: 0;
							}
						}
						p.right {
							/*flex-basis: 40%;*/
							position: absolute;
							right: 0;
							text-align: right;
							&:hover {
								cursor: pointer;
								transition: 1s;
								padding-right: 0;
							}
						}
					}
				}
				.appendInfo {
					text-align: right;
					time {
						color: #000000;
						display: inline-block;
					}
					span {
						color: #000000;
						display: inline-block;
					}
					a.commentCount {
						display: inline-block;
						color: #000000;
						cursor: pointer;
						&:hover {
							color: darkturquoise;
						}
					}
				}
			}
		}
	}
</style>