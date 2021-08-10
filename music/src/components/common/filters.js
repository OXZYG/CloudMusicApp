const vfilters = {
  // 歌曲时长转换
  durToMin: function (dur) {
    if (dur) {
      const temp = parseInt(dur / 1000)
      let min = parseInt(temp / 60)
      let sec = temp % 60
      if (min < 10) min = '0' + min
      if (sec < 10) sec = '0' + sec
      return min + ':' + sec
    } else {
      return '00:00'
    }
  },
  // 当前播放时间
  curToMin: function (cur) {
    let min = parseInt(cur / 60)
    let sec = parseInt(cur - 60 * min)
    if (min < 10) min = '0' + min
    if (sec < 10) sec = '0' + sec
    return min + ':' + sec
  },
  // 歌曲作者
  artistName: function (artist) {
    const allName = []
    let i = 0
    while (artist[i]) {
      allName.push(artist[i].name)
      i++
    }
    return allName.join('、')
  }
}

export default vfilters
