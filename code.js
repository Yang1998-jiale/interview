/*
 * @Author: yjl
 * @Date: 2024-05-08 17:47:16
 * @LastEditors: yjl
 * @LastEditTime: 2024-05-20 17:25:34
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
    let value = this.value;
    let filterValue = [];
    if (typeof cbk === "function") {
      for (let i = 0; i < value.length; i++) {
        if (cbk(value[i])) {
          filterValue.push(value[i]);
        }
      }
    }
    return new this.constructor(filterValue);
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

/**
 * 简易的封装timeout
 * @param {*} time
 * @param {*} ms
 * @param {*} cbk
 */
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

// myTimeout(10000, 1000, () => {
//   console.log("我执行了");
// });

/**
 * 返回合大于目标的元素
 */
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

//event bus||订阅发布模式

class EventBus {
  list = new Map();
  on(event, cbk) {
    if (this.list.has(event)) {
      this.list.get(event).push(cbk);
    } else {
      this.list.set(event, [cbk]);
    }
  }

  emit(event, ...args) {
    if (this.list.has(event)) {
      this.list.get(event).forEach((cbk) => {
        cbk.apply(this, args);
      });
    }
  }
}

let eventBus = new EventBus();
eventBus.on("aaa", (a) => {
  console.log("哈哈哈");
  console.log("我是cbk1", a);
});
eventBus.on("aaa", (a) => {
  console.log("哈哈哈");
  console.log("我是cbk2", a);
});
eventBus.emit("aaa", "123");

//给str添加一个方法可以翻转
String.prototype.reserveStr = function () {
  return this.split("").reverse().join("");
};
let str = "123";

console.log(str.reserveStr());

//防抖
function debounce(fn, time) {
  let timeID = null;
  return function () {
    if (timeID) {
      clearTimeout(timeID);
    }
    timeID = setTimeout(() => {
      fn.apply(this, arguments);
    }, time);
  };
}

//节流
function throttle(fn, time) {
  let flag = true;
  let timeID = null;
  return function () {
    if (!flag) return;
    flag = false;
    if (timeID) {
      clearTimeout(timeID);
    }
    timeID = setTimeout(() => {
      fn.apply(this, arguments);
      flag = true;
    }, time);
  };
}

function deepClone(target, hash = new WeakMap()) {
  if (target === null || typeof target !== "object") {
    return target;
  }
  if (target instanceof RegExp) {
    return new RegExp(target.source, target.flags);
  }

  if (target instanceof Date) {
    return new Date(target.getTime());
  }

  //判断hash中是否有缓存 有的话返回缓存
  if (hash.has(target)) {
    return hash.get(target);
  }

  let newTarget = new target.constructor();
  hash.set(target, newTarget);
  let keys = Object.keys(target);
  keys.forEach((key) => {
    let value = target[key];
    if (value === null || typeof value !== "object") {
      newTarget[key] = value;
    } else if (Array.isArray(value)) {
      newTarget[key] = value.map((item) => deepClone(item, hash));
    } else if (value instanceof Set) {
      newTarget[key] = new Set([...value]);
    } else if (value instanceof Map) {
      newTarget[key] = new Map([...value]);
    } else if (typeof value === "function") {
      newTarget[key] = function () {
        return value.apply(this, arguments);
      };
    } else {
      newTarget[key] = deepClone(value, hash);
    }
  });

  return newTarget;
}

//观察者模式
class Subject {
  constructor() {
    this.list = [];
  }
  addObs(obs) {
    this.list.push(obs);
  }

  removeObs(obs) {
    this.list = this.list.filter((item) => item !== obs);
  }

  notify(text) {
    this.list.forEach((obs) => {
      obs.update(text);
    });
  }
}

class Observer {
  constructor(name, update) {
    this.name = name;
    this.update = update;
  }
}

let subject = new Subject();
let obs1 = new Observer("obs1", (text) => {
  console.log("我是观察1", text);
});
let obs2 = new Observer("obs2", (text) => {
  console.log("我是观察2", text);
});
subject.addObs(obs1);
subject.addObs(obs2);
subject.notify("123");

//手写bind

Function.prototype.myBind = function (target, ...args1) {
  if (typeof this !== "function") {
    return new TypeError("not a function");
  }
  let self = this;
  let bound = function (...args2) {
    return self.apply(this instanceof self ? this : target || window, [
      ...args1,
      ...args2,
    ]);
  };
  bound.prototype = this.prototype;
  return bound;
};

//数组扁平化
// Array.prototype.myFlat = function (deep) {
//   let self = this;
//   if (!deep) {
//     deep = 1;
//   }

