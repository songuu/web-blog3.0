<template>
	<div class="header">
		<div class="statusLine">
			<p class="left">
				<router-link :to="{name: 'index'}" class="iconfont icon-zhuye" tag="i"></router-link>
				<span>{{time}}好，{{name}}</span>
			</p>
			<p class="btn-bell">
				<el-tooltip effect="dark" :content="message?`有${ message }条未读消息`:`消息中心`" placement="bottom">
					<router-link to="/notify">
						<i class="el-icon-bell"></i>
					</router-link>
				</el-tooltip>
				<span class="btn-bell-badge" v-if="message"></span>
			</p>
			<p class="right" @click="logout">
				<i class="iconfont icon-out"></i>
				<span>登出</span>
			</p>
		</div>
	</div>
</template>

<script>
	import { mapMutations, mapState, mapActions } from 'vuex'
	export default {
		data() {
			return {
				a: 1
			}
		},
		created() {
			this.getMessageBox()
		},
		computed: {
			...mapState(['user','messageBox']),
			message: {
				get() {
					return this.messageBox.length
				}
			},
			time() {
				const hours = new Date().getHours()
				if(hours > 5 && hours < 12) {
					return '早上'
				} else if(hours > 12 && hours < 19) {
					return '下午'
				} else if(hours === 12) {
					return '中午'
				} else {
					return '晚上'
				}
			},
			name() {
				return this.user.name
			}
		},
		methods: {
			...mapMutations(['unset_user','set_messageBox']),
			...mapActions(['getMessageBox']),
			logout() {
				this.unset_user()
				this.$router.go({
					name: 'home'
				})
			}
		}
	}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	.header {
		width: 100%;
		height: 50px;
		.statusLine {
			background: transparent;
			width: 100%;
			height: 3.125rem;
			line-height: 3.125rem;
			color: #fff;
			font-size: 1.125rem;
			display: flex;
			justify-content: space-between;
			p.left {
				margin-left: 1.25rem;
				i.icon-zhuye {
					font-size: 1.875rem;
					color: rgb(129, 216, 208);
					cursor: pointer;
					&:hover {
						color: darkturquoise;
					}
				}
			}
			p.right {
				cursor: pointer;
				margin-right: 1.25rem;
				color: rgb(129, 216, 208);
				i.icon-out {
					font-size: 1.25rem;
				}
				&:hover {
					color: rgb(129, 216, 208);
				}
			}
			p.btn-bell {
				position: relative;
				width: 30px;
				height: 30px;
				left: 550px;
				text-align: center;
				border-radius: 15px;
				cursor: pointer;
				.btn-bell-badge {
					position: absolute;
					right: 0;
					top: 10px;
					width: 8px;
					height: 8px;
					border-radius: 4px;
					background-color: #f56c6c;
					color: #FFF;
				}
				.el-icon-bell {
					color: #fff;
				}
			}
		}
	}
</style>