<template>
	<div class="wrapper">
		<div class="login">
			<i class="iconfont icon-face"></i>
			<div>
				<input type="text" placeholder="请输入你的账号" v-model="name" />
				<i class="iconfont icon-zhanghu"></i>
			</div>
			<div>
				<input type="password" placeholder="请输入你的密码" v-model="password" />
				<i class="iconfont icon-yuechi"></i>
			</div>
			<p>{{info}}</p>
			<button @click="confirm(name,password)">
				<span>
					登录		
				</span>
			</button>
		</div>
	</div>
</template>

<script>
	import { mapActions, mapMutations } from 'vuex'
	export default {
		data() {
			return {
				name: '',
				password: '',
				info: ''
			}
		},
		methods: {
			...mapActions(['login']),
			...mapMutations(['set_user']),
			confirm(name, password) {
				this.login({
					name: name,
					password: password
				}).then((res) => {
					if(res.status === 200) {
						this.info = "正在登陆中..."
						this.set_user(res.data)
						this.$router.push({
							name: 'admin'
						})
					} else {
						this.info = '账号或者密码错误'
					}
					
				}).catch((err) => {
					this.info = "登录失败，请重新登陆"
				})
			}
		},
		watch: {
			name() {
				this.info = ''
			},
			password() {
				this.info = ''
			}
		}
	}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	.wrapper {
		.login {
			width: 16.125rem;
			height: 20rem;
			text-align: center;
			margin: 7rem auto 0;
			position: relative;
			.icon-face {
				font-size: 3.75rem;
				color: darkturquoise;
			}
			div {
				width: 100%;
				margin: 0 auto;
				position: relative;
				i {
					color: darkturquoise;
					font-size: 1.875rem;
					display: block;
					position: absolute;
					top: 0;
					left: 0;
					transition: .5s;
				}
			}
			input {
				width: 12.5rem;
				height: 1.875rem;
				display: block;
				margin-top: 1.25rem;
				margin-bottom: 1.25rem;
				margin-left: 3rem;
				outline: none;
				border: none;
				border-bottom: 0.1875rem solid darkturquoise;
				background: transparent;
				color: #fff;
				font-size: 1rem;
				padding-left: 0.625rem;
				&:focus+i {
					color: #ffc520;
				}
			}
			button {
				width: 12.5rem;
				padding-left: 0;
				margin-top: 1.25rem;
				position: relative;
				left: 1.25rem;
				text-align: center;
				background: darkturquoise;
			}
			button {
				height: 2.5rem;
				border: none;
				outline: none;
				color: #00193a;
				background: rgb(129, 216, 208);
				margin-top: 1.875rem;
				padding-left: 0.4375rem;
				cursor: pointer;
				border-radius: 0.25rem;
				transition: 0.5s;
				font-size: 0.875rem;
				span {
					display: inline-block;
					height: 2.5rem;
					line-height: 2.5rem;
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
	
	p {
		color: #FFFFFF;
		width: 100%;
		height: 1.25rem;
	}
	
	@media only screen and (max-width: 440px) {
		.login {
			margin-top: 2rem !important;
		}
	}
</style>