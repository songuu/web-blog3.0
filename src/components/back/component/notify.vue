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
									<el-button type="info" @click="lookback(scope.row._id,scope.$index)">回看</el-button>
								</template>
							</el-table-column>
						</el-table>
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
					r_message: []
				}
			}
		},
		created() {
			this.getComments()
			this.getData()
		},
		methods: {
			...mapMutations(['set_allcomments']),
			...mapActions(['getComments', 'summitComment', 'updateMessage']),
			handleRead(index) {
				const item = this.messageForm.u_message.splice(index, 1);
				this.updateMessage({
					id: item[0].articleId,
					date: item[0].date
				}).then((res) => {
					if(res.status === 200) {
						console.log('此消息已读')
						this.messageForm.r_message = item.concat(this.messageForm.r_message);
					} else {
						console.log('修改失败')
					}
				})
				this.getData()
			},
			lookback(id, index) {
				const item = this.messageForm.r_message.splice(index, 1);
				console.log(item)
			},
			handleAllRead() {
				let arr = this.messageForm.u_message
				for(let i in arr) {
					this.updateMessage({
						id: arr[i].articleId,
						date: arr[i].date
					}).then((res) => {
						if(res.status === 200) {
							arr.splice(i, 1)
							this.messageForm.r_message.push(arr[i])
						} else {
							console.log(i + 1 + '项修改失败')
						}
					})
				}
				this.messageForm.u_message = arr
				this.getData()
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
				this.allcomments.forEach((item) => {
					if(!item.isRead) {
						this.messageForm.u_message.push({
							date: item.date,
							name: item.name,
							content: item.content,
							articleId: item.articleId,
							imgName: item.imgName,
							address: item.address,
							like: item.like,
							isRead: item.isRead
						})
					}
				})
			}
		},
		computed: {
			...mapState(['allcomments']),
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