<template>
	<div id="contact">
		<a class="title animated bounceIn">
			<p class="headline" id="about_me">ABOUT ME</p>
		</a>
		<div class="info animated tada">
			<img src="http://pa5114ths.bkt.clouddn.com/me1.jpg" alt="self" />
			<div class="wraper">
				<p class="left">邮箱:</p>
				<p class="right">songyuduck@163.com</p>
				<p class="left">QQ:</p>
				<p class="right">1101309860</p>
				<p class="left">学校:</p>
				<p class="right">四川理工学院大三在校生</p>
				<p class="left">在线简历:</p>
				<a class="right" href="http://www.500d.me/cvresume/edit/?itemid=512&resumeId=4322424">job.songyu.cn</a>
			</div>
		</div>
	</div>
</template>

<script>
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	#contact {
		min-height: 15rem;
		padding: 0 1rem 5rem;
		background-color: #f7f2ec;
		.title {
			p.headline {
				width: 13rem;
			}
		}
		.info {
			position: relative;
			width: 40%;
			margin: 4.875rem auto 0;
			background-color: #F7F35C;
			padding-bottom: 2rem;
			border: 0.1875rem solid rgb(84, 92, 100);			
			border-radius: 1rem;
			transition: all 2s;
			&:hover {
				background-color: rgb(0, 194, 169);
				transition: all 2s;
			}
			img {
				width: 9.375rem;
				height: 9.375rem;
				border: 0.1875rem solid #cccccc;
				border-radius: 50%;
				position: absolute;
				left: 50%;
				margin-left: -4.6875rem;
				margin-top: -4.6875rem;
			}
			div.wraper {
				margin-top: 6.125rem;
				padding-left: 2rem;
				p {
					display: inline-block;
					font-size: 1.25rem;
					color: #F95;
					margin-bottom: 1.5625rem;
				}
				a {
					color: #F95;
				}
				.left {
					width: 30%;
				}
				.right {
					width: 50%;
				}
			}
		}
	}
	
	p.headline {
		padding-top: 1.375rem;
		margin: 0 auto 1.25rem;
		text-align: center;
		color: #000000;
		font-size: 2rem;
		padding-bottom: 0.75rem;
		border-bottom: 0.3125rem double #34495e;
	}
</style>