//   function flat(target, res, level = 1) {
//     target.forEach((item) => {
//       if (Array.isArray(item) && (level <= deep || deep === Infinity)) {
//         res = [...res, ...flat(item, [], level + 1)];
//       } else {
//         res.push(item);
//       }
//     });
//     return res;
//   }
//   return flat(self, []);
// };
Array.prototype.myFlat = function (deep) {
  let self = this;
  if (!deep) {
    deep = 1;
  }
  function flat(target, level = 1) {
    return target.reduce((per, item) => {
      if (Array.isArray(item) && (level <= deep || deep == Infinity)) {
        return [...per, ...flat(item, level + 1)];
      }
      return [...per, item];
    }, []);
  }
  return flat(self);
};
let arrFlat = [1, 2, [3, 4, [5, 6]]];
// arrFlat.flat();
console.log(arrFlat.myFlat());
console.log(arrFlat.myFlat(1));
console.log(arrFlat.myFlat(2));
console.log(arrFlat.myFlat(Infinity));
// console.log(arrFlat.flat(2));
// console.log(arrFlat.flat(1));
// console.log(arrFlat.flat());
// console.log(arrFlat.myFlat(2));

//写一个链表结构'
class Node {
  constructor(val) {
    this.value = val;
    this.next = null;
  }
}

class LinkList {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  addNode(value) {
    let newNode = new Node(value);
    if (this.head == null) {
      this.head = newNode;
    } else {
      let target = this.head;

      while (target.next !== null) {
        target = target.next;
      }
      target.next = newNode;
    }
    console.log(this.head);
    this.size++;
  }

  insetNode(value, index) {
    let newNode = new Node(value);
    if (index < 0 || index > this.index) {
      return false;
    }

    if (index == 0) {
      newNode.next = this.head;
      this.head = newNode;
    } else {
      let target = this.head;
      let i = 0;
      let flag = null;
      while (i++ < index) {
        flag = target;
        target = target.next;
      }
      newNode.next = target;
      flag.next = newNode;
    }
    this.size++;
    return true;
  }

  removeNode(index) {
    if (index < 0 || index > this.size) {
      return false;
    }
    let target = this.head;
    if (index == 0) {
      this.head = target.next;
    } else {
      let i = 0;
      let flag = null;
      while (i++ < index) {
        flag = target;
        target = target.next;
      }
      flag.next = target.next;
    }
    this.size--;
    return target.value;
  }

  findNode(value) {
    let target = this.head;
    while (target.value != value && target != null) {
      target = target.next;
    }
    return target;
  }

  printLinkList() {
    let target = this.head;
    let str = "";
    while (target !== null) {
      str += target.value + (target.next == null ? "" : "=>");
      target = target.next;
    }
    return str;
  }
  deleteNode(head, value) {
    if (head.value == value) {
      head = head.next;
      return head;
    }
    let target = head;
    let current = head.next;

    while (current !== null) {
      if (current.value === value) {
        target.next = current.next;
        current = null;
        break;
      } else {
        target = current;
        current = current.next;
      }
    }
    return head;
  }
}

const list = new LinkList();
list.addNode(1);
list.addNode(2);
list.addNode(3);
list.insetNode(4, 1);
// list.removeNode(2);
// list.deleteNode(list.head, 2);
console.log(list.head);
console.log("我是", list.deleteNode(list.head, 2));
console.log(list.printLinkList());

/**
 *模拟压缩功能例如 aaabbbccccaaa 输出 a3b3c4a3
 */

function codeSet(str) {
  let s = "";
  let count = 1;
  for (let i = 0; i < str.length; i++) {
    console.log(str[i], count);
    if (str[i] == str[i + 1]) {
      count++;
    } else {
      s += str[i] + count;
      count = 1;
    }
  }
  return s.length < str.length ? s : str;
}

console.log(codeSet("abc"));

/**
 * 手写new
 */
function myNew(fn, ...arg) {
  let obj = Object.create();
  obj._proto_ = fn.prototype;
  let result = fn.apply(obj, arg);
  return typeof result == "object" ? result : obj;
}

/**
 * 防抖
 */

function debounce(fn, timer) {
  let timeID = null;
  return function () {
    if (timeID) {
      clearTimeout(timeID);
    }
    timeID = setTimeout(() => {
      fn.apply(this, arguments);
    }, timer);
  };
}

/**
 * 节流
 */
function throttle(fn, timer) {
  let timeID = null;
  let flag = true;
  return function () {
    if (!flag) {
      return;
    }
    flag = false;
    if (timeID) {
      clearTimeout(timeID);
    }
    timeID = setTimeout(() => {
      fn.apply(this.arguments);
      flag = true;
    }, timer);
  };
}

