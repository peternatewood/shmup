Bolt = function(x, y, rad) {
  this.x = x + (PLAYER_RADIUS * Math.cos(rad));
  this.y = y + (PLAYER_RADIUS * Math.sin(rad));
  this.rad = rad;
  this.xVel = 28 * Math.cos(this.rad);
  this.yVel = 28 * Math.sin(this.rad);
  this.life = 4;
  this.dying = false;
  this.size = 14;

  return this;
}
Bolt.delay = 140;
Bolt.prototype.update = function() {
  if (! this.dying) {
    this.x += this.xVel;
    this.y += this.yVel;
  }
}
Bolt.prototype.collide = function(other) {
  var rayToCenter = Math.sqrt(Math.pow(other.x - this.x, 2) + Math.pow(other.y - this.y, 2));
  var collide = rayToCenter < this.size;

  if (!collide) {
    var lastX = this.x - this.xVel;
    var lastY = this.y - this.yVel;
    var lastRay = Math.sqrt(Math.pow(lastX - this.x, 2) + Math.pow(lastY - this.y, 2));
    collide = Math.sqrt(Math.pow(rayToCenter, 2) + Math.pow(lastRay)) < this.size;
  }

  if (collide) {
    this.x = other.x;
    this.y = other.y;
    this.dying = true;
    if (other.life > 1 && this.life == 4) other.life--;
  }

  return collide;
}
Bolt.prototype.render = function() {
  var x = this.x - gCamera.x;
  var y = this.y - gCamera.y;

  if (gCamera.isInView(this)) {
    switch (this.life) {
      case 4:
        renderPath([
          ['moveTo', x + (4 * Math.cos(this.rad)), y + (4 * Math.sin(this.rad))],
          ['lineTo', x + (4 * Math.cos(this.rad + (Math.PI / 2))), y + (4 * Math.sin(this.rad + (Math.PI / 2)))],
          ['lineTo', x + (8 * Math.cos(this.rad + Math.PI)), y + (8 * Math.sin(this.rad + Math.PI))],
          ['lineTo', x + (4 * Math.cos(this.rad - (Math.PI / 2))), y + (4 * Math.sin(this.rad - (Math.PI / 2)))],
        ], true);
        break;
      case 3:
      case 2:
      case 1:
        renderPath([
          ['moveTo', x + (3 * (4 - this.life)), y],
          ['arc', x + (3 * (4 - this.life)), y, 1 * this.life, 0, Math.PI * 2],
          ['moveTo', x, y - (3 * (4 - this.life))],
          ['arc', x, y - (3 * (4 - this.life)), 1 * this.life, 0, Math.PI * 2],
          ['moveTo', x - (3 * (4 - this.life)), y],
          ['arc', x - (3 * (4 - this.life)), y, 1 * this.life, 0, Math.PI * 2],
          ['moveTo', x, y + (3 * (4 - this.life))],
          ['arc', x, y + (3 * (4 - this.life)), 1 * this.life, 0, Math.PI * 2],
        ], true);
        break;
    }

    stroke('#F88', 2);
    fill('#FFF');
  }
  if (this.dying) this.life--;
}
