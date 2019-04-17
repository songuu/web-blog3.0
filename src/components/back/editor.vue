<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-date"></i> 博客</el-breadcrumb-item>
				<el-breadcrumb-item>文章内容编辑</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container1">
			<div class="handle-box">
				<el-input v-model="title" placeholder="文章标题" class="handle-title mr10" size="small"></el-input>
				<el-input v-model="imgUrl" placehoder="图片连接" class="handle-url mr10" size="small"></el-input>
 				<el-tag :key="tag" v-for="tag in tags" closable :disable-transitions="false" @close="handleClose(tag)">
					{{tag}}
				</el-tag>
				<el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
				</el-input>
				<el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新标签</el-button>
			</div>
			<mavon-editor v-model="Vcontent" ref="md" @imgAdd="$imgAdd" @change="change" style="min-height: 600px" />
			<el-button class="editor-btn" type="primary" @click="save($route.query.aid);isSaving = true">提交</el-button>
		</div>
		<el-dialog title="提示" :visible.sync="addVisible" width="300px" center>
			<div class="add-dialog-cnt">类型不可以重复</div>
			<span slot="footer" class="dialog-footer">
	    			<el-button @click="addVisible = false">取消</el-button>
	    			<el-button type="primary" @click="addVisible = false">确定</el-button>
	    		</span>
		</el-dialog>
		<el-dialog title="提示" :visible.sync="dialog.isUpdate" width="300px" center>
			<div class="leaving-dialog-cnt">还没有上传确定要离开吗?</div>
			<span slot="footer" class="dialog-footer">
	    			<el-button type="primary" @click="cancel">取消</el-button>
	    			<el-button type="primary" @click="confirm">确定</el-button>
	    		</span>
		</el-dialog>
	</div>
</template>

<script>
	import { mapMutations, mapActions, mapState } from 'vuex'
	import { mavonEditor } from 'mavon-editor'
	import 'mavon-editor/dist/css/index.css'
	export default {
		data() {
			return {
				inputVisible: false,
				inputValue: '',
				addVisible: false,
				isChange: false,
				isSaving: false
			}
		},
		components: {
			mavonEditor
		},
		created() {
			const aid = this.$route.query.aid
			//console.log(aid)
			this.isSaving_ctl(false)
			if(aid) {
				return this.getArticle(aid)
			}
			this.set_article({
				content: '',
				title: '',
				tags: [],
				imgUrl: ''
			})
		},
		directives: {
			focus: {
				inserted: (el) => {
					el.focus()
				}
			}
		},
		computed: {
			...mapState(['article', 'dialog']),
			Vcontent: { //获取文章内容
				get() {
					return this.article.content
				},
				set(value) {
					this.update_post_content(value)
				}
			},
			title: { //获取文章标题
				get() {
					return this.article.title || ''
				},
				set(value) {
					this.update_post_title(value)
				}
			},
			tags: { //获取文章标签
				get() {
					return this.article.tags
				},
				set(value) {
					this.update_post_tags(this.tags)
				}
			},
			imgUrl: {
				get() {
					return this.article.imgUrl
				},
				set(value) {
					this.update_post_imgUrl(value)
				}
			}
		},
		watch: {
			title() {
				this.isChange = true
			},
			tags() {
				this.isChange = true
			},
			Vcontent() {
				this.isChange = true
			}
		},
		methods: {
			...mapMutations(['set_article', 'update_post_content', 'update_post_title', 'update_post_tags', 'update_post_imgUrl', 'isSaving_ctl', 'set_dialog']),
			...mapActions(['saveArticle', 'getArticle']),
			$imgAdd(pos, $file) {
				//上传到七牛云
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
						}
					}).then((url) => {
						this.$refs.md.$img2Url(pos, 'http://' + res.data.domain + '/' + url.data.key);
					})
				})
			},
			save(id) {
				this.saveArticle(id).then((res) => {
					if(res.status === 200) {
						this.isSaving_ctl(true)
						this.$router.push({name: 'essay'})
					} else {
						console.log('获取失败')
					}
				})
			},
			change(value, render) { // render 为 markdown 解析后的结果
				this.html = render;
			},
			handleClose(tag) {
				this.tags.splice(this.tags.indexOf(tag), 1);
			},

			showInput() {
				this.inputVisible = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput.$refs.input.focus();
				});
			},

			handleInputConfirm() {
				let inputValue = this.inputValue;
				if(inputValue) {
					if(this.tags.indexOf(inputValue)) {
						this.tags.push(inputValue);
					} else {
						this.addVisible = true;
					}
				}
				this.inputVisible = false;
				this.inputValue = '';
			},
			confirm() {
				this.dialog.isUpdate = false
				this.dialog.resolveFn()
			},
			cancel() {
				this.dialog.isUpdate = false
				this.dialog.rejectFn()
			}
		},
		beforeRouteLeave(to, from, next) {
			if(this.isChange && !this.isSaving) {
				this.set_dialog({
					isUpdate: true
				})
				new Promise((resolve, reject) => {
					this.dialog.resolveFn = resolve
					this.dialog.rejectFn = reject
				}).then(
					() => {
						next()
					},
					() => {
						next(false)
					}
				).catch((err) => {
					console.log(err)
				})
			} else {
				this.set_article({
					content: '',
					title: '',
					tags: []
				})
				next()
			}
		}
	}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
	.handle-box {
		margin-bottom: 20px;
	}
	
	.handle-title {
		width: 300px;
		display: inline-block;
	}
	
	.handle-url {
		width: 300px;
		display: inline-block;
	}
	.editor-btn {
		margin-top: 20px;
	}
	
	.el-tag+.el-tag {
		margin-left: 10px;
	}
	
	.button-new-tag {
		margin-left: 10px;
		height: 32px;
		line-height: 30px;
		padding-top: 0;
		padding-bottom: 0;
	}
	
	.input-new-tag {
		width: 90px;
		margin-left: 10px;
		vertical-align: bottom;
	}
	
	.add-dialog-cnt {
		font-size: 16px;
		text-align: center
	}
	
	.leaving-dialog-cnt {
		font-size: 16px;
		text-align: center
	}
</style>