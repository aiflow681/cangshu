// 交互处理类
class InteractionHandler {
  constructor(canvas, hamsters, environment) {
    this.canvas = canvas;
    this.hamsters = hamsters;
    this.environment = environment;
    this.mouseX = 0;
    this.mouseY = 0;
    this.isMouseDown = false;
    
    this.handleClick = this.handleClick.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    
    this.canvas.addEventListener('click', this.handleClick);
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    this.canvas.addEventListener('mouseup', this.handleMouseUp);
    
    // 触摸支持
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = touch.clientX - rect.left;
      this.mouseY = touch.clientY - rect.top;
      this.handleClick(e);
    });
  }

  update(deltaTime) {}

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouseX = e.clientX - rect.left;
    this.mouseY = e.clientY - rect.top;
    this.updateCursor();
  }

  handleMouseDown(e) {
    this.isMouseDown = true;
  }

  handleMouseUp(e) {
    this.isMouseDown = false;
  }

  // 处理点击事件
  handleClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    
    // 获取点击位置（支持鼠标和触摸）
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if (e.clientX !== undefined) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      // 使用存储的鼠标位置（用于触摸事件）
      clientX = this.mouseX + rect.left;
      clientY = this.mouseY + rect.top;
    }
    
    // 计算缩放比例
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    
    // 转换到画布坐标系统
    const clickX = (clientX - rect.left) * scaleX;
    const clickY = (clientY - rect.top) * scaleY;
    
    console.log(`🖱️ 点击位置: (${clickX.toFixed(0)}, ${clickY.toFixed(0)}), 缩放比例: ${scaleX.toFixed(2)}x${scaleY.toFixed(2)}`);
    
    const lang = CONFIG.LANGUAGE;
    const labels = CONFIG.LABELS[lang];
    
    if (this.isPointInBounds(clickX, clickY, this.environment.foodBowl.getBounds())) {
      this.environment.foodBowl.feed();
      this.showFeedback(labels.FOOD_ADDED, clickX / scaleX + rect.left, clickY / scaleY + rect.top);
      return;
    }
    
    if (this.isPointInBounds(clickX, clickY, this.environment.waterBottle.getBounds())) {
      this.environment.waterBottle.fill();
      this.showFeedback(labels.WATER_FILLED, clickX / scaleX + rect.left, clickY / scaleY + rect.top);
      return;
    }
    
    // 检测点击仓鼠
    for (let hamster of this.hamsters) {
      const bounds = hamster.getBounds();
      console.log(`🐹 仓鼠位置: (${hamster.x.toFixed(0)}, ${hamster.y.toFixed(0)}), 边界: x=${bounds.x.toFixed(0)}-${(bounds.x + bounds.width).toFixed(0)}, y=${bounds.y.toFixed(0)}-${(bounds.y + bounds.height).toFixed(0)}`);
      
      if (this.isPointInBounds(clickX, clickY, bounds)) {
        console.log('✅ 点击到仓鼠了！');
        this.petHamster(hamster);
        this.showFeedback(labels.PET_HAMSTER, clickX / scaleX + rect.left, clickY / scaleY + rect.top);
        return;
      }
    }
    
    console.log('❌ 没有点击到任何仓鼠');
  }

  isPointInBounds(x, y, bounds) {
    return x >= bounds.x &&
           x <= bounds.x + bounds.width &&
           y >= bounds.y &&
           y <= bounds.y + bounds.height;
  }

  // 抚摸仓鼠
  petHamster(hamster) {
    const oldHappiness = hamster.happiness;
    // 增加更多快乐值，确保玩家能看到明显变化
    hamster.happiness = Math.min(100, hamster.happiness + 15);
    console.log(`🐹 抚摸仓鼠！快乐值: ${oldHappiness.toFixed(1)} → ${hamster.happiness.toFixed(1)}`);
    
    // 添加视觉效果：让仓鼠"跳"一下
    hamster.vy = -2; // 给一个向上的速度
  }

  // 显示反馈
  showFeedback(text, x, y) {
    const feedback = document.createElement('div');
    feedback.textContent = text;
    feedback.style.position = 'fixed';
    feedback.style.left = x + 'px';
    feedback.style.top = y + 'px';
    feedback.style.color = '#FF1493'; // 使用更鲜艳的粉红色
    feedback.style.fontWeight = 'bold';
    feedback.style.fontSize = '24px'; // 增大字体
    feedback.style.pointerEvents = 'none';
    feedback.style.animation = 'fadeOut 1s forwards';
    feedback.style.zIndex = '1000';
    feedback.style.textShadow = '2px 2px 4px rgba(0,0,0,0.3)'; // 添加阴影使其更明显
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
      document.body.removeChild(feedback);
    }, 1000);
  }

  updateCursor() {
    let cursor = 'default';
    
    if (this.isPointInBounds(this.mouseX, this.mouseY, this.environment.foodBowl.getBounds()) ||
        this.isPointInBounds(this.mouseX, this.mouseY, this.environment.waterBottle.getBounds())) {
      cursor = 'pointer';
    }
    
    for (let hamster of this.hamsters) {
      if (this.isPointInBounds(this.mouseX, this.mouseY, hamster.getBounds())) {
        cursor = 'pointer';
        break;
      }
    }
    
    this.canvas.style.cursor = cursor;
  }

  destroy() {
    this.canvas.removeEventListener('click', this.handleClick);
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    this.canvas.removeEventListener('mousedown', this.handleMouseDown);
    this.canvas.removeEventListener('mouseup', this.handleMouseUp);
  }
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    0% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(-30px);
    }
  }
`;
document.head.appendChild(style);
