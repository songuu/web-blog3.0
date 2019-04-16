<template>
	<div class="contact">
		<h2 class="animated bounceIn">联系站长</h2>
		<div class='form_wrap'>
			<div class="form animated tada">
				<label for="subject">邮件主题:</label>
				<input type="text" v-model="subject"/>
				<label for="email">邮箱: </label>
				<input type="text" class="email" v-model="email" />
				<label for="content">邮件内容 : </label>
				<textarea placeholder="内容不要过多" spellcheck="false" v-model="content" class="message"></textarea>
				<button class="sendEmail" @click="send" :disabled="sendFlag">
                	<span>{{sendFlag ? '发送中...' : '确认提交'}}</span>
            	</button>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapActions } from 'vuex'
	export default {
		data() {
			return {
				subject: '',
				email: '',
				content: '',
				sendFlag: false
			}
		},
		methods: {
			...mapActions(['sendMail']),
			open(name) {
				const h = this.$createElement;
				this.$notify({
					title: '信息',
					message: h('i', {
						style: 'color: teal'
					}, name)
				});
			},
			send() {
				const re = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g
				if(!this.subject || !this.content) {
					this.open('主题或内容为空')
					return
				} else if(!re.test(this.email)) {
					this.open('邮箱错误或邮箱格式错误')
					return
				}
				this.sendFlag = true
				this.sendMail({
					subject: this.subject,
					email: this.email,
					content: this.content
				}).then((res) => {
					if(res.status === 200) {
						this.open('发送成功')
					} else {
						this.open('发送失败')
					}
					this.subject = ''
					this.content = ''
					this.email = ''
					this.sendFlag = false
				}).catch(() => {
					this.sendFlag = false
					this.open('系统错误')
				})
			}
		}

	}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	.contact {
		min-height: 30rem;
		width: 530px;
		background: rgb(219, 218, 192);
		margin: 0 auto;
		h2 {
			margin-bottom: 20px;
			text-align: center;
			font-size: 2rem;
			text-shadow: 0 1px 0 #ede8d9;
		}
		.form_wrap {
			overflow: hidden;
			height: 430px;
			position: relative;
			top: 0px;
			.form {
				background: #f7f2ec url('http://pa5114ths.bkt.clouddn.com/letter.jpg');
				position: relative;
				top: 15px;
				overflow: hidden;
				height: 20rem;
				width: 400px;
				margin: 0px auto;
				padding: 20px;
				border: 1px solid #fff;
				border-radius: 5px;
				-moz-border-radius: 5px;
				-webkit-border-radius: 5px;
				box-shadow: 0px 0px 3px #9d9d9d, inset 0px 0px 27px #fff;
				-moz-box-shadow: 0px 0px 3px #9d9d9d, inset 0px 0px 14px #fff;
				-webkit-box-shadow: 0px 0px 3px #9d9d9d, inset 0px 0px 27px #fff;
				label {
					margin: 11px 20px 0 0;
					font-size: 16px;
					color: #b3aba1;
					text-transform: uppercase;
					text-shadow: 0px 1px 0px #fff;
				}
				textarea,
				input[type=text] {
					font: 14px normal normal uppercase helvetica, arial, serif;
					color: #7c7873;
					background: none;
					width: 380px;
					height: 36px;
					padding: 0px 10px;
					margin: 0 0 10px 0;
					border: 1px solid #f8f5f1;
					-moz-border-radius: 5px;
					-webkit-border-radius: 5px;
					border-radius: 5px;
					-moz-box-shadow: inset 0px 0px 1px #726959;
					-webkit-box-shadow: inset 0px 0px 1px #b3a895;
					box-shadow: inset 0px 0px 1px #b3a895;
					&:focus {
						background: rgba(255, 255, 255, .35);
					}
				}
				textarea {
					height: 6rem;
					width: 24rem;
					resize: none;
					padding-top: 14px;
				}
				button {
					height: 2.5rem;
					border: none;
					outline: none;
					color: #00193a;
					background: #ffffff;
					padding-left: 0.4375rem;
					cursor: pointer;
					border-radius: 0.25rem;
					transition: 0.5s;
					font-size: 0.875rem;
					span {
						display: inline-block;
						height: 2.5rem;
						line-height: 2.5rem;
						position: relative;
						transition: 0.5s;						
					}
					&:hover {
						color: #435c70;
					}					
				}
				.sendEmail {
					width: 6.25rem;
					margin-top: 0.25rem;
					margin-left: calc(100% - 6.25rem);
				}
			}
		}
	}
	
	@media screen and (max-width: 440px) {
		.email {
			width: 100% !important;
		}
	}
</style>