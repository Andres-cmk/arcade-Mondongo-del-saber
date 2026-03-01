class Bala {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.r = 4;
        this.speed = 10;
        this.eliminada = false;
    }

    show(){
        fill(255, 255, 0);
        noStroke();
        ellipse(this.x, this.y, this.r*2, this.r*2);
    }

    movement(){
        this.y -= this.speed;
    }

    hit(enemigo) {
        let d = dist(this.x, this.y, enemigo.x, enemigo.y);
    
        return (d < (this.r + enemigo.r) * 0.8); 
    }
}