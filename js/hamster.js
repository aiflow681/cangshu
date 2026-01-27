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
    this.stateTimer = 0;
    this.hunger = 0;
    this.thirst = 0;
    this.tiredness = 0;
    this.happiness = 100;
    this.animationFrame = 0;
    this.animationSpeed = 0.1;
    this.facingRight = true;
    this.lastX = x;
    this.lastY = y;
    this.stuckCounter = 0;
    
    console.log('🐹 Hamster created at', x, y);
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
        console.log('🚨 Hamster was stuck, returning home');
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
      this.happiness = Math.max(0, this.happiness - 0.01 * deltaTime);
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
    if (this.hunger > 50 && environment?.foodBowl?.hasFood()) {
      this.setState('eating', 3000);
      return;
    }
    
    if (this.thirst > 50 && environment?.waterBottle?.hasWater()) {
      this.setState('drinking', 3000);
      return;
    }
    
    if (this.tiredness > 70) {
      this.setState('sleeping', 5000);
      return;
    }
    
    if (this.tiredness < 30 && Math.random() < 0.08 && environment?.wheel) {
      this.setState('playing', Utils.random(3000, 5000));
      return;
    }
    
    if (Math.random() < 0.05 && environment?.tunnel) {
      this.setState('hiding', Utils.random(4000, 8000));
      return;
    }
    
    if (Math.random() < 0.8) {
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
      const dx = bowl.x - this.x;
      const dy = bowl.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 50) {
        this.direction = Math.atan2(dy, dx);
        this.targetSpeed = CONFIG.HAMSTER.SPEED;
      } else {
        this.targetSpeed = 0;
        if (bowl.eat()) {
          this.hunger = Math.max(0, this.hunger - 0.5);
        }
      }
    }
  }

  behaviorDrinking(environment) {
    if (environment?.waterBottle) {
      const bottle = environment.waterBottle;
      const dx = bottle.x - this.x;
      const dy = bottle.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 50) {
        this.direction = Math.atan2(dy, dx);
        this.targetSpeed = CONFIG.HAMSTER.SPEED;
      } else {
        this.targetSpeed = 0;
        if (bottle.drink()) {
          this.thirst = Math.max(0, this.thirst - 0.3);
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
      { name: 'upper-left', minX: 200, maxX: 400, minY: 150, maxY: 300 },
      { name: 'upper-right', minX: 600, maxX: 800, minY: 150, maxY: 300 },
      { name: 'lower-left', minX: 200, maxX: 400, minY: 450, maxY: 600 },
      { name: 'lower-right', minX: 600, maxX: 800, minY: 450, maxY: 600 }
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
      hasLeftOpening = (this.y >= 320 && this.y <= 380);
      hasRightOpening = (this.y >= 320 && this.y <= 380);
    } else if (currentCage.name === 'upper-left') {
      hasBottomOpening = (this.x >= 330 && this.x <= 370);
      hasRightOpening = (this.y >= 210 && this.y <= 240);
    } else if (currentCage.name === 'upper-right') {
      hasBottomOpening = (this.x >= 630 && this.x <= 670);
      hasLeftOpening = (this.y >= 210 && this.y <= 240);
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
    this.hunger = 0;
    this.thirst = 0;
    this.tiredness = 0;
    this.happiness = 100;
    this.state = 'idle';
    this.stateTimer = 1000;
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
