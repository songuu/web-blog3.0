<template>
	<div class="wrapper">
		<v-header></v-header>
		<v-sidebar></v-sidebar>
		<div class="content-box" :class="{'content-collapse': collapse}">
			<div class="content">
				<transition mode="out-in" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
					<keep-alive>
						<router-view></router-view>
					</keep-alive>
				</transition>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapMutations, mapState } from 'vuex'
	import vHeader from './common/Header'
	import vSidebar from './common/Sidebar'
	import bus from './common/bus'
	export default {
		data() {
			return {
				collapse: false
			}
		},
		computed: {
			...mapState(['user']),
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
			}
		},
		created() {
			bus.$on('collapse', msg => {
				this.collapse = msg
			})
		},
		methods: {
			...mapMutations(['unset_user']),
			logout() {
				this.unset_user()
				this.$router.go({
					name: 'home'
				})
			}
		},
		components: {
			vHeader,
			vSidebar
		}
	}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	.wrapper {
		width: 100%;
		height: 100%;
		overflow: hidden;
		.content-box {
			position: absolute;
			left: 270px;
			right: 0;
			top: 70px;
			bottom: 0;
			overflow-y: scroll;
			-webkit-transition: left .3s ease-in-out;
			transition: left .3s ease-in-out;
			.content {
				width: auto;
				padding: 40px;
			}
		}
		.content-collapse {
			left: 85px;
		}
	}
</style>