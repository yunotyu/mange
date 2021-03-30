<template>
  <div>
      <!-- 面包屑部分，头部 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
        <el-table
            :data="rightsList"
            style="width: 100%"
            border
            stripe>
            <el-table-column type="index"> </el-table-column>
            <el-table-column label="权限名称" prop="authName"> </el-table-column>
            <el-table-column label="路径" prop="path"> </el-table-column>
            <el-table-column label="权限等级" prop="level">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.level==0">一级</el-tag>
                    <el-tag v-else-if="scope.row.level==1" type="success">二级</el-tag>
                    <el-tag v-else-if="scope.row.level==2" type="warning">三级</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
    data(){
        return{
            //权限列表
        rightsList:[],
        levelList:['','success','info','warning','danger']
        }
    },
    methods:{
        //获取权限列表
        getRightsList(){
            this.$request({
            url:'rights/list',
            method:'get'
        }).then(res=>{
            if(res.data.meta.status=='200'){
                this.rightsList=res.data.data;
            }else{
                this.$message.error(res.data.meta.msg)
            }
        })
        }
    },
    created(){
         //获取权限列表
        this.getRightsList();
    }
}
</script>

<style scoped>

</style>