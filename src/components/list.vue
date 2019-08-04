<template>
  <div>

    <el-form :inline="true" :model="pageInfo" class="demo-form-inline">
      <el-form-item label="用户名">
        <el-input v-model="pageInfo.userName" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item>
      <span class="demonstration">开始日期</span>
        <span class="demonstration"></span>
        <el-date-picker
          v-model="pageInfo.sd"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
        <span class="demonstration">结束日期</span>
        <span class="demonstration"></span>
        <el-date-picker
          v-model="pageInfo.dt"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getlist(0)">查询</el-button>
        <el-button type="danger" @click="dels()">批量删除</el-button>

      </el-form-item>

    </el-form>
  <el-table
    ref="multipleTable"
    :data="tableData"
    tooltip-effect="dark"
    style="width: 100%"
    @selection-change="handleSelectionChange">
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
    <el-table-column
      label="日期"
      width="120">
      <template slot-scope="scope">{{ scope.row.birthday }}</template>
    </el-table-column>
    <el-table-column
      prop="username"
      label="姓名"
      width="120">
      <template slot-scope="scope">{{ scope.row.userName }}</template>
    </el-table-column>
    <el-table-column
      prop="password"
      label="密码"
      show-overflow-tooltip>
      <template slot-scope="scope">{{ scope.row.password }}</template>
    </el-table-column>
    <el-table-column
      prop="sex"
      label="性别"
      show-overflow-tooltip>
      <template slot-scope="scope">{{ scope.row.sex }}</template>
    </el-table-column>
    <el-table-column>
      <template slot-scope="scope">
        <el-image
          style="width: 100px; height: 100px"
          :src="'http://localhost:8090/'+scope.row.url">
        </el-image>
      </template>

    </el-table-column>
    <el-table-column
      label="操作"
      show-overflow-tooltip>
      <template slot-scope="scope">
      <el-button type="success" el-icon-plus @click="toadd">添加</el-button>
      <el-button type="danger" @click="del(scope.row.id)">删除</el-button>
        <el-button type="danger" @click="toupd(scope.row)">修改</el-button>
      </template>
    </el-table-column>



  </el-table>
    <el-pagination
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[2, 4, 5, 6]"
      :page-size="this.pageInfo.pageSize"
      :total="total">
    </el-pagination>


    <el-dialog title="个人信息" :visible.sync="dialogFormVisible">
      <el-form :model="dataModal">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="dataModal.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input type="password" v-model="dataModal.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="日期" :label-width="formLabelWidth">
          <el-input type="date" v-model="dataModal.birthday" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="性别" :label-width="formLabelWidth">
          <el-radio v-model="dataModal.sex" label="男">男</el-radio>
          <el-radio v-model="dataModal.sex" label="女">女</el-radio>
        </el-form-item>

        <el-form-item :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            action="http://localhost:10000/test/addimg"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="add()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import  axios from 'axios'
    export default {
        name: "list",
      data(){
          return{
            tableData:[],
            pageInfo:{
              pageSize:2,
              pageNum:1,
              userName:"",
              sd:"",
              dt:"",
              birthday:[],
              selectids:""
            },
            total:0,
            dataModal:{},
            formLabelWidth:"120px",
            dialogFormVisible:false,
            imageUrl:""
          }
      },
      mounted(){
        console.log("vue以加载");
        this.getlist(0);
      },
      methods:{

          del(id){
            axios.post('http://localhost:10000/test/delById?id='+id).then((response)=>{
              if(confirm("是否确认删除该数据?")){
                if(response.data){
                  this.$message({
                    message: '恭喜你，这是一条成功消息',
                    type: 'success'
                  });

                }
              }
              this.getlist(1);
            })
          },
        dels(){
          axios.post('http://localhost:10000/test/delByIds?ids='+this.selectids).then((response)=>{
            if(confirm("是否确认删除该数据?")){
              if(response.data){
                this.$message({
                  message: '恭喜你，这是一条成功消息',
                  type: 'success'
                });

              }
            }
            this.getlist(1);
          })
        },
        toupd(row){
            this.dataModal=row;
            this.dialogFormVisible=true;
            this.imageUrl = "http://localhost:8090/"+row.url
        },
        handleAvatarSuccess(res, file) {
          this.imageUrl = URL.createObjectURL(file.raw);
          this.dataModal.url = file.name
        },
        beforeAvatarUpload(file) {
          const isJPG = file.type === 'image/jpeg';
          const isLt2M = file.size / 1024 / 1024 < 2;

          if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
          }
          if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
          }
          return file;
        },
          toadd(){
            this.dataModal={id:0};
            this.dialogFormVisible=true;
            this.imageUrl = ""
          },
        add(){
            var url='http://localhost:10000/test/add';
            if(this.dataModal.id>0){
              url='http://localhost:10000/test/modify';
            }
          axios.post(url,this.dataModal).then((response)=>{
            if(response.data){
              this.dialogFormVisible=false;
              this.getlist(0);
            }
          })
        },
        handleSelectionChange(selection){
        this.selectids=selection.map(i=>i.id);
        },
        handleSizeChange(pageSize){
          console.log(pageSize);
          this.pageInfo.pageSize=pageSize;
          this.getlist();
        },
        handleCurrentChange(pageNum){
          console.log(pageNum);
          this.pageInfo.pageNum=pageNum;
          this.getlist();
        },
        getlist:function () {
          /*this.pageInfo.sd=this.birthday[0];
          this.pageInfo.dt=this.birthday[1];*/
          console.log( this.pageInfo.sd)
          console.log( this.pageInfo.dt)
          axios.post('http://localhost:10000/test/getlist',this.pageInfo).then((response)=>{

            this.tableData=response.data.list;
            this.total=response.data.total;
            console.log(this.tableData)
          }).catch((error)=>{

          })
        }
      }
    }
</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
