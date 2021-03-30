<template>
  <div>
    <!-- 面包屑部分，头部 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
        <!-- 柵格 -->
      <el-row>
        <!-- 添加角色 -->
        <el-col><el-button @click="showAddRoleDia" type="primary">添加角色</el-button></el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-table :data="roleList" border stripe>
              <!-- 子權限展開區域 -->
            <el-table-column type="expand">
                <template slot-scope="scope">
                   <!-- 柵格佈局   -->
                   <el-row :class="['bd-bottom','vcenter',index1==0?'bd-top':'']" v-for="(item1,index1) in scope.row.children" :key="item1.id" :gutter="10">
                       <!-- 一級權限 -->
                       <el-col :span="5">
                           <el-tag @close="removePower(scope.row,item1.id)"  closable >{{item1.authName}}</el-tag>
                           <i class="el-icon-caret-right"></i>
                       </el-col>
                         <!-- 二級權限和三級權限 -->
                       <el-col :span="19">
                           <el-row :class="['vcenter',index2!=0?'bd-top':'']" v-for="(item2,index2) in item1.children" :key="item2.id">
                               <!-- 二級權限 -->
                               <el-col :span="6">
                                 <el-tag closable @close="removePower(scope.row,item2.id)" type="success">{{item2.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                               </el-col>
                               <!-- 三級權限 -->
                               <el-col :span="18">
                                  <el-tag closable @close="removePower(scope.row,item3.id)" type="warning"  v-for="(item3,index3) in item2.children" :key="item3.id" >{{item3.authName}}</el-tag>
                               </el-col>
                           </el-row>
                       </el-col>
                   </el-row>
                </template>
            </el-table-column>
            <el-table-column type="index"> </el-table-column>
            <el-table-column prop="roleName" label="角色名称"></el-table-column>
            <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
            <!-- 操作栏 -->
            <el-table-column label="操作">
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
                    @click="showEditDialog(scope.row.id)"
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
                  content="分配权限"
                  placement="top"
                  :enterable="false"
                >
                  <el-button
                    size="mini"
                    type="warning"
                    icon="el-icon-setting"
                    @click="showRightDialog(scope.row)"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>

  <!-- 添加角色对话框 -->
   <edit-dialog @cancel="addCancel" @close="addDiaClose" :title="addTitle" :rules="rules" :model="addRoleInfo" @submit="addSubmit" :dialogFormVisible="addIsShow">
       <div slot="input">
        <el-form-item  label="角色名稱" prop="roleName">
          <el-input  clearable v-model="addRoleInfo.roleName"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input  clearable v-model="addRoleInfo.roleDesc"  autocomplete="off"></el-input>
        </el-form-item>
       </div>
    </edit-dialog>

    <!-- 修改對話框 -->
    <edit-dialog @cancel="cancel" @close="diaClose" :title="title" :rules="rules" :model="roleData" @submit="editSubmit" :dialogFormVisible="isShow">
       <div slot="input">
        <el-form-item  label="角色名稱" prop="roleName">
          <el-input  clearable v-model="roleData.roleName"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input  clearable v-model="roleData.roleDesc"  autocomplete="off"></el-input>
        </el-form-item>
       </div>
    </edit-dialog>

     <!-- 修改用户权限對話框 -->
    <edit-dialog @cancel="cancelRole" @close="diaCloseRole" :title="titleRole"  :model="roleDataRole" @submit="editSubmitRole" :dialogFormVisible="isShowRole">
       <div slot="input">
         <!-- 树形组件 -->
         <el-tree ref="treeRef" :default-checked-keys="checkedIds" node-key="id" default-expand-all  show-checkbox :data="rightList" :props="{children:'children',label:'authName'}" @node-click="handleNodeClick">
         </el-tree>
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
    return {
      roleList: [],
      isShow:false,
      roleData:{},
      rules:{},
      title:'修改用戶角色',
      isShowRole:false,
      roleDataRole:{},
      titleRole:'修改用戶权限',
      rightList:[],//所有权限数据.
      checkedIds:[],//默认点开某个用户，拥有的三级权限id
      currentRoleId:'',
      //添加角色信息
      addRoleInfo:{
        roleName:'',
        roleDesc:''
      },
      addIsShow:false,
      addTitle:'添加角色',
    };
  },
  methods:{
      //获取角色数据列表
      getRoleList(){
           this.$request({
      url: "roles",
      method: "get",
    }).then((res) => {
      this.roleList = res.data.data;
      console.log(this.roleList);
    });
    },
    //弹出添加用户框
    showAddRoleDia(){
        this.addIsShow=true;
    },
    addCancel(){
        this.addIsShow=false;
    },
    addDiaClose(){
        this.addIsShow=false;
    },
    //提交添加角色
    async addSubmit(){
     let res= await this.$request({
        url:'roles',
        method:'post',
        data:{
          roleName:this.addRoleInfo.roleName,
          roleDesc:this.addRoleInfo.roleDesc,
        }
      });
      console.log(res);
      if(res.data.meta.status=='201'){
        this.$message.success('添加成功')
        this.addDiaClose();
        this.getRoleList();
      }else{
        this.$message.error('添加失败')

      }
    },
    //彈出修改框
    showEditDialog(roleId){
        this.$request({
            url:'roles/'+roleId,
            method:"get"
        }).then(res=>{
            if(res.data.meta.status=='200'){
                this.roleData=res.data.data;
            }else{
                this.$message.error('獲取權限數據失敗');
            }
        })
        this.isShow=true;
    },
    //修改數據提交
    editSubmit(){
        this.$request({
            url:'roles/'+this.roleData.roleId,
            method:'put',
            data:{
                roleName:this.roleData.roleName,
                roleDesc:this.roleData.roleDesc,
            }
        }).then(res=>{
            if(res.data.meta.status=='200'){
                this.$message.success('修改成功')
                this.diaClose();
                this.getRoleList();
            }else{
                this.$message.error('修改失敗');
            }
        })
    },
    //關閉窗體
    diaClose(){
        this.isShow=false;
    } , 
    //點擊取消 
    cancel(){
        this.isShow=false;
    },
    //關閉窗體
    diaCloseRole(){
        this.isShowRole=false;
        this.checkedIds=[];
    } , 
    //點擊取消 
    cancelRole(){
        this.isShowRole=false;
    },
    //修改角色权限提交
   async editSubmitRole(){
     //获取树形结构半选中节点的key值数组
     let halfChecks =this.$refs.treeRef.getHalfCheckedKeys();	
     //获取树形结构半选中节点的key值数组
     let Checks =this.$refs.treeRef.getCheckedKeys();	
     let finallyChceks=Checks.concat(halfChecks);
     let idsStr=finallyChceks.join(',');//转成字符串id集合
     const res= await this.$request({
        url:'roles/'+this.currentRoleId+'/rights',
        method:'post',
        data:{
          rids:idsStr,
        }
      });
      if(res.data.meta.status=='200'){
        this.$message.success('修改成功');
        this.diaCloseRole();
        this.getRoleList();
      }else{
         this.$message.error('修改失败');
      }
    },
    //移除权限
    removePower(role,pId){ 
       this.$confirm('此操作将永久删除该权限, 是否继续?',()=>{
          this.$request({
            url:'roles/'+role.id+'/rights/'+pId,
            method:'delete'
            }).then(res=>{
            if(res.data.meta.status=='200'){
              //删除后会返回新的权限数据，将这些数据重新赋值给这个角色对应的权限，就不会导致整个页面刷新
               role.children=res.data.data;
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
    //用户分配权限弹框
    async showRightDialog(right){
      const res= await this.$request({
        url:'rights/tree',
        method:'get',
      });
      if(res.data.meta.status=='200'){
        this.rightList=res.data.data;
      }else{
        this.$message.error('获取权限数据失败');
      }
      //递归获取第三级节点
      this.getcheckedIds(right);
      this.isShowRole=true;
      this.currentRoleId=right.id;//保存当前点击的角色名
    },
    //递归获取第三级节点
    getcheckedIds(right){
      if(!right.children){
        return this.checkedIds.push(right.id);
      }
      right.children.forEach(element => {
        this.getcheckedIds(element);
      });
    },
    //点击节点
    handleNodeClick(){

    }
  },
  created() {
   this.getRoleList();
  },
};
</script>

<style scoped>
    .el-tag{
        margin: 7px;
    }
    .bd-top{
        border-top: 1px solid #eee;
    }
    .bd-bottom{
         border-bottom: 1px solid #eee;
    }
    /* r让行内容垂直居中 */
    .vcenter{
      display: flex;
      align-items: center;
    }
</style>