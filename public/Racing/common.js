/**
 * get 数据
 * @param {*} url 
 * @returns 
 */
async function fetchData(url) {
  try {
    const response = await $.ajax({
      url: url,
      method: 'GET',
      dataType: 'json'
    });
    return response; // 返回数据
  } catch (error) {
    throw error; // 抛出错误
  }
}

function GetQueryString(key) {
  // var b = window.location.search;
  // var d = new RegExp("(^|&)" + c + "=([^&]*)(&|$)");
  // var a = b.substr(1).match(d);
  // return a ? decodeURIComponent(a[2]) : null
  var after = window.location.search
  if (after.indexOf('?') === -1) return null // 如果url中没有传参直接返回空
  // key存在先通过search取值如果取不到就通过hash来取
  after = after.substr(1) || window.location.href.split('?')[1]
  if (after) {
    var reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)')
    var r = after.match(reg)
    if (r != null) {
      return decodeURIComponent(r[2])
    } else {
      return null
    }
  }
}