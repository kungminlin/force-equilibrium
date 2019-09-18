const CANVAS_SIZE = 400;

var canvas = document.getElementById("diagram");
var ctx = canvas.getContext("2d");
setInterval(() => update(), 50)

M.AutoInit();

var forces = [];

$(document).ready(function() {
  $(document)
    .on('keyup', 'input[name="force"]', (e) => {
      $(e.target).closest('.force').siblings('.weight').find('input[name="weight"]').val(Math.round($(e.target).val()*1000*1000/9.8)/1000);
      M.updateTextFields();
    })

    .on('keyup', 'input[name="weight"]', (e) => {
      $(e.target).closest('.weight').siblings('.force').find('input[name="force"]').val(Math.round($(e.target).val()*1000*9.8/1000)/1000);
      M.updateTextFields();
    })

    .on('mousemove keydown keyup', (e) => {
      $('input[name="angle"]').closest('div').find('.deg-display').text($('input[name="angle"]').val());
    })

    .on('click', '.delete', (e) => {
      $(e.target).closest('li').remove();
    })

  addForceEntry("Force 1", 70, 60);
  addForceEntry("Force 2", 80, 120);
  addForceEntry("Force 3", 90, 210);
})

function update() {
  clear();

  let eforce = new Force('equilibrium force', 0, 0);

  forces.forEach((force) => {
    let $input = $(`li[data-name='${force.name}']`);
    let newtons = parseFloat($input.find('input[name="force"]').val()=="" ? 0 : $input.find('input[name="force"]').val());
    let angle = parseFloat($input.find('input[name="angle"]').val()=="" ? 0 : $input.find('input[name="angle"]').val());
    force.update(newtons, angle);

    eforce.vector.x -= force.vector.x;
    eforce.vector.y -= force.vector.y;

    force.vector.draw();
  })

  $('#equilibrium-force').text(`Equilibrium Force: ${eforce.force} N @ ${eforce.angle} deg`);

  eforce.vector.draw();
}

function clear() {
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
}

function addForceEntry(name, force, angle) {
  if (!name) var name = prompt('The name of this force:');
  if (!name) return;
  if (forces.filter(f => f.name == name).length > 0) {
    alert('That force already exists!');
    return;
  }

  var $entry = $(`<li data-name="${name}"><div class="collapsible-header"><i class="delete material-icons red-text text-darken-1">cancel</i>${name}</div><div class="collapsible-body"><div class="row"><div class="force input-field col s6"><input name="force" type="number" value=0><label for="force">Force (N)</label></div><div class="weight input-field col s6"><input name="weight" type="number" value=0><label for="force">Weight (g)</label></div><div><label>Angle (deg) - <span class="deg-display"></span></label><p class="range-field"><input name="angle" type="range" min=0 max=360></p></div></div></div></li>`)

  if (force) $entry.find('input[name="force"]').val(force);
  if (angle) $entry.find('input[name="angle"]').val(angle);

  $entry.appendTo('#forces');
  $entry.find('input[name="force"]').keyup();

  addForce(name, force ? force : 0, angle ? angle : 0);
}

function addForce(name, force, angle) {
  forces.push(new Force(name, force, angle));
}

class Force {
  constructor(name, force, angle) {
    this._name = name;
    this._force = force;
    this._angle = angle;
    let rad = angle*Math.PI/180;
    this._vector = new Vector(name, force*Math.cos(rad), force*Math.sin(rad));
  }
  get name() { return this._name; }
  get force() { return this._force; }
  get angle() { return this._angle; }
  get vector() { return this._vector; }

  update(force, angle) {
    this._force = force;
    this._angle = angle;
    let rad = angle*Math.PI/180;
    this._vector.x = force*Math.cos(rad);
    this._vector.y = force*Math.sin(rad);
  }
}

class Vector {
  constructor(name, x, y) {
    this.name = name;
    this._x = x;
    this._y = y;
  }

  draw() {
    let x = this.x+(CANVAS_SIZE/2);
    let y = -this.y+(CANVAS_SIZE/2);
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.fillStyle = "#000000";
    ctx.fill();
    ctx.strokeStyle = "#000000";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(CANVAS_SIZE/2, CANVAS_SIZE/2);
    ctx.lineTo(x, y);
    ctx.stroke();

    ctx.font = "10px Arial";
    ctx.fillText(this.name, x+5, y+5);
    ctx.fillText(`(${Math.round(this.x*100)/100}, ${Math.round(this.y*100)/100})`, x+5, y+15);
  }

  get x() { return this._x; }
  get y() { return this._y; }
  get angle() { return Math.atan2(this._y, this._x); }
  get magnitude() { return Math.sqrt(this._x**2 + this._y**2); }

  set x(x) { this._x = x; }
  set y(y) { this._y = y; }
}
