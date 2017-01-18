var EnvelopeGenerator = function(context) {
  this.attackTime = 0.1;
  this.releaseTime = 0.1;

  return this;
}
EnvelopeGenerator.prototype.trigger = function() {
  now = context.currentTime;
  this.param.cancelScheduledValues(now);
  this.param.setValueAtTime(0, now);
  this.param.linearRampToValueAtTime(1, now + this.attackTime);
  this.param.linearRampToValueAtTime(0, now + this.attackTime + this.releaseTime);
}
EnvelopeGenerator.prototype.connect = function(param) {
  this.param = param;
}

EffectChannel = function(context) {
  this.context = context;
  this.gain = context.createGain();
  this.gain.gain.value = 0;
  this.gain.connect(this.context.destination);

  return this;
}
EffectChannel.prototype.start = function() {
  var now = this.context.currentTime;
  this.gain.gain.linearRampToValueAtTime(0, now);
  this.gain.gain.linearRampToValueAtTime(0.1, now + 0.01);
  this.osc = this.context.createOscillator();
  this.osc.connect(this.gain);
  this.osc.start();
}
EffectChannel.prototype.stop = function(delay) {
  this.osc.stop(delay);
}
EffectChannel.prototype.startBolt = function() {
  this.start();
  var now = this.context.currentTime;
  this.osc.frequency.linearRampToValueAtTime(1200, now);
  this.osc.frequency.linearRampToValueAtTime(400, now + 0.1);
  this.gain.gain.linearRampToValueAtTime(0.1, now + 0.1);
  this.gain.gain.linearRampToValueAtTime(0, now + 0.11);
  this.stop(now + 0.11);
}

gAudio = (function(context) {
  return {
    // context: context,
    eChan1: new EffectChannel(context)
  }
})(new AudioContext());
