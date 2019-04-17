<template>
	<div id="Blog">
		<div class="Blog-box">
			<section class="left">
				<!--显示最近访问和搜索文章-->
				<div class="search">
					<el-select v-model="select_type" placeholder="类型" class="handle-select mr10" clearable size="small">
						<el-option v-for="item in options" :key="item.key" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
					<el-input v-model="select_word" placeholder="关键字" class="handle-input mr10" size="small"></el-input>
					<el-button type="primary" icon="search" @click="search" size="small">搜索</el-button>
				</div>
				<!--搜索博客-->
				<div class="latest-comment">
					<h3>最新留言</h3>
					<hr />
					<ul>
						<li v-for="names in allcomment">
							<el-popover placement="right" title="评论内容" width="200" trigger="hover" :content='names.content'>
								<router-link :to="{name: 'article', params: {id: names.articleId}}" tag="a" slot="reference">{{ names.name }}</router-link>
							</el-popover>
						</li>
					</ul>
				</div>
				<!--最新留言-->
				<div class="about">
					<h3>关于</h3>
					<hr />
					<div class="avater">
						<img src="http://pa5114ths.bkt.clouddn.com/me1.jpg" />
						<!--头像设置-->
					</div>
					<div class="about_content">
						<span><!--个人简介-->
							<i class="iconfont icon-about"></i>
							<router-link to="/about">
								个人简介
							</router-link>
						</span>
						<!--博客的主要信息-->
						<span>
							<i class="iconfont icon-wenzhang"></i>
							文章:{{aids.length}}
						</span>
						<span>
							<i class="iconfont icon-liuyan"></i>
							留言:{{commentsNum}}
						</span>
					</div>
				</div>
				<!--关于我-->
			</section>
			<section class="right">
				<div class="articles">
					<nav class="tagsBox">
						<div class="tagFlex">
							<button v-for="(tag, index) in data" :class="{activeBtn: selectIndex === index}" @click="switchTag({value: tag.name, page: 1, sortname: 'date',limit: 4,add: false}, index, tag.name)">
								<span><!--标签-->
									#{{ tag.name }}
								</span>
								<span>
									{{ tag.count }}
								</span>
							</button>
						</div>
					</nav>
					<div v-for="(article, index) in articlesBox" class="article">
						<img :src="article.imgUrl" :alt="article.title" width="15%" height="90%" />
						<div class="article_info">
							<h3>{{article.title}}</h3>
							<time><i class="iconfont icon-shijian"></i>{{article.date | toDate}}</time>
							<span class="articleTag"><i class="iconfont icon-label"></i>{{article.tags | toTag}}</span>
							<span class="commentNumber"><i class="iconfont icon-huifu"></i>{{article.comment_n}}</span>
							<router-link :to="{name: 'article', params: {id: article.aid,index: index,page: page}}" tag="button" exact>
								<span>阅读更多</span>
							</router-link>
						</div>
					</div>
				</div>
				<div class="block">
					<el-pagination @current-change="handleCurrentChange" :page-size="4" :current-page="page" layout="total, prev, pager, next, jumper" :total="aids.length" size="small">
					</el-pagination>
				</div>
			</section>
			<git-corner></git-corner>
		</div>
	</div>
</template>

