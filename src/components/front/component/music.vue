<template>
	<div id="main">
		<div class="handle-box">
			<el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10" size="small"></el-input>
			<el-button type="primary" icon="search" @click="search" size="small">搜索</el-button>
		</div>
		<div class="container1">
			<div class="hide">
				<div class="allitems">
					<h3>音乐资源</h3>
					<el-table :data="data" border style="width: 24rem; height: 19.5rem;">
						<el-table-column prop="title" label="音乐名称" width="100"></el-table-column>
						<el-table-column prop="singer" label="歌唱者" width="80"></el-table-column>
						<el-table-column prop="rate" label="评分" sortable width="80"></el-table-column>
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
						<el-pagination @current-change="handleCurrentChange" layout="prev,pager,next" :total="100"></el-pagination>
					</div>
				</div>
				<div class="hotitems">
					<h3>最新资源</h3>
					<el-table :data="data1" border style="width: 24rem; height: 22rem;">
						<el-table-column prop="title" label="音乐名称" width="100"></el-table-column>
						<el-table-column prop="singer" label="歌唱者" width="80"></el-table-column>
						<el-table-column prop="rate" label="评分" sortable width="80"></el-table-column>
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
			<el-form ref="musicItem" :model="musicItem" label-width="50px">
				<el-form-item label="名称">
					<el-input v-model="musicItem.title"></el-input>
				</el-form-item>
				<el-form-item label="原唱">
					<el-input v-model="musicItem.singer"></el-input>
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
				musicItem: {
					title: '',
					singer: ''
				},
				select_word: '',
				is_search: false,
				cur_page: 1,
				idx: -1,
				shareVisible: false
			}
		},
		created() {
			this.getAllmusics({page: this.cur_page,limit: 4})
			this.getNewmusics({page: 1, limit: 5})
		},
		computed: {
			...mapState(['music', 'musics', 'newmusics']),
			data() {
				this.musicList = []
				this.getMusicData()
				return this.musicList.filter((d) => {
					let is_del = false;
					for(let i = 0; i < this.musicList.length; i++) {
						if(!d.bid) {
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
			data1() {
				return this.newmusics
			}
		},
		methods: {
			...mapMutations(['set_music']),
			...mapActions(['getAllmusics', 'getNewmusics', 'saveMusic', 'delMusic']),
			handleCurrentChange(val) {
				this.cur_page = val;
				this.getMusics(this.cur_page, 4)
			},			
			getMusics(page, limit) {
				this.getAllmusics({
					page: page,
					limit: limit
				})
			},
			getMusicData() {
				this.musics.forEach((item) => {
					this.musicList.push({
						rate: item.rate,
						title: item.title,
						singer: item.singer,
						bid: item.bid
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
				//console.log(this.books[index].rid)
				this.$router.push({
					name: 'download',
					params: {
						type: 'music',
						id: this.musics[index].bid
					}
				})
			},
			downnew(index, row) {
				//console.log(this.books[index].rid)
				this.$router.push({
					name: 'download',
					params: {
						type: 'music',
						id: this.newmusics[index].bid
					}
				})
			},
			shareup(index,row) {
				this.musicItem.title = this.musics[index].title
				this.musicItem.singer = this.musics[index].singer
				this.shareVisible = true
			},
			sharenew(index,row) {
				this.musicItem.title = this.newmusics[index].title
				this.musicItem.singer = this.newmusics[index].singer
				this.shareVisible = true
			},				
			search() {
				if(this.select_word === '') {
					this.open('未输入搜索内容')
				}
			}
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