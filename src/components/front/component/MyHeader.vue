<template>
	<div id="nav">
		<div class="flexDiv">
			<div class="banner">
				<router-link :to="{name: 'index'}" tag="span">
					<i class="iconfont icon-logo"></i>
					<h3 class="h-title">宋钰的个人博客</h3>
				</router-link>
			</div>
			<nav>
				<el-menu :default-active="$route.path" class="el-menu-demo" mode="horizontal" @select="handleSelect" active-text-color="rgb(129, 216, 208)" router>
					<el-menu-item index="/blog">
						博客
					</el-menu-item>
					<el-menu-item index="/archives">
						个人经历
					</el-menu-item>
					<el-submenu index="3">
						<template slot="title">{{title}}</template>
						<el-menu-item index="/book">
							图书
						</el-menu-item>
						<el-menu-item index="/music">
							音乐
						</el-menu-item>
						<el-menu-item index="/movie">
							电影
						</el-menu-item>
					</el-submenu>
				</el-menu>
			</nav>
			<div class="mulcolor">
				<el-tooltip effect="dark" content="theme" placement="bottom" size="small">
					<theme-picker class="theme-switch right-menu-item"></theme-picker>
				</el-tooltip>
			</div>
		</div>
	</div>
</template>
<script>
	import { mapState, mapMutations } from 'vuex'
	import { toggleClass } from '../../../lib/utils'
	import ThemePicker from '@/components/front/component/themepicker'
	export default {
		data() {
			return {
				title: '资源'
			}
		},
		methods: {
			...mapMutations(['setThemeColor']),
			handleSelect(key) {
				switch(key) {
					case '/book':
						this.title = '图书';
						break;
					case '/music':
						this.title = '音乐';
						break;
					case '/movie':
						this.title = '电影';
						break;
					default:
						this.title = '资源';
				}
			}
		},
		components: {
			ThemePicker
		}
	}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
	#nav {
		position: relative;
		.flexDiv {
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			background: rgba(44, 62, 80, 0.8);
			width: 100%;
			nav {
				width: 40%;
				overflow: hidden;
				margin-left: 16rem;
				ul {
					overflow: hidden;
					display: flex;
					flex-wrap: nowrap;
					justify-content: space-around;
					list-style: none;
					width: 100%;
					li {
						width: 7rem;
						font-size: 1.125rem;
						font-weight: bold;
						text-align: center;
						margin-right: 1.2rem;
						height: 2.9375rem;
						line-height: 3.3125rem;
						cursor: pointer;
						border-bottom: 0.1875rem solid transparent;
						font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, PingFang SC, Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei, sans-serif;
						text-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1);
					}
				}
			}
			.banner {
				height: 3rem;
				position: relative;
				margin-top: 0.4rem;
				margin-left: 4.625rem;
				span {
					color: #fff;
					outline: none;
					background: transparent;
					width: 15.625rem;
					height: 1.875rem;
					line-height: 1.875rem;
					font-size: 1.125rem;
					padding-left: 0.625rem;
					.icon-logo {
						cursor: pointer;
						font-size: 2.5rem;
						right: 0.5rem;
					}
					.h-title {
						cursor: pointer;
						color: #34496D;
						display: inline-block;
						margin-left: 6.125rem;
						white-space: nowrap;
						letter-spacing: 0.4rem;
						font-family: zwodrei;
						font-size: 1.8rem;
						font-weight: 800;
						-webkit-box-reflect: below 1px linear-gradient(transparent, transparent 50%, rgba(255, 255, 255, .3));
					}
				}
			}
			.mulcolor {
				width: 6rem;
				display: inline-block;
				height: 2rem;
				margin-top: 1rem;
				margin-right: 1rem;
			}
		}
	}
	
	.el-menu--horizontal {
		border-bottom: none
	}
	
	.el-dropdown-menu__item--divided:before,
	.el-menu,
	.el-menu--horizontal>.el-menu-item:not(.is-disabled):focus,
	.el-menu--horizontal>.el-menu-item:not(.is-disabled):hover,
	.el-menu--horizontal>.el-submenu .el-submenu__title:hover {
		background-color: transparent;
		color: #409EFF;
	}
	
	@media screen and (max-width: 980px) {
		nav {
			width: 100% !important;
			padding-left: 0 !important;
		}
		li {
			font-size: 0.9rem !important;
			margin-right: 0 !important;
		}
	}
</style>