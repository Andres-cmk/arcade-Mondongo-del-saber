class Enemigo{
    constructor(x,y, colorNivel, tipo, velocidadNivel) {
        this.x = x;
        this.y = y;
        this.r = 10;
        this.xdir = 1;
        this.color = colorNivel;
        this.tipo = tipo;
        this.velocidad = velocidadNivel;
    }

    show() {
        if (this.tipo === 'especial') {
        image(imgEnemigoEspecial, this.x - this.r, this.y - this.r, this.r * 2, this.r * 2);
        } else {
            tint(this.color); 
            image(imgEnemigoNormal, this.x - this.r, this.y - this.r, this.r * 2, this.r * 2);
            noTint();
        }
    }

    shoot() {
    let velocidadBala = 4 + (nivel * 0.3); // Las balas también aceleran un poco
    return new BalaEnemiga(this.x, this.y, velocidadBala);
}

    movement(){
        this.x += this.xdir * this.velocidad;
    }

    bajar(){
        this.xdir *= -1;
        this.y += 20;
    }
}
