class Nave {
    constructor(){
        this.x = 300;
        this.width = 40;
        this.dir = 0;
    }

    show(){
        fill(0, 255, 0);
        noStroke();
        imageMode(CENTER);
        image(imgNave, this.x, height - 40, this.width, 20);
    }

    setDir(dir){
        this.dir = dir;
    }

    movement(){
        this.x += this.dir * 5;

        this.x = constrain(this.x, this.width / 2, width - this.width / 2);
    }
}