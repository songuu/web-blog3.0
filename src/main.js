import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'

import { Input, Select, Button, Icon, Tabs, TabPane, ButtonGroup, Breadcrumb, BreadcrumbItem, Checkbox, MenuItem, Submenu, ColorPicker, Pagination, Popover, Table, Menu, Tooltip, Tag, Dialog, Row, Form, FormItem, DatePicker, Card, Col, Option, TableColumn, MessageBox, Message, Notification, Timeline, TimelineItem } from 'element-ui'
Vue.component(Button.name, Button);
Vue.component(Select.name, Select);
Vue.component(Input.name, Input);
Vue.component(Menu.name, Menu);
Vue.component(Pagination.name, Pagination);
Vue.component(Popover.name, Popover);
Vue.component(Table.name, Table);
Vue.component(Popover.name, Popover);
Vue.component(Tooltip.name, Tooltip);
Vue.component(Breadcrumb.name, Breadcrumb);
Vue.component(BreadcrumbItem.name, BreadcrumbItem);
Vue.component(Tag.name, Tag);
Vue.component(Tabs.name, Tabs);
Vue.component(TabPane.name, TabPane);
Vue.component(Row.name, Row);
Vue.component(Col.name, Col);
Vue.component(Icon.name, Icon);
Vue.component(FormItem.name, FormItem);
Vue.component(DatePicker.name, DatePicker);
Vue.component(Card.name, Card);
Vue.component(Checkbox.name, Checkbox);
Vue.component(Dialog.name, Dialog);
Vue.component(Form.name, Form);
Vue.component(Option.name, Option);
Vue.component(MenuItem.name, MenuItem);
Vue.component(ColorPicker.name, ColorPicker);
Vue.component(Submenu.name, Submenu);
Vue.component(TableColumn.name, TableColumn);
Vue.component(ButtonGroup.name, ButtonGroup);
Vue.component(Timeline.name, Timeline)
Vue.component(TimelineItem.name, TimelineItem)

Vue.config.productionTip = false

Vue.use(VueResource)

Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
Vue.prototype.$axios = axios

document.body.oncopy = (event) => {
	event.preventDefault(); // 取消默认的复制事件 
	let textFont, copyFont = window.getSelection(0).toString(); // 被复制的文字 等下插入
	if(copyFont.length > 10) {
		textFont = copyFont + '\n' +
			'作者：songyu\n' +
			'来源：宋钰的博客\n';
	} else {
		textFont = copyFont; // 没超过十个字 则采用被复制的内容。
	}
	if(event.clipboardData) {
		return event.clipboardData.setData('text', textFont); // 将信息写入粘贴板
	} else {
		// 兼容IE
		return window.clipboardData.setData("text", textFont);
	}
}

new Vue({
	el: '#app',
	router,
	store,
	axios,
	template: '<App/>',
	components: {
		App
	}
})