<template>
	<div id="main">
		<div class="header1">
			<h1><<{{data.title}}>></h1>
		</div>
		<div class="clear"></div>
		<div class="desc">
			<h3>下载资源信息</h3>
			<p>文件名称: {{data.title}}</p>
			<p>文件大小: </p>
			<p>上传时间: {{data.date | toDate}}</p>
			<p>作者: {{data.author}}</p>
			<p>百度云提取码: {{data.pwd}}   (部分文件可以不需要输入提取码)</p>
		</div>
		<div class="clear"></div>
		<div class="list">
			下载列表:
			<a :href='data.url' target="_blank">百度网盘</a>
		</div>
		<div class="clear"></div>
		<div class="desc" style="border:1px solid #FCC;background:#FFE;">
			<p>下载说明</p>
			<ol style="padding:0 10px 0 25px;">
				<li>下载后文件若为压缩包格式，请安装RAR或者好压软件进行解压。现阶段只是提供百度云分享</li>
				<li>文件比较大的时候，建议使用下载工具进行下载，浏览器下载有时候会自动中断，导致下载错误</li>
				<li>资源可能会由于内容问题被和谐，导致下载链接不可用，遇到此问题，请到文章页面进行反馈，我会及时进行更新的。</li>
			</ol>
		</div>
		<div class="sm" style="padding:5px">
			<p>声明：</p>
			<p>本站大部分下载资源收集于网络，只做学习和交流使用</p>
		</div>
		<div class="clear"></div>
	</div>
</template>

<script>
	import { mapState, mapMutations, mapActions } from 'vuex'
	export default {
		data() {
			return {
				type: '',
				form: {
					title: '',
					date: '',
					author: '',
					url: '',
					pwd: ''
				}
			}
		},
		created() {
			const id = this.$route.params.id
			this.type = this.$route.params.type
			if(id && this.type) {
				return this.getData(id,this.type)
			}			
		},
		directives: {
			focus: {
				inserted: (el) => {
					el.focus()
				}
			}
		},
		filters: {
			toDate(input) {
				if(input){
					var d = new Date(input);
					var year = d.getFullYear();
					var month = d.getMonth() + 1;
					var day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();
					var hour = d.getHours() < 10 ? '0' +d.getHours() : '' + d.getHours();
					var minute = d.getMinutes() <10 ? '0' + d.getMinutes() : '' + d.getMinutes();
					var second = d.getSeconds() < 10 ? '0' +d.getSeconds() : '' + d.getSeconds();
					return year + '-' + month + '-' + day+ " " + hour + ':' + minute + ':' + second;					
				}
			}
		},		
		computed: {
			...mapState(['book', 'music', 'movie']),
			data() {
				switch(this.type) {
					case 'book':
						this.form.title = this.book.title;
						this.form.date = this.book.date;
						this.form.author = this.book.writer;
						this.form.url = this.book.url;
						this.form.pwd = this.book.pwd;
						return this.form;
						break;
					case 'music':
						this.form.title = this.music.title;
						this.form.date = this.music.date;
						this.form.author = this.music.singer;
						this.form.url = this.music.url;
						this.form.pwd = this.music.pwd;
						return this.form;
						break;
					case 'movie':
						this.form.title = this.movie.title;
						this.form.date = this.movie.date;
						this.form.author = this.movie.director;
						this.form.url = this.movie.url;
						this.form.pwd = this.movie.pwd;
						return this.form;
						break;
					default:
						this.open('没有此文件')
				}
			}
		},
		watch: {
			'$route' (to, from) {
				this.$router.go(0);
			}
		},
		methods: {
			...mapActions(['getBook', 'getMusic', 'getMovie']),
			open(name) {
				const h = this.$createElement;
				this.$notify({
					title: '错误信息',
					message: h('i', {
						style: 'color: teal'
					}, name)
				});
			},
			getData(id,type) {
				switch(type) {
					case 'book':
						this.getBook(id);
						break;
					case 'music':
						this.getMusic(id);
						break;
					case 'movie':
						this.getMovie(id);
						break;
					default:
						this.open('没有此文件')
				}
			}
		}
	}
</script>

<style scoped>
	h1 {
		text-align: center;
		border-bottom: 1px solid #dadada;
		clear: both;
		font: 26px Georgia, "Times New Roman", Times, serif;
		margin: 5px 0 0 -4px;
		padding: 0;
		padding-bottom: 7px;
		font-weight: bold;
	}
	
	h3 {
		color: #666666;
		font-size: 15px;
		margin: 15px 0 10px;
	}
	
	p {
		padding-bottom: 2px;
		font-size: 13px;
		line-height: 22px;
	}
	
	#main {
		background: #fff;
		color: #333;
		font-family: "Microsoft YaHei", Helvetica, sans-serif;
		margin: 2em auto;
		width: 45rem;
		height: 30rem;
		padding: 1em 2em;
		border: 1px solid #dfdfdf;
	}
	
	.clear {
		clear: both;
		height: 1px;
	}
	
	.header1 {
		padding: 10px 0 15px 10px;
		text-align: center;
	}
	
	.list {
		background: none repeat scroll 0 0 #F2F2F2;
		border: 1px solid #BFBFBF;
		color: #666666;
		font-size: 12px;
		height: 30px;
		margin: 15px 0 10px;
		padding: 10px 0 0 10px;
	}
	
	.list a {
		display: inline-block;
		padding: 2px 4px;
	}
	
	.sm,
	.desc {
		background: #F2F2F2;
		border: 1px solid #BFBFBF;
		color: #666666;
		font-size: 13px;
	}
	.desc {
		margin: 10px 0;
		display: inline-block;
		height: 80px;
	}
	.sm {
		margin: 5px 0;
	}
</style>