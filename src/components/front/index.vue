<template>
	<div id="wrapper">
		<my-header></my-header>
		<my-container></my-container>
		<transition name="huojian" enter-active-class="animated bounceIn" leave-active-class="animated fadeOut">
			<a href="#app" class="rocket"><i class="iconfont icon-huojian" v-if="show"></i></a>
		</transition>
		<my-footer></my-footer>
	</div>
</template>

<script>
	import MyFooter from './component/MyFooter'
	import MyHeader from './component/MyHeader'
	import MyContainer from './component/Mycontainer'
	import { mapState } from 'vuex'
	export default {
		data() {
			return {
				show: false
			}
		},
		mounted() {
			window.addEventListener('scroll', this.handleScroll)
		},
		computed: {
			...mapState(['isLoading'])
		},
		methods: {
			handleScroll() {
				this.show = window.scrollY > 50
			}
		},
		components: {
			MyFooter,
			MyHeader,
			MyContainer
		}
	}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	@import '../../assets/css/icon.scss';
	#wrapper {
		margin: 0 auto;
		width: 100%;
		min-width: 0;
		.icon-huojian {
			font-size: 2.5rem;
			color: #C0CCDA;
			position: fixed;
			bottom: 1.25rem;
			right: 1.5rem;
			cursor: pointer;
			transition: 1s;
			&:hover {
				bottom: 1.875rem;
				color: #00ff7f;
				transition: 1s;
			}
		}
	}
</style>