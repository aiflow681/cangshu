// 工具函数集合
const Utils = {
  // 生成随机数
  random(min, max) {
    return Math.random() * (max - min) + min;
  },

  // 生成随机整数
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // 限制数值范围
  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  },

  // 线性插值
  lerp(start, end, t) {
    return start + (end - start) * t;
  },

  // 计算两点距离
  distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  },

  // 矩形碰撞检测
  rectanglesOverlap(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  },

  // 点是否在矩形内
  pointInRect(px, py, rect) {
    return px >= rect.x &&
           px <= rect.x + rect.width &&
           py >= rect.y &&
           py <= rect.y + rect.height;
  },

  // 点是否在圆内
  pointInCircle(px, py, cx, cy, radius) {
    const distance = this.distance(px, py, cx, cy);
    return distance <= radius;
  },

  // 角度转弧度
  degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
  },

  // 弧度转角度
  radiansToDegrees(radians) {
    return radians * (180 / Math.PI);
  },

  // 随机选择数组元素
  randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
  },

  // 打乱数组
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },

  // 格式化数字
  formatNumber(num, decimals = 2) {
    return num.toFixed(decimals);
  },

  // 深拷贝对象
  deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
  },

  // 防抖函数
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // 检查数值是否在范围内
  inRange(value, min, max) {
    return value >= min && value <= max;
  },

  // 映射数值范围
  map(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  }
};
