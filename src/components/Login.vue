<template>
  <div class="login-container">
    <div class="box">
      <div>
        <img src="@/assets/img/header.jpg" alt="" />
      </div>
      <div class="login-form">
        <el-form
          ref="loginFrmRef"
          :model="loginForm"
          :rules="rules"
          label-width="0"
        >
          <!-- 用户名 -->
          <el-form-item prop="username">
            <!-- //使用v-model绑定数据 -->
            <el-input
              v-model="loginForm.username"
              prefix-icon="iconfont icon-user"
            ></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="pwd">
            <el-input
              show-password
              v-model="loginForm.pwd"
              prefix-icon="iconfont icon-3702mima"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item class="btn">
            <el-button @click="login" type="primary">登录</el-button>
            <el-button @click="reset" type="primary">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //登录表单数据对象
      loginForm: {
        username: "admin",
        pwd: "123456",
      },
      //表单验证规则
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 5,
            max: 16,
            message: "长度在 5 到 16 个字符",
            trigger: "blur",
          },
        ],
        pwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 16,
            message: "长度在 3 到 16 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //重置表单
    reset() {
      this.$refs.loginFrmRef.resetFields();
    },
    login() {
      this.$refs.loginFrmRef.validate((validata, errArr) => {
        if (validata) {
          this.$request({
            url: "/login",
            method: "post",
            data: {
              username: this.loginForm.username,
              password: this.loginForm.pwd,
            },
          }).then((res) => {
            if (res.data.meta.status == "200") {
              this.$message({
                message: "登录成功",
                type: "success",
              });
              //保存token到sessionStorage里
              window.sessionStorage.setItem('token',res.data.data.token)
              this.$router.push('/home');
            } else {
              this.$message.error("账号或密码错误");
            }
          });
        }
      });
    },
  },
};
</script>

<style scoped>
.login-container {
  background-color: #2b4b6b;
  height: 100vh;
  width: 100vw;
  position: absolute;
}
.box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 3px;
}
.box img {
  width: 130px;
  height: 130px;
  border: 1px solid;
  border-radius: 50%;
  padding: 10px;
  background-color: #eee;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
}
.login-form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btn {
  display: flex;
  justify-content: flex-end;
}
</style>