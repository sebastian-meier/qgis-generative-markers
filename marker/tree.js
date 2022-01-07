const {Canvas} = require('skia-canvas');

function drawBranch(x, y, angle, level, ctx){
	if(tAmount < fullAmount){
		ctx.beginPath();
		ctx.lineWidth = (max_level+1 - level)/line_multiply;
		ctx.moveTo(x, y);
		const b_angle = ((level*-angle_range)/2) - angle;
		const r_angle = Math.random()*(level*angle_range);

		const t_angle = (b_angle + r_angle);

		const r = radius/level * 0.5 + radius/level * 0.5 * Math.random();

		const px = polar_x(r, t_angle) + x;
		const py = polar_y(r, t_angle) + y;

		ctx.lineTo(px, py);
		ctx.stroke();

		if (level == 1) {

      const root = Math.random()*max_level*0.5 + max_level*0.5;
			ctx.beginPath();
			ctx.fillStyle = 'black';
			ctx.moveTo(px, py);
			ctx.lineTo(x+root, y);
      ctx.arc(x, y, root, Math.PI, 2*Math.PI, true);	
			ctx.lineTo(px, py);
			ctx.fill();

      /*
      // Root system for the tree
      ctx.fillStyle = 'rgba(0,0,0,0)';
      const root_amount = Math.random()*5+5;
      let tpx, tpy, tr;
      ctx.lineWidth = 1;
      for (let i = 0; i < root_amount; i++) {
        tr = root+Math.random()*3+i*1.5;
        tpx = polar_x(tr, 180-(90/root_amount)*i) + x;
        tpy = polar_y(tr, 180-(90/root_amount)*i) + y;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(tpx, tpy);
        ctx.stroke();

        tr = root+Math.random()*3+i*1.5;
        tpx = polar_x(tr, 180+(90/root_amount)*i) + x;
        tpy = polar_y(tr, 180+(90/root_amount)*i) + y;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(tpx, tpy);
        ctx.stroke();
      }
      */
		}

		let leafDraw = false;
		if (level < max_level) {
			for (let i = 0; i < multiply; i++) {
				if (tAmount < fullAmount) {
					drawBranch(px, py, 0, level+1, ctx);
				} else {
					if (!leafDraw) {
						drawLeaf(px, py, ctx);		
						leafDraw = true;
					}
				}
			}
		} else {
			drawLeaf(px, py, ctx);
		}
	} else {
		off++;
		drawLeaf(x, y, ctx);
	}
}

function drawLeaf(x, y, ctx){
	if (tAmount < fullAmount) {
		tAmount++;

    // bigger leafs for trees with less leafs
    let leafImgSize = 10;
    if (fullAmount < 10) {
      leafImgSize = 10 + (5 - fullAmount / 2) * 2;
    }

		ctx.save(); 
		ctx.translate(x, y); 
		ctx.rotate( -0.5 + Math.random() );
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(leafImgSize / 2, -leafImgSize/2, leafImgSize, 0);
    ctx.quadraticCurveTo(leafImgSize / 2, leafImgSize/2, 0, 0);
    ctx.fillStyle = 'green';
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'rgba(0,0,0,0)';
		ctx.restore();
  }
}

const w = 150;
const h = 110;
const radius = 35;
const angle_range = 35;
const max_level = 7;
let multiply = 3;
const line_multiply = 4;
let fullAmount = 0;
let tAmount = 0;
let leaf_amount = 0;
let off = 0;

function polar_x(radius, angle) {
	return(radius * Math.cos(Math.PI/180*angle + Math.PI/180*270));
}

function polar_y(radius, angle) {
	return(radius * Math.sin(Math.PI/180*angle + Math.PI/180*270));
}

module.exports = async (req, res) => {
  const amount = parseInt(req.params.param);

  const canvas1 = new Canvas(w, h);
  ctx1 = canvas1.getContext('2d');

  const canvas2 = new Canvas(w, h);
  ctx2 = canvas2.getContext('2d');

  leaf_amount = 0;
	off = 0;
	fullAmount = amount;
	tAmount = 0;
	let end = 0;
	let tmulti = 0;
	while(end < amount){
		tmulti++;
		end = Math.pow(tmulti, max_level-1);
	}
	multiply = tmulti;

	ctx1.strokeStyle = "rgba(0, 0, 0, 1)";
	ctx1.lineJoin = "round";
	ctx1.lineCap = "round";

	ctx1.save();
	drawBranch(50, 100, 0, 1, ctx1);
	ctx1.restore();

	ctx2.save();
  ctx2.transform(1,0,-1.5,1,0,0);
  ctx2.filter = 'grayscale(100%) contrast(0%) blur(5px) opacity(75%)';
	ctx2.drawImage(canvas1, 173, 51, 100, 55);
  ctx2.filter = 'none';
	ctx2.restore();
	ctx2.drawImage(canvas1, 0, 0);

  const buffer = await canvas2.toBuffer('image/png');

  res.setHeader('Content-Type', 'image/png');
	res.end(buffer, 'binary');
};