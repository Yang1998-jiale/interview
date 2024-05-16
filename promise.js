/*
 * @Author: yjl
 * @Date: 2024-05-16 09:53:44
 * @LastEditors: yjl
 * @LastEditTime: 2024-05-16 11:30:41
 * @Description: 描述
 */

const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";
class MyPromise {
  status = PENDING; //状态
  value = null; //成功的值
  reason = null; //失败的值
  fulfillCallbacks = []; //成功的回调
  rejectCallbacks = []; //失败的回调
  constructor(executor) {
    this.status = PENDING;
    const reject = (value) => {
      if (this.status !== PENDING) {
        return;
      }
      this.status = REJECTED;
      this.reason = value;
    };
    const resolve = (value) => {
      if (this.status !== PENDING) {
        return;
      }

      this.status = FULFILLED;
      this.value = value;
      this.fulfillCallbacks.forEach((fn) => {
        fn();
      });
    };

    try {
      executor(resolve, reject);
    } catch (e) {
      this.reject(e);
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = onFulfilled ? onFulfilled : (value) => value;
    onRejected = onRejected
      ? onRejected
      : (reason) => {
          throw reason;
        };
    let newPromise = new MyPromise((resolve, reject) => {
      if (this.status == FULFILLED) {
        try {
          let x = onFulfilled(this.value);
          return resolve(x);
        } catch (e) {
          reject(e);
        }
      }
      if (this.status == REJECTED) {
        try {
          let x = onRejected(this.reason);
          return resolve(x);
        } catch (e) {
          reject(e);
        }
      }

      if (this.status == PENDING) {
        this.fulfillCallbacks.push(() => {
          try {
            let x = onFulfilled(this.value);
            return resolve(x);
          } catch (e) {
            reject(e);
          }
        });
        this.rejectCallbacks.push(() => {
          try {
            let x = onRejected(this.reason);
            return resolve(x);
          } catch (e) {
            reject(e);
          }
        });
      }
    });
    return newPromise;
  }

  static resolve(value) {
    return new MyPromise((resolve) => {
      resolve(value);
    });
  }

  reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(value);
    });
  }
}

// let p = new MyPromise((resolve, reject) => {
//   setTimeout(() => {
//     resolve("成功了");
//   });
// });
// p.then((res) => {
//   console.log(res);
//   return "hahah ";
// }).then((res) => {
//   console.log(res);
// });

let p = MyPromise.resolve(1);
p.then((res) => {
  console.log(res);
  return 2
}).then(res=>{
  console.log(res);
});
