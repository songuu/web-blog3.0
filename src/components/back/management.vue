<template>
	<div>
		<el-row :gutter="20">
			<el-col :span="8">
				<el-row>
					<el-col>
						<el-card shadow="hover" class="mgb20">
							<div class="user-info">
								<img src="../../assets/img/me.jpg" class="user-avator" alt="管理员头像" />
								<div class="user-info-cont">
									<div class="user-info-name">
										{{ name }}
									</div>
								</div>
							</div>
							<div class="user-info-list1">
								登录时间:<span>{{ date }}</span>
							</div>
							<div class="user-info-list1">
								登录地点:<span>{{ position }}</span>
							</div>
						</el-card>
						<el-card shadow="hover">
							<div slot="header" class="clearfix">
								<span>管理员信息</span>
							</div>
							<div class="user-info-list">
								座右铭:<span>{{ this.person_message.motto }}</span>
							</div>
							<div class="user-info-list">
								毕业学校:<span>{{ this.person_message.school }}</span>
							</div>
							<div class="user-info-list">
								毕业时间:<span>{{ this.person_message.gratudation }}</span>
							</div>
							<div class="user-info-list">
								联系邮箱:<span>{{ this.person_message.email }}</span>
							</div>
							<div class="user-info-list">
								出生地方:<span>{{ this.person_message.homeplace }}</span>
							</div>
							<div class="user-info-list">
								现处地方:<span>{{ this.person_message.address }}</span>
							</div>
							<div class="user-info-list">
								自我爱好:<span>{{ this.person_message.hobby }}</span>
							</div>
						</el-card>
					</el-col>
				</el-row>
			</el-col>
			<el-col :span="16">
				<el-row :gutter="20" class="mgb20">
					<el-col :span="8">
						<el-card shadow="hover" :body-style="{padding: '0px'}">
							<div class="grid-content grid-con-1">
								<i class="el-icon-view grid-con-icon"></i>
								<div class="grid-con-right">
									<div class="grid-num">{{ commentUsers }}</div>
									<div>用户访问量</div>
								</div>
							</div>
						</el-card>
					</el-col>
					<el-col :span="8">
						<el-card shadow="hover" :body-style="{padding: '0px'}">
							<div class="grid-content grid-con-2">
								<i class="el-icon-edit grid-con-icon"></i>
								<div class="grid-con-right">
									<div class="grid-num">{{ commentsNum }}</div>
									<div>用户留言数</div>
								</div>
							</div>
						</el-card>
					</el-col>
					<el-col :span="8">
						<el-card shadow="hover" :body-style="{padding: '0px'}">
							<div class="grid-content grid-con-3">
								<i class="el-icon-bell grid-con-icon"></i>
								<div class="grid-con-right">
									<div class="grid-num">{{ messageBox.length }}</div>
									<div>通知数</div>
								</div>
							</div>
						</el-card>
					</el-col>
				</el-row>
				<el-card shadow="hover" :body-style="{height: '304px'}">
					<div slot="header" class="clearfix">
						<span>
							待办事项
						</span>
						<el-button style="float: right;padding: 3px 0" type="text" @click="addItem">添加</el-button>
					</div>
					<el-table :data="this.todoList" :show-header="false" height="304" style="width: 100%;font-size:14px;">
						<el-table-column width="40">
							<template slot-scope="scope">
								<el-checkbox v-model="scope.row.status"></el-checkbox>
							</template>
						</el-table-column>
						<el-table-column>
							<template slot-scope="scope">
								<div class="todo-item" :class="{'todo-item-del': scope.row.status}">{{scope.row.title}}</div>
							</template>
						</el-table-column>
						<el-table-column width="60">
							<template slot-scope="scope">
								<i class="el-icon-edit" @click="handleEdit(scope.$index,scope.row)"></i>
								<i class="el-icon-delete" @click="handleDelete(scope.$index,scope.row)"></i>
							</template>
						</el-table-column>
					</el-table>
				</el-card>
			</el-col>
		</el-row>

		<!--编辑添加信息-->
		<el-dialog title="添加信息" :visible.sync="addVisible" width="300px">
			<el-form ref="todoItems" :model="todoItems" label-width="50px">
				<el-form-item label="标题">
					<el-input v-model="todoItems.title"></el-input>
				</el-form-item>
				<el-form-item label="状态">
					<el-select v-model="todoItems.status" placeholder="筛选状态" class="handle-select mr10" clearable>
						<el-option key="1" label="false" value="false"></el-option>
						<el-option key="2" label="true" value="true"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
	    		<el-button type="primary" @click="addVisible = false">取消</el-button>
	    		<el-button type="primary" @click="saveAddEdit">确定</el-button>
	    	</span>
		</el-dialog>

		<!--编辑修改信息-->
		<el-dialog title="添加信息" :visible.sync="editVisible" width="300px">
			<el-form ref="todoItems" :model="todoItems" label-width="50px">
				<el-form-item label="标题">
					<el-input v-model="todoItems.title"></el-input>
				</el-form-item>
				<el-form-item label="状态">
					<el-select v-model="todoItems.status" placeholder="筛选状态" class="handle-select mr10" clearable>
						<el-option key="1" label="false" value="false"></el-option>
						<el-option key="2" label="true" value="true"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
	    		<el-button type="primary" @click="editVisible = false">取消</el-button>
	    		<el-button type="primary" @click="saveEdit">确定</el-button>
	    	</span>
		</el-dialog>

		<!--编辑删除信息-->
		<el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
			<div class="del-dialog-cnt">删除不可恢复，是否确定</div>
			<span slot="footer" class="dialog-footer">
    			<el-button type="primary" @click="delVisible = false">取消</el-button>
    			<el-button type="primary" @click="deleteRow">确定</el-button>
    		</span>
		</el-dialog>
	</div>