function deepClone2(obj, hash = new WeakMap()) {
  if (typeof obj !== "object" || obj == null) return obj;

  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone2(item, hash));
  }

  if (hash.has(obj)) {
    return hash.get(obj);
  }

  let cloneObj = new obj.constructor();

  hash.set(obj, cloneObj);
  Object.keys(obj).forEach((item) => {
    let value = obj[item];
    if (typeof value !== "object" || obj == null) {
      cloneObj[item] = value;
    } else if (value instanceof Set) {
      cloneObj[item] = new Set([...value]);
    } else if (value instanceof Map) {
      cloneObj[item] = new Map([...value]);
    } else if (typeof value == "function") {
      cloneObj[item] = function () {
        return value.bind(this, arguments);
      };
    } else {
      cloneObj = deepClone2(value, hash);
    }
  });
}

/**
 * 一个trans函数,实现数字转汉字
 */
function transToChinese(num) {
  num = num.toString();
  const numChinese = [
    "零",
    "一",
    "二",
    "三",
    "四",
    "五",
    "六",
    "七",
    "八",
    "九",
  ];
  if (num === "0") {
    return numChinese[0];
  }
  let res = "";
  const units = ["", "十", "百", "千"];
  let len = num.length;
  for (let i = 0; i < len; i++) {
    let value = Number(num[i]);
    if (value != 0) {
      if (num[i - 1] === "0") {
        res = res + numChinese[0];
      }
      res = res + numChinese[value] + units[len - i - 1];
    }
  }
  if (len == 2 && num[0] === "1") {
    res = res.slice(1);
  }
  // console.log(res);
  return res;
}
function trans(num) {
  let isLose = num < 0;
  num = Math.abs(num).toString();
  let res = [];
  let len = num.length;
  for (let i = len; i > 0; i -= 4) {
    res.push(transToChinese(num.slice(Math.max(0, i - 4), i)));
  }
  let maxUnits = ["", "万", "亿", "万亿", "亿亿"];
  for (let i = 0; i < res.length; i++) {
    if (res[i] == "") {
      continue;
    }
    res[i] += maxUnits[i];
  }
  return isLose ? "负" + res.reverse().join("") : res.reverse().join("");
}
console.log(trans(-1001001001));

let data1 = [
  { id: 12, parent_id: 1, name: "朝阳区" },
  { id: 241, parent_id: 24, name: "田林街道" },
  { id: 31, parent_id: 3, name: "广州市" },
  { id: 13, parent_id: 1, name: "昌平区" },
  { id: 2421, parent_id: 242, name: "上海科技绿洲" },
  { id: 21, parent_id: 2, name: "静安区" },
  { id: 242, parent_id: 24, name: "漕河泾街道" },
  { id: 22, parent_id: 2, name: "黄浦区" },
  { id: 11, parent_id: 1, name: "顺义区" },
  { id: 2, parent_id: 0, name: "上海市" },
  { id: 24, parent_id: 2, name: "徐汇区" },
  { id: 1, parent_id: 0, name: "北京市" },
  { id: 2422, parent_id: 242, name: "漕河泾开发区" },
  { id: 32, parent_id: 3, name: "深圳市" },
  { id: 33, parent_id: 3, name: "东莞市" },
  { id: 3, parent_id: 0, name: "广东省" },
];

function arrToTree(list, root) {
  let activeList = [];
  let notList = [];
  list.forEach((item) => {
    if (item.parent_id == root) {
      activeList.push(item);
    } else {
      notList.push(item);
    }
  });
  return activeList.map((item) => {
    return {
      ...item,
      children: arrToTree(notList, item.id),
    };
  });
}

console.log(arrToTree(data1, 0));

/**
 * 去除字符串中出现次数最少的字符并且保持字符串的原有顺序
 */

function removeStr(str) {
  let res = [];
  let resObj = {};
  for (let i = 0; i < str.length; i++) {
    if (resObj[str[i]]) {
      resObj[str[i]]++;
    } else {
      resObj[str[i]] = 1;
    }
  }
  let min = Math.min(...Object.values(resObj));
  for (let i = 0; i < str.length; i++) {
    if (resObj[str[i]] > min) {
      res.push(str[i]);
    }
  }
  return res.join("");
}
console.log(removeStr("aaabbbcceeff"));
console.log(removeStr("aaabbabababcceeff"));

/**
 * 实现一个批量请求函数,要求可以控制并发量
 */

function myFetch(p, maxLength) {
  const len = p.length;
  let res = new Array(len).fill("pedding");
  let count = 0;
  return new Promise((resolve) => {
    // if (count >= maxLength) {
    // }
    while (count < maxLength) {
      next();
    }
    function next() {
      let current = count++;
      if (current >= len) {
        if (!res.includes("pedding")) {
          resolve(res);
        }
        return;
      }
      let fn = p[current];
      fn()
        .then((r) => {
          res[current] = r;
          if (current < len) {
            next();
          }
        })
        .catch((err) => {
          res[current] = err;
          if (current < len) {
            next();
          }
        });
    }
  });
}
let promiseAll = new Array(50).fill({}).map((item, index) => {
  return () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(index);
      }, Math.floor(Math.random() + 1) * 1000);
    });
  };
});
myFetch(promiseAll, 10).then((res) => {
  console.log(res);
});

