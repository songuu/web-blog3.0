import Axios from 'axios'
import store from '@/store'

class httpRequest {
	constructor() {
		this.options = {
			method: '',
			url: ''
		}
		// 存储请求队列
		this.queue = {}
	}
	// 销毁请求实例
	destroy(url) {
		delete this.queue[url]
		const queue = Object.keys(this.queue)
		return queue.length
	}
	// 请求拦截
	interceptors(instance, url) {
		// 添加请求拦截器
		instance.interceptors.request.use(config => {
			/*if (window.localStorage.getItem('token')) {					  // 实现token的动态跟新
        		request.headers.set('authorization', 'Bearer ' + window.localStorage.getItem('token'))
   	 		}*/
			return config			
		}, error => {
			// 对请求错误做些什么
			return Promise.reject(error)
		})

		// 添加响应拦截器
		instance.interceptors.response.use((res) => {
			let {data} = res
			const is = this.destroy(url)
			if(!is) {
				setTimeout(() => {
					// Spin.hide()
				}, 500)
			}
			if(res.status !== 200) {
				// 后端服务在个别情况下会报201，待确认
				if(res.status === 401) {
					//localStorage.removeItem('token')
					window.location.href = window.location.origin + '/login'
					console.log('未登录，或登录失效，请登录')
				} else {
					if(res.msg) console.log(res.msg)
				}
				return false
			}
			return data
		}, (error) => {
			debugger
			window.location.href = window.location.origin + '/login'
			console.log('服务器离线')			
			// 对响应错误做点什么
			return Promise.reject(error)
		})
	}
	// 创建实例
	create() {
		let conf = {
			baseURL: 'http://127.0.0.1:3003',
			// timeout: 2000,
			headers: {
				'Content-Type': 'application/json; charset=utf-8'
			}
		}
		return Axios.create(conf)
	}
	// 合并请求实例
	mergeReqest(instances = []) {
		//
	}
	// 请求实例
	request(options) {
		var instance = this.create()
		this.interceptors(instance, options.url)
		options = Object.assign({}, options)
		this.queue[options.url] = instance
		return instance(options)
	}
}
export default httpRequest