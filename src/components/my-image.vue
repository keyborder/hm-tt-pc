<template>
  <div class="my-image">
    <!-- 图片按钮 -->
    <div class="img_btn" @click="openDialog">
      <img :src="value||defaultImage" alt />
    </div>
    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogVisible" width="700px">
      <!-- activeName 当前tap激活的选项卡的名称 -->
      <!-- lable 选项卡文字  el-tab-pane  内容就是选项卡对应内容 -->
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="image">
          <!-- 全部与收藏 -->
          <el-radio-group @change="changeCollect" v-model="filterParams.collect">
            <el-radio-button :label="false">全部</el-radio-button>
            <el-radio-button :label="true">收藏</el-radio-button>
          </el-radio-group>
          <!-- 图片列表 -->
          <div class="img_list">
            <div
              class="img_item"
              :class="{selected:selectedImageUrl==item.url}"
              v-for="item in images"
              :key="item.id"
            >
              <img @click="selectedImage(item.url)" :src="item.url" alt />
            </div>
          </div>
          <!-- 分页区域 -->
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            :current-page="filterParams.page"
            :page-size="filterParams.per_page"
            @current-change="changePager"
            :hide-on-single-page="true"
          ></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="upload">
          <el-upload
            class="avatar-uploader"
            action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
            :headers="headers"
            :show-file-list="false"
            :on-success="uploadSuccess"
            name="image"
          >
            <img v-if="uploadImageUrl" :src="uploadImageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmImage">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import store from '@/store'
import defaultImage from '../assets/assets/default.png'
export default {
  name: 'my-image',
  props: ['value'],
  data () {
    return {
      // 控制对话框显示 隐藏
      dialogVisible: false,
      // 当前选项卡激活name
      activeName: 'image',
      // 素材库
      filterParams: {
        collect: false,
        page: 1,
        per_page: 8
      },
      // 总条数
      total: 0,
      // 图片列表
      images: [],
      // 选中的图片地址
      selectedImageUrl: null,
      // 上传图片的请求头
      headers: {
        Authorization: `Bearer ${store.getUser().token}`
      },
      // 上传的图片地址
      uploadImageUrl: null,
      // 确认的图片地址
      // confirmImageUrl: defaultImage,
      // 默认图
      defaultImage
    }
  },

  methods: {
    // 确认图片
    confirmImage () {
      if (this.activeName === 'image') {
        // 素材库
        if (!this.selectedImageUrl) return this.$message.warning('请选择一张素材图片')
        // 按钮位置显示图片
        // this.confirmImageUrl = this.selectedImageUrl
        // 把图片提交给父组件
        this.$emit('input', this.selectedImageUrl)
      } else {
        // 上传图片
        if (!this.selectedImageUrl) return this.$message.warning('请上传一张素材图片')
        // this.confirmImageUrl = this.selectedImageUrl
        // 把图片提交给父组件
        this.$emit('input', this.selectedImageUrl)
      }
      // 关闭对话框
      this.dialogVisible = false
    },
    // 上传成功
    uploadSuccess (res) {
      this.uploadImageUrl = res.data.url
    },
    // 选中图片
    selectedImage (url) {
      this.selectedImageUrl = url
    },
    // 打开对话框
    openDialog () {
      this.dialogVisible = true
      this.getImages()
      // 清空选择的图片
      this.selectedImageUrl = null
      // 清空上次的图片
      this.uploadImageUrl = null
      // 默认选中 tab 是素材库
      this.activeName = 'image'
    },
    // 切换全部与收藏
    changeCollect () {
      this.filterParams.page = 1
      this.getImages()
    },
    // 获取图片列表
    async getImages () {
      const {
        data: { data }
      } = await this.$http.get('user/images', { params: this.filterParams })
      this.images = data.results
      this.total = data.total_count
    },
    changePager (newPage) {
      this.filterParams.page = newPage
      this.getImages()
    }
  }
}
</script>

<style lang="less" scoped>
.my-image {
  display: inline-block;
  margin-right: 20px;
  .img_btn {
    width: 150px;
    height: 150px;
    border: 1px dashed #ddd;
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
}
.img_list {
  margin-top: 10px;
  .img_item {
    width: 150px;
    height: 120px;
    border: 1px dashed #ddd;
    position: relative;
    display: inline-block;
    margin-right: 10px;
    margin-bottom: 10px;
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
    &.selected {
      &::after {
        // .img_item.selected::after{} 当加上selected就加上一个伪元素
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background: rgba(0, 0, 0, 0.3) url(../assets/assets/selected.png)
          no-repeat center / 50px;
      }
    }
  }
}
</style>
