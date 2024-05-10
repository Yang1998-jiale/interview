/*
 * @Author: yjl
 * @Date: 2024-05-08 17:47:16
 * @LastEditors: yjl
 * @LastEditTime: 2024-05-10 17:55:36
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

// console.log(a, b);

/**
 * 提供了一个数组结构的 data，要求实现一个 query 方法，返回一个新的数组，query 方法内部分组、过滤、排序等操作，并且支持链式调用，调用最终的execute方法返回结果:
 */

// const result = query(list)
//   .where((item) => item.age > 18)
//   .sortBy("id")
//   .groupBy("name")
//   .execute();
class Data {
  value;
  constructor(value) {
    this.value = value;
  }

  sortBy(key = "id") {
    this.value.sort(a, (b) => a[key] - b[key]);
    return this;
  }

  where(cbk) {
    if (typeof cbk === "function") {
      this.value = this.value.filter(cbk);
    }
    return this;
  }

  execute() {
    return this.value;
  }

  groupBy(key) {
    if (this.value.length) {
      let group = {};
      let value = this.value;
      value.forEach((item) => {
        if (group[key]) {
          group[key].push(item);
        } else {
          group[key] = [item];
        }
      });
      this.value = Object.values(group);
    }
    return this;
  }
}

function query(data) {
  return new Data(data);
}

// function myTimeout(cbk, ms) {
//   if (!ms || ms < 500) {
//     ms = 500;
//   }
//   let start = Date.now();
//   let intervalID = setInterval(() => {
//     let now = Date.now();
//     let time = now - start;
//     if (time >= ms) {
//       clearInterval(intervalID);
//       cbk();
//     }
//   }, 1000);
// }

// myTimeout(() => {
//   console.log("我执行了");
// }, 3000);

function myTimeout(time, ms = 1000, cbk) {
  let start = +new Date();
  let timeID = null;
  if (timeID) {
    clearTimeout(timeID);
  }
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
});

let arrList = [
  { age: 20, name: "张三" },
  { age: 21, name: "李四" },
  { age: 22, name: "王五" },
  { age: 23, name: "赵六" },
];

function queryMaxTarget(num, target) {
  if (!target.length || !num) {
    return "";
  }
  let sum = 0;
  let index = target.findIndex((item) => {
    sum += item.age;
    return sum >= num;
  });
  console.log(index);
  if (index != -1) {
    return target.slice(0, index + 1);
  }
  return "所有合都小于num";
}
// console.log(queryMaxTarget(60, arrList));
