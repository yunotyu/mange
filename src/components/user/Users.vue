<template>
  <div>
    <!-- 面包屑部分，头部 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片部分 -->
    <el-card>
      <!-- 栅格布局  gutter栅格间隔-->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索框 -->
          <el-input @clear="searchCilck" :clearable="true" v-model="queryInfo.query" placeholder="请输入内容">
            <el-button  @click="searchCilck" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="dialogFormVisible = true" type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格部分 -->
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <!-- 将布尔值显示为开关按钮,使用作用域插槽 -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <!-- 操作栏 -->
        <el-table-column prop="" label="操作">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="修改"
              placement="top"
              :enterable="false"
            >
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="showEditDialog(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false"
            >
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="deleteUser(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="设置用户角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-setting"
                @click="getRoleData(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count"
      >
      </el-pagination>
    </el-card>

 <!-- 添加用户弹出框    -->
<el-dialog @close="diaClose" title="添加用户" width="50%" :visible.sync="dialogFormVisible">
  <el-form :model="addFormInfo" :rules="rules" label-width="70px" ref="addFormRef">
    <el-form-item label="姓名" prop="username">
      <el-input clearable v-model="addFormInfo.username"  autocomplete="off"></el-input>
    </el-form-item>
     <el-form-item label="密码" prop="password">
      <el-input clearable v-model="addFormInfo.password"  autocomplete="off"></el-input>
    </el-form-item>
     <el-form-item label="邮箱" prop="email">
      <el-input clearable  v-model="addFormInfo.email"  autocomplete="off"></el-input>
    </el-form-item>
     <el-form-item label="手机" prop="mobile">
      <el-input clearable v-model="addFormInfo.mobile"  autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible=false">取 消</el-button>
    <el-button @click="addUser" type="primary" >确 定</el-button>
  </div>
</el-dialog>

 <!-- 编辑用户弹出框    -->
<el-dialog @close="diaClose" title="编辑用户" width="50%" :visible.sync="editDialogFormVisible">
  <el-form :model="editUserInfo" :rules="rules" label-width="70px" ref="addFormRef">
    <el-form-item label="姓名" prop="username">
      <el-input disabled clearable v-model="editUserInfo.username"  autocomplete="off"></el-input>
    </el-form-item>
     <el-form-item label="邮箱" prop="email">
      <el-input clearable  v-model="editUserInfo.email"  autocomplete="off"></el-input>
    </el-form-item>
     <el-form-item label="手机" prop="mobile">
      <el-input clearable v-model="editUserInfo.mobile"  autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="editDialogFormVisible=false">取 消</el-button>
    <el-button @click="editUser" type="primary" >确 定</el-button>
  </div>
</el-dialog>

<!-- 分配用户角色弹框 -->
<edit-dialog @submit="setRole" @cancel='setRoleDiaCancel' @close="setRoleDiaClose" :title="setRoleTitle" width="50%" :dialogFormVisible="setRoleDialogFormVisible">
  <div slot="input">
    <div>
      <p>{{userInfo.username}}</p>
      <p>{{userInfo.role_name}}</p>
    </div>
    <el-select v-model="selectRoleId" placeholder="请选择角色">
      <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id" multiple></el-option>
    </el-select>
  </div>
</edit-dialog>
  </div>
</template>

<script>
import EditDialog from '@/components/Common/CustomDialog';

