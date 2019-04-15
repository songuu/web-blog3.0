<template>
 <div id="box">
 	<div class="container">
	    <router-view v-show="isshow"></router-view>
    </div>
 </div>
</template>
<script>
import slider from 'vue-concise-slider'
export default {
   data () {
      return {
      		isshow: true,
      	}
    }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
	#box {
		position: relative;
		min-height: 34rem;
		.container {
			overflow: hidden;
			background-color: #F5F5FE;
			transition: 2s;
		}
	}
</style>