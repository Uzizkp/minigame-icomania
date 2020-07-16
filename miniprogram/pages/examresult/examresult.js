import Poster from '../../components/miniprogram_dist/poster/poster';
// pages/my/my.js
const app = getApp()
const posterConfig = {
  jdConfig: {
      width:750,
      height: 1200,
      backgroundColor: '#fff',
      debug: false,
      pixelRatio: 1,
      blocks: [
          {
              width: 690,
              height: 700,
              x: 30,
              y: 190,
              borderWidth: 2,
              borderColor: '#f0c2a0',
              borderRadius: 20,
          },
          {
              width: 634,
              height: 74,
              x: 59,
              y: 770,
              backgroundColor: '#fff',
              opacity: 0.5,
              zIndex: 100,
          },
      ],
      texts: [
          {
              x: 140,
              y: 120,
              baseLine: 'middle',
              text: '',
              fontSize: 32,
              color: '#8d8d8d',
          },
          {
              x: 140,
              y: 60,
              baseLine: 'top',
              text: '',
              fontSize: 26,
              color: '#080808',
          },
          {
              x: 320,
              y: 120,
              fontSize: 32,
              baseLine: 'middle',
              text: '获得称号:',
              width: 570,
              lineNum: 1,
              color: '#080808',
              zIndex: 200,
          },
          // {
          //     x: 59,
          //     y: 895,
          //     baseLine: 'middle',
          //     text: [
          //         {
          //             text: '',
          //             fontSize: 28,
          //             color: '#ec1731',
          //         },
          //         {
          //             text: '',
          //             fontSize: 36,
          //             color: '#ec1731',
          //             marginLeft: 30,
          //         }
          //     ]
          // },
          // {
          //     x: 522,
          //     y: 895,
          //     baseLine: 'middle',
          //     text: '22222',
          //     fontSize: 28,
          //     color: '#929292',
          // },
          // {
          //     x: 59,
          //     y: 945,
          //     baseLine: 'middle',
          //     text: [
          //         {
          //             text: '22222',
          //             fontSize: 28,
          //             color: '#929292',
          //         },
          //         {
          //             text: '',
          //             fontSize: 28,
          //             color: '#929292',
          //             marginLeft: 50,
          //         },
          //         {
          //             text: '',
          //             fontSize: 28,
          //             color: '#929292',
          //             marginLeft: 50,
          //         },
          //     ]
          // },
          {
              x: 360,
              y: 980,
              baseLine: 'top',
              text: '长按识别小程序码',
              fontSize: 38,
              color: '#080808',
          },
          {
              x: 360,
              y: 1050,
              baseLine: 'top',
              text: '一起来挑战吧!',
              fontSize: 28,
              color: '#929292',
          },
      ],
      images: [
        {
            url: 'https://img-1253324855.cos.ap-chengdu.myqcloud.com/nh/error.png',
            width: 700,
            height: 700,
            y: 190,
            x: 30,
            borderRadius: 20,
            // borderWidth: 10,
            // borderColor: 'red',
        },
        {
            url: 'https://img-1253324855.cos.ap-chengdu.myqcloud.com/nh/error.png',
            width: 90,
            height: 90,
            y: 50,
            x: 30,
            borderRadius: 100,
            borderWidth: 10,
        },
        {
          url: 'https://img-1253324855.cos.ap-chengdu.myqcloud.com/nh/gh_24d9a2b09e57_344.jpg',
          width: 200,
          height: 200,
          y: 940,
          x: 90,
          borderRadius: 100,
          borderWidth: 10,
      },
    ],
    // lines: [
    //     {
    //         startY: 800,
    //         startX: 10,
    //         endX: 300,
    //         endY: 800,
    //         width: 5,
    //         color: 'red',
    //     }
    // ]
  }
}


Page({

  data: {
    url: '',
    winWidth: 0,
    winHeight: 0,
    oneHeight: 0, // 风景图的高度
    ewmWidth: 0, //二维码的高度
    posterConfig: posterConfig.jdConfig,
    oneWidth: 0, //左右两边的空白
    twoWidth: 0, //二维码和边框之间的距离
    fontHeight: 0,
    text1: '',
    text2: '',
    text3: '',
    text4: '',
  },

  onLoad: function (e) {
    
    wx.getSetting({
      success (res) {
        console.log('授权信息:')
        console.log(res.authSetting)
        // res.authSetting = {
        //   "scope.userInfo": true,
        //   "scope.userLocation": true
        // }
      }
    })
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          'posterConfig.texts[0].text': res.userInfo.nickName,
          'posterConfig.images[1].url': res.userInfo.avatarUrl,
        })

        console.log('头像:'+this.data.posterConfig.images[1].url)
      }
    })
    
    
    this.onQuery();

    this.setData({
      ordernum: e.ordernum,
      rightNum: e.rightNum,
      errNum: e.errNum,
      unAnswerNum: parseInt(e.length) - (parseInt(e.rightNum) + parseInt(e.errNum) ),
      'posterConfig.texts[1].text': '我在小游戏内涵大作战里答对了'+e.rightNum+'道题',
    });
    
    if(parseInt(e.rightNum) == parseInt(e.length)){
      this.setData({
        title: '内涵大师',
        'posterConfig.images[0].url': 'https://img-1253324855.cos.ap-chengdu.myqcloud.com/nh/bg-1.png',
      })
    } else if(parseInt(e.rightNum) > parseInt(e.length)/2){
      this.setData({
        title: '知识青年',
        'posterConfig.images[0].url': 'https://img-1253324855.cos.ap-chengdu.myqcloud.com/nh/bg-2.png',
      })
    } else if(parseInt(e.rightNum) == parseInt(e.length)/2){
      this.setData({
        title: '相对单纯',
        'posterConfig.images[0].url': 'https://img-1253324855.cos.ap-chengdu.myqcloud.com/nh/bg-2.png',
      })
    } else if(parseInt(e.rightNum) < parseInt(e.length)/2){
      this.setData({
        title: '纯洁小白',
        'posterConfig.images[0].url': 'https://img-1253324855.cos.ap-chengdu.myqcloud.com/nh/bg-3.png',
      })
    } 
    console.log(this.data.posterConfig.texts[0].text);
  },

  onReady: function () {

  },

  onShow: function () {

  },

  examBack: function () {
    let url = '/pages/index/index';
    wx.navigateTo({
      url: url
    })
  },

  onQuery: function() {
    const db = wx.cloud.database()
    db.collection('exams').get({
      success: res => {
        this.setData({
          queryResult: res.data
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  onPosterSuccess(e) {

    const { detail } = e;
    wx.previewImage({
      current: detail,
      urls: [detail]
    })
    

  },
  onPosterFail(err) {
    console.error(err);
},
  toQuestionPage: function(e){
    console.log(e.currentTarget.dataset.id);
    let id = e.currentTarget.dataset.id;
    let url = '/pages/questions/questions?id='+id;
    wx.navigateTo({
      url: url
    })
  },
})