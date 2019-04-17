<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-tickets"></i> 文章管理
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container1">
			<div class="handle-box">
				<el-button type="primary" icon="delete" class="handle-del mr10" @click="handledelAll" size="small">批量删除</el-button>
				<el-select v-model="select_cate" placeholder="筛选类型" class="handle-select mr10" clearable size="small">
					<el-option v-for="(tag,index) in Tags" :key="index" :label="tag" :value="tag" size="small">
					</el-option>
				</el-select>
				<el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10" size="small"></el-input>
				<el-button type="primary" icon="search" @click="search" size="small">搜索</el-button>
				<el-button type="primary" icon="el-icon-upload" @click="upload" size="small"></el-button>
			</div>
			<el-table :data="data" border style="width: 630px;min-height: 380px" ref="multipleTable" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55"></el-table-column>
				<el-table-column prop="date" label="上传时间" sortable width="150"></el-table-column>
				<el-table-column prop="type" label="文章类型" width="120"></el-table-column>
				<el-table-column prop="title" label="文章标题" width="120"></el-table-column>
				<el-table-column label="操作" width="180">
					<template slot-scope="scope">
						<el-button size="small" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>
						<el-button size="small" type="danger" @click="handleDelete(scope.$index,scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="paginaton1">
				<el-pagination @current-change="handleCurrentChange" layout="prev,pager,next" :total="100"></el-pagination>
			</div>
		</div>
		<!--编辑修改弹出-->
		<el-dialog title="修改信息" :visible.sync="editVisible" width="300px">
			<el-form ref="form" :model="form" label-width="50px">
				<el-form-item label="上传时间">
					<el-date-picker type="date" placeholder="选择时间" v-model="form.date" value-format="yyyy-MM-dd" style="width: 100%;">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="类型">
					<el-input v-model="form.type"></el-input>
				</el-form-item>
				<el-form-item label="标题">
					<el-input v-model="form.title"></el-input>
				</el-form-item>
				<el-form-item label="图片链接">
					<el-input v-model="form.imgUrl"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
    			<el-button type="primary" @click="editVisible = false" size="small">取消</el-button>
    			<el-button type="primary" @click="spEdit" size="small">具体修改</el-button>
    			<el-button type="primary" @click="saveEdit" size="small">确定</el-button>
    		</span>
		</el-dialog>

		<!--编辑删除-->
		<el-dialog title="提示" :visible.sync="delVisible1" width="300px" center>
			<div class="del-dialog-cnt">删除不可恢复，是否确定</div>
			<span slot="footer" class="dialog-footer">
    			<el-button type="primary" @click="delVisible1 = false">取消</el-button>
    			<el-button type="primary" @click="deleteRow">确定</el-button>
    		</span>
		</el-dialog>

		<!--编辑部分删除-->
		<el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
			<div class="del-dialog-cnt">删除不可恢复，是否确定</div>
			<span slot="footer" class="dialog-footer">
    			<el-button type="primary" @click="delVisible = false">取消</el-button>
    			<el-button type="primary" @click="delAll">确定</el-button>
    		</span>
		</el-dialog>
	</div>
</template>

