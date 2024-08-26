/*
 * @Author: yjl
 * @Date: 2024-05-08 09:27:38
 * @LastEditors: yjl
 * @LastEditTime: 2024-08-20 18:10:42
 * @Description: 描述
 */

/**
 * 1.两个数之和的下标
 * @param {*} nums
 * @param {*} target
 * @returns
 */
function toSum(nums, target) {
  if (nums.length < 2) {
    return [];
  }
  const obj = {};
  for (let i = 0; i < nums.length; i++) {
    if (obj[target - nums[i]] !== undefined) {
      return [obj[target - nums[i]], i];
    } else {
      obj[nums[i]] = i;
    }
  }
  return [];
}

console.log("1.两个数之和的下标:", toSum([2, 7, 11, 15], 9));

/**
 * 3.找出字符串中无重复字符的最长子串
 * @param {*} s
 * @returns
 */

function lengthOfLongestSubstring1(s) {
  let right = 0;
  let res = 0;
  let map = {};
  for (let left = 0; left < s.length; left++) {
    //如果map中出现了当前字符为key的数据,则+1没有则初始为1
    map[s[left]] = map[s[left]] ? map[s[left]] + 1 : 1;
    //判断当前字符在出现次数,大于1则表示重复了
    while (map[s[left]] > 1) {
      //如果重复了 就减去一次次数
      //因为s是从左到右遍历,所以right从0开始加
      map[s[right]]--;
      right++;
    }
    res = Math.max(res, left - right + 1);
  }
  return res;
}

function lengthOfLongestSubstring2(s) {
  let res = 0;
  let left = 0;
  let right = 1;
  while (right < s.length) {
    let temp = s.slice(left, right);
    if (temp.indexOf(s.charAt(right)) > -1) {
      left++;
      continue;
    } else {
      right++;
    }

    res = Math.max(res, right - left);
  }
  return res;
}
console.log(
  "3.找出字符串中无重复字符的最长子串fun1:",
  lengthOfLongestSubstring1("abcabcbb")
);
console.log(
  "3.找出字符串中无重复字符的最长子串fun2:",
  lengthOfLongestSubstring2("abcabcbb")
);

/**
 * 4.寻找两个正序数组的中位数
 * @param {*} nums1
 * @param {*} nums2
 * @returns
 */
function findMedianSortedArrays(nums1, nums2) {
  let all = [...nums1, ...nums2].sort((a, b) => a - b);
  if (all.length <= 1) {
    return all[0];
  }
  let left = 0;
  let right = all.length - 1;
  let mid = 0;
  while (left < right) {
    left++;
    right--;
    if (all[left] == all[right]) {
      mid = all[left];
      continue;
    } else {
      mid = (all[left] + all[right]) / 2;
    }
  }
  return mid;
}

console.log("4.寻找两个正序数组的中位数:", findMedianSortedArrays([1, 3], [2]));
console.log("4.寻找两个正序数组的中位数:", findMedianSortedArrays([1, 3], [2, 4]));

/**
 * 5.找出最长回文字
 * @param {*} s
 * @returns
 */
function longestPalindrome(s) {
  if (s.length == "" || s.length <= 1) {
    return s;
  }
  if ([...s].reverse().join("") == s) {
    return s;
  }

  let start = 0;
  let maxIndex = 1;
  function fun(left, right) {
    while (left >= 0 && right < s.length && s[left] == s[right]) {
      if (right - left + 1 > maxIndex) {
        maxIndex = right - left + 1;
        start = left;
      }
      left--;
      right++;
    }
  }
  for (let i = 0; i < s.length; i++) {
    fun(i - 1, i + 1);
    fun(i, i + 1);
  }
  return s.substring(start, start + maxIndex);
}

console.log("5.找出最长回文字:", longestPalindrome("bananas"));

/**
 * 去重排序
 */

function unique(arr1, arr2) {
  let all = [...arr1, ...arr2];
  if (all.length <= 1) {
    return all;
  }
  function fun(target) {
    if (target.length <= 1) {
      return target;
    }
    let min = [];
    let max = [];
    let targetItem = target[0];
    for (let i = 1; i < target.length; i++) {
      if (target[i] < targetItem) {
        min.push(target[i]);
      } else if (target[i] > targetItem) {
        max.push(target[i]);
      }
    }
    return [...fun(min), targetItem, ...fun(max)];
  }
  return fun(all);
}

console.log("去重排序:", unique([1, 9, 3, 6, 12], [0, 2, 10, 3, 12, 12]));

/**
 * 爬楼梯
 * 描述：每次爬1或2阶，爬n层有多少种爬法
 * 理解：整个算法的本质是一个斐波那契数列,也就是说从第三项开始永远是前两项的和
 * @param {*} n 楼梯总数
 */
