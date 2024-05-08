/*
 * @Author: yjl
 * @Date: 2024-05-08 17:47:16
 * @LastEditors: yjl
 * @LastEditTime: 2024-05-08 18:01:26
 * @Description: 描述
 */
/**
 * 使用Promise模拟红绿灯
 * 描述:红灯3秒亮一次，绿灯2秒亮一次，黄灯1秒亮一次；如何让三个灯不断交替重复亮灯？
 */

function red() {
  console.log("red");
}
function green() {
  console.log("green");
}
function yellow() {
  console.log("yellow");
}

function light(time, cbk) {
  return new Promise((resolve, reject) => {
    cbk();
    setTimeout(() => {
      resolve();
    }, time);
  });
}

function step(num) {
  Promise.resolve()
    .then(() => {
      light(3000, red);
    })
    .then(() => {
      light(2000, green);
    })
    .then(() => {
      light(1000, yellow);
    })
    .then(() => {
      if (num) {
        step(num - 1);
      }
    });
}
// step(10);

/**
 * 如何让 var [a, b] = {a: 1, b: 2} 解构赋值成功？
 */

let obj = {
  a: 1,
  b: 2,
  [Symbol.iterator]() {
    let index = 0;
    const keys = Object.keys(this);
    return {
      next() {
        if (index < keys.length) {
          return {
            done: false,
            value: obj[keys[index++]],
          };
        }
        return { done: true, value: undefined };
      },
    };
  },
};

let [a, b] = obj;

console.log(a, b);
