<template>
	<div class="sidebar">
		<div class="collapse-btn" @click="collapseChange" :style="{'margin-left' : distance + 'px'}">
			<i :class="collapse_check"></i>
		</div>
		<el-menu class="sidebar-el-menu" :default-active="onRouter" :collapse="collapse" background-color="#324157" text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
			<template v-for="item in items">
				<template v-if="item.subs">
					<el-submenu :index="item.index" :key="item.index">
						<template slot="title">
							<i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
						</template>
						<el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">
							{{ subItem.title }}
						</el-menu-item>
					</el-submenu>
				</template>
				<template v-else>
					<el-menu-item :index="item.index" :key="item.index">
						<i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
					</el-menu-item>
				</template>
			</template>
		</el-menu>
	</div>
</template>

<script>
	import bus from '../common/bus'
	export default {
		data() {
			return {
				collapse: false,
				collapse_check: this.collapse ? 'el-icon-caret-right' : 'el-icon-caret-left',
				items: [
					{
						icon: 'el-icon-menu',
						title: '用户首页',
						index: '1',
						subs: [{
								index: 'management',
								title: '网站信息管理'
							},				
							{
								index: 'account',
								title: '管理员添加'
							}
						]
					},
					{
						icon: 'el-icon-document',
						index: 'essay',
						title: '博客管理',
					},
					{
						icon: 'el-icon-edit',
						index: '3',
						title: '个人管理',
						subs: [{
								index: 'person',
								title: '个人信息管理'
							},
							{
								index: 'tour',
								title: '个人旅游管理'
							}
						]
					},
					{
						icon: 'el-icon-edit-outline',
						index: 'resourceinput',
						title: '资源管理',
					},
					{
						icon: 'el-icon-upload2',
						index: 'commonFile',
						title: '通用资源管理'
					}
				]
			}
		},
		computed: {
			onRouter() {
				return this.$route.path.replace('/', '')
			},
			distance() {
				if(this.collapse) {
					return 65
				}else {
					return 250
				}
			}
		},
		methods: {
			collapseChange() {
				this.collapse = !this.collapse
				bus.$emit('collapse',this.collapse)
				this.collapse_check = this.collapse ? 'el-icon-caret-right' : 'el-icon-caret-left'				
			},
		}
	}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	.sidebar {
		position: absolute;
		display: block;
		left: 0;
		top: 70px;
		bottom: 0;
		width: 265px;
		.collapse-btn {
			width: 15px;
			height: 70px;
			background-color: #00CED1;
			border: 1px solid #FFFFFF;
			position: absolute;
			margin-top: 120px;
			i {
				cursor: pointer;
				color: #FFFFFF;
				line-height: 70px;
			}
		}
		.sidebar-el-menu:not(.el-menu--collapse) {
			width: 250px;
		}
		ul {
			height: 100%;
		}
	}
</style>