</template>

<script>
	import { mapMutations, mapActions, mapState } from 'vuex'
	export default {
		data() {
			return {
				todoItems: {
					title: '',
					status: ''
				},
				addVisible: false,
				editVisible: false,
				delVisible: false,
				idx: -1,
				position: '',
				date: ''
			}
		},
		watch: {
			addVisible() {
				this.gettodoList(10)
				this.todoItems = {}
			},
			editVisible() {
				this.gettodoList(10)
			},
			delVisible() {
				this.gettodoList(10)
			}
		},
		computed: {
			...mapState(['user', 'login_message', 'person_message', 'todoList', 'todoItem', 'commentNum', 'allcomments', 'messageBox']),
			name() {
				return localStorage.getItem('userName')
			},
			commentsNum() {
				return this.sum(this.commentNum)
			},
			commentUsers() {
				let result = this.unique(this.allcomments);
				return result.length
			},
			messageBox() {
				return this.allcomments.filter((item) => (!item.isRead))
			}
		},
		created() {
			this.gettodoList(10)
			this.set_plan({
				title: '',
				status: Boolean
			})
			this.getCommentsNum()
			this.getComments()
			this.getComments()
			this.getDate()
			this.getposition()
			//console.log(this.todoItem)
			//console.log(this.todoList)
		},
		methods: {
			...mapMutations(['set_deal', 'set_plan']),
			...mapActions(['getAllplans', 'savePlan', 'delPlan', 'getCommentsNum', 'getComments', 'getComments']),
			gettodoList(limit) {
				this.getAllplans(limit)
			},
			getDate() {
				let d = new Date()
				let year = d.getFullYear();
				let month = d.getMonth() + 1;
				let day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();
				let hour = d.getHours() < 10 ? '0' + d.getHours() : '' + d.getHours();
				let minute = d.getMinutes() < 10 ? '0' + d.getMinutes() : '' + d.getMinutes();
				let second = d.getSeconds() < 10 ? '0' + d.getSeconds() : '' + d.getSeconds();
				this.date = year + '-' + month + '-' + day + " " + hour + ':' + minute + ':' + second;
			},
			getposition() {
				try {
					this.position = returnCitySN["cname"]
				} catch(err) {
					this.position = ''
				}
			},
			addItem() {
				this.addVisible = true
				this.idx = this.todoList.length
			},
			unique(arr) {
				let ret = [];
				let names = []; //存储name的值(不重复)
				let len = arr.length
				for(let i = 0; i < len; i++) {
					let item = arr[i];
					if(names.indexOf(item['name']) === -1) {
						names.push(item['name'])
						ret.push(item)
					}
				}
				return ret;
			},
			saveAddEdit() {
				this.todoItem.title = this.todoItems.title
				if(this.todoItems.status === 'true') {
					this.todoItem.status = true
				} else {
					this.todoItem.status = false
				}
				//console.log(this.todoItem)
				this.savePlan()
				this.addVisible = false
				this.$message.success(`添加第${this.idx+1}行成功`);
			},
			handleDelete(index, row) {
				this.idx = index;
				//console.log(this.todoList[this.idx].id)
				this.delVisible = true;
			},
			deleteRow() {
				try {
					this.delPlan({
						id: this.todoList[this.idx].id,
						route: this.$route
					})
					this.$message.success('删除成功');
				} catch(err) {
					console.log('delete error')
					this.$message.success('删除失败,这是最后一项不能删除');
				}
				this.delVisible = false;
			},
			handleEdit(index, row) {
				this.idx = index;
				const item = this.todoList[index];
				this.todoItems = {
					title: item.title,
					status: item.status.toString()
				}
				this.editVisible = true;
			},
			saveEdit() {
				this.delPlan({
					id: this.todoList[this.idx].id,
					route: this.$route
				})
				let title = this.todoItems.title
				let status = Boolean
				this.todoList.pop(this.todoItem)
				if(this.todoItems.status === 'true') {
					status = true
				} else {
					status = false
				}
				this.set_plan({
					title: title,
					status: status
				})
				this.savePlan(this.todoItem.id)
				this.editVisible = false;
				this.$message.success(`修改第${this.idx+1}行成功`);
			},
			sum(arr) {
				let s = 0;
				arr.forEach(function(val, idx, arr) {
					s += val;
				}, 0);
				return s;
			}
		}
	}