function climbStairs(n) {
  if (n == 1 || n == 2) return n; //如果台阶只有1或者2阶梯那就只有这两种走法
  let a = 1;
  let b = 2;
  let sum = 0;
  for (let i = 3; i <= n; i++) {
    sum = a + b;
    a = b;
    b = sum;
  }
  return sum;
}

console.log("爬楼梯：", climbStairs(4));

function climbStairs2(n, start = 1, total = 1) {
  if (n <= 2) {
    return n;
  }
  return climbStairs2(n - 1, total, total + start);
}
console.log("爬楼梯2：", climbStairs(4));

/**
 * 字符串相加
 * @param {*} num1
 * @param {*} num2
 */
function addStrings(num1, num2) {
  let len1 = num1.length - 1;
  let len2 = num2.length - 1;
  let add = 0;
  let res = [];
  while (len1 >= 0 || len2 >= 0 || add != 0) {
    let x = len1 >= 0 ? num1[len1] - "0" : 0;
    let y = len2 >= 0 ? num2[len2] - "0" : 0;
    let result = x + y + add;
    res.unshift(result % 10);
    add = Math.floor(result / 10);
    len1--;
    len2--;
  }
  return res.join("");
}

console.log("字符串相加:", addStrings("123", "457"));

function isWin(arr1, arr2) {
  if (arr1.length != arr2.length) return false;
  let len = arr1.length;
  let sum1 = 0;
  let sum2 = 0;
  for (let i = 0; i < len; i++) {
    let arr1Slice = arr1.slice(i > 2 ? i - 2 : 0, i);
    let arr2Slice = arr2.slice(i > 2 ? i - 2 : 0, i);
    if (arr1Slice.includes(10)) {
      sum1 += arr1[i] * 2;
    } else {
      sum1 += arr1[i];
    }
    if (arr2Slice.includes(10)) {
      sum2 += arr2[i] * 2;
    } else {
      sum2 += arr2[i];
    }
    if (arr1[i] == arr2[i]) {
      continue;
    }
  }
  if (sum1 == sum2) return 0;
  return sum1 > sum2 ? 1 : 2;
}
console.log(isWin([10, 10, 0], [3, 10, 6]));

/**
 * 6.Z字变形转换
 * 例:比如输入字符串为 "PAYPALISHIRING" 行数为 3 时，排列如下：
 * P   A   H   N
 * A P L S I I G
 * Y   I   R
 * 之后，你的输出需要从左往右逐行读取，产生出一个新的字符串，比如："PAHNAPLSIIGYIR"。
 */
function convertZ(s, rowNums) {
  if (rowNums === 1) return s;
  const rows = new Array(rowNums).fill(""); //创建一个行数为length的数组
  const n = 2 * (rowNums - 1); //标识 第一行的下标计算是同过个公式计算的得来
  for (let i = 0; i < s.length; i++) {
    let x = i % n;
    rows[Math.min(x, n - x)] += s[i];
  }
  return rows.join("");
}
console.log("6.Z字变形转换:", convertZ("PAYPALISHIRING", 3));

/**
 * 7.给你一个 32 位的有符号整数 x ，返回将 x 中的数字部分反转后的结果。
 * 例: 输入123 输出321
 * @param {*} target
 * @returns
 */
function reverse(target) {
  if (target === 0) return target;

  let newT = (target + "").split("");
  let flag = false;
  if (newT[0] == "-") {
    newT = newT.slice(1);
    flag = true;
  }
  let result = newT.reverse().reduce((pre, item) => {
    return pre != 0 ? pre + item : item != "0" ? item : "";
  });
  if (result > 2147483647 || result < -2147483648) return 0;
  return flag ? "-" + result : result;
}
console.log(
  "7.给你一个 32 位的有符号整数 x ，返回将 x 中的数字部分反转后的结果:",
  reverse(1534236469)
);

/**
 * 8.字符串转换整数 (atoi)
 * @param {*} target
 * @returns
 */
function myAtoi(target) {
  target = target.trim();
  let reg = new RegExp(/[A-Za-z]/);
  let numReg = new RegExp(/[0-9]/);
  let reg2 = new RegExp(/[+-]/);
  let result = "";
  for (let i = 0; i < target.length; i++) {
    let s = target[i];
    if (reg.test(s)) {
      return result ? getResult(result) : 0;
    }
    if (reg2.test(s)) {
      if (result) {
        return getResult(result);
      } else {
        result += s + "0";

        continue;
      }
    }

    if (numReg.test(s)) {
      result += s;
    } else {
      return result ? getResult(result) : 0;
    }
  }

  function getResult(res) {
    return Number(res) < -2147483648
      ? -2147483648
      : Number(res) > 2147483647
      ? 2147483647
      : Number(res);
  }
  return getResult(result);
}
console.log("8.字符串转换整数 (atoi):", myAtoi("      -11919730356x"));

/** */
