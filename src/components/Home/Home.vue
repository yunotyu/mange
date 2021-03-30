<template>
  <div class="home-container">
    <el-container>
      <!-- 头部 -->
      <el-header>
        <div class="header">
          <div class="header-title">
            <img src="~@/assets/img/header.jpg" alt="" />
            <h3>后台管理系统</h3>
          </div>
          <el-button class="logout-btn" @click="logout" type="info"> 注销</el-button>
        </div>
      </el-header>
      <el-container>
        <!-- 侧边栏 -->
        <!-- 收起侧边栏时，修改侧边栏整体的宽度 -->
        <el-aside  :width="isToggle?'64px':'200px'">
            <!-- 收起菜单按钮 -->
            <div @click="toggleClick" class="toggleBtn">|||</div>
          <el-menu
            :default-active="actPath"
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409eff"
            :unique-opened="true"
            :collapse="isToggle"
            :collapse-transition="false"
            :router="true"
          >
            <!-- 一级菜单 -->
            <el-submenu :index="item.id+''" v-for="(item) in menuList" :key="item.id">
              <!-- 一级菜单模板 -->
              <template slot="title">
                <i :class="iconObj[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级菜单 -->
              <!-- 启用elementui的路由功能后，在这里的index属性使用路径，就可以跳转到对应路径 -->
              <el-menu-item @click="saveIndex(item1.path)" :index="''+item1.path+''" v-for="item1 in item.children" :key="item1.id">
                <i class="el-icon-menu"></i>
                <span>{{item1.authName}}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 主体 -->
        <el-main>
            <router-view>
            </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
    data(){
        return{
            menuList:[],
            iconObj:{
                125:'iconfont icon-user',
                103:'iconfont icon-tijikongjian',
                101:'iconfont icon-shangpin',
                102:'iconfont icon-danju',
                145:'iconfont icon-baobiao',
            },
            isToggle:false,
            actPath:'',
        }
    },
    created(){
        //获取菜单列表
        this.$request({
            url:'/menus',
            method:'get',
        }).then((res)=>{
            if(res.data.meta.status=='200'){
                this.menuList=res.data.data;
            }else{
                this.$message(res.data.meta.msg)
            }
        });
        //当回退或者刷新时，返回上一次点击的菜单项
        this.actPath=window.sessionStorage.getItem('activePath');
    },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    //折叠展开菜单
    toggleClick(){
        this.isToggle=!this.isToggle;
    },
    //保存当前被点击的菜单项
    saveIndex(path){
        window.sessionStorage.setItem('activePath',path);
        this.actPath=path;
    }
  },
};
</script>

<style scoped>
.home-container {
  height: 100%;
}
.el-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  height: 100px !important;
  line-height: 100px;
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  color: #fff;
  height: 100%;
}
.header img {
  width: 50px;
  height: 50px;
  margin-right: 15px;
}
.header-title {
  display: flex;
  align-items: center;
}
.logout-btn {
  height: 40px;
  line-height: 30px;
  padding: 0;
  width: 80px;
}
/* 增大图标跟文字的边距 */
.iconfont{
    margin-right: 10px;
}
/* 去除不整齐的边缘部分 */
.el-menu{
    border-right: 0;
}
.toggleBtn{
    background-color: #4A5064;
    font-size: 20px;
    line-height: 30px;
    height: 30px;
    text-align: center;
    /* 设置文字间距 */
    letter-spacing: 0.3em;
    cursor: pointer;
}

</style>