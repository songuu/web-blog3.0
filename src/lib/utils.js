import Cookies from 'js-cookie'

export const SESSION = 'session'
const cookieExpires = 1



// 让一个高频触发的函数在一定时间内只触发一次  函数节流
export function _debounce (func, wait) {
    let _timestamp, _timer
    return function () {
        let now = Date.now()
        if (_timestamp && ((now - _timestamp) < wait)) {
            clearTimeout(_timer)
        }
        _timestamp = now
        _timer = setTimeout(func.bind(this, ...arguments), wait)
    }
}
export function toggleClass(element, className) {//换肤函数
    if (!element || !className) {
      return
    }
    element.className = className;
}

export const setSession = (session) => {
	Cookies.set(SESSION, session, {
		expires: cookieExpires || 1
	})
}

export const getSession = () => {
	const session = Cookies.get(SESSION)
	if(session) return session
	else return false
}
