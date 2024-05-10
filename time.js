/*
 * @Author: yjl
 * @Date: 2024-05-10 17:56:31
 * @LastEditors: yjl
 * @LastEditTime: 2024-05-10 17:59:31
 * @Description: 描述
 */
function myTimeout(time, ms = 1000, cbk) {
  let start = +new Date();
  let timeID = null;
  if (timeID) {
    clearTimeout(timeID);
  }
  time -= ms;
  cbk();
  timeID = setTimeout(fun, ms);

  function fun() {
    if (time <= 0) {
      return;
    }
    let now = +new Date();
    let diff = now - start;
    time -= diff;
    start = now;
    cbk();
    timeID = setTimeout(fun, ms);
  }
}

myTimeout(10000, 1000, () => {
  console.log("我执行了");
  setTimeout(()=>{
    console.log('我是阻塞');
  },1000)
});
