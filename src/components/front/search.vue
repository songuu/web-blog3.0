<template>
	<div id="search">
		<div v-for="(article, index) in articles" class="article" v-if="show">
			<h2>{{article.title}}</h2>
			<time><i class="iconfont icon-shijian"></i>{{article.date | toDate}}</time>
			<span class="articleTag"><i class="iconfont icon-label"></i>{{article.tags | toTag}}</span>
			<span class="commentNumber"><i class="iconfont icon-huifu"></i>{{article.comment_n}}</span>
			<router-link :to="{name: 'article', params: {id: article.aid}}" tag="button" exact>
				<span>阅读更多</span>
			</router-link>
		</div>
	</div>
</template>

<script>
	import {mapState, mapActions, mapMutations } from 'vuex'
	export default {
		data() {
			
		},
		props: ['select_word','select_type'],
		created() {
			this.searchArticles({key: this.select_type, value: this.$route.params.this.select_word})
		},
		computed: {
        	...mapState(['articles']),
    	},
		methods: {
			...mapActions(['searchArticles'])
		}
	}
</script>

<style>

</style>