</script>

<style scoped>
	.el-row {
		margin-bottom: 20px;
	}
	
	.grid-content {
		display: flex;
		align-items: center;
		height: 100px;
	}
	
	.grid-cont-right {
		flex: 1;
		text-align: center;
		font-size: 12px;
		color: #999;
	}
	
	.grid-num {
		font-size: 30px;
		font-weight: bold;
	}
	
	.grid-con-icon {
		font-size: 50px;
		width: 100px;
		height: 100px;
		text-align: center;
		line-height: 100px;
		color: #fff;
	}
	
	.grid-con-1 .grid-con-icon {
		background: rgb(45, 140, 240);
	}
	
	.grid-con-1 .grid-num {
		color: rgb(45, 140, 240);
	}
	
	.grid-con-2 .grid-con-icon {
		background: rgb(100, 213, 114);
	}
	
	.grid-con-2 .grid-num {
		color: rgb(45, 140, 240);
	}
	
	.grid-con-3 .grid-con-icon {
		background: rgb(242, 94, 67);
	}
	
	.grid-con-3 .grid-num {
		color: rgb(242, 94, 67);
	}
	
	.user-info {
		display: flex;
		align-items: center;
		padding-bottom: 20px;
		border-bottom: 2px solid #ccc;
		margin-bottom: 20px;
	}
	
	.user-avator {
		width: 120px;
		height: 120px;
		border-radius: 50%;
	}
	
	.user-info-cont {
		padding-left: 50px;
		flex: 1;
		font-size: 14px;
		color: #999;
	}
	
	.user-info-cont div {
		font-size: 30px;
		color: #222;
	}
	
	.user-info-list {
		font-size: 14px;
		color: #999;
		line-height: 25px;
	}
	
	.user-info-list span {
		margin-left: 50px;
	}
	
	.user-info-list1 {
		font-size: 14px;
		color: #999;
		line-height: 25px;
	}
	
	.user-info-list1 span {
		margin-left: 30px;
	}
	
	.mgb20 {
		margin-bottom: 20px;
	}
	
	.todo-item {
		font-size: 14px;
	}
	
	.todo-item-del {
		text-decoration: line-through;
		color: #999;
	}
	
	.handle-select {
		width: 200px;
	}
	
	.del-dialog-cnt {
		font-size: 16px;
		text-align: center
	}
	
	.el-icon-edit:hover {
		cursor: pointer;
	}
	
	.el-icon-delete:hover {
		cursor: pointer;
	}
</style>