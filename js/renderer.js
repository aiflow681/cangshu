// 渲染器类
class Renderer {
  constructor(ctx) {
    this.ctx = ctx;
  }

  // 清空画布
  clear(color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, CONFIG.CANVAS.WIDTH, CONFIG.CANVAS.HEIGHT);
  }

  // 渲染环境
  renderEnvironment(environment) {
    this.drawCage();
    if (environment?.foodBowl) this.drawFoodBowl(environment.foodBowl);
    if (environment?.waterBottle) this.drawWaterBottle(environment.waterBottle);
    if (environment?.tunnel) this.drawTunnel(environment.tunnel);
    if (environment?.wheel) this.drawWheel(environment.wheel);
  }

  // 绘制笼子
  drawCage() {
    this.drawSingleCage(350, 350, 300, 200);
    this.drawSingleCage(200, 150, 200, 150);
    this.drawSingleCage(600, 150, 200, 150);
    this.drawSingleCage(200, 450, 200, 150);
    this.drawSingleCage(600, 450, 200, 150);
    this.drawTubes();
  }
  
  drawSingleCage(x, y, width, height) {
    const ctx = this.ctx;
    ctx.fillStyle = CONFIG.CAGE.BEDDING_COLOR;
    ctx.fillRect(x, y + height - 30, width, 30);
    ctx.strokeStyle = CONFIG.CAGE.BORDER_COLOR;
    ctx.lineWidth = CONFIG.CAGE.BORDER_WIDTH;
    ctx.strokeRect(x, y, width, height);
  }
  
  // 绘制连接管道
  drawTubes() {
    this.drawTube(350, 350, 350, 300, 40, '#87CEEB');
    this.drawTube(650, 350, 650, 300, 40, '#90EE90');
    this.drawTube(400, 225, 600, 225, 40, '#DDA0DD');
  }
  
  drawTube(x1, y1, x2, y2, width, color) {
    const ctx = this.ctx;
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    
    ctx.save();
    ctx.translate(x1, y1);
    ctx.rotate(angle);
    
    ctx.fillStyle = color;
    ctx.fillRect(0, -width/2, length, width);
    
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    for (let i = 0; i < length; i += 15) {
      ctx.beginPath();
      ctx.moveTo(i, -width/2);
      ctx.lineTo(i, width/2);
      ctx.stroke();
    }
    
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, 0, width/2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(length, 0, width/2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.restore();
  }

  // 绘制食物碗
  drawFoodBowl(bowl) {
    const ctx = this.ctx;
    
    ctx.fillStyle = CONFIG.FOOD_BOWL.COLOR;
    ctx.beginPath();
    ctx.ellipse(bowl.x, bowl.y, bowl.width / 2, bowl.height / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#2E5090';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(bowl.x, bowl.y - bowl.height / 3, bowl.width / 2, bowl.height / 6, 0, 0, Math.PI);
    ctx.stroke();
    
    if (bowl.foodLevel > 0) {
      const foodHeight = (bowl.foodLevel / bowl.maxFood) * bowl.height / 2;
      ctx.fillStyle = CONFIG.FOOD_BOWL.FOOD_COLOR;
      ctx.beginPath();
      ctx.ellipse(bowl.x, bowl.y - bowl.height / 4 + (bowl.height / 4 - foodHeight / 2), bowl.width / 3, foodHeight / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'right';
    ctx.strokeText(Math.round(bowl.foodLevel) + '%', bowl.x - bowl.width / 2 - 5, bowl.y + 5);
    ctx.fillText(Math.round(bowl.foodLevel) + '%', bowl.x - bowl.width / 2 - 5, bowl.y + 5);
  }

  // 绘制水瓶
  drawWaterBottle(bottle) {
    const ctx = this.ctx;
    
    ctx.fillStyle = CONFIG.WATER_BOTTLE.COLOR;
    ctx.fillRect(bottle.x - bottle.width / 2, bottle.y - bottle.height / 2, bottle.width, bottle.height);
    
    ctx.fillStyle = '#4169E1';
    ctx.fillRect(bottle.x - bottle.width / 2 - 2, bottle.y - bottle.height / 2 - 8, bottle.width + 4, 8);
    
    if (bottle.waterLevel > 0) {
      const waterHeight = (bottle.waterLevel / bottle.maxWater) * bottle.height;
      ctx.fillStyle = CONFIG.WATER_BOTTLE.WATER_COLOR;
      ctx.fillRect(bottle.x - bottle.width / 2 + 2, bottle.y + bottle.height / 2 - waterHeight, bottle.width - 4, waterHeight - 2);
    }
    
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(bottle.x, bottle.y + bottle.height / 2 + 5, 4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.strokeText(Math.round(bottle.waterLevel) + '%', bottle.x + bottle.width / 2 + 5, bottle.y + 5);
    ctx.fillText(Math.round(bottle.waterLevel) + '%', bottle.x + bottle.width / 2 + 5, bottle.y + 5);
  }

  // 绘制跑轮
  drawWheel(wheel) {
    const ctx = this.ctx;
    
    ctx.save();
    ctx.translate(wheel.x, wheel.y);
    
    ctx.strokeStyle = CONFIG.WHEEL.COLOR;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(0, 0, wheel.radius, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.strokeStyle = CONFIG.WHEEL.SPOKE_COLOR;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, wheel.radius - 15, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.rotate(wheel.rotation);
    ctx.strokeStyle = CONFIG.WHEEL.SPOKE_COLOR;
    ctx.lineWidth = 2;
    
    for (let i = 0; i < CONFIG.WHEEL.SPOKES; i++) {
      const angle = (Math.PI * 2 / CONFIG.WHEEL.SPOKES) * i;
      const x1 = Math.cos(angle) * 10;
      const y1 = Math.sin(angle) * 10;
      const x2 = Math.cos(angle) * (wheel.radius - 15);
      const y2 = Math.sin(angle) * (wheel.radius - 15);
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    
    ctx.fillStyle = CONFIG.WHEEL.SPOKE_COLOR;
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }

  // 绘制隧道
  drawTunnel(tunnel) {
    const ctx = this.ctx;
    
    ctx.fillStyle = CONFIG.TUNNEL.COLOR;
    ctx.fillRect(tunnel.x - tunnel.width / 2, tunnel.y - tunnel.height / 2, tunnel.width, tunnel.height);
    
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.arc(tunnel.x - tunnel.width / 2, tunnel.y, CONFIG.TUNNEL.ENTRANCE_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#1a6b1a';
    ctx.beginPath();
    ctx.arc(tunnel.x - tunnel.width / 2, tunnel.y, CONFIG.TUNNEL.ENTRANCE_RADIUS - 5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.arc(tunnel.x + tunnel.width / 2, tunnel.y, CONFIG.TUNNEL.ENTRANCE_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#1a6b1a';
    ctx.beginPath();
    ctx.arc(tunnel.x + tunnel.width / 2, tunnel.y, CONFIG.TUNNEL.ENTRANCE_RADIUS - 5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#228B22';
    ctx.lineWidth = 3;
    for (let i = 0; i < 4; i++) {
      const x = tunnel.x - tunnel.width / 2 + (tunnel.width / 4) * i;
      ctx.beginPath();
      ctx.moveTo(x, tunnel.y - tunnel.height / 2);
      ctx.lineTo(x, tunnel.y + tunnel.height / 2);
      ctx.stroke();
    }
    
    if (tunnel.hamsterInside) {
      ctx.fillStyle = '#FF69B4';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('😴 Hiding...', tunnel.x, tunnel.y - tunnel.height);
    }
  }

  // 渲染仓鼠
  renderHamster(hamster) {
    const ctx = this.ctx;
    
    if (hamster.state === 'hiding') {
      ctx.globalAlpha = 0.3;
    }
    
    ctx.save();
    ctx.translate(hamster.x, hamster.y);
    
    if (!hamster.facingRight) {
      ctx.scale(-1, 1);
    }
    
    ctx.fillStyle = hamster.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, hamster.width / 2, hamster.height / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = hamster.color;
    ctx.beginPath();
    ctx.arc(-hamster.width / 3, -hamster.height / 2, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(hamster.width / 3, -hamster.height / 2, 8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = hamster.eyeColor;
    ctx.beginPath();
    ctx.arc(-hamster.width / 4, -5, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(hamster.width / 4, -5, 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = hamster.noseColor;
    ctx.beginPath();
    ctx.arc(0, 5, 2, 0, Math.PI * 2);
    ctx.fill();
    
    if (hamster.speed > 0.5) {
      const bounce = Math.sin(hamster.animationFrame) * 3;
      ctx.fillStyle = hamster.color;
      ctx.beginPath();
      ctx.arc(-hamster.width / 3, hamster.height / 2 + bounce, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(hamster.width / 3, hamster.height / 2 - bounce, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
    ctx.globalAlpha = 1.0;
    
    if (CONFIG.GAME.DEBUG_MODE) {
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(hamster.state, hamster.x, hamster.y - 30);
    }
  }

  // 渲染UI
  renderUI(hamster, environment) {
    const ctx = this.ctx;
    const lang = CONFIG.LANGUAGE;
    const labels = CONFIG.LABELS[lang];
    
    this.drawNeedsBar(labels.HUNGER, hamster.hunger, 10, 10, '#FF6347');
    this.drawNeedsBar(labels.THIRST, hamster.thirst, 10, 40, '#4682B4');
    this.drawNeedsBar(labels.ENERGY, 100 - hamster.tiredness, 10, 70, '#FFD700');
    this.drawNeedsBar(labels.HAPPY, hamster.happiness, 10, 100, '#32CD32');
    
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('FPS: ' + Math.round(window.game?.fps || 0), CONFIG.CANVAS.WIDTH - 10, 20);
  }

  // 绘制需求条
  drawNeedsBar(label, value, x, y, color) {
    const ctx = this.ctx;
    const barWidth = 120;
    const barHeight = 16;
    
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(label, x, y + 12);
    
    ctx.fillStyle = '#ddd';
    ctx.fillRect(x + 60, y, barWidth, barHeight);
    
    ctx.fillStyle = color;
    ctx.fillRect(x + 60, y, (barWidth * value) / 100, barHeight);
    
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 60, y, barWidth, barHeight);
  }

  // 渲染暂停覆盖层
  renderPauseOverlay() {
    const ctx = this.ctx;
    const lang = CONFIG.LANGUAGE;
    const labels = CONFIG.LABELS[lang];
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, CONFIG.CANVAS.WIDTH, CONFIG.CANVAS.HEIGHT);
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(labels.PAUSED, CONFIG.CANVAS.WIDTH / 2, CONFIG.CANVAS.HEIGHT / 2);
    
    ctx.font = '20px Arial';
    ctx.fillText(labels.PRESS_SPACE, CONFIG.CANVAS.WIDTH / 2, CONFIG.CANVAS.HEIGHT / 2 + 40);
  }
}