/**
 * 树结构转数组(树结构扁平化)
 */

const listTree = [
  {
    id: 1,
    name: "部门1",
    pid: 0,
    children: [
      {
        id: 2,
        name: "部门1-1",
        pid: 1,
        children: [
          {
            id: 4,
            name: "部门1-1-1",
            pid: 2,
            children: [],
          },
        ],
      },
      {
        id: 3,
        name: "部门1-2",
        pid: 1,
        children: [
          {
            id: 5,
            name: "部门1-2-1",
            pid: 3,
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: 6,
    name: "部门2",
    pid: 0,
    children: [
      {
        id: 7,
        name: "部门2-1",
        pid: 6,
        children: [],
      },
    ],
  },
  {
    id: 8,
    name: "部门3",
    pid: 0,
    children: [],
  },
];
//reduce递归
function treeToArr(tree) {
  return tree.reduce((pre, item) => {
    let childrenList = [...item.children];
    delete item.children;
    if (Array.isArray(childrenList) && childrenList.length) {
      return [...pre, item, ...treeToArr(childrenList)];
    } else {
      return [...pre, item];
    }
  }, []);
}

//广度优先遍历法
function treeToArr2(tree, className = "children") {
  let newArr = [...tree];
  let result = [];
  while (newArr.length) {
    let first = newArr.shift();
    if (Array.isArray(first[className])) {
      newArr = newArr.concat(first[className]);
      delete first[className];
    }
    result.push(first);
  }
  return result;
}
console.log(treeToArr(listTree));
console.log(treeToArr2(listTree));

/**
 * 删除链表的一个节点
 */
function deleteNode(head, value) {
  if (head.value == value) {
    head = head.next;
    return head;
  }
  if (head.value == value) {
    head = head.next;
    return head;
  }
  let target = head;
  let current = head.next;

  while (current !== null) {
    if (current.value === value) {
      target.next = current.next;
      current = null;
      break;
    } else {
      target = current;
      current = current.next;
    }
  }
  return head;
}
list.removeNode(2);
console.log(list.printLinkList());

/**
 * a , b , c
 * a={} b='name.sex.age' c=10
 * 输出 a{name:{sex:{age:10}}}
 */

function setAttr(a, b, c) {
  if (typeof a !== "object") {
    return TypeError("第一个参数是对象");
  }
  let bSplit = b.split(".");
  bSplit.reduce((pre, key, index) => {
    if (index < bSplit.length - 1) {
      pre[key] = {};
    } else {
      pre[key] = c;
    }
    return pre[key];
  }, a);
  return a;
}

// console.log(setAttr({}, "name.sex.age", 10));
/**
 * 定义一个函数 用来收集目标函数的信息 开始时间 结束时间 名称 参数 返回值 运行状态等
 * @param {*} fn
 * @param  {...any} arg
 * @returns
 */
function myApply(fn, ...arg) {
  if (typeof fn !== "function") {
    return TypeError("第一个参数是函数");
  }
  let start = new Date().getTime();
  let obj = {
    params: arg,
    start,
    status: null,
    name: fn.name,
  };
  let end = null;
  let promise = new Promise(async (resolve, reject) => {
    try {
      let res = await fn.apply(this, arg);
      obj.status = "resolve";
      resolve(res);
    } catch (e) {
      end = new Date().getTime();
      obj.status = "reject";
      obj.end = end;
      resolve(e);
    }
  });

  return promise.then((res) => {
    end = new Date().getTime();
    obj.end = end;
    return { res, obj };
  });
}

function addFn() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // console.log(123);
      reject(TypeError("类型错误"));
    }, 3000);
  });
}
myApply(addFn).then((err) => {
  console.log(err);
});

// 给一个资源地址,获取其后缀
function getSuffix(url) {
  if (typeof url !== "string") {
    return;
  }
  return url.substring(url.lastIndexOf(".") + 1);
}

/**
 * 数组去重
 */

function unique(target) {
  if (!Array.isArray(target) || target.length < 2) {
    return target;
  }
  let map = new Map();
  let result = [];
  target.forEach((item) => {
    if (!map.has(item)) {
      map.set(item, 1);
      result.push(item);
    }
  });
  return result;
}
console.log(
  unique([1, 1, "1", 17, true, true, false, false, "true", "a", {}, {}])
);

/**
 * 函数珂理化
 */

function addfn() {
  let arg = [...arguments];
  function fn() {
    arg.push(...arguments);
    return fn;
  }

  fn.toString = function () {
    return arg.reduce((pre, item) => (pre += item), 0);
  };
  return fn;
}
console.log(addfn(1)(1, 2, 3)(2) == 9);