<script>
	import { mapMutations, mapActions, mapState } from 'vuex'
	export default {
		data() {
			return {
				form: {
					date: '',
					type: '',
					title: '',
					imgUrl: ''
				},
				select_cate: '',
				select_word: '',
				is_search: false,
				editVisible: false,
				delVisible: false,
				delVisible1: false,
				del_list: [],
				cur_page: 1,
				l_page: 1, //记录上一次出现的页面的情况
				tableData: [],
				multipleSelection: [],
				cur_page: 1,
				idx: -1,
				save: false
			}
		},
		created() {
			this.getData(this.cur_page, 5)
			this.getAllTags()
		},
		computed: {
			...mapState(['articles', 'article', 'tags']),
			data() {
				this.tableData = []
				this.gettableData()
				if(this.articles.length === 0) {
					this.tableData = []
				} else {
					return this.tableData.slice(-5).filter((d) => {
						let is_del = false;
						for(let i = 0; i < this.del_list.length; i++) {
							if(d.aid === this.del_list[i].aid) {
								is_del = true;
								break;
							}
						} //只用过滤掉删除的
						if(!is_del) {
							if(d.type.indexOf(this.select_cate) > -1 &&
								(d.type.indexOf(this.select_word) > -1 ||
									d.title.indexOf(this.select_word) > -1)
							) {
								return d;
							}
						}
					})
				}
			},
			Tags() {
				return Array.from(new Set(this.tags))
			}
		},
		watch: {
			save() {
				this.getData(this.cur_page, 5);
			}
		},
		methods: {
			...mapMutations(['set_article']),
			...mapActions(['getAllArticles', 'delArticle', 'saveArticle', 'getAllTags']),
			handleCurrentChange(val) {
				this.cur_page = val;
				this.getData(this.cur_page, 5);
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

				this.delVisible = true;
				for(let i = 0; i < length; i++) {
					try {
						if(this.delArticle({
								aid: this.del_list[i].aid,
								page: this.cur_page,
								route: this.$route
							})) {
							this.del_list = this.del_list.concat(this.multipleSelection);
						} else {
							this.$message.info('删除失败')
						}
					} catch(err) {
						console.log('aid is error')
					}
				}
				this.$message.success('删除成功');
				this.delVisible = false
				this.multipleSelection = [];
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			getData(page, limit) {
				this.getAllArticles({
					page: page,
					limit: limit
				})
			},
			gettableData() {
				this.articles.forEach((item) => {
					this.tableData.push({
						date: item.date.substring(0, 10),
						type: item.tags.toString(),
						title: item.title,
						imgUrl: item.imgUrl,
						aid: item.aid //唯一标识符						
					})
				})
			},
			search() {
				if(this.select_word) {
					this.is_search = true;
				} else {
					this.$message.error('未输入关键字');
				}
			},
			upload() {
				this.$router.push({
					name: 'editor'
				});
			},
			handleEdit(index, row) {
				this.idx = index;
				const item = this.tableData[index];
				this.form = {
					type: item.type,
					date: item.date,
					title: item.title,
					imgUrl: item.imgUrl
				}
				this.editVisible = true;
			},
			spEdit() {
				this.$router.push({
					name: 'editor',
					query: {
						aid: this.articles[this.idx].aid
					}
				})
				this.editVisible = false;
			},
			handleDelete(index, row) {
				this.idx = index;
				this.delVisible1 = true;
			},
			saveEdit() {
				this.$set(this.tableData, this.idx, this.form);
				let content = this.articles[this.idx].content
				let array = this.form.type.split(',')
				let tags = []
				for(let i = 0, len = array.length; i < len; i++) {
					tags.push(array[i]);
				}
				let title = this.form.title
				let date = this.form.date
				let imgUrl = this.form.imgUrl
				//设置更新的文章							
				//数据设置												
				try {
					this.set_article({
						content: content,
						title: title,
						tags: tags,
						date: date,
						imgUrl: imgUrl
					})
					this.saveArticle(this.articles[this.idx].aid).then((res) => {
						if(res.status === 200) {
							this.getData(this.cur_page, 5)
						} else {
							console.log('获取失败')
						}
					})
					
				} catch(err) {
					console.log('error')
				}
				this.editVisible = false;
				this.$message.success(`修改第${this.idx+1}行成功`);
			},
			deleteRow() {
				const item = this.tableData[this.idx];
				try {
					if(this.delArticle({
							aid: item.aid,
							page: this.cur_page,
							route: this.$route
						})) {
						this.del_list.push(item)
					} else {
						this.$message.error('删除成功');
					}
				} catch(err) {
					console.log('aid is error')
				}
				this.$message.success('删除成功');
				this.delVisible1 = false;
			}
		},

	}
</script>

<style scoped>
	.handle-box {
		margin-bottom: 20px;
	}
	
	.handle-select {
		width: 120px;
	}
	
	.handle-input {
		width: 300px;
		display: inline-block;
	}
	
	.del-dialog-cnt {
		font-size: 16px;
		text-align: center
	}
</style>