<script>
	import { mapMutations, mapActions, mapState, mapGetters } from 'vuex'
	import GitCorner from '@/components/front/component/gitCorner'
	import SearchContent from './search'
	export default {
		data() {
			return {
				Tags: [{
					'name': '最热',
					'count': ''
				}, {
					'name': '最新',
					'count': ''
				}],
				options: [{
					value: 'date',
					key: 1,
					label: '日期'
				}, {
					value: 'tags',
					key: 2,
					label: '标签'
				}, {
					value: 'title',
					key: 3,
					label: '题目'
				}],
				selectIndex: Number,
				cur_page: 1,
				select_word: '',
				select_type: '',
				show: false,
				isMore: false,
				sortname: '',
				page: 1,
				is_search: false
			}
		},
		filters: { //格式的转换
			toDate(input) {
				var d = new Date(input);
				var year = d.getFullYear();
				var month = d.getMonth() + 1;
				var day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();
				return year + '-' + month + '-' + day;
			},
			toTag(arr) {
				return arr.join(',')
			}
		},
		created() {
			this.getAllTags()
			this.getComments()
			this.getAllaids()
			this.getCommentsNum()
			this.page = Number(localStorage.getItem('pagination')) || 1; //记忆刷新页面之前的页面位置
			this.handleCurrentChange(this.page)
		},
		computed: {
			...mapGetters(['articlesBox']),
			...mapState(['loadMore', 'moreArticle', 'isLoading', 'noMore', 'articles', 'tags', 'comments', 'allcomments', 'curTag', 'aids', 'commentNum']),
			data() {
				/*this.tags.forEach((tag) => {
					this.Tags.push(tag)
				})
				return Array.from(new Set(this.Tags))*/ //数组去重
				if(this.Tags.length > 2) {
					this.Tags = [{
						'name': '最热',
						'count': ''
					}, {
						'name': '最新',
						'count': ''
					}]
				}
				this.Tags.push.apply(this.Tags, this.countNum(this.tags));
				return this.Tags;
			},
			allcomment() {
				let commentBox = this.unique(this.allcomments)
				return commentBox.slice(0, 6)
			},
			commentsNum() {
				return this.sum(this.commentNum)
			}
		},
		beforeUpdate() { //刷新页面
			if(this.curTag) {
				localStorage.setItem('pagination', '1')
			} else {
				localStorage.setItem('pagination', this.page)
			}
		},
		beforeDestroy() { //退出页面
			localStorage.setItem('pagination', '1')
		},
		methods: {
			...mapMutations(['set_curtag', 'noMore_toggle']),
			...mapActions(['getAllArticles', 'searchArticles', 'getAllTags', 'getAllComments', 'getComments', 'getCommentsNum', 'getAllaids']),
			switchTag(payload, index, tag) { //切换标题
				this.isMore = true
				this.selectIndex = index
				this.set_curtag(tag)
				this.page = 1
				if(index === 0) {
					this.sortname = 'comment_n'
					payload.sortname = 'comment_n'
					this.getAllArticles(payload)
				} else if(index === 1) {
					this.sortname = 'alldate'
					payload.sortname = 'alldate'
					this.getAllArticles(payload)
				} else {
					this.sortname = 'date'
					this.getAllArticles(payload)
				}
			},
			handleCurrentChange(val) { //控制分页
				this.cur_page = val
				if(!this.is_search) {
					this.page = val
					this.getAllArticles({
						value: this.curTag,
						add: false,
						page: this.cur_page,
						limit: 4,
						sortname: this.sortname
					})
				} else {
					this.searchArticles({
						key: this.select_type,
						value: this.select_word,
						page: this.cur_page
					})
				}
			},
			unique(arr) {
				let ret = [];
				let names = [];
				let len = arr.length
				for(let i = 0; i < len; i++) {
					let item = arr[i];
					if(names.indexOf(item['name']) === -1) {
						names.push(item['name'])
						ret.push(item)
					}
				}
				return ret;
			},
			open(name) {
				const h = this.$createElement;
				this.$notify({
					title: '错误信息',
					message: h('i', {
						style: 'color: teal'
					}, name)
				});
			},
			search() { //搜索内容
				const re_time = /\d{4}-\d{2}-\d{2}/;
				this.is_search = true
				if(this.select_word === '') {
					this.open('没有填写关键字')
				} else if(this.select_type === '') {
					this.open('没有选择类型')
				} else {
					switch(this.select_type) {
						case 'date':
							if(!re_time.test(this.select_word)) {
								this.open("时间搜索格式错误,应该为'(xxxx)-(xx)-(xx)'")
							} else {
								this.set_curtag('')
								this.searchArticles({
									key: this.select_type,
									value: this.select_word
								})
							}
							break
						default:
							this.set_curtag(this.select_word)
							this.searchArticles({
								key: this.select_type,
								value: this.select_word
							})
					}

				}
			},
			sum(arr) {
				let s = 0;
				arr.forEach(function(val, idx, arr) {
					s += val;
				}, 0);
				return s;
			},
			countNum(arr) {
				var res = [];
				var a = arr.reduce((obj, item) => {
					if(item in obj) {
						obj[item]++
					} else {
						obj[item] = 1
					}
					return obj
				}, {})
				for(let i in a) {
					res.push({
						"name": i,
						"count": a[i]
					})
				}
				
				return res;
			}
		},
		components: {
			GitCorner
		}
	}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	#Blog {
		width: 100%;
		.Blog-box {
			height: 34rem;
			display: inline-block;
			display: flex;
			overflow: hidden;
			flex-wrap: nowrap;
			.left {
				height: 33rem;
				overflow: hidden;
				margin-left: 1rem;
				.search {
					background-color: transparent;
				}
				.latest-comment {
					min-height: 16rem;
					margin-top: 1rem;
					border-radius: 1rem;
					border: 1px solid #d3d3d3;
					h3 {
						color: #000000;
					}
					ul {
						list-style-type: square;
						li {
							text-indent: 0.8em;
							white-space: nowrap;
							text-overflow: ellipsis;
							a {
								cursor: pointer;
								color: #000000;
							}
						}
					}
				}
				.about {
					height: 10rem;
					margin-top: 1rem;
					border-radius: 1rem;
					border: 1px solid #D3D3D3;
					h3 {
						color: #000000;
					}
					.avater {
						width: 6rem;
						height: 5rem;
						float: left;
						img {
							margin-left: 1rem;
							margin-top: 1rem;
							width: 5rem;
							height: 5rem;
						}
					}
					.about_content {
						margin-top: 1rem;
						margin-left: 7rem;
						a {
							color: #606975;
							text-decoration: underline;
						}
						span {
							display: block;
						}
					}
				}
			}
			.right {
				overflow: hidden;
				position: relative;
				height: 34rem;
				h2 {
					text-align: center;
					color: #000000;
				}
				.tagsBox {
					.tagFlex {
						display: flex;
						flex-wrap: wrap;
						justify-content: space-around;
						border-bottom: solid 1px #EFF1F5;
						.activeBtn {
							background-color: #e78170;
							color: #ffffff;
							transition: 1s;
						}
						button {
							transition: 1s;
							padding-left: 0.1rem;
							padding-right: 0.1rem;
							text-align: center;
							margin: 0 0.25rem 0.25rem 0;
						}
						button {
							height: 1.5rem;
							border: none;
							outline: none;
							margin-top: 1.25rem;
							cursor: pointer;
							border-radius: 0.5rem;
							transition: 0.5s;
							font-size: 0.875rem;
							span {
								text-align: center;
								display: inline-block;
								height: 1rem;
								line-height: 1rem;
								transition: 0.5s;
							}
						}
					}
				}
				.article {
					height: 6.5rem;
					margin-top: 0.5rem;
					display: flex;
					width: 100%;
					border-bottom: 0.125rem solid rgb(129, 216, 208);
					.article_info {
						width: 80%;
						height: 90%;
						margin-left: 3rem;
						h3 {
							color: rgb(129, 216, 208);
							margin-top: 0;
							margin-bottom: 0.25rem;
						}
						time {
							margin-top: 0.25rem;
							margin-right: 0.25rem;
						}
						button {
							width: 5.75rem;
							height: 2rem;
							line-height: 2rem;
							margin-bottom: 0.25rem;
							border-radius: 0.25rem;
							position: relative;
							text-align: center;
							background-color: darkturquoise;
							margin-left: calc(100% - 8.75rem);
							outline: none;
							margin-top: 0.25rem;
							padding-left: 0.4375rem;
							cursor: pointer;
							border-radius: 0.25rem;
							transition: 0.5s;
							font-size: 0.875rem;
							span {
								display: inline-block;
								height: 1.5rem;
								line-height: 1.5rem;
								position: relative;
								transition: 0.5s;
							}
							&:hover span {
								padding-right: 0.625rem;
								transition: 0.5s;
							}
							span:after {
								content: '\00bb';
								opacity: 0;
								transition: 0.5s;
								font-size: 1.25rem;
								position: relative;
								right: 0;
							}
							&:hover span:after {
								opacity: 1;
								right: -0.5rem;
							}
						}
						.articleTag {
							margin-bottom: 1.875rem;
							margin-right: 0.625rem;
						}
						.commentNumber {
							i {
								margin-right: 0.3125rem;
							}
						}
						i.icon-label,
						i.icon-shijian,
						i.icon-huifu {
							color: #E78123;
							margin-right: 0.3125rem;
						}
					}
				}
				.noMore {
					width: 100%;
					height: 1rem;
					line-height: 1rem;
					color: #81d8d0;
					margin-top: 1.25rem;
					margin-bottom: 1.25rem;
					text-align: center;
					cursor: pointer;
				}
				.block {
					position: absolute;
					overflow: hidden;
					bottom: 5px;
					right: 0rem;
				}
			}
		}
	}
</style>