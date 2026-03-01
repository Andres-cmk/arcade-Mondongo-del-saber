class BalaEnemiga {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.r = 4;
        this.speed = 5;
    }

    show(){
        fill("#4D57E8");
        ellipse(this.x, this.y, this.r*2, this.r*2);
    }

    movement(){
        this.y += this.speed;
    }

    hits(nave){
        let d = dist(this.x, this.y, nave.x, height - 20);
        return (d < this.r + nave.width / 2);
    }
}