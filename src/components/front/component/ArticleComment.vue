<template>
	<div id='comment'>
		<div class='newComment'>
			<img :src="'http://pa5114ths.bkt.clouddn.com/' + imgName + '.jpg'" />
			<textarea spellcheck='false' placeholder='评论区' v-model='content' id='reply' ref='textBox'></textarea>
			<div class="inputBox">
				<input type='text' placeholder='邮箱 (用于通知)' v-model='address' />
				<input type='text' placeholder='称呼' v-model='name' class='name' id='nameBox' />
				<button @click='summit' :disabled='summitFlag'>
                    <span>{{summitFlag ? '提交中...' : '发布评论'}}</span>
                </button>
			</div>
		</div>
		<div class='allComments'>
			<div class='summary'>
				<p>评论数 {{comments.length}}</p>
				<p>
					<span @click="getAllComments({id: $route.params.id})">最早 </span>|
					<span @click="getAllComments({id: $route.params.id, sort: 'date'})">最新 </span>|
					<span @click="getAllComments({id: $route.params.id, sort: 'like'})"> 最热</span>
				</p>
			</div>
			<div class='comments' v-for='(comment,index) in comments'>
				<div id='info' :class='comment.imgName'>
					<p class='commentName' :id="comment.name">#{{index + 1}} <span>{{comment.name}}</span></p>
					<p class='text'>{{comment.content}}</p>
					<div class='options'>
						<p class='commentDate'>{{comment.date | toDate}}</p>
						<a href='#comment' data-scroll>
							<span @click='reply(comment.name)'>
                                <i class='iconfont icon-huifu'></i>回复
                            </span>
						</a>
						<p @click='addLike(comment._id, index)'>
							<i class='iconfont icon-like' :class='{activeLike: likeArr.indexOf(index) !== -1}'>
                            </i> {{comment.like}}
						</p>
					</div>
					<img :src="'http://pa5114ths.bkt.clouddn.com/' + comment.imgName + '.jpg'" />
				</div>
			</div>
			<p v-show='comments.length === 0' class='nocomment'>无人评论:(</p>
		</div>
	</div>
</template>

<script>
	import { mapActions, mapState, mapMutations } from 'vuex'
	export default {
		data() {
			return {
				name: '',
				address: '',
				content: '',
				imgName: '',
				summitFlag: false
			}
		},
		created() {
			this.getAllComments({
				id: this.$route.params.id
			})
			if(localStorage.token && this.user.name) {

				this.imgName = 'myself'
			} else {

				this.imgName = 'reviewer'
			}
			if(localStorage.reviewer) {
				this.address = localStorage['e-mail']
				this.name = localStorage['reviewer']
			}
		},
		filters: {
			toDate(input) {
				var d = new Date(input);
				var year = d.getFullYear();
				var month = d.getMonth() + 1;
				var day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();
				var hour = d.getHours() < 10 ? '0' + d.getHours() : '' + d.getHours();
				var minute = d.getMinutes() < 10 ? '0' + d.getMinutes() : '' + d.getMinutes();
				var second = d.getSeconds() < 10 ? '0' + d.getSeconds() : '' + d.getSeconds();
				return year + '-' + month + '-' + day + " " + hour + ':' + minute + ':' + second;
			},
		},
		computed: {
			...mapState(['comments', 'user']),
			likeArr() { // 访问者点赞了哪些评论的数组
				if(localStorage.getItem(this.$route.params.id)) {
					const item = localStorage.getItem(this.$route.params.id) // 初始化访问者的点赞情况
					return JSON.parse(item)
				}
				return []
			}
		},
		methods: {
			...mapActions(['summitComment', 'getAllComments', 'updateLike']),
			open(name) {
				const h = this.$createElement;
				this.$notify({
					title: '错误信息',
					message: h('i', {
						style: 'color: teal'
					}, name)
				});
			},
			summit() {
				const re = /^[\w_-]+@[\w_-]+\.[\w\\.]+$/
				if(!this.name || !this.content) {
					this.open('信息还没有填完')
					return
				} else if(!re.test(this.address)) {
					this.open('填写正确的邮箱地址')
					return
				}
				// 限制评论内容
				if(this.content.length > 500) {
					this.open('评论太长')
					return false
				} else if(this.content.length < 5) {
					this.open('内容太短')
					return false
				} else if(/\d{7,}/i.test(this.content) || //过滤掉具体的内容
					/(\d.*){7,}/i.test(this.content) ||
					/\u52A0.*\u7FA4/i.test(this.content) ||
					/(\u9876.*){5,}/i.test(this.content) ||
					/([\u4E00\u4E8C\u4E09\u56DB\u4E94\u516D\u4E03\u516B\u4E5D\u25CB\u58F9\u8D30\u53C1\u8086\u4F0D\u9646\u67D2\u634C\u7396\u96F6].*){7,}/i.test(this.content)
				) {
					this.open('禁止发表不好的内容')
					return false
				}
				this.summitFlag = true
				// 将评论者的邮箱和用户名存储在浏览器中，在created钩子中赋值, 这样刷新后邮箱和昵称都不用再写一遍
				localStorage.setItem('e-mail', this.address)
				localStorage.setItem('reviewer', this.name)
				this.summitComment({
					imgName: this.imgName,
					name: this.name,
					content: this.content,
					address: this.address,
					articleId: this.$route.params.id,
					curPath: this.$route.fullPath
				}).then(() => {
					this.content = ''
					this.summitFlag = false
					this.getAllComments({
						id: this.$route.params.id
					})
				}).catch((err) => {
					console.log(err)
					this.summitFlag = false
					this.name = ''
				})
			},
			reply(name) {
				this.content = '@' + name + ': '
				this.$refs.textBox.focus()
			},
			addLike(id, index) {
				const i = this.likeArr.indexOf(index)
				if(i === -1) {
					this.updateLike({
						id: id,
						option: 'add'
					}).then(() => {
						this.likeArr.push(index)
						this.getAllComments({
							id: this.$route.params.id
						})
						localStorage[this.$route.params.id] = JSON.stringify(this.likeArr) // 记录访问者的点赞情况
					}).catch((err) => {
						console.log(err)
					})
				} else {
					this.updateLike({
						id: id,
						option: 'drop'
					}).then(() => {
						this.likeArr.splice(i, 1)
						this.getAllComments({
							id: this.$route.params.id
						})
						localStorage[this.$route.params.id] = JSON.stringify(this.likeArr) // 记录访问者的点赞情况
					}).catch((err) => {
						console.log(err)
					})
				}
			}
		},
	}
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
	#comment {
		margin: 1.875rem auto 0.625rem;
		padding-top: 1.875rem;
		text-align: left;
		.newComment {
			position: relative;
			width: 100%;
			img {
				position: absolute;
				top: 50%;
				left: 3.125rem;
				margin-top: -3.125rem;
				width: 6.25rem;
				height: 6.25rem;
				border: 0.125rem solid #cccccc;
				border-radius: 0.625rem;
			}
			textarea {
				font-size: 1.125rem;
				border: 0.125rem solid rgb(129, 216, 208);
				padding: 0.3125rem;
				border-radius: 0.625rem;
				width: calc(100% - 16.5rem);
				margin-left: 15.625rem;
				height: 12.5rem;
				resize: none;
				background: transparent;
				outline: none;
				font-family: Georgia, 'Times New Roman', 'Microsoft YaHei', '微软雅黑', STXihei, '华文细黑', serif;
			}
			.inputBox {
				margin-left: 15.625rem;
				display: flex;
				flex-wrap: wrap;
				justify-content: center;
				input {
					flex-grow: 1;
					margin-right: 1.5625rem;
					font-size: 1.125rem;
					border: 0.125rem solid rgb(129, 216, 208);
					border-radius: 0.3125rem;
					outline: none;
					width: 12.5rem;
					height: 1.5625rem;
					margin-top: 1.25rem;
					margin-bottom: 0.625rem;
					padding-left: 0.3125rem;
					display: inline-block;
					background: transparent;
				}
				button {
					flex-grow: 1;
					margin-top: 1.25rem;
					width: 7.5rem;
					padding-left: 0;
					position: relative;
					left: 1.25rem;
					text-align: center;
					background: darkturquoise;
				}
				button {
					height: 1.9625rem;
					border: none;
					outline: none;
					color: #00193a;
					background: rgb(129, 216, 208);
					padding-left: 0.4375rem;
					cursor: pointer;
					border-radius: 0.5rem;
					transition: 0.5s;
					font-size: 0.875rem;
					span {
						display: inline-block;
						height: 1.9625rem;
						line-height: 1.9625rem;
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
			}
		}
		.allComments {
			margin-top: 1.875rem;
			.summary {
				display: flex;
				justify-content: space-between;
				background: rgba(245, 245, 245, 0.5);
				padding: 0.625rem;
				border-radius: 0.3125rem;
				span {
					cursor: pointer;
					&:hover {
						color: darkturquoise;
					}
				}
			}
			.comments {
				position: relative;
				padding: 0.3125rem;
				margin-top: 0.625rem;
				width: 100%;
				display: flex;
				flex-wrap: wrap;
				#info {
					width: 60%;
					border: 0.125rem solid #cccccc;
					border-radius: 0.3125rem;
					padding: 0.625rem;
					color: #ccc;
					.commentName {
						margin-left: 1rem;
						font-size: 1.125rem;
						margin-bottom: 0.3125rem;
						span {
							color: darkturquoise;
						}
					}
					.text {
						overflow: hidden;
						margin-left: 4rem;
						margin-top: 0.625rem;
						margin-bottom: 0.625rem;
					}
					.options {
						display: flex;
						flex-wrap: wrap;
						justify-content: flex-end;
						text-align: right;
						a {
							margin-right: 0.625rem;
							i.icon-huifu {
								margin-right: 0.3125rem;
							}
							&:hover {
								color: deepskyblue;
							}
						}
						p {
							display: inline-block;
							margin-right: 0.3125rem;
							cursor: pointer;
							&:hover {
								color: darkturquoise;
							}
						}
						i {
							color: #000000;
						}
					}
					img {
						width: 3.75rem;
						height: 3.75rem;
						position: absolute;
						top: 50%;
						margin-top: -0.875rem;
						border: 0.125rem solid #cccccc;
						border-radius: 0.3125rem;
					}
				}
			}
			.nocomment {
				margin: 1.25rem auto;
				text-align: center;
			}
		}
	}
	
	.activeLike {
		color: #ffc520;
	}
	
	.reviewer {
		margin-left: 6.25rem;
		img {
			left: 0.625rem;
		}
		&:after {
			position: absolute;
			left: 5.55rem;
			top: 50%;
			margin-top: -0.4375rem;
			content: '';
			width: 0;
			height: 0;
			border: 0.625rem solid transparent;
			border-right-color: #000000;
			z-index: 3;
		}
		&:before {
			position: absolute;
			left: 5.4rem;
			top: 50%;
			margin-top: -0.4375rem;
			content: '';
			width: 0;
			height: 0;
			border: 0.625rem solid transparent;
			border-right-color: #cccccc;
			z-index: 2;
		}
	}
	
	.me {
		position: relative;
		margin-left: calc(40% - 7.625rem);
		img {
			right: -5.9375rem;
		}
		&:after {
			position: absolute;
			right: -1.15rem;
			top: 50%;
			margin-top: -0.5rem;
			content: '';
			width: 0;
			height: 0;
			border: 0.625rem solid transparent;
			border-left-color: #000000;
			z-index: 3;
		}
		&:before {
			position: absolute;
			right: -1.3rem;
			top: 50%;
			margin-top: -0.5rem;
			content: '';
			width: 0;
			height: 0;
			border: 0.625rem solid transparent;
			border-left-color: #cccccc;
			z-index: 2;
		}
	}
	
	@media screen and (max-width: 980px) {
		.newComment {
			img {
				display: none !important;
			}
			textarea {
				width: calc(100% - 0.875rem) !important;
				margin-left: 0 !important;
			}
			.inputBox {
				margin-left: 0 !important;
				input {
					width: 40% !important;
				}
			}
		}
	}
</style>