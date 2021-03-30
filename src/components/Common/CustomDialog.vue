<template>
  <div>
<el-dialog @close="diaClose" :title="title" width="50%" :visible.sync="diaIsShow">
  <el-form  ref="editFormRef" :model="model" :rules="rules" label-width="70px">
      <slot name="input"></slot>
  <div class="dialog-footer">
    <el-button @click="cancelClick">取 消</el-button>
    <el-button @click="submit" type="primary" >确 定</el-button>
  </div>
  </el-form> 
</el-dialog>
  </div>
</template>

<script>
export default {
    props:{
        title:{
            type:String,
            default:'',
        },
        model:{
            type:Object,
            default(){
                return {}
            },
        },
        rules:{
            type:Object,
            default(){
                return {}
            },
        },
        dialogFormVisible:{
            type:Boolean,
            default:false,
        }
    },
    data(){
       return{
            diaIsShow:this.dialogFormVisible,
       }
    },
    watch:{
        //監聽父組件傳遞過來的值是否改變，如果改變，
        //將props裡的值傳遞給data裡的值
        dialogFormVisible(newVal,OldVal){
            this.diaIsShow=newVal;
        }
    },
    methods:{
        //點擊提交按鈕
        submit(){
            this.$emit('submit')
        },
        //關閉窗體
        diaClose(){
            this.$emit("close");
            this.$refs.editFormRef.resetFields();
        },
        //點擊取消
        cancelClick(){
            this.$emit('cancel')
            this.$refs.editFormRef.resetFields();
        }
    }
  
};
</script>

<style>
</style>