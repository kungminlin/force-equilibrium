const CANVAS_SIZE = 400;

var canvas = document.getElementById("diagram");
var ctx = canvas.getContext("2d");
point(0, 0);
point(50, 50);
update();

$(document).ready(function() {
  $(document).mousemove(() => {update();})
})

function update() {
  clear();

  $("#force1").text($("#force-1-weight").val() + "N or " + Math.round(parseFloat($("#force-1-weight").val())*1000/9.8, 2) + "g @ " + $("#force-1-angle").val() + "deg");
  $("#force2").text($("#force-2-weight").val() + "N or " + Math.round(parseFloat($("#force-2-weight").val())*1000/9.8, 2) + "g @ " + $("#force-2-angle").val() + "deg");

  force1_weight = parseFloat($("#force-1-weight").val())/5;
  force1_angle = parseFloat($("#force-1-angle").val())*Math.PI/180;
  force2_weight = parseFloat($("#force-2-weight").val())/5;
  force2_angle = parseFloat($("#force-2-angle").val())*Math.PI/180;
  force1_x = force1_weight*Math.cos(force1_angle);
  force1_y = force1_weight*Math.sin(force1_angle);
  force2_x = force2_weight*Math.cos(force2_angle);
  force2_y = force2_weight*Math.sin(force2_angle);

  point(force1_x, force1_y, "blue");
  point(force2_x, force2_y, "red");

  force3_x = force1_weight*Math.cos(force1_angle) + force2_weight*Math.cos(force2_angle);
  force3_y = force1_weight*Math.sin(force1_angle) + force2_weight*Math.sin(force2_angle);

  point(-force3_x, -force3_y, "green");
  $("#force3").text(Math.round(Math.sqrt(force3_x**2 + force3_y**2)*5, 2) + "N or " + Math.round(Math.sqrt(force3_x**2 + force3_y**2)*5*1000/9.8, 2) + "g @ " + Math.round((Math.atan2(-force3_y, -force3_x)*180/Math.PI) < 0 ? Math.abs(Math.atan2(-force3_y, -force3_x)*180/Math.PI) : 360 - (Math.atan2(-force3_y, -force3_x)*180/Math.PI), 2) + "deg");

  $("#force1_xy").text("x: " + Math.round(force1_x*5) + ", y: " + -Math.round(force1_y*5));
  $("#force2_xy").text("x: " + Math.round(force2_x*5) + ", y: " + -Math.round(force2_y*5));
  $("#force3_xy").text("x: " + Math.round(force3_x*5) + ", y: " + Math.round(force3_y*5));
}

function point(x, y, color) {
  ctx.beginPath();
  ctx.arc(x+(CANVAS_SIZE/2), y+(CANVAS_SIZE/2), 3, 0, 2 * Math.PI);
  ctx.fillStyle = color ? color : "#000000";
  ctx.fill();
  ctx.strokeStyle = color ? color: "#000000";
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(CANVAS_SIZE/2, CANVAS_SIZE/2);
  ctx.lineTo(x+(CANVAS_SIZE/2), y+(CANVAS_SIZE/2));
  ctx.stroke();
}

function clear() {
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
}
