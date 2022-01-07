const {Canvas} = require('skia-canvas');

var w = 150;
var h = 110;

// define the donut
var cX = 50;
var cY = 50;
var radius = Math.min(cX,cY)*.75;

// colors to use for each datapoint
var colors=[];
colors.push("teal");
colors.push("rgb(165,42,42)");
colors.push("purple");
colors.push("green");
colors.push("cyan");
colors.push("gold");

function polar_x(radius, angle) {return (radius * Math.cos(angle));}
function polar_y(radius, angle) {return (radius * Math.sin(angle));}

// draw a wedge
function drawWedge(percent, color, ctx, start) {
	// calc size of our wedge in radians
	var WedgeInRadians = percent/100*360 * Math.PI/180;
	// draw the wedge
	ctx.save();
	ctx.beginPath();
  ctx.moveTo(cX + polar_x(radius, start), cY + polar_y(radius, start));
	ctx.arc(cX, cY, radius, start, start+WedgeInRadians, false);
  ctx.lineTo(cX + polar_x(radius / 2, start + WedgeInRadians), cY + polar_y(radius / 2, start + WedgeInRadians));
	ctx.arc(cX, cY, radius/2, start+WedgeInRadians, start , true);
	ctx.lineTo(cX + polar_x(radius, start), cY + polar_y(radius, start));
	ctx.fillStyle = color;
  ctx.strokeStyle = 'black';
  ctx.stroke();
	ctx.fill();
	ctx.restore();

  // sum the size of all wedges so far
	// We will begin our next wedge at this sum
	return start+WedgeInRadians;
}

// draw the donut one wedge at a time
function drawDonut(ctx, data){
  let start = 0;
	for (let i = 0; i < data.length; i++) {
	  start = drawWedge(data[i], colors[i], ctx, start);
	}
}

module.exports = async (req, res) => {
  const data = req.params.values.split(',');

  const canvas1 = new Canvas(w, h);
  const ctx1 = canvas1.getContext('2d');

  const canvas2 = new Canvas(w, h);
  const ctx2 = canvas2.getContext('2d');

  ctx1.save();
  drawDonut(ctx1, data);
	ctx1.restore();

  ctx2.save();
  ctx2.transform(1,0,-1.5,1,0,0);
  ctx2.filter = 'grayscale(100%) contrast(0%) blur(5px) opacity(75%)';
	ctx2.drawImage(canvas1, 173, 51, 100, 55);
  ctx2.filter = 'none';
	ctx2.restore();
	ctx2.drawImage(canvas1, 15, 12);

	const buffer = await canvas2.toBuffer('image/png');

  res.setHeader('Content-Type', 'image/png');
	res.end(buffer, 'binary');
};