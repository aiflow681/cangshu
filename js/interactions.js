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
    
    console.log('🖱️ Interaction handler created');
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
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    console.log('🖱️ Click at', Math.round(clickX), Math.round(clickY));
    
    const lang = CONFIG.LANGUAGE;
    const labels = CONFIG.LABELS[lang];
    
    if (this.isPointInBounds(clickX, clickY, this.environment.foodBowl.getBounds())) {
      this.environment.foodBowl.feed();
      this.showFeedback(labels.FOOD_ADDED, clickX, clickY);
      return;
    }
    
    if (this.isPointInBounds(clickX, clickY, this.environment.waterBottle.getBounds())) {
      this.environment.waterBottle.fill();
      this.showFeedback(labels.WATER_FILLED, clickX, clickY);
      return;
    }
    
    for (let hamster of this.hamsters) {
      if (this.isPointInBounds(clickX, clickY, hamster.getBounds())) {
        this.petHamster(hamster);
        this.showFeedback('❤️ Pet!', clickX, clickY);
        return;
      }
    }
  }

  isPointInBounds(x, y, bounds) {
    return x >= bounds.x &&
           x <= bounds.x + bounds.width &&
           y >= bounds.y &&
           y <= bounds.y + bounds.height;
  }

  // 抚摸仓鼠
  petHamster(hamster) {
    hamster.happiness = Math.min(100, hamster.happiness + 5);
    console.log('❤️ Hamster petted! Happiness:', Math.round(hamster.happiness));
  }

  // 显示反馈
  showFeedback(text, x, y) {
    const feedback = document.createElement('div');
    feedback.textContent = text;
    feedback.style.position = 'fixed';
    feedback.style.left = x + 'px';
    feedback.style.top = y + 'px';
    feedback.style.color = '#4CAF50';
    feedback.style.fontWeight = 'bold';
    feedback.style.fontSize = '20px';
    feedback.style.pointerEvents = 'none';
    feedback.style.animation = 'fadeOut 1s forwards';
    feedback.style.zIndex = '1000';
    
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
    console.log('🗑️ Interaction handler destroyed');
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
