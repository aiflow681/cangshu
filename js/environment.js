// 环境类
class Environment {
  constructor() {
    this.foodBowl = new FoodBowl();
    this.waterBottle = new WaterBottle();
    this.wheel = new ExerciseWheel();
    this.tunnel = new Tunnel();
  }

  update(deltaTime, hamster) {
    this.foodBowl.update(deltaTime);
    this.waterBottle.update(deltaTime);
    this.wheel.update(deltaTime, hamster);
    this.tunnel.update(deltaTime, hamster);
  }

  reset() {
    this.foodBowl.reset();
    this.waterBottle.reset();
    this.wheel.reset();
    this.tunnel.reset();
  }
}

// 食物碗类
class FoodBowl {
  constructor() {
    this.x = CONFIG.FOOD_BOWL.X;
    this.y = CONFIG.FOOD_BOWL.Y;
    this.width = CONFIG.FOOD_BOWL.WIDTH;
    this.height = CONFIG.FOOD_BOWL.HEIGHT;
    this.foodLevel = CONFIG.FOOD_BOWL.MAX_FOOD;
    this.maxFood = CONFIG.FOOD_BOWL.MAX_FOOD;
  }

  update(deltaTime) {}

  feed() {
    this.foodLevel = Math.min(this.maxFood, this.foodLevel + CONFIG.FOOD_BOWL.FEED_AMOUNT);
  }

  eat() {
    if (this.foodLevel > 0) {
      this.foodLevel = Math.max(0, this.foodLevel - CONFIG.FOOD_BOWL.EAT_AMOUNT);
      return true;
    }
    return false;
  }

  hasFood() {
    return this.foodLevel > 10;
  }

  reset() {
    this.foodLevel = this.maxFood;
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

// 水瓶类
class WaterBottle {
  constructor() {
    this.x = CONFIG.WATER_BOTTLE.X;
    this.y = CONFIG.WATER_BOTTLE.Y;
    this.width = CONFIG.WATER_BOTTLE.WIDTH;
    this.height = CONFIG.WATER_BOTTLE.HEIGHT;
    this.waterLevel = CONFIG.WATER_BOTTLE.MAX_WATER;
    this.maxWater = CONFIG.WATER_BOTTLE.MAX_WATER;
  }

  update(deltaTime) {}

  fill() {
    this.waterLevel = Math.min(this.maxWater, this.waterLevel + CONFIG.WATER_BOTTLE.FILL_AMOUNT);
  }

  drink() {
    if (this.waterLevel > 0) {
      this.waterLevel = Math.max(0, this.waterLevel - CONFIG.WATER_BOTTLE.DRINK_AMOUNT);
      return true;
    }
    return false;
  }

  hasWater() {
    return this.waterLevel > 10;
  }

  reset() {
    this.waterLevel = this.maxWater;
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

// 跑轮类
class ExerciseWheel {
  constructor() {
    this.x = CONFIG.WHEEL.X;
    this.y = CONFIG.WHEEL.Y;
    this.radius = CONFIG.WHEEL.RADIUS;
    this.rotation = 0;
    this.rotationSpeed = 0;
    this.isHamsterOn = false;
  }

  update(deltaTime, hamster) {
    const distance = Utils.distance(hamster.x, hamster.y, this.x, this.y);
    this.isHamsterOn = distance < this.radius;
    
    if (this.isHamsterOn && hamster.speed > 0.5) {
      this.rotationSpeed = CONFIG.WHEEL.ROTATION_SPEED * hamster.speed;
      hamster.tiredness = Math.max(0, hamster.tiredness - 0.02);
      hamster.happiness = Math.min(100, hamster.happiness + 0.01);
    } else {
      this.rotationSpeed *= 0.95;
    }
    
    this.rotation += this.rotationSpeed;
    if (this.rotation > Math.PI * 2) {
      this.rotation -= Math.PI * 2;
    }
  }

  reset() {
    this.rotation = 0;
    this.rotationSpeed = 0;
    this.isHamsterOn = false;
  }

  getBounds() {
    return {
      x: this.x - this.radius,
      y: this.y - this.radius,
      width: this.radius * 2,
      height: this.radius * 2
    };
  }

  containsPoint(x, y) {
    return Utils.distance(x, y, this.x, this.y) <= this.radius;
  }
}

// 隧道类
class Tunnel {
  constructor() {
    this.x = CONFIG.TUNNEL.X;
    this.y = CONFIG.TUNNEL.Y;
    this.width = CONFIG.TUNNEL.WIDTH;
    this.height = CONFIG.TUNNEL.HEIGHT;
    this.hamsterInside = false;
    this.hideTimer = 0;
  }

  update(deltaTime, hamster) {
    const distance = Utils.distance(hamster.x, hamster.y, this.x, this.y);
    
    if (distance < this.width / 2 && hamster.state === 'hiding') {
      this.hamsterInside = true;
      this.hideTimer += deltaTime;
      hamster.happiness = Math.min(100, hamster.happiness + 0.02);
      hamster.x = this.x;
      hamster.y = this.y;
      hamster.speed = 0;
    } else {
      this.hamsterInside = false;
    }
  }

  reset() {
    this.hamsterInside = false;
    this.hideTimer = 0;
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
