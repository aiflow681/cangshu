// 仓鼠类
class Hamster {
  constructor(x, y, homeCage = null) {
    this.x = x;
    this.y = y;
    this.homeCage = homeCage || { x: x, y: y };
    this.vx = 0;
    this.vy = 0;
    this.width = CONFIG.HAMSTER.WIDTH;
    this.height = CONFIG.HAMSTER.HEIGHT;
    this.color = CONFIG.HAMSTER.DEFAULT_COLOR;
    this.eyeColor = CONFIG.HAMSTER.EYE_COLOR;
    this.noseColor = CONFIG.HAMSTER.NOSE_COLOR;
    this.direction = 0;
    this.speed = 0;
    this.targetSpeed = CONFIG.HAMSTER.SPEED;
    this.state = 'idle'; // idle, walking, eating, drinking, sleeping
    this.stateTimer = Math.random() * 1000;
    this.hunger = Math.random() * 30;
    this.thirst = Math.random() * 30;
    this.tiredness = Math.random() * 30;
    this.happiness = 100;
    this.animationFrame = 0;
    this.animationSpeed = 0.1;
    this.facingRight = true;
    this.lastX = x;
    this.lastY = y;
    this.stuckCounter = 0;
  }

  // 更新仓鼠状态
  update(deltaTime, environment) {
    this.updateNeeds(deltaTime);
    this.updateBehavior(deltaTime, environment);
    this.updateMovement(deltaTime);
    
    // 卡住检测
    const distanceMoved = Math.sqrt(
      Math.pow(this.x - this.lastX, 2) + Math.pow(this.y - this.lastY, 2)
    );
    
    if (distanceMoved < 0.5 && this.speed > 0.5) {
      this.stuckCounter++;
      if (this.stuckCounter > 30) {
        if (this.homeCage) {
          this.x = this.homeCage.x;
          this.y = this.homeCage.y;
        }
        this.stuckCounter = 0;
        this.setState('walking', Utils.random(3000, 6000));
        this.chooseRandomDirection();
      }
    } else {
      this.stuckCounter = 0;
    }
    
    this.lastX = this.x;
    this.lastY = this.y;
    
    this.constrainToCage();
    this.updateAnimation(deltaTime);
  }

  // 更新需求值
  updateNeeds(deltaTime) {
    this.hunger = Math.min(100, this.hunger + CONFIG.HAMSTER.HUNGER_RATE * deltaTime);
    this.thirst = Math.min(100, this.thirst + CONFIG.HAMSTER.THIRST_RATE * deltaTime);
    this.tiredness = Math.min(100, this.tiredness + CONFIG.HAMSTER.ENERGY_RATE * deltaTime);
    
    const averageNeed = (this.hunger + this.thirst + this.tiredness) / 3;
    if (averageNeed > 50) {
      // 降低快乐值减少速度，让玩家的点击更有效果
      this.happiness = Math.max(0, this.happiness - 0.003 * deltaTime);
    } else {
      this.happiness = Math.min(100, this.happiness + 0.005 * deltaTime);
    }
  }

  // 更新行为状态机
  updateBehavior(deltaTime, environment) {
    this.stateTimer = Math.max(0, this.stateTimer - deltaTime);
    
    if (this.stateTimer <= 0) {
      this.chooseBehavior(environment);
    }
    
    switch (this.state) {
      case 'idle':
        this.behaviorIdle();
        break;
      case 'walking':
        this.behaviorWalking();
        break;
      case 'exploring':
        this.behaviorExploring();
        break;
      case 'eating':
        this.behaviorEating(environment);
        break;
      case 'drinking':
        this.behaviorDrinking(environment);
        break;
      case 'sleeping':
        this.behaviorSleeping();
        break;
      case 'playing':
        this.behaviorPlaying(environment);
        break;
      case 'hiding':
        this.behaviorHiding(environment);
        break;
    }
  }

