import {
    Form,
    FormItem,
    Input,
    Button,
    Message,
    Container,
    Header,
    Aside,
    Main,
    Menu,
    Submenu,
    MenuItem,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Row,
    Col,
    Table,
    TableColumn,
    Switch,
    Tooltip,
    Pagination,
    Dialog,
    MessageBox,
    Tag,
    Tree,
    Select,
    Option,
} from 'element-ui';

const element = {
    install(Vue) {
        Vue.use(Form)
        Vue.use(FormItem)
        Vue.use(Input)
        Vue.use(Button)
        Vue.use(Container)
        Vue.use(Header)
        Vue.use(Aside)
        Vue.use(Main)
        Vue.use(Menu)
        Vue.use(Submenu)
        Vue.use(MenuItem)
        Vue.use(Breadcrumb)
        Vue.use(BreadcrumbItem)
        Vue.use(Card)
        Vue.use(Row)
        Vue.use(Col)
        Vue.use(Table)
        Vue.use(TableColumn)
        Vue.use(Switch)
        Vue.use(Tooltip)
        Vue.use(Pagination)
        Vue.use(Dialog)
        Vue.use(Tag)
        Vue.use(Tree)
        Vue.use(Select)
        Vue.use(Option)
        Vue.prototype.$message = Message;
        Vue.prototype.$confirm = function(tip, success, fail) {
            MessageBox.confirm(tip, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                success();
            }).catch(() => fail());
        }

    }
}

export default element