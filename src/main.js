import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'

import { Input, Select, Button, Icon, Tabs, TabPane, ButtonGroup, Breadcrumb, BreadcrumbItem,Checkbox,MenuItem, Submenu, ColorPicker, Pagination, Popover, Table, Menu, Tooltip, Tag, Dialog, Row, Form, FormItem, DatePicker, Card, Col, Option, TableColumn, MessageBox, Message, Notification} from 'element-ui'
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

Vue.config.productionTip = false

Vue.use(VueResource)

Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
Vue.prototype.$axios = axios

new Vue({
    el: '#app',
    router,
    store,
    axios,
    template: '<App/>',
    components: { App }
})
