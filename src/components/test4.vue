<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-date"></i> 表单</el-breadcrumb-item>
				<el-breadcrumb-item>markdown编辑器</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<mavon-editor v-model="content" ref="md" @imgAdd="$imgAdd" @change="change" style="min-height: 600px" />
			<el-button class="editor-btn" type="primary" @click="submit">提交</el-button>
		</div>
	</div>
</template>

<script>
	import { mavonEditor } from 'mavon-editor'
	import 'mavon-editor/dist/css/index.css'
	export default {
		data: function() {
			return {
				content: '',
				html: '',
				configs: {}
			}
		},
		components: {
			mavonEditor
		},
		methods: {
			$imgAdd(pos, $file) {
				this.$axios({
					url: '/api/getToken',
					method: 'post'
				}).then((res) => {
					let formdata = new FormData();
					formdata.append('token', res.data.token);
					formdata.append('file', $file);
					this.$axios({
						url: res.data.upUrl,
						method: 'post',
						data: formdata,
						headers: {
							'Content-Type': 'multipart/form-data'
						},
					}).then((url) => {
						this.$refs.md.$img2Url(pos, 'http://' + res.data.domain + '/' + url.data.key);
					})
				})
			},
			change(value, render) {
				// render 为 markdown 解析后的结果
				this.html = render;
			},
			submit() {
				//this.$message.success('提交成功！');
			}
		}
	}
</script>
<style scoped>
	.editor-btn {
		margin-top: 20px;
	}
</style>