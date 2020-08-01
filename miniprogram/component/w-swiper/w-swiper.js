// comments/w-swiper/w-swiper.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list:{
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isLoad: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleImageLoad(){
      if (!this.data.isLoad){
        // console.log('Jiazaiwancheng')
        this.data.isLoad = true
        this.triggerEvent('imageload')
      }
    }
  }
})
