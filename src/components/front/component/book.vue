<template>
	<div id="main">
		<div class="handle-box">
			<el-input v-model="select_word" placeholder="输入书名" class="handle-input mr10" size="small"></el-input>
			<el-button type="primary" icon="search" @click="search" size="small">搜索</el-button>
		</div>
		<div class="container1">
			<div class="hide">
				<div class="allitems">
					<h3>图书资源</h3>
					<el-table :data="data" border style="width: 24rem; height: 19.5rem;">
						<el-table-column prop="title" label="书籍名称" width="100"></el-table-column>
						<el-table-column prop="writer" label="书籍作者" width="80"></el-table-column>
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
						<el-pagination @current-change="handleCurrentChange" layout="prev,pager,next" :total="100"></el-pagination>
					</div>
				</div>
				<div class="hotitems">
					<h3>最新图书</h3>
					<el-table :data="data1" border style="width: 24rem; height: 22rem;">
						<el-table-column prop="title" label="书籍名称" width="100"></el-table-column>
						<el-table-column prop="writer" label="书籍作者" width="80"></el-table-column>
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
			<el-form ref="bookItem" :model="bookItem" label-width="50px">
				<el-form-item label="名称">
					<el-input v-model="bookItem.title"></el-input>
				</el-form-item>
				<el-form-item label="作者">
					<el-input v-model="bookItem.writer"></el-input>
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
		data() {
			return {
				select_word: '',
				is_search: false,
				multipleSelection: [],
				bookList: [],
				cur_page: 1,
				idx: -1,
				shareVisible: false,
				bookItem: {
					title: '',
					writer: ''
				}
			}
		},
		created() {
			this.getAllbooks({
					page: this.cur_page,
					limit: 4
				}),
			this.getNewbooks({
					page: 1,
					limit: 5
				})
		},
		computed: {
			...mapState(['book', 'books', 'newbooks']),
			data() {
				this.bookList = []
				this.getbookData()
				return this.bookList.filter((d) => {
					let is_del = false;
					for(let i = 0; i < this.bookList.length; i++) {
						if(!d.rid) {
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
				return this.newbooks
			}
		},
		watch: {
			'$route' (to, from) {
				this.$router.go(0);
			}
		},
		methods: {
			...mapMutations(['set_book']),
			...mapActions(['getAllbooks', 'getNewbooks', 'saveBook', 'delBook']),
			handleCurrentChange(val) {
				this.cur_page = val;
				this.getBooks(this.cur_page, 4);
			},
			getBooks(page, limit) {
				this.getAllbooks({
					page: page,
					limit: limit
				})
			},
			getbookData() {
				this.books.forEach((item) => {
					this.bookList.push({
						rate: item.rate,
						title: item.title,
						writer: item.writer,
						rid: item.rid
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
						type: 'book',
						id: this.books[index].rid
					}
				})
			},
			downnew(index, row) {
				//console.log(this.books[index].rid)
				this.$router.push({
					name: 'download',
					params: {
						type: 'book',
						id: this.newbooks[index].rid
					}
				})
			}, 
			shareup(index,row) {
				this.bookItem.title = this.books[index].title
				this.bookItem.writer = this.books[index].writer
				this.shareVisible = true
			},
			sharenew(index,row) {
				this.bookItem.title = this.newbooks[index].title
				this.bookItem.writer = this.newbooks[index].writer
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