export default {
  components:{
    EditDialog,
  },
  data() {
    //自定义校验规则,注意要写在return前面
      var checkEmail=(rule, value, callback) => {
        if (!value) {
          return callback(new Error('邮箱不能为空'));
        }
        var reg = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/;
        if (!reg.test(value)){
          return callback(new Error('邮箱格式错误'));
        }else{
          callback();
        }
    };
    //校验手机号
      var checkPhone=(rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机不能为空'));
        }
        var reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
        if (!reg.test(value)){
          return callback(new Error('手机格式错误'));
        }else{
          callback();
        }
    };    
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      userList: [],
      count:0,//总条数
      dialogFormVisible: false,
      //绑定添加用户的表单数据
      addFormInfo:{
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      rules:{
         username:[{ required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 9, message: '长度在 3 到 9 个字符', change: 'blur' }
            ],
             password:[{ required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 9, message: '长度在 3 到 9 个字符', change: 'blur' }
            ],
             email:[{ validator:checkEmail, change: 'blur' },
             { required: true, message: '请输入用户名', trigger: 'blur' }
            ],
             mobile:[{ validator:checkPhone, change: 'blur' },
             { required: true, message: '请输入用户名', trigger: 'blur' }],
      },
      //编辑框弹出
      editDialogFormVisible:false,
      editUserInfo:{},
      setRoleDialogFormVisible:false,
      setRoleTitle:'分配用户角色',
      userInfo:{},
      roleList:[],
      selectRoleId:'',//当前选中的角色
  }
  },
  methods: {
    //请求用户数据
    getUserList() {
      this.$request({
        url: "users",
        method: "get",
        params: this.queryInfo,
      }).then((res) => {
        this.userList = res.data.data.users;
        this.count=res.data.data.total;
      });
    },
    //监听切换页面显示条数事件
    handleSizeChange(size) {
      this.queryInfo.pagesize = size;
      this.getUserList();
    },
    //监听切换到第几页的事件
    handleCurrentChange(page) {
      this.queryInfo.pagenum = page;
      this.getUserList();
    },
    //监听开关按钮切换
    userStateChange(row){
      this.$request({
        url: "users/"+row.id+"/state/"+row.mg_state,
        method: "put",
      }).then((res) => {
        if(res.data.meta.status!=200){
          row.mg_state=!row.mg_state;
          this.$message.error('更新数据失败');
        }
        else{
          this.$message.success('更新状态成功')
        }
      });
    },
    //查询
    searchCilck(){
      this.getUserList();
    },
    //添加用户窗体关闭
    diaClose(){
      //清除表单内容
      this.$refs.addFormRef.resetFields();
      this.dialogFormVisible=false;
    },
    //添加用户请求
    addUser(){
       this.$refs.addFormRef.validate(valid=>{
         if(valid){
           this.$request({
             url:'users',
             method:'post',
             data:this.addFormInfo
           }).then(res=>{
             if(res.data.meta.status=='201'){
               this.diaClose();//关闭弹窗
               this.getUserList();//重新请求页面数据
               this.$message.success('添加成功')
             }else{
               this.$message.error('添加失败')
             }
           })
         }else{
           this.$message.error('信息校验失败');
         }
       })
    },
    //修改用户数据弹出框
    showEditDialog(user){
      this.editDialogFormVisible=true;
      // 根据id查询
      this.$request({
        url:'users/'+user.id,
        method:'get'
      }).then(res=>{
        if(res.data.meta.status=='200')
        this.editUserInfo=res.data.data;
        else{
          this.$message.error('获取数据失败');
        }
      })
    },
    //编辑用户请求提交
    editUser(){
      console.log(this.editUserInfo);
      this.$request({
        url:'users/'+this.editUserInfo.id,
        method:'put',
        data:{
          email:this.editUserInfo.email,
          mobile:this.editUserInfo.mobile,
        }
      }).then(res=>{
        if(res.data.meta.status=='200'){
          this.editDialogFormVisible=false;
          this.$message.success('修改成功');
          this.getUserList();
        }else{
          this.$message.error('修改失败');
        }
      })
    },
    //删除用户
    deleteUser(id){
        this.$confirm('此操作将永久删除该用户, 是否继续?',()=>{
          this.$request({
            url:'users/'+id,
            method:'delete'
            }).then(res=>{
            if(res.data.meta.status=='200'){
              this.getUserList();
               this.$message({
              type: 'success',
              message: '删除成功'
          });
            }else{
              this.$message.error('删除失败');
            }
          })
    },()=>{
      this.$message({
            type: 'info',
            message: '已取消删除'
          });   
    })
    },
    //关闭分配角色窗体
    setRoleDiaClose(){
      this.setRoleDialogFormVisible=false;
    },
    //取消分配角色窗体
    setRoleDiaCancel(){
       this.setRoleDialogFormVisible=false;
    },
    //获取用户角色数据
    async getRoleData(user){
     this.userInfo=user;
     //获取角色列表
     const res= await this.$request({
        url:'roles',
        method:'get',
      })
      if(res.data.meta.status=='200'){
        this.roleList=res.data.data;
      }else{
        this.$message.error('获取用户角色数据失败');
      }
      this.setRoleDialogFormVisible=true;
    },
    //修改用户角色数据
  async setRole(){
    if(!this.selectRoleId){
      return this.$message.error('请选择一个角色');
    }
     const res= await this.$request({
        url:'users/'+ this.userInfo.id+'/role',
        method:'put',
        data:{
          rid:this.selectRoleId,
        }
      })
      console.log(res);
      if(res.data.meta.status=='200'){
        this.$message.success('修改成功');
      }else{
        this.$message.error('修改失败');
      }
      this.getUserList();
      this.setRoleDialogFormVisible=false;
      this.selectRoleId='';
    },
  },
  created() {
    //请求用列表数据
    this.getUserList();
  },
};
</script>

<style scoped>
</style>