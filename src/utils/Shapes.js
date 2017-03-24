const Shapes = {

  // draws a simple line-based shield shape
  drawShield: function(context,x,y,size){
    // begin custom shape
    context.beginPath();
    context.moveTo(x+size/2,y);
    context.lineTo(x, y+.15*size)
    context.quadraticCurveTo(x+(size/2 - .3*size), y+(.8*size), x+size/2, y+size)
    context.quadraticCurveTo(x+(size/2 + .3*size), y+(.8*size), x+size,y+(.15*size))
    context.lineTo(x+size/2,y)
    context.closePath();
    // complete custom shape
    context.lineWidth = 1;
    context.fillStyle = 'silver';
    context.fill();
    context.stroke();
  },

  //draws a star to represent the player.  rotation is done to get star point at 0 degrees
  //also draws a "light radius" from fully transparent to black.
  //using globalCompositeOperation = "xor" allows the transparency to show the layer below.
  drawStar: function(ctxTop, x, y, size, ctx, lightRadius){
    ctx.save()
    ctx.translate(x,y)
    ctx.rotate(54 * Math.PI/180)
    ctx.beginPath();
    for (var i = 1; i <= 5;i += 1) {
      ctx.lineTo (size * Math.cos(4 * i * Math.PI / 5), size * Math.sin(4 * i * Math.PI / 5));
    }
    ctx.fill();
    ctx.restore()
  },

  //
  drawGlow: function(ctxTop, x, y, lightRadius){
    ctxTop.globalCompositeOperation = "xor"
    ctxTop.beginPath()
    var gradient = ctxTop.createRadialGradient(x, y, lightRadius, x, y, 0);
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,1)');
    ctxTop.fillStyle = gradient;
    ctxTop.arc(x,y, lightRadius, 0, 2 * Math.PI, true)
    ctxTop.fill()
    ctxTop.closePath()
    ctxTop.globalCompositeOperation = "source-over"
  },

  // a glowing orb
  drawLight: function(ctxTop, x, y, size, lightRadius){
    ctxTop.beginPath()
    var gradient = ctxTop.createRadialGradient(x+size/2, y+size/2, lightRadius, x+size/2, y+size/2, 0);
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(255,255,0,1)');
    ctxTop.fillStyle = gradient;
    ctxTop.arc(x+size/2,y+size/2, size, 0, 2*Math.PI, true)
    ctxTop.fill()
    ctxTop.closePath()
  },

  drawHeart: function(context, x, y, size){
    context.beginPath()
    context.moveTo(x, y+size/4)
    context.arc(x+size/4, y+size/4, size/4, 1 * Math.PI, 2 * Math.PI);
    context.arc(x+size*3/4, y+size/4, size/4, 1 * Math.PI, 2 * Math.PI);
    context.bezierCurveTo( x+size, y+size/2, x+size*7/8, y+size*.8, x+size/2, y+size)
    context.bezierCurveTo(x+size/8, y+size*8/10, x, y+size/2, x, y+size/4)
    context.stroke();
    context.fillStyle ='pink'
    context.fill();
    context.closePath()
  },

  // designed for a 20px block...
  // applied a scale for other block sizes
  drawMonster: function(ctx,x,y,size){
    x=x+4
    y=y+size/3
    let scale = size/20
    //this path is whites of the eyes...fill color used for 'blink  '
    ctx.fillStyle='black'
    ctx.beginPath()
    ctx.fillStyle= Math.random() > .5 ? 'white' : 'transparent'
    ctx.moveTo(x,y)
    ctx.bezierCurveTo(x-(3*scale),y, x-(4*scale),y+(3*scale),x-(4*scale),y+(5*scale))
    ctx.bezierCurveTo(x-(4*scale),y+(7*scale), x-(3*scale),y+(10*scale),x,y+(10*scale))
    ctx.bezierCurveTo(x+(3*scale), y+(10*scale), x+(4*scale),y+(7*scale), x+(4*scale), y+(5*scale))
    ctx.bezierCurveTo(x+(4*scale), y+(3*scale), x+(3*scale), y, x, y)
    ctx.moveTo(x+(12*scale), y)
    ctx.bezierCurveTo(x+(9*scale),y, x+(8*scale),y+(3*scale),x+(8*scale),y+(5*scale))
    ctx.bezierCurveTo(x+(8*scale),y+(7*scale), x+(9*scale),y+(10*scale),x+(12*scale),y+(10*scale))
    ctx.bezierCurveTo(x+(15*scale), y+(10*scale), x+(16*scale),y+(7*scale), x+(16*scale), y+(5*scale))
    ctx.bezierCurveTo(x+(16*scale), y+(3*scale), x+(15*scale), y, x+(12*scale), y)
    ctx.closePath()
    ctx.fill()

    let lookRight = Math.random() > .9 ? 4*scale : 0
    ctx.fillStyle='black'
    ctx.moveTo(x-(2*scale), y+(6*scale))
    ctx.beginPath();
    ctx.arc(x-(2*scale) + lookRight, y+(6*scale), 2, 0, Math.PI * 2, true);  //x-2
    ctx.closePath()
    ctx.fill();
    ctx.moveTo(x+(10*scale), +(6*scale))
    ctx.beginPath();
    ctx.arc(x+(10*scale) + lookRight, y+(6*scale), 2, 0, Math.PI * 2, true);//x+10
    ctx.closePath()
    ctx.fill();

  },

  drawWeapon: function(ctx, x, y, size){
    ctx.fillStyle = 'gold';
    ctx.beginPath();
    ctx.moveTo(x+size/2+size/8, y)
    ctx.lineTo(x+size/4-1, y+size/2+size/8)
    ctx.lineTo(x+size/2-2, y+size/2)
    ctx.lineTo(x+size/4, y+size)
    ctx.lineTo(x+size*3/4+1, y+size/2-size/8)
    ctx.lineTo(x+size/2, y+size/2 )
    ctx.lineTo(x+size/2+size/8, y)
    ctx.closePath()
    ctx.stroke()
    ctx.fill()
  },

  drawFoot: function(ctx, x, y, size){
    ctx.moveTo(x+size/2+size/8, y)
    ctx.beginPath()
    ctx.fillStyle='white'
    ctx.arc(x+2.5, y+3.5, 5, 0, Math.PI * 2, true);
    ctx.moveTo(x+11.5, y+5)
    ctx.arc(x+11.5, y+5, 4, 0, Math.PI * 2, true);
    ctx.moveTo(x+17.5, y+8.5)
    ctx.arc(x+17.5, y+8.5, 3.5, 0, Math.PI * 2, true);
    ctx.moveTo(x+22, y+12)
    ctx.arc(x+22, y+12, 2.5, 0, Math.PI * 2, true);
    ctx.moveTo(x+4, y+17.5)
    ctx.arc(x+8, y+17.5, 8, 0, Math.PI * 2, true);
    ctx.moveTo(x+4, y+28.5)
    ctx.arc(x+8, y+28.5, 6, 0, Math.PI * 2, true);
    ctx.fill()
    ctx.closePath()
  },

  drawBoss: function(ctx, x, y, size){
    let count=1
    for(let i=size/2; i>=2; i=i-2){
      count++
      let style = (count%2 === 0 ? 'red' : 'white')
      ctx.beginPath()
      ctx.fillStyle = style
      ctx.arc(x+size/2,y+size/2, i, 0, 2 * Math.PI, true)
      ctx.fill()
      ctx.closePath()
    }
  },

  drawExit: function(ctx, x, y, size){

  },

  reveal: function(ctxTop, width, height){
    let time = new Date()
    let maxRadius = ( width >  height ? width : height)
    let step = maxRadius/40
    let radius = 0
    ctxTop.globalCompositeOperation = "destination-out"
    let t=window.setInterval(
      function(){
        ctxTop.beginPath()
        var gradient = ctxTop.createRadialGradient(width/2, height/2, radius, width/2, height/2, 0);
        gradient.addColorStop(0, 'rgba(0,0,0,1)');
        gradient.addColorStop(1, 'rgba(0,0,0,1)');
        ctxTop.fillStyle = gradient;
        ctxTop.arc(width/2,width/2, radius, 0, 2 * Math.PI, true)
        ctxTop.fill()
        ctxTop.closePath()
        radius += step
    },50)
    window.setTimeout( function(){
      window.clearInterval(t)
    }, 2000)
  }
}

export default Shapes
