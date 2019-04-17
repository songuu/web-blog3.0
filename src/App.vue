<template>
	<div id="app">
		<fire-canvas class="fire"></fire-canvas>
		<router-view></router-view>
	</div>
</template>

<script>
	import FireCanvas from './components/common/FireCanvas'
	import './assets/css/index.scss'
	import 'element-ui/lib/theme-chalk/index.css'
	export default {
		mounted() {
			document.addEventListener('visibilitychange', this.changeTitle, false)
			const s = document.createElement('script');
			s.type = 'text/javascript';
			s.src = 'http://pv.sohu.com/cityjson?ie=utf-8';
			document.body.appendChild(s);
		},
		methods: {
			changeTitle() {
				if(document.hidden) {
					document.title = '宋钰的博客'
				} else {
					document.title = '宋钰的博客'
				}
			}
		},
		components: {
			FireCanvas
		}
	}
</script>

<style>
	#app {
		margin: 0;
		padding: 0;
		overflow: hidden;
		min-height: 100%;
		width: 100%;
	}

</style>