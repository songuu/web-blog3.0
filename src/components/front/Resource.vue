<template>
	<div id="main">
		<div class="container">
			<div class="drag-box">
				<div class="drag-box-item">
					<div class="item-title">图书</div>
					<books-content></books-content>					
				</div>
				<div class="drag-box-item">
					<div class="item-title">音乐</div>
					<musics-content></musics-content>
				</div>
				<div class="drag-box-item">
					<div class="item-title">电影</div>
					<movies-content></movies-content>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {mapMutations, mapActions, mapState} from 'vuex'
	import Books from './component/book'
	import Musics from './component/music'
	import Movies from './component/movie'
	export default {
		data() {
			return {
				book_info: [
				
				],
				music_info: [
				
				],
				movie_info: [
				
				]
			}
		},
		computed: {
			
		},
		methods: {
			
		},
		components: {
			booksContent: Books,
			moviesContent: Movies,
			musicsContent: Musics
		}
	}
</script>

<style scoped>
	.drag-box {
		display: flex;
		user-select: none;
	}
	
	.container {
	    padding: 30px;
	    background: transparent;
	    border-radius: 5px;
	    overflow-y: scroll;
	    overflow-x: hidden;
	}
	.drag-box-item {
		flex: 1;
		max-width: 370px;
		min-width: 350px;
		background-color: #eff1f5;
		border-radius: 6px;
		border: 1px #e1e4e8 solid;
	}
	
	.item-title {
		padding: 8px 8px 8px 12px;
		font-size: 20px;
		line-height: 1.5;
		color: #24292e;
		font-weight: 600;
	}
	
	.head {
		padding: 8px 8px 8px 12px;
		font-size: 14px;
		line-height: 1.5;
		color: #24292e;
		font-weight: 600;
	}
	
	.item-ul {
		padding: 0 8px 8px;
		height: 500px;
		overflow-y: scroll;
	}
	
	.item-ul::-webkit-scrollbar {
		width: 0;
	}
	
	.drag-list {
		border: 1px #e1e4e8 solid;
		padding: 10px;
		margin: 5px 0 10px;
		list-style: none;
		background-color: #fff;
		border-radius: 6px;
		cursor: pointer;
		-webkit-transition: border .3s ease-in;
		transition: border .3s ease-in;
	}
	
	.drag-list:hover {
		border: 1px solid #20a0ff;
	}
	
	.drag-title {
		font-weight: 400;
		line-height: 25px;
		margin: 10px 0;
		font-size: 22px;
		color: #1f2f3d;
	}
	
	.ghost-style {
		display: block;
		color: transparent;
		border-style: dashed
	}
</style>