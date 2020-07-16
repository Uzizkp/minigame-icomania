// miniprogram/pages/study/study.js
const util = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    percent: 0,
    btnText: '跳过',
    rightNum: 0,
    idx: 0,
    length: 0,
    answer: '',
    question: {
    },
    selectedOption: {
      code: '',
      content: '',
      value: -1
    },
    errNum: 0,
    score_arr: [],
    options_arr: [],
    result:'回答错误',
    showResult:false,
    showHint: false,
    score: 0,
    isRight: false,
    realAnswers: [],
    hints: 3,
    lives: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let id = options.id;
    this.setData({
      id: id
    })
    this.onQuery(id);
    this.queryQues(this.data.items[0]);
    let ordernum = this.generate();
    this.setData({
      ordernum
    });
    
  },
  onQuery: function(id){
    let easy_items = this.generateNoRepeatdArr(5, 1, 10);
    let difficult_items = this.generateNoRepeatdArr(6, 1, 8);
    var items = easy_items.concat(difficult_items);
    this.setData({
      items: items,
      length: items.length - 1
    })
  },
  queryQues: function(id){

    let that = this;
    let idx = this.data.idx;
    const db = wx.cloud.database();
    var set = ''
    if (idx<=4) {
      set = 'easy'
    } else {
      set = 'difficult'
    }
    db.collection(set).doc(id)
    .get()
    .then(res => {
      console.log('[数据库] [查询记录] 成功: ', res)
      let question = res.data;
      // let options = question.options;
      let realAnswers = question.answer;
      let typename=question.typename;
      let hint=question.comments;
      // options中的每个选项都改为false

      that.setData({
        question,
        // options,
        realAnswers,
        typename,
        hint,
      })
    })
  },

  generate: function(){
    return util.formatTime(new Date());
  },
  onBindInput: function(e){
    
      
  },
  onBindConfirm: function(e){
    let that = this
    let answer = e.detail.value
    console.log(answer)
    console.log(this.data.realAnswers)
    if (answer) {
      that.setData({
        answer: answer
      });
      if(this.data.realAnswers.indexOf(answer)> -1){
        let score = that.data.score + 1
        this.setData({
          result: "猜对了",
          score: score,
          isRight: true,
        })
      }else{
        this.setData({
          result: "可惜! 再试一次吧"
        })
      }
    };
    that.showResultModel(answer);
    
  },
  // 提示 
  onBindHind: function(e){
    var that = this
    if(this.data.hints!=0){
      let hints = this.data.hints - 1
      that.setData({
        hints: hints,
        showHint: true
      })
    }
  },
  onBindHelp: function(e){
    var that = this
    if(this.data.hints!=0){
      // let hints = this.data.hints - 1
      that.setData({
        // hints: hints,
        showHelp: true
      })
    }
  },
  //跳过
  onBindSkip: function(e){
    var that = this
    if(this.data.lives!=0){
      let lives = this.data.lives - 1
      that.setData({ 
        lives: lives
      })
      console.log('doSkip')
    that.setData({
      showResult: false,
      answer: ''
    })
    this.queryQues(that.data.items[10]);
    }
  },
  showResultModel(answer) {
    var that = this
    if(answer){
      that.setData({
        showResult: true
      })
    } else{
      wx.showToast({
        title: "答案不能为空",
        duration: 1000,
        icon: "none"
      })
    }
  },


  generateNoRepeatdArr(n, min, max) {
    var arr = [],res = [];
    for(var i=min;i<max;i++){
        arr.push(i);
    }
    for (i=0 ; i <n; i++) {
        var index = parseInt(Math.random()*(arr.length));   
        res.push(arr[index]);
        arr.splice(index,1)  //已选用的数，从数组arr中移除， 实现去重复
    }
    return res;
  },
  hideResultModel() {
    var that = this

      that.setData({
        showResult: false
      })
    
  },
  hideHintModel() {
    var that = this

      that.setData({
        showHint: false
      })
    
  },
  hideHelpModel() {
    var that = this

      that.setData({
        showHelp: false
      })
    
  },
  goResult: function(){
      let url = '/pages/examresult/examresult?length='+this.data.length+'&errNum='+this.data.errNum+'&rightNum='+this.data.rightNum+'&ordernum='+this.data.ordernum;
      wx.navigateTo({
        url: url
      })
  },
  generate: function(){
    return util.formatTime(new Date());
  },
  onExit: function(){
    let url = '/pages/index/index';
    wx.navigateTo({
      url: url
    })
  },
  doNext: function(){
    console.log('doNext')
    var that = this
    that.setData({
      showResult: false,
      answer: ''
    })
    let idx = this.data.idx;
    let length = this.data.length;
    idx++;
    let realAnswers = this.data.answer;
    let isRight = this.data.isRight;
    let rightNum = this.data.rightNum;
    let errNum = this.data.errNum;
    var items;
    if(!isRight){
      errNum++;
    }else{
      rightNum++;
    }
    let score_arr = this.data.score_arr;
    score_arr[this.data.idx] = isRight;

    items=this.data.items
    
    let percent = ((idx+1)/length)*100;
    if(idx == length){
      this.setData({
        rightNum,
        errNum,
        score_arr,
      },()=>{
        this.goResult();
      })
      return;

    }

    if(length-idx == 1){
      this.setData({
        btnText: '完成'
      })
      wx.showToast({
        icon: 'none',
        title: '已经是最后一题了'
      })
    }

    let id = items[idx];
    this.queryQues(id);

    this.setData({
      rightNum,
      errNum,
      score_arr,
      idx,
      percent,
      isRight: false
    },()=>{
      
    })
  }
})