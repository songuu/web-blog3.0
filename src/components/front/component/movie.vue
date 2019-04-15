<template>
	<div id="main">
		<div class="handle-box">
			<el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10" size="small"></el-input>
			<el-button type="primary" icon="search" @click="search" size="small">搜索</el-button>
		</div>
		<div class="container1">
			<div class="hide">
				<div class="allitems">
					<h3>电影资源</h3> 
					<el-table :data="data" border style="width: 24rem; height: 19.5rem;">
						<el-table-column prop="title" label="电影名称" width="100"></el-table-column>
						<el-table-column prop="director" label="导演" width="80"></el-table-column>
						<el-table-column prop="rate" label="评分" width="80" sortable></el-table-column>
						<el-table-column label="操作" width="120">
							<template slot-scope="scope">
								<el-button-group>
									<el-button type="primary" icon="el-icon-share" @click="shareup(scope.$index,scope.row)" size="small"></el-button>
									<el-button type="primary" icon="el-icon-download" @click="down(scope.$index,scope.row)" size="small"></el-button>
								</el-button-group>
							</template>
						</el-table-column>
					</el-table>
					<div class="paginaton">
						<el-pagination @current-change="handleCurrentChange" layout="prev,pager,next" :total="80"></el-pagination>
					</div>
				</div>
				<div class="hotitems">
					<h3>最新电影</h3>
					<el-table :data ="data1" border style="width: 24rem;height: 22rem;">
						<el-table-column prop="title" label="电影名称" width="100"></el-table-column>
						<el-table-column prop="director" label="导演" width="80"></el-table-column>
						<el-table-column prop="rate" label="评分" width="80" sortable></el-table-column>
						<el-table-column label="操作" width="120">
							<template slot-scope="scope">
								<el-button-group>
									<el-button type="primary" icon="el-icon-share" @click="sharenew(scope.$index,scope.row)" size="small"></el-button>
									<el-button type="primary" icon="el-icon-download" @click="downnew(scope.$index,scope.row)" size="small"></el-button>
								</el-button-group>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</div>
		</div>
		<!--文件分享-->
		<el-dialog title="文件分享(暂时没有申请到接口)" :visible.sync="shareVisible" width="300px">
			<el-form ref="movieItem" :model="movieItem" label-width="50px">
				<el-form-item label="名称">
					<el-input v-model="movieItem.title"></el-input>
				</el-form-item>
				<el-form-item label="导演">
					<el-input v-model="movieItem.director"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="shareVisible = false">取消</el-button>
				分享到:
				<a class="iconfont icon-sina" href="#"></a>
				<a class="iconfont icon-weixin" href="#"></a>
				<a class="iconfont icon-qqkongjian" href="#"></a>
    		</span>
		</el-dialog>		
	</div>
</template>

<script>
	import { mapMutations, mapActions, mapState } from 'vuex'
	export default {
		/*props: {
			bookList: Array,
			index: Number
		},*/
		data() {
			return {
				movieItem: {
					title: '',
					director: ''
				},
				select_word: '',
				is_search: false,
				movieList: [],
				cur_page: 1,
				idx: -1,
				shareVisible: false
			}
		},
		created() {
			this.getAllmovies({page: this.cur_page,limit: 4})
			this.getNewmovies({page: 1, limit: 5})
		},
		computed: {
			...mapState(['movie', 'movies','newmovies']),
			data() {
				this.movieList = []
				this.getmovieData()
				return this.movieList.filter((d) => {
					let is_del = false;
					for(let i = 0; i < this.movieList.length; i++) {
						if(!d.cid) {
							is_del = true;
							break;
						}
					}
					if(!is_del) {
						if(d.title.indexOf(this.select_word) > -1) {
							return d;
						}
					}
				})
			},
			data1 () {
				return this.newmovies
			}
		},
		methods: {
			...mapMutations(['set_movie']),
			...mapActions(['getAllmovies', 'getNewmovies', 'saveMovie', 'delMovie']),
			handleCurrentChange(val) {
				this.cur_page = val;
				this.getMovies(this.cur_page, 4)
			},
			getMovies(page, limit) {
				this.getAllmovies({
					page: page,
					limit: limit
				})
			},
			getmovieData() {
				this.movies.forEach((item) => {
					this.movieList.push({
						rate: item.rate,
						title: item.title,
						director: item.director,
						cid: item.cid
					})
				})
			},
			open(name) {
				const h = this.$createElement;
				this.$notify({
					title: '错误信息',
					message: h('i', {
						style: 'color: teal'
					}, name)
				});
			},
			down(index, row) {
				//console.log(this.movies[index].rid)
				this.$router.push({
					name: 'download',
					params: {
						type: 'movie',
						id: this.movies[index].cid
					}
				})
			},	
			downnew(index, row) {
				//console.log(this.movies[index].rid)
				this.$router.push({
					name: 'download',
					params: {
						type: 'movie',
						id: this.newmovies[index].cid
					}
				})
			},
			shareup(index,row) {
				this.movieItem.title = this.movies[index].title
				this.movieItem.director = this.movies[index].director
				this.shareVisible = true
			},
			sharenew(index,row) {
				this.movieItem.title = this.newmovies[index].title
				this.movieItem.director = this.newmovies[index].director
				this.shareVisible = true
			},			
			search() {
				if(this.select_word === '') {
					this.open('未输入搜索内容')
				}
			},
		}
	}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	@import '../../../assets/css/icon.scss';
	.dialog-footer {
		a {
			color: #000000;
		}
	}
	.icon-font{
		color: #FFFFFF;
		font-size: 1.2rem;
	}
</style>