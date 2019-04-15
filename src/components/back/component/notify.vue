<template>
	<div class="">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-message"></i>消息通知</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<el-tabs v-model="message" :data="data">
				<el-tab-pane :label="`未读消息(${data.u_message.length})`" name="first">
					<el-table :data="data.u_message" :show-header="false" style="width: 100%">
						<el-table-column>
							<template slot-scope="scope">
								<span class="message-name">{{scope.row.name}}</span>
								<span class="message-name">留言为:{{scope.row.content}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="date" width="180" :formatter="toDate"></el-table-column>
						<el-table-column width="120">
							<template slot-scope="scope">
								<el-button size="small" @click="handleRead(scope.$index)">标为已读</el-button>
							</template>
						</el-table-column>
					</el-table>
					<div class="handle-row">
						<el-button type="primary" @click="handleAllRead">全部标为已读</el-button>
					</div>
				</el-tab-pane>
				<el-tab-pane :label="`已读消息(${data.r_message.length})`" name="second">
					<template v-if="message === 'second'">
						<el-table :data="data.r_message" :show-header="false" style="width: 100%">
							<el-table-column>
								<template slot-scope="scope">
									<span class="message-name">{{scope.row.name}}</span>
								</template>
							</el-table-column>
							<el-table-column prop="date" width="180" :formatter="toDate"></el-table-column>
							<el-table-column width="120">
								<template slot-scope="scope">
									<el-button type="danger" @click="handleDel(scope.row._id,scope.$index)">删除</el-button>
								</template>
							</el-table-column>
						</el-table>
						<div class="handle-row">
							<el-button type="danger" @click="handleDelAll">删除全部</el-button>
						</div>
					</template>
				</el-tab-pane>
				<el-tab-pane :label="`回收站(${data.c_message.length})`" name="third">
					<template v-if="message === 'third'">
						<el-table :data="data.c_message" :show-header="false" style="width: 100%">
							<el-table-column>
								<template slot-scope="scope">
									<span class="message-name">{{scope.row.name}}</span>
								</template>
							</el-table-column>
							<el-table-column prop="date" width="180" :formatter="toDate"></el-table-column>
							<el-table-column width="120">
								<template slot-scope="scope">
									<el-button @click="handleRestore(scope.$index)">还原</el-button>
								</template>
							</el-table-column>
						</el-table>
						<div class="handle-row">
							<el-button type="danger" @click="handleRsAll">清空回收站</el-button>
						</div>
					</template>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script>
	import { mapMutations, mapState, mapActions } from 'vuex'
	export default {
		data() {
			return {
				message: 'first',
				showHeader: false,
				messageForm: {
					u_message: [],
					r_message: [],
					c_message: []
				}
			}
		},
		created() {
			this.getMessageBox()
			this.getData()
		},
		methods: {
			...mapMutations(['set_messageBox']),
			...mapActions(['getMessageBox', 'summitComment']),
			handleRead(index) {
				const item = this.messageForm.u_message.splice(index, 1);
				this.messageForm.r_message = item.concat(this.messageForm.r_message);
			},
			handleDel(id, index) {
				const item = this.messageForm.r_message.splice(index, 1);
				this.messageForm.c_message = item.concat(this.messageForm.c_message);
				try {
					this.summitComment({
						date: item[index].date,
					}).then(() => {
						this.getMessageBox()
					}).catch((err) => {
						console.log(err)
					})
				} catch(err) {
					console.log(err)
				}

				//console.log(this.messageForm)				
			},
			handleRestore(index) {
				const item = this.messageForm.c_message.splice(index, 1);
				this.messageForm.r_message = item.concat(this.messageForm.r_message);
			},
			handleAllRead() {
				this.messageForm.u_message.forEach((item) => {
					this.messageForm.r_message.push(item)
				})
				this.messageForm.u_message = []
			},
			handleDelAll() {
				this.messageForm.r_message.forEach((item) => {
					this.messageForm.c_message.push(item)
				})
				this.messageForm.r_message = []
			},
			handleRsAll() {
				this.messageForm.c_message = []
			},
			toDate(row, column) {
				var date = row[column.property]
				var d = new Date(date);
				var year = d.getFullYear();
				var month = d.getMonth() + 1;
				var day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();
				var hour = d.getHours() < 10 ? '0' + d.getHours() : '' + d.getHours();
				var minute = d.getMinutes() < 10 ? '0' + d.getMinutes() : '' + d.getMinutes();
				var second = d.getSeconds() < 10 ? '0' + d.getSeconds() : '' + d.getSeconds();
				return year + '-' + month + '-' + day + " " + hour + ':' + minute + ':' + second;
			},
			getData() {
				this.messageBox.forEach((item) => {
					this.messageForm.u_message.push({
						date: item.date,
						name: item.name,
						content: item.content,
						articleId: item.articleId,
						imgName: item.imgName,
						address: item.address,
						like: item.like
					})
				})
			}
		},
		computed: {
			...mapState(['messageBox']),
			data() {
				this.messageForm.u_message = []
				this.getData()
				return this.messageForm
			}
		}
	}
</script>

<style scoped>
	.message-name {
		cursor: pointer;
	}
	
	.handle-row {
		margin-top: 30px;
	}
</style>