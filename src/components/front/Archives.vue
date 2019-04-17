<template>
	<div id="archives">
		<div class="archBox">
			<el-timeline>
				<el-timeline-item v-for="(item, index) in archives" :color="item.type === 'personal' ? '#0bbd87': ''" :key="index" :timestamp="item.date | toDate" placement="top">
					<el-card>
						<h4>上传文章</h4>
						<p @click="gotoArc(item.title, item.date)">{{item.title}}</p>
					</el-card>
				</el-timeline-item>
			</el-timeline>
			<el-pagination background @current-change="handleCurrentChange" :page-size="3" :current-page="page" layout="total, prev, pager, next" :total="archNum" size="small">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import { mapActions, mapState } from 'vuex'
	export default {
		data() {
			return {
				page: 1,
				cur_page: 1
			};
		},
		created() {
			this.getArchNum()
			this.page = Number(localStorage.getItem('page')) || 1; //记忆刷新页面之前的页面位置
			this.handleCurrentChange(this.page)
		},
		beforeUpdate() { //刷新页面
			if(this.curTag) {
				localStorage.setItem('page', '1')
			} else {
				localStorage.setItem('page', this.page)
			}
		},
		beforeDestroy() { //退出页面
			localStorage.setItem('page', '1')
		},
		filters: {
			toDate(input) {
				var d = new Date(input);
				var year = d.getFullYear();
				var month = d.getMonth() + 1;
				var day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();
				return year + '/' + month + '/' + day;
			},
		},
		computed: {
			...mapState(['archives', 'archNum'])
		},
		methods: {
			...mapActions(['getArchives', 'getArchNum', 'getArtId']),
			handleCurrentChange(val) {
				this.cur_page = val
				this.getArchives({
					page: this.cur_page,
					limit: 3
				})
			},
			gotoArc(title, date) {
				console.log(date)
				/*this.getArtId({
					'title': title,
					'date': date
				}).then((res) => {
					if(res.status === 200) {
						this.$router.push({
							name: 'article',
							params: {
								'id': res.data
							}
						})
					} else {
						console.log('获取失败')
					}
				})*/
			}
		}
	};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	#archives {
		width: 100%;
		.archBox {
			margin: 1rem auto;
			width: 90%;
			height: 33.5rem;
			ul {
				width: 60%;
				margin: 0 20%;
			}
			.el-pagination {
				width: 30%;
				position: absolute;
				bottom: 1rem;
				left: 40rem;
			}
		}
	}
</style>