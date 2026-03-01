class Snake{

    constructor(size, img, x, y,w,h ,speed){
        this.size = size;
        this.img = img;
        this.pos = createVector(x,y);
        this.w = w;
        this.h = h;
        this.speed = speed;

        this.row = [
            { fila: 5,  speed: -2, img: snakeImg, count: 3, snakeW: w },
        ];

    }

    update() {
        this.pos.x += this.speed;
        if (this.speed < 0 && this.pos.x < -this.w) {
            this.pos.x = width; 
        }
    }

    draw() {
        image(this.img, this.pos.x, this.pos.y, this.w, this.h);
    }

}