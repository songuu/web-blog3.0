<template>
	<div>
		<div class="source">
			<el-card class="img">
				<h2>图片资源上传</h2>
				<el-upload class="upload-demo" ref="upload" action="/api/upload" :on-remove="handleRemove" :on-success="doMore" :file-list="fileList" :auto-upload="false">
					<el-button slot="trigger" size="small" type="primary">选取文件</el-button>
					<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
					<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload1">上传到七牛云</el-button>
					<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
				</el-upload>
			</el-card>
			<el-card class="file">
				<h2>文本资源上传</h2>
			</el-card>
		</div>
		<el-card class="table">
			<el-button type="primary" icon="delete" class="handle-del mr10" @click="handledelAll" size="small">批量删除</el-button>
			<el-select v-model="select_cate" placeholder="筛选类型" class="handle-select mr10" clearable size="small">
				<el-option v-for="(tag,index) in tags" :key="index" :label="tag.title" :value="tag.type" size="small">
				</el-option>
			</el-select>
			<el-input v-model="select_word" placeholder="关键词" class="handle-input mr10" size="small"></el-input>
			<el-button type="primary" icon="search" @click="search" size="small">搜索</el-button>
			<el-table :data="data" border ref="multipleTable" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55">
				</el-table-column>
				<el-table-column prop="name" label="名称" width="250">
				</el-table-column>
				<el-table-column prop="time" label="上传时间" width="180">
				</el-table-column>
				<el-table-column prop="type" label="类型" width="100">
				</el-table-column>
				<el-table-column label="操作" width="300">
					<template slot-scope="scope">
						<el-button size="small" @click="handleDelete(scope.$index)">删除资源</el-button>
						<el-button size="small" @click="copy(scope.row.url)">复制链接</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination @current-change="handleCurrentChange" :page-size="3" :current-page="page" layout="total, prev, pager, next" :total="filesNum" size="small">
			</el-pagination>
		</el-card>
		<el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
			<div class="del-dialog-cnt">删除不可恢复，是否确定</div>
			<span slot="footer" class="dialog-footer">
    			<el-button type="primary" @click="delVisible = false">取消</el-button>
    			<el-button type="primary" @click="del">确定</el-button>
    		</span>
		</el-dialog>
		<el-dialog title="提示" :visible.sync="delVisible1" width="300px" center>
			<div class="del-dialog-cnt">删除不可恢复，是否确定</div>
			<span slot="footer" class="dialog-footer">
    			<el-button type="primary" @click="delVisible1 = false">取消</el-button>
    			<el-button type="primary" @click="delAll">确定</el-button>
    		</span>
		</el-dialog>
	</div>

</template>

<script>
	import { mapActions, mapState } from 'vuex'
	export default {
		data() {
			return {
				fileList: [],
				select_cate: '',
				select_word: '',
				is_search: false,
				selections: [],
				tags: [{
					title: '名称',
					type: 'name'
				}, {
					title: '类型',
					type: 'type'
				}, {
					title: '时间',
					type: 'time'
				}],
				tableData: [],
				del_list: [],
				delVisible: false,
				delVisible1: false,
				page: 1,
				cur_page: 1,
				idx: 1
			};
		},
		beforeUpdate() { //刷新页面
			if(this.curTag) {
				localStorage.setItem('fpage', '1')
			} else {
				localStorage.setItem('fpage', this.page)
			}
		},
		beforeDestroy() { //退出页面
			localStorage.setItem('fpage', '1')
		},
		created() {
			this.getFilesNum()
			const page = localStorage.getItem('fpage')
			this.handleCurrentChange(page)
		},
		computed: {
			...mapState(['allFiles', 'filesNum']),
			data() {
				this.tableData = []
				this.getTable()
				if(this.allFiles.length === 0) {
					this.tableData = []
				} else {
					return this.allFiles.filter((d) => {
						d.time = this.toDate(d.time);
						let is_del = false;
						for(let i = 0; i < this.del_list.length; i++) {
							if(d.fid === this.del_list[i].fid) {
								is_del = true;
								break;
							}
						} //只用过滤掉删除的
						if(!is_del) {
							if(d.type.indexOf(this.select_word) > -1 ||
								d.name.indexOf(this.select_word) > -1) {
								return d;
							}
						}
					})
				}
			}
		},
		watch: {

		},
		methods: {
			...mapActions(['getAllfiles', 'delFile', 'getFilesNum']),
			submitUpload() {
				this.$refs.upload.submit()
			},
			doMore() {
				this.getFilesNum()
				this.getAllfiles({
					page: this.cur_page,
					limit: 3
				})
			},
			submitUpload1() {
				//暂时没有接口
			},
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},
			getTable() {
				this.tableData = this.allFiles
			},
			copy(link) {
				this.$copyText(link).then(function(e) {
					alert('Copied')
					console.log(e)
				}, function(e) {
					alert('Can not copy')
					console.log(e)
				})
			},
			del() {
				console.log(this.idx)
				const item = this.tableData[this.idx]
				console.log(item)
				try {
					if(this.delFile({
							fid: item.fid,
							page: this.cur_page
						})) {
						this.$message.success('删除成功');
						this.del_list.push(item)
					} else {
						this.$message.error('删除失败');
					}
				} catch(err) {
					console.log('系统错误')
				}
				this.delVisible = false;
			},
			handleSelectionChange(val) {
				this.selections = val;
			},
			handleDelete(index) {
				this.idx = index
				this.delVisible = true
			},
			handledelAll() {
				const length = this.selections.length;
				if(length > 0) {
					this.delVisible1 = true
				} else {
					this.$message.error('未选择');
				}
			},
			delAll() {
				const length = this.selections.length;
				for(let i = 0; i < length; i++) {
					try {
						if(this.delFile({
								fid: this.selections[i].fid,
								page: this.cur_page,
							})) {
							this.$message.success('删除成功');
							this.del_list.push(this.selections[i]);
						} else {
							this.$message.info('删除失败')
						}
					} catch(err) {
						console.log('系统错误')
					}
				}
				this.delVisible1 = false
				this.selections = [];
			},
			handleCurrentChange(val) {
				this.cur_page = val
				this.getAllfiles({
					page: this.cur_page,
					limit: 3
				})
			},
			search() {
				if(this.select_word && this.select_cate) {
					this.is_search = true;
				} else {
					this.$message.error('未输入关键字或未选择类型');
				}
			},
			toDate(input) {
				var d = new Date(input);
				var year = d.getFullYear();
				var month = d.getMonth() + 1;
				var day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();
				return year + '-' + month + '-' + day;
			},
		}
	}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	.source {
		display: flex;
		height: 15rem;
		.img {
			width: 30rem;
		}
		.file {
			width: 30rem;
			margin-left: 5rem;
		}
	}
	
	.table {
		margin-top: 1rem;
		height: 19rem;
		width: 65rem;
		position: relative;
		.el-pagination {
			bottom: 0rem;
			right: 0rem;
			position: absolute;
		}
		.el-select {
			width: 100px;
		}
		.el-input {
			width: 120px;
		}
	}
</style>