class G{
    static makeCanvas(w=0,h=0){
        let c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        c.ctx = c.getContext('2d');
        return c;
    }
    static fuseImage(canvas,canvas2,composite = 'source-atop'){
        let buffer = G.makeCanvas(canvas.width,canvas.height);
        let ctx = buffer.ctx;
        ctx.drawImage(canvas,0,0);
        ctx.globalCompositeOperation = composite;
        for(let i = 0 ; i < canvas.width/canvas2.width;i++){
            for(let j = 0 ; j < canvas.height/canvas2.height;j++){
                ctx.drawImage(canvas2,i * canvas2.width,j * canvas2.height);
            }
        }
        return buffer;
    }
    static getFontSprite(word,size,color,fuseImage,family = 'Arial',w=0,h=0){
        let ctx = G.makeCanvas(1, 1).ctx; // Create a temporary canvas context
        ctx.font = size + "px "+family;
        const textWidth = w || ctx.measureText(word).width || 1;
        const textHeight = h ||size+2; 
        let canvas = G.makeCanvas(parseInt(textWidth), textHeight);
        ctx = canvas.ctx;
        ctx.font = size + "px "+family;
        ctx.fillStyle = color;
        ctx.fillText(word,0, size-2);
        if (fuseImage) {
            canvas = G.fuseImage(canvas, fuseImage);
        }
        var c2 = G.makeCanvas(canvas.width,canvas.height);
        var cx2 = c2.ctx;
        cx2.fillStyle = '#ffffff';
        // cx2.fillRect(0,0,c2.width,c2.height);
        cx2.drawImage(canvas,0,0);
        return c2;
    }
    static centerTo(canvas,w,h){
        var c2 = G.makeCanvas(w,h);
        c2.ctx.drawImage(canvas,
            w/2 - canvas.width/2,
            h/2 - canvas.height/2,
            );
        return c2;
    }
    static gridBG(color1 = "lightgrey",color2 = null, scale = 8, width=1){
        var canvas = G.makeCanvas(scale,scale);
        var ctx = canvas.ctx;
        ctx.fillStyle = color1;
        ctx.fillRect(0,0,scale,scale);
        if(color2 == null){
            ctx.clearRect(0,0,scale-width,scale-width);
        }
        else{
            ctx.fillStyle = color2;
            ctx.fillRect(0,0,scale-width,scale-width);
        }
        return canvas;
        // const base64Image = canvas.toDataURL();
        // document.body.style.backgroundImage = `url(${base64Image})`;
    }
    static brickPattern(color1 = "#fff",color2 = "#000"){
        var canvas = G.makeCanvas(8,8);
        var ctx = canvas.ctx;
        ctx.fillStyle = color1;
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = color2;
        ctx.fillRect(7,0,1,4);
        ctx.fillRect(0,3,8,1);
        ctx.fillRect(4,4,1,4);
        ctx.fillRect(0,7,8,1);
        return canvas;
    }
    static gridToFull(c,w,h,border = null, bg=null){
        var b = G.makeCanvas(w,h);
        var cw = c.width;
        var ch = c.height;
        if(bg!= null){
            b.ctx.fillStyle = bg;
            b.ctx.fillRect(0,0,b.width,b.height);
        }
        if(border!= null){
            b.ctx.fillStyle = border;
            b.ctx.fillRect(0,0,b.width,b.height);
            b.ctx.clearRect(1,1,b.width-2,b.height-2);
        }
        for(let i = 0 ; i < w/cw;i++){
            for(let j = 0 ; j < h/ch;j++){
                b.ctx.drawImage(c,i*cw,j*ch);
            }
        }
        return b;
    }
    static merge(list,w,h){
        var c = G.makeCanvas(w,h);
        for(let i in list){
            c.ctx.drawImage(list[i],0,0);
        }
        return c;
    }
    static rand (a=1, b=0){ return b + (a-b)*Math.random();}
    static randInt (a=1, b=0){ return G.rand(a,b)|0;}
    static randomColor() {return '#' + Math.floor(Math.random()*16777215).toString(16);}
    static shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // Generate random index
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
        return array;
    }
    static makeDom(html){
        var h = document.createElement('div');
        h.innerHTML = html;
        return h.firstChild;
    }
}
const TileSize = 20;
const COl0 = "#8d8d88";
const COl1 = "#e7e7e7";
const COl2 = "#000000";
const COl3 = "red";
const COl4 = "#ffffff";
class TetrisBox{
    constructor(pos){
        this.x = pos.x;
        this.y = pos.y;
    }
    draw(ctx){
        var s = this.GetSprite();
        ctx.drawImage(s,this.x,this.y);
    }
    GetSprite(){
        if(TetrisBox.BOX) return TetrisBox.BOX;
        var c = G.makeCanvas(TileSize,TileSize);
        c.ctx.fillStyle = COl3;
        c.ctx.fillRect(0,0,c.width,c.height);
        c.ctx.clearRect(1,1,c.width-2,c.height-2);
        c.ctx.fillRect(3,3,c.width-6,c.height-6);
        TetrisBox.BOX = c;
        return TetrisBox.BOX;
    }
}
class TetrisPeice{
    constructor(pos){
        this.pos = pos;
        this.maps = [];
        this.current = 0;
    }
    GetBox(){
        if(TetrisPeice.BOX) return TetrisPeice.BOX;
        var c = G.makeCanvas(TileSize,TileSize);
        c.ctx.fillStyle = COl2;
        c.ctx.fillRect(0,0,c.width,c.height);
        c.ctx.clearRect(1,1,c.width-2,c.height-2);
        c.ctx.fillRect(3,3,c.width-6,c.height-6);
        TetrisPeice.BOX = c;
        return TetrisPeice.BOX;
    }
    GetSprite(map){
        var box = this.GetBox();
        var s = G.makeCanvas(TileSize*map.length,TileSize*map[0].length);
        for(let i = 0 ; i < map.length ; i++){
            for(let j = 0 ; j < map[i].length;j++){
                if(map[i][j] === 1){
                    s.ctx.drawImage(box,TileSize*i,TileSize*j);
                }
            }
        }
        // document.body.append(s);
        return s;
    }
    static makeRandom(pos){
        return TetrisPeice.GetForType(G.randInt(1,6),pos);
    }
    static GetForType(type,pos){
        switch(type){
            case 1 : return new BarTP(pos);
            case 2 : return new RLTP(pos);
            case 3 : return new LLTP(pos);
            case 4 : return new LNTP(pos);
            case 5 : return new RNTP(pos);
            case 6 : return new BoxTP(pos);
            default : return new RLTP(pos);
        }
    }
    getBoxes(){
        var boxes = [];
        var map = this.maps[this.current];
        for(let i = 0 ; i < map.length ; i++){
            for(let j = 0 ; j < map[i].length;j++){
                if(map[i][j] === 1){
                    boxes.push(new TetrisBox({
                        x: this.pos.x + j * TileSize,y : this.pos.y + i * TileSize
                    }));
                }
            }
        }
        return boxes;
    }
    move(vx,vy,game){
        var destination = {
            x: this.pos.x + TileSize * vx,
            y: this.pos.y + TileSize * vy,
        };
        var boxes = this.getBoxes();
        for(let i in boxes){
            var box = boxes[i];
            if(box.x + TileSize * vx < 0) return false;
            if(box.x + TileSize * vx > TileSize * 10) return false;
            if(box.y + TileSize * vy >= TileSize * 20) return false;
            if(game.isOccupied(box.x + TileSize * vx, box.y + TileSize * vy)) return false;
        }
        if(destination.x < 0) return false;
        if(destination.x > TileSize * 10) return false;
        this.pos.x = destination.x;
        this.pos.y = destination.y;
        return true;
    }
    update(time,game){
        if(!this.move(0,1,game)){
            game.handlePeiceStopMoving(this);
        }
    }
    draw(ctx){
        ctx.drawImage(this.sprite,this.pos.x,this.pos.y);
    }
    rotate(){
        this.current++;
        if(this.current >= this.maps.length) this.current = 0;
        this.sprite = this.GetSprite(this.maps[this.current]);
    }
}
class BarTP extends TetrisPeice{
    constructor(pos){
        super(pos);
        this.maps = [
            [[1,1,1,1,1]],
            [[1],[1],[1],[1],[1]]
        ]
        this.sprite = this.GetSprite(this.maps[this.current]);
    }
}
class RLTP extends TetrisPeice{
    constructor(pos){
        super(pos);
        this.maps = [
            [[1,0],[1,0],[1,1]],
            [[0,0,1],[1,1,1],],
            [[1,1],[0,1],[0,1]],
            [[1,1,1],[1,0,0]]
        ]
        this.sprite = this.GetSprite(this.maps[this.current]);
    }
}
class LLTP extends TetrisPeice{
    constructor(pos){
        super(pos);
        this.maps = [
            [[0,1],[0,1],[1,1]],
            [[1,1,1],[0,0,1]],
            [[1,1],[1,0],[1,0]],
            [[1,0,0],[1,1,1]]
        ]
        this.sprite = this.GetSprite(this.maps[this.current]);
    }
}
class LNTP extends TetrisPeice{
    constructor(pos){
        super(pos);
        this.maps = [
            [[0,1,1],[1,1,0]],
            [[1,0],[1,1],[0,1]]
        ]
        this.sprite = this.GetSprite(this.maps[this.current]);
    }
}
class RNTP extends TetrisPeice{
    constructor(pos){
        super(pos);
        this.maps = [
            [[1,1,0],[0,1,1]],
            [[0,1],[1,1],[1,0]]
        ]
        this.sprite = this.GetSprite(this.maps[this.current]);
    }
}
class BoxTP extends TetrisPeice{
    constructor(pos){
        super(pos);
        this.maps = [
            [[1,1],[1,1]]
        ]
        this.sprite = this.GetSprite(this.maps[this.current]);
    }
}
class Game{
    constructor(){
        this.init();
        document.addEventListener('keydown', (e)=>{
            if(e.key === 'ArrowLeft'){
                this.currentPeice.move(-1,0,this);
            }
            else if (e.key === 'ArrowRight'){
                this.currentPeice.move(1,0,this);
            }
            else if (e.key === 'ArrowDown'){
                this.currentPeice.move(0,1,this);
            }
            else if (e.key === 'ArrowUp'){
                this.currentPeice.rotate();
                //rotate peice
            }
        }, false);
    }
    init(){
        const COL1 = "#e7e7e7";
        var canvasW = TileSize*16;
        var canvasH = TileSize*20;
        this.canvas = G.makeCanvas(canvasW,canvasH);
        this.grid = G.makeCanvas(TileSize*10,TileSize*20);
        var gbg = G.gridBG(COL1,null,TileSize,1);
        var gbgfull = G.gridToFull(gbg,this.grid.width,this.grid.height,COL1);
        this.grid.ctx.drawImage(gbgfull,0,0);
        this.boxes = [];
        this.speed = 0;
        this.speedMeter = 0;
        this.score = 0;
        this.lines = 0;
        this.level = 0;
        this.currentPeice = TetrisPeice.makeRandom({x:TileSize*4,y:0});
        this.next = TetrisPeice.makeRandom({x:TileSize*4,y:0});
        document.body.append(this.canvas);
        this.update(0);
    }

