<template>
	<div>
		<a href="https://segmentfault.com/u/songuu" class="iconfont icon-iconsf"></a>
        <a href="https://github.com/songuu" class="iconfont icon-github"></a>
        <a href="https://weibo.com/3516360474/profile?topnav=1&wvr=6" class="iconfont icon-sina"></a>
		<a href="#" class="iconfont icon-jianshu"></a>
		<p>川ICP备15101010118号</p>
        <p>Copyright @ 2018 Powered by Vue. Designed by songyu| <router-link :to="{name: 'contact'}" tag="span" class="contact">联系站长</router-link> | <router-link :to="{name: 'login'}" tag="span" class="login">站长登录</router-link></p>
	</div>
</template>

<script>
		export default {}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import '../../../assets/css/icon.scss';
	.iconfont {
		font-size: 1.875rem;
		color: #fff;
		margin-right: 0.625rem;
	}
	.icon-iconsf:hover {
        color: green;
    }
	.icon-github:hover {
        color: royalblue;
    }
    .icon-sina {
        font-size: 1.625rem;
    }
    .icon-sina:hover {
        color: deepskyblue;
    }
    .icon-jianshu {
        font-size: 1.625rem;
    }
    .icon-jianshu:hover {
        color: indianred;
    }
    div {
        text-align: center;
        padding-top: 0.625rem;
        line-height: 2.5rem;
        width: 100%;
        background: rgba(55, 57, 65, 0.5);
        position: absolute;
    }
    p {
        text-align: center;
        color: #ffffff;
        font-size: 1rem;
    }
    span.contact {
    	cursor: pointer;
    	color: #fff;
    }
    span.login {
        cursor: pointer;
        color: #fff;
    }
</style>