  // 选择下一个行为
  chooseBehavior(environment) {
    // 随机优先级，防止群体行为同步
    // 添加随机扰动来决定优先处理哪个需求
    const hungerPriority = this.hunger + (Math.random() * 30);
    const thirstPriority = this.thirst + (Math.random() * 30);
    const tirednessPriority = this.tiredness + (Math.random() * 30);

    // 优先处理最紧迫的需求（包含随机因素）
    if (hungerPriority > thirstPriority && hungerPriority > tirednessPriority) {
        if (this.hunger > 20 && environment?.foodBowl?.hasFood()) {
            this.setState('eating', Utils.random(5000, 9000));
            return;
        }
    } else if (thirstPriority > hungerPriority && thirstPriority > tirednessPriority) {
        if (this.thirst > 20 && environment?.waterBottle?.hasWater()) {
            this.setState('drinking', Utils.random(5000, 9000));
            return;
        }
    }
    
    // Fallback normal checks if top priority wasn't actionable
    if (this.hunger > 25 && environment?.foodBowl?.hasFood()) {
      this.setState('eating', 8000);
      return;
    }
    
    if (this.thirst > 25 && environment?.waterBottle?.hasWater()) {
      this.setState('drinking', 8000);
      return;
    }
    
    if (this.tiredness > 70) {
      this.setState('sleeping', 5000);
      return;
    }
    
    if (this.tiredness < 30 && Math.random() < 0.2 && environment?.wheel) {
      this.setState('playing', Utils.random(3000, 5000));
      return;
    }
    
    if (Math.random() < 0.1 && environment?.tunnel) {
      this.setState('hiding', Utils.random(4000, 8000));
      return;
    }
    
    // 大幅降低探索概率
    if (Math.random() < 0.2) {
      this.setState('exploring', Utils.random(4000, 8000));
      return;
    }
    
    const rand = Math.random();
    if (rand < 0.4) {
      this.setState('walking', Utils.random(3000, 6000));
      this.chooseRandomDirection();
    } else if (rand < 0.6) {
      this.setState('idle', Utils.random(1500, 3000));
    } else {
      this.setState('walking', Utils.random(3000, 6000));
      this.chooseRandomDirection();
    }
  }

  setState(state, duration) {
    this.state = state;
    this.stateTimer = duration;
  }

  behaviorIdle() {
    this.targetSpeed = 0;
  }

  behaviorWalking() {
    this.targetSpeed = CONFIG.HAMSTER.SPEED;
    if (Math.random() < CONFIG.HAMSTER.DIRECTION_CHANGE_CHANCE) {
      this.direction += Utils.random(-0.5, 0.5);
    }
  }

  behaviorExploring() {
    this.targetSpeed = CONFIG.HAMSTER.SPEED;
    if (Math.random() < 0.05) {
      this.direction += Utils.random(-0.8, 0.8);
    }
  }

  behaviorEating(environment) {
    if (environment?.foodBowl) {
      const bowl = environment.foodBowl;
      
      let targetX = bowl.x;
      let targetY = bowl.y;
      
      // 寻路逻辑：如果在主笼（X > 350且Y < 550），需要先通过底部管道
      if (this.x > 350 && this.y < 550) {
        // 目标设为底部管道入口
        if (Math.abs(this.x - 350) > 20 || Math.abs(this.y - 550) > 20) {
          targetX = 350;
          targetY = 550;
        }
      }

      const dx = targetX - this.x;
      const dy = targetY - this.y;
      const distToTarget = Math.sqrt(dx * dx + dy * dy);
      const distToFood = Math.sqrt(Math.pow(bowl.x - this.x, 2) + Math.pow(bowl.y - this.y, 2));
      
      // 增加检测距离，让仓鼠更容易吃到食物
      if (distToFood > 80) {
        this.direction = Math.atan2(dy, dx);
        this.targetSpeed = CONFIG.HAMSTER.SPEED;
      } else {
        this.targetSpeed = 0;
        // 在食物碗附近就开始吃
        if (bowl.eat()) {
          this.hunger = Math.max(0, this.hunger - 0.2);
        }
      }
    }
  }

  behaviorDrinking(environment) {
    if (environment?.waterBottle) {
      const bottle = environment.waterBottle;
      
      let targetX = bottle.x;
      let targetY = bottle.y;
      
      // 寻路逻辑
      // 1. 如果在主笼（下方），去右上出口
      if (this.y > 350) {
        if (Math.abs(this.x - 650) > 20 || Math.abs(this.y - 350) > 20) {
           targetX = 650;
           targetY = 350;
        }
      }
      // 2. 如果在左侧（左上笼或隧道中），去右侧
      else if (this.x < 600) {
          // 目标设为隧道右出口
          if (Math.abs(this.x - 600) > 20) {
             targetX = 600;
             targetY = 225;
          }
      }

      const dx = targetX - this.x;
      const dy = targetY - this.y;
      const distToTarget = Math.sqrt(dx * dx + dy * dy);
      const distToWater = Math.sqrt(Math.pow(bottle.x - this.x, 2) + Math.pow(bottle.y - this.y, 2));
      
      // 增加检测距离，让仓鼠更容易喝到水
      if (distToWater > 80) {
        this.direction = Math.atan2(dy, dx);
        this.targetSpeed = CONFIG.HAMSTER.SPEED;
      } else {
        this.targetSpeed = 0;
        // 在水瓶附近就开始喝
        if (bottle.drink()) {
          this.thirst = Math.max(0, this.thirst - 0.15);
        }
      }
    }
  }

  behaviorSleeping() {
    this.targetSpeed = 0;
    this.tiredness = Math.max(0, this.tiredness - 0.05);
  }

  behaviorPlaying(environment) {
    if (environment?.wheel) {
      const wheel = environment.wheel;
      const dx = wheel.x - this.x;
      const dy = wheel.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > wheel.radius - 10) {
        this.direction = Math.atan2(dy, dx);
        this.targetSpeed = CONFIG.HAMSTER.SPEED;
      } else {
        this.targetSpeed = CONFIG.HAMSTER.SPEED * 1.5;
        this.direction += 0.1;
        const angle = Math.atan2(this.y - wheel.y, this.x - wheel.x);
        this.x = wheel.x + Math.cos(angle) * (wheel.radius - 5);
        this.y = wheel.y + Math.sin(angle) * (wheel.radius - 5);
      }
    } else {
      this.setState('walking', Utils.random(3000, 6000));
      this.chooseRandomDirection();
    }
  }

  behaviorHiding(environment) {
    if (environment?.tunnel) {
      const tunnel = environment.tunnel;
      const dx = tunnel.x - this.x;
      const dy = tunnel.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 30) {
        this.direction = Math.atan2(dy, dx);
        this.targetSpeed = CONFIG.HAMSTER.SPEED;
      } else {
        this.targetSpeed = 0;
        this.x = tunnel.x;
        this.y = tunnel.y;
      }
    }
  }

  chooseRandomDirection() {
    this.direction = Utils.random(0, Math.PI * 2);
  }

  // 更新移动
  updateMovement(deltaTime) {
    const speedDiff = this.targetSpeed - this.speed;
    this.speed += speedDiff * CONFIG.HAMSTER.ACCELERATION;
    this.speed *= CONFIG.HAMSTER.FRICTION;
    
    this.vx = Math.cos(this.direction) * this.speed;
    this.vy = Math.sin(this.direction) * this.speed;
    
    this.x += this.vx;
    this.y += this.vy;
    
    if (Math.abs(this.vx) > 0.1) {
      this.facingRight = this.vx > 0;
    }
  }

  // 限制在笼子内
  constrainToCage() {
    const cages = [
      { name: 'main', minX: 350, maxX: 650, minY: 350, maxY: 550 },
      { name: 'upper-left', minX: 200, maxX: 400, minY: 150, maxY: 350 },
      { name: 'upper-right', minX: 600, maxX: 800, minY: 150, maxY: 350 },
      { name: 'lower-left', minX: 200, maxX: 400, minY: 450, maxY: 600 },
      { name: 'lower-right', minX: 600, maxX: 800, minY: 450, maxY: 600 },
      { name: 'top-tunnel', minX: 400, maxX: 600, minY: 205, maxY: 245 }
    ];
    
    let currentCage = null;
    for (const cage of cages) {
      if (this.x >= cage.minX && this.x <= cage.maxX && 
          this.y >= cage.minY && this.y <= cage.maxY) {
        currentCage = cage;
        break;
      }
    }
    
    if (!currentCage) {
      let nearestCage = cages[0];
      let minDist = Infinity;
      
      for (const cage of cages) {
        const centerX = (cage.minX + cage.maxX) / 2;
        const centerY = (cage.minY + cage.maxY) / 2;
        const dist = Math.sqrt(Math.pow(this.x - centerX, 2) + Math.pow(this.y - centerY, 2));
        if (dist < minDist) {
          minDist = dist;
          nearestCage = cage;
        }
      }
      
      const centerX = (nearestCage.minX + nearestCage.maxX) / 2;
      const centerY = (nearestCage.minY + nearestCage.maxY) / 2;
      this.x = centerX;
      this.y = centerY;
      return;
    }
    
    const minX = currentCage.minX + this.width / 2;
    const maxX = currentCage.maxX - this.width / 2;
    const minY = currentCage.minY + this.height / 2;
    const maxY = currentCage.maxY - this.height / 2;
    
    let hasLeftOpening = false, hasRightOpening = false;
    let hasTopOpening = false, hasBottomOpening = false;
    
    if (currentCage.name === 'main') {
      // Main Cage Openings
      // Top: Tubes to upper cages
      hasTopOpening = (this.x >= 330 && this.x <= 370) || (this.x >= 630 && this.x <= 670);
      
      // Bottom: Vertical tubes to lower cages
      hasBottomOpening = (this.x >= 330 && this.x <= 370) || (this.x >= 630 && this.x <= 670);
      
      // Left/Right: Upper connections (existing)
      const isUpperPassage = (this.y >= 320 && this.y <= 380);
      
      // NEW: Left/Right Lower connections (overlap areas with lower cages)
      const isLowerPassage = (this.y >= 450); 
      
      hasLeftOpening = isUpperPassage || isLowerPassage;
      hasRightOpening = isUpperPassage || isLowerPassage;

    } else if (currentCage.name === 'upper-left') {
      hasBottomOpening = (this.x >= 330 && this.x <= 370);
      hasRightOpening = (this.y >= 210 && this.y <= 240);
    } else if (currentCage.name === 'upper-right') {
      hasBottomOpening = (this.x >= 630 && this.x <= 670);
      hasLeftOpening = (this.y >= 210 && this.y <= 240);
    } else if (currentCage.name === 'lower-left') {
      hasTopOpening = (this.x >= 330 && this.x <= 370);
      hasRightOpening = true; // Overlap with Main
    } else if (currentCage.name === 'lower-right') {
      hasTopOpening = (this.x >= 630 && this.x <= 670);
      hasLeftOpening = true; // Overlap with Main
    } else if (currentCage.name === 'top-tunnel') {
      hasLeftOpening = true;
      hasRightOpening = true;
    }
    
    if (this.x < minX && !hasLeftOpening) {
      this.x = minX;
      this.direction = Math.PI - this.direction + Utils.random(-0.1, 0.1);
    }
    if (this.x > maxX && !hasRightOpening) {
      this.x = maxX;
      this.direction = Math.PI - this.direction + Utils.random(-0.1, 0.1);
    }
    if (this.y < minY && !hasTopOpening) {
      this.y = minY;
      this.direction = -this.direction + Utils.random(-0.1, 0.1);
    }
    if (this.y > maxY && !hasBottomOpening) {
      this.y = maxY;
      this.direction = -this.direction + Utils.random(-0.1, 0.1);
    }
  }

  updateAnimation(deltaTime) {
    if (this.speed > 0.5) {
      this.animationFrame += this.animationSpeed * deltaTime / 16;
      if (this.animationFrame > 4) {
        this.animationFrame = 0;
      }
    } else {
      this.animationFrame = 0;
    }
  }

  reset() {
    this.x = 500;
    this.y = 450;
    this.vx = 0;
    this.vy = 0;
    this.speed = 0;
    this.hunger = Math.random() * 20;
    this.thirst = Math.random() * 20;
    this.tiredness = 0;
    this.happiness = 100;
    this.state = 'idle';
    this.stateTimer = Math.random() * 2000;
    console.log('🔄 Hamster reset');
  }

  getBounds() {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height / 2,
      width: this.width,
      height: this.height
    };
  }
}
