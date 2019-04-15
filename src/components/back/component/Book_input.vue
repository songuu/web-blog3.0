<template>
	<div class="hide1">
		<div class="handle-box">
			<el-button type="primary" icon="delete" class="handle-del mr10" @click="handledelAll" size="small">批量删除</el-button>
			<el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10" size="small"></el-input>
			<el-button type="primary" icon="search" @click="search" size="small">搜索</el-button>
			<el-button type="primary" icon="el-icon-upload" @click="upload" size="small"></el-button>
		</div>
		<el-table :data="data" border style="width: 100%;" ref="multipleTable" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="40"></el-table-column>
			<el-table-column prop="title" label="书籍名称" width="150"></el-table-column>
			<el-table-column prop="writer" label="书籍作者" width="100"></el-table-column>
			<el-table-column prop="rate" label="评分" width="60"></el-table-column>
		</el-table>
		<div class="paginaton">
			<el-pagination @current-change="handleCurrentChange" layout="prev,pager,next" :total="100"></el-pagination>
		</div>
		<!--部分删除操作-->
		<el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
			<div class="del-dialog-cnt">删除不可恢复，是否确定</div>
			<span slot="footer" class="dialog-footer">
    			<el-button type="primary" @click="delVisible = false">取消</el-button>
    			<el-button type="primary" @click="delAll">确定</el-button>
    		</span>
		</el-dialog>
		<!--添加操作-->
		<el-dialog title="添加文件" :visible.sync="addVisible" width="300px">
			<el-form ref="bookItem" :model="bookItem" label-width="50px">
				<el-form-item label="名称">
					<el-input v-model="bookItem.title"></el-input>
				</el-form-item>
				<el-form-item label="作者">
					<el-input v-model="bookItem.writer"></el-input>
				</el-form-item>
				<el-form-item label="评分">
					<el-input v-model="bookItem.rate"></el-input>
				</el-form-item>
				<el-form-item label="链接">
					<el-input v-model="bookItem.url"></el-input>
				</el-form-item>
				<el-form-item label="密码">
					<el-input v-model="bookItem.pwd"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
    			<el-button type="primary" @click="addVisible = false">取消</el-button>
    			<el-button type="primary" @click="saveEdit">确定</el-button>
    		</span>
		</el-dialog>
	</div>
</template>

<script>
	import { mapMutations, mapActions, mapState } from 'vuex'
	export default {
		data() {
			return {
				bookItem: {
					title: '',
					writer: '',
					rate: '',
					url: '',
					pwd: ''
				},
				select_word: '',
				delVisible: false,
				addVisible: false,
				is_search: false,
				multipleSelection: [],
				del_list: [],
				bookList: [],
				cur_page: 1,
			}
		},
		created() {
			this.getAllbooks({
				page: this.cur_page,
				limit: 6
			})
		},
		watch: {
			addVisible() {
				this.bookItem = {}
			}
		},
		computed: {
			...mapState(['book', 'books']),
			data() {
				this.bookList = []
				this.getbookData()
				return this.bookList.filter((d) => {
					let is_del = false;
					for(let i = 0; i < this.del_list.length; i++) {
						if(d.rid === this.del_list[i].rid) {
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
			}
		},
		methods: {
			...mapMutations(['set_book']),
			...mapActions(['getAllbooks', 'saveBook', 'delBook']),
			handleCurrentChange(val) {
				this.cur_page = val;
				this.getBooks(this.cur_page, 6);
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
						rid: item.rid,
						url: item.url,
						pwd: item.pwd
					})
				})
			},
			handledelAll() {
				const length = this.multipleSelection.length;
				if(length > 0) {
					this.delVisible = true
				} else {
					this.$message.error('未选择');
				}
			},
			delAll() {
				const length = this.multipleSelection.length;
				let str = '';
				this.del_list = this.del_list.concat(this.multipleSelection);
				this.delVisible = true;
				for(let i = 0; i < length; i++) {
					try {
						if(this.delBook({
							rid: this.del_list[i].rid,
							page: this.cur_page,
							route: this.$route
						})) {
							this.$message.success('删除成功');
						} else {
							this.$message.error('删除失败');
						}
					} catch(err) {
						console.log('rid is error')
					}
				}
				this.delVisible = false			
				this.multipleSelection = [];
			},
			search() {
				this.is_search = true;
			},
			upload() {
				this.addVisible = true
			},
			saveEdit() {
				this.set_book({
					title: this.bookItem.title,
					writer: this.bookItem.writer,
					rate: this.bookItem.rate,
					url: this.bookItem.url,
					pwd: this.bookItem.pwd
				})
				//console.log(this.book.rate)
				this.saveBook()
				this.addVisible = false
				this.$message.success('添加成功');
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
		}
	}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>