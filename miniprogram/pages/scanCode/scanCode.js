// pages/scanCode/scanCode.js
const db = wx.cloud.database()
const slideshow = db.collection('slideshow')
const type = ['textbook', 'postgra', 'cet','past','book']
Page({

  /**
   * 页面的初始数据
   */
  data: {
    slideshowList: [],
    book_list:[],
    bookshow: false,
    titles:['教材','考研','四六级','期末真题','图书'],
    title:null,
    recyles:['yes','possible','no'],
    recyle:null,
    number: 0,
    newnum: 0,
    mednum: 0,
    goodnum:0,
    uptimes:0,
    isbn: null

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSlideshow()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

// ------------------------数据请求函数------------------
// 获取轮播图数据
getSlideshow(){
  slideshow.get().then(res => {
    // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
    // console.log(res.data)
    this.setData({
      slideshowList: res.data[0].slideshowList
    })
  })
},

// ------------------------事件监听函数------------------
// 手动输入isbn
  inputIsbn(event){
    console.log(event.detail.value)
    this.setData({
      isbn: event.detail.value
    })
  },
  handleInputCode(){
    // 1.要调用的云函数名称
    wx.cloud.callFunction({
      name: 'bookinfo',
      // 传递给云函数的参数
      data: {
        isbn: this.data.isbn
      },
      // 2.云函数返回书籍信息
      success: res => {
        var bookString = res.result
        // console.log(JSON.parse(bookString))
        this.setData({
          book_list: this.data.book_list.concat(JSON.parse(bookString)),
          bookshow: true
        })
      },
      fail: err => {
        console.error(err)
      },
    })
  },
// 扫码加书
// 扫码获取书籍信息
  handleScanCode(){
    wx.scanCode({
      // 1.获取barCode
      onlyFromCamera: true,
      scanType: ['barCode'],
      success: res => {
        console.log(res.result);
        // 2.要调用的云函数名称
        wx.cloud.callFunction({
          name: 'bookinfo',
          // 传递给云函数的参数
          data: {
            isbn: res.result
          },
          // 3.云函数返回书籍信息
          success: res => {
            var bookString = res.result
            // console.log(JSON.parse(bookString))
            this.setData({
              book_list: this.data.book_list.concat(JSON.parse(bookString)),
              bookshow: true
            })
          },
          fail: err => {
            console.error(err)
          },
        })
      },
      fail: err => {
        console.log(err);
      }
    })
  },
// 上传书籍信息到数据库
  handleUpbook(){
    // 4.将书籍信息增加到云数据库
    const uptimes = this.data.uptimes + 1
    db.collection(this.data.title).add({
      // data 字段表示需新增的 JSON 数据
      data:{
        result: this.data.book_list[this.data.uptimes].result,
        recyle: this.data.recyle,
        number: this.data.number,
        newnum: this.data.newnum,
        mednum: this.data.mednum,
        goodnum: this.data.goodnum,
        sellnum: 0
      }
    })
      .then(res => {
        this.setData({
          bookshow: false,
          uptimes: uptimes
        })
        wx.showToast({
          title: '上传成功',
          icon: 'success'
        })
        // console.log(res)
      }).catch(err => {
        console.log(err)
      })
  },

  // 选择书籍类型
  choosetitle(event) {
    // console.log(event.detail.value[0])
    for (var i = 0; i < this.data.titles.length; i++) {
      if (this.data.titles[i] == event.detail.value[0]) {
        this.setData({
          title: type[i]
        })
      }
    }
  },
  // 选择回收情况
  chooserecyle(event) {
    this.setData({
      recyle: event.detail.value[0]
    })
  },

  //输入总数
  inputnum(event) {
    this.setData({
      number: event.detail.value
    })
    //  console.log("dfadfa",event)
  },
  // 输入新书数量
  inputnewnum(event) {
    // console.log(event)
    this.setData({
      newnum: event.detail.value
    })
  },
  // 输入品相一般数量
  inputmednum(event) {
    this.setData({
      mednum: event.detail.value
    })
  },
  // 输入品相良好数量
  inputgoodnum(event) {
    // console.log(event)
    this.setData({
      goodnum: event.detail.value
    })
  },




// 上传轮播图
// 1 选择图片
  selectslideimage(){
    // 1.1 选择图片
    var slideshowList = this.data.slideshowList
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res =>{
        const tempFilePaths = res.tempFilePaths
        for (var i = 0; i < tempFilePaths.length;i++){
          //1.2 存储图片
          wx.cloud.uploadFile({
            cloudPath:'slideshow/'+`${Math.floor(Math.random() * 10000000)}.png`,
            filePath: tempFilePaths[i],
            success: res => {
              // 返回文件 ID
              console.log("这是fileID",res.fileID)
              this.setData({
                slideshowList: this.data.slideshowList.concat(res.fileID)
              }) 
            },
            fail: console.error
          })
        }
      }
    })
  },
  // 2.图片链接添加到数据库
  upslideimage(){
    slideshow.add({
      data: {
        slideshowList: this.data.slideshowList
      },
      success: res => {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
      }
    })
  },


})