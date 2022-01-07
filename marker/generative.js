const {Canvas} = require('skia-canvas');

const w = 150;		//Width of marker image
const h = 110;		//Height of marker image

//Just some polar functions to convert x/y into radius/angle
function polar_x(radius, angle) {return(radius * Math.cos(Math.PI/180*angle + Math.PI/180*270));}
function polar_y(radius, angle) {return(radius * Math.sin(Math.PI/180*angle + Math.PI/180*270));}

const seed = function(s) {
	return function() {
			s = Math.sin(s) * 10000; return s - Math.floor(s);
	};
};

let random = seed(1);

module.exports = async (req, res) => {
	if (req.params.seed) {
		random = seed(parseInt(req.params.seed));
	}

  const canvas1 = new Canvas(w, h);
  const ctx1 = canvas1.getContext('2d');

  const canvas2 = new Canvas(w, h);
  const ctx2 = canvas2.getContext('2d');

  ctx1.strokeStyle = "rgba(0, 0, 0, 0.5)";
	ctx1.lineJoin = "round";
	ctx1.lineCap = "round";
	ctx1.lineWidth = 0.5;

	ctx1.save();	
	ctx1.translate(50,50);

	ctx1.beginPath();
	ctx1.moveTo(polar_x(20, 0), polar_y(20, 0));
	ctx1.fillStyle = "rgba(255,255,255,1)";
	ctx1.lineTo(polar_x(20, 60),  polar_y(20, 60));
	ctx1.lineTo(polar_x(20, 120), polar_y(20, 120));
	ctx1.lineTo(polar_x(30, 180), polar_y(30, 180));
	ctx1.lineTo(polar_x(20, 240), polar_y(20, 240));
	ctx1.lineTo(polar_x(20, 300), polar_y(20, 300));
	ctx1.lineTo(polar_x(20, 360), polar_y(20, 360));
	ctx1.closePath();
	ctx1.fill();
	ctx1.stroke();

	ctx1.beginPath();
	ctx1.moveTo(polar_x(20, 0), polar_y(20, 0));
	ctx1.fillStyle = "rgba(255,0,0,0.2)";
	ctx1.lineTo(polar_x(20, 60),  polar_y(20, 60));
	ctx1.lineTo(polar_x(20, 120), polar_y(20, 120));
	ctx1.lineTo(polar_x(30, 180), polar_y(30, 180));
	ctx1.lineTo(polar_x(20, 240), polar_y(20, 240));
	ctx1.lineTo(polar_x(20, 300), polar_y(20, 300));
	ctx1.lineTo(polar_x(20, 360), polar_y(20, 360));
	ctx1.closePath();
	ctx1.fill();

	for (let i = 0; i<10; i++) {
		ctx1.fillStyle = "rgba("+Math.round(random()*255)+","+Math.round(random()*255)+","+Math.round(random()*255)+","+random()/2+")";
		var cr = 20;
		ctx1.beginPath();
		var a = Math.round(random()*6)*60;
		if(a==180){cr=30;}else{cr=20;}
		ctx1.moveTo(polar_x(cr, a), polar_y(cr, a));
		var a1 = a+60;
		if(a1>360){a1 -= 360;}
		if(a1==180){cr=30;}else{cr=20;}
		ctx1.lineTo(polar_x(cr, a1), polar_y(cr, a1));
		var a2 = a1+180;
		if(a2 > 360){a2 -= 360;}
		if(a2==180){cr=30;}else{cr=20;}
		ctx1.lineTo(polar_x(cr, a2), polar_y(cr, a2));
		ctx1.closePath();
		ctx1.fill();
	}

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