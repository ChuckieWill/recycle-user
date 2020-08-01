// component/books/books.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    book_list:{
    type: Array,
    value: []
  }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // -----------------事件监听---------------
    handleCard(event) {
      var id = event.currentTarget.dataset.id
      wx.navigateTo({
        url: '../bookDetail/bookDetail?id=' + id,
      })
    }
  }
})
