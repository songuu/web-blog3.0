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
			<el-table-column prop="title" label="音乐名称" width="150"></el-table-column>
			<el-table-column prop="singer" label="歌唱者" width="100"></el-table-column>
			<el-table-column prop="rate" label="评分" width="60"></el-table-column>
		</el-table>
		<div class="paginaton">
			<el-pagination @current-change="handleCurrentChange" layout="prev,pager,next" :total="100"></el-pagination>
		</div>
		<!--删除部分操作-->
		<el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
			<div class="del-dialog-cnt">删除不可恢复，是否确定</div>
			<span slot="footer" class="dialog-footer">
    			<el-button type="primary" @click="delVisible = false">取消</el-button>
    			<el-button type="primary" @click="delAll">确定</el-button>
    		</span>
		</el-dialog>
		<!--添加操作-->
		<el-dialog title="添加文件" :visible.sync="addVisible" width="300px">
			<el-form ref="musicItem" :model="musicItem" label-width="50px">
				<el-form-item label="名称">
					<el-input v-model="musicItem.title"></el-input>
				</el-form-item>
				<el-form-item label="作者">
					<el-input v-model="musicItem.singer"></el-input>
				</el-form-item>
				<el-form-item label="评分">
					<el-input v-model="musicItem.rate"></el-input>
				</el-form-item>
				<el-form-item label="链接">
					<el-input v-model="musicItem.url"></el-input>
				</el-form-item>
				<el-form-item label="密码">
					<el-input v-model="musicItem.pwd"></el-input>
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
				musicItem: {
					title: '',
					singer: '',
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
				musicList: [],
				cur_page: 1
			}
		},
		created() {
			this.getAllmusics({
				page: this.cur_page,
				limit: 6
			})
		},
		watch: {
			addVisible() {
				this.musicItem = {}
			}
		},
		computed: {
			...mapState(['music', 'musics']),
			data() {
				this.musicList = []
				this.getMusicData()
				return this.musicList.filter((d) => {
					let is_del = false;
					for(let i = 0; i < this.del_list.length; i++) {
						if(d.title === this.del_list[i].title) {
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
			...mapMutations(['set_music']),
			...mapActions(['getAllmusics', 'saveMusic', 'delMusic']),
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
						bid: item.bid,
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
				this.del_list = this.del_list.concat(this.multipleSelection);
				for(let i = 0; i < length; i++) {
					try {
						if(this.delMusic({
								bid: this.del_list[i].bid,
								page: this.cur_page,
								route: this.$route
							})) {
							this.$message.success('删除成功');
						} else {
							this.$message.error('删除失败');
						}
					} catch(err) {
						console.log('aid is error')
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
				this.set_music({
					title: this.musicItem.title,
					singer: this.musicItem.singer,
					rate: this.musicItem.rate,
					url: this.musicItem.url,
					pwd: this.musicItem.pwd
				})
				this.saveMusic()
				this.addVisible = false
				this.$message.success('添加成功');
			},
			handleCurrentChange(val) {
				this.cur_page = val;
				this.getMusics(this.cur_page, 6)
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			}
		}
	}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>