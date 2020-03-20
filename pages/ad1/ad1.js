Page({
  data: {
    fromStatus: 0
  },
  onLoad: function (options) {
    if (options.fromStatus == 1) {
      this.setData({ fromStatus: 1 });
    } else if (options.fromStatus == 2) {
      this.setData({ fromStatus: 2 });
    }
  }
})