    update(time){
        this.speedMeter++;
        if(this.speedMeter > 20 - this.speed * 20 ){
            this.speedMeter = 0;
            this.currentPeice.update(time,this);
        }

        this.canvas.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

        this.canvas.ctx.drawImage(this.grid,0,0);
        this.canvas.ctx.fillText("SCORE",this.grid.width + TileSize/3, 10);
        this.canvas.ctx.fillText(`${this.score}`,this.grid.width + TileSize/3, 20);
        this.canvas.ctx.fillText(`LINES`,this.grid.width + TileSize/3, 40);
        this.canvas.ctx.fillText(`${this.lines}`,this.grid.width + TileSize/3, 50);
        this.canvas.ctx.fillText(`LEVEL`,this.grid.width + TileSize/3, 70);
        this.canvas.ctx.fillText(`${this.level}`,this.grid.width + TileSize/3, 80);
        this.canvas.ctx.fillText(`NEXT`,this.grid.width + TileSize/3, 100);
        this.canvas.ctx.drawImage(this.next.sprite,this.grid.width + TileSize/3, 110);


        this.canvas.ctx.drawImage(this.grid,0,0);
        this.currentPeice.draw(this.canvas.ctx);
        this.boxes.forEach(x=>{
            x.draw(this.canvas.ctx);
        })
        requestAnimationFrame((t)=>this.update(t));
    }
    isOccupied(x,y){
        return this.boxes.filter(b=> b.x == x && b.y == y).length != 0;
    }
    checkRowsCompletion(){
        var maxy = 0;
        this.boxes.forEach(b=>{
            maxy = Math.min(b.y,maxy)
        })
        for(var y = TileSize*20; y > 0; y -= TileSize){
            var row = this.boxes.filter(b=> b.y == y );
            if(row.length == 10){
                this.lines++;
                this.score += 10 * (this.level+1);
                this.boxes = this.boxes.filter(b=> b.y != y);
                this.boxes.forEach(box=>{
                    if(box.y < y){
                        box.y += TileSize
                    };
                })
                return this.checkRowsCompletion();
            }
        }
        return true;
    }
    handlePeiceStopMoving(peice){
        
        peice.getBoxes().forEach(box=>{
            var exist = this.boxes.filter(x=> x.x == box.x && x.y == box.y);
            if(exist.length > 0){
                
            }
            this.boxes.push(box);
            this.checkRowsCompletion()
        })

        this.currentPeice = this.next;
        this.next = TetrisPeice.makeRandom({x:TileSize*4,y:0});
    }
}
document.addEventListener('DOMContentLoaded', function () {
    window.game = new Game("");
}, false);