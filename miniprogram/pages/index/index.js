const db = wx.cloud.database()
const book = db.collection('book')
const slideshow = db.collection('slideshow')
const tabcontrol = db.collection('tabcontrol')
const type = ['textbook', 'postgra', 'cet', 'past', 'book']
const TOP_DISTENCE = 1000
Page({

  /**
   * 页面的初始数据
   */
  data: {
    slideshowList: [],
    tabcontrol: [],
    books: {
      'textbook': {
        skip: 0,
        list: []
      },
      'postgra': {
        skip: 0,
        list: []
      },
      'cet': {
        skip: 0,
        list: []
      },
      'past': {
        skip: 0,
        list: []
      },
      'book': {
        skip: 0,
        list: []
      },
    },
    currentType: 'textbook',
    isTabFixed: false,
    tabScrollTop: 0,
    showBackTop: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取书籍信息
      this.getBooks('textbook'),
      this.getBooks('postgra'),
      this.getBooks('cet'),
      this.getBooks('past'),
      this.getBooks('book'),
      // 获取轮播图
      this.getSlideshow(),
      // 获取tab-control
      this.getTabcontrol()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getBooks(this.data.currentType)
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.regetBooks(this.data.currentType)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  // -------------------------------数据获取----------------------
  // 获取书籍数据
  getBooks(type) {
    wx.showLoading({
      title: '数据加载中',
    })
    db.collection(type).get({
      success: res => {
        // console.log(res.data)
        // 1 取出数据
        const list = res.data;
        // 2 将数据设置到data中的books中去
        const typeKey = `books.${type}.list`;
        const skipKey = `books.${type}.skip`;
        this.setData({
          [typeKey]: list,
          [skipKey]: 20
        }, res => {
          // this.books[type].skip = this.books[type].skip + 20;
          wx.hideLoading();
        })
      }
    })
  },


  regetBooks(type) {
    wx.showLoading({
      title: '数据加载中',
    })
    db.collection(type).skip(this.data.books[type].skip).get({
      success: res => {
        // console.log(res.data)
        // 1 取出数据
        const list = res.data;
        // 2 将取出的数据放入对应类型的list中去
        // const oldList = this.data.books[type].list;
        // oldList.push(...list)
        const oldList = this.data.books[type].list.concat(list)
        // console.log(oldList)
        const skip = this.data.books[type].skip + 20
        // 3 将数据设置到data中的books中去
        const typeKey = `books.${type}.list`;
        const skipKey = `books.${type}.skip`;
        this.setData({
          [typeKey]: oldList,
          [skipKey]: skip
        }, res => {
          // this.books[type].skip = this.books[type].skip + 20;
          wx.hideLoading();
        })
      }
    })
  },


  // 获取轮播图数据
  getSlideshow() {
    slideshow.get().then(res => {
      // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
      //  console.log(res)
      this.setData({
        slideshowList: res.data[0].slideshowList
      })
    })
  },


  //获取tab-control数据
  getTabcontrol() {
    tabcontrol.get().then(res => {
      // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
      //  console.log(res)
      this.setData({
        tabcontrol: res.data
      })
    })
  },

  // -------------------------------事件处理函数----------------------
  // tab-control点击事件处理
  handleTabcontrol(e) {
    this.setData({
      currentType: type[e.detail.index]
    })
  },
  // 轮播图图片加载完成事件处理
  handleImageLoad(){
    // 获取组件距离顶部的距离
    wx.createSelectorQuery().select('#tab-control').boundingClientRect(rect => {
      // console.log(rect)
      this.data.tabScrollTop = rect.top
    }).exec()
  },
  // 监听页面滚动
  onPageScroll(options){
    // console.log(options)
    const scrollTop = options.scrollTop
    // 1.修改showBackTop
    const flag1 = scrollTop >= TOP_DISTENCE
    if(flag1 != this.data.showBackTop){
      this.setData({
        showBackTop: flag1
      })
    }
    // 2.修改isTabFixed
    const flag2 = scrollTop >= this.data.tabScrollTop
    if (flag2 != this.data.isTabFixed) {
      this.setData({
        isTabFixed: flag2
      })
    }

  }
})