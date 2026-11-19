class GameObject {
    constructor(_imageID) {
       
        this.x = c.width / 2;
        this.y = c.height / 2;
        this.angle = 0;
        this.w = 100;
        this.h = 100;
        this.vx = 0;
        this.vy = 0;
        this.color = "hotpink";

        this.img = document.querySelector(_imageID);
        this.img.w = 100;
        this.img.h = 100;
        this.img.scale = { x: 1, y: 1 };
    }

    graphic(_offsetX = 0, _offsetY = 0) {
        if (this.img && this.img.complete && this.img.naturalWidth > 0) {
            var drawW = this.img.w * this.img.scale.x;
            var drawH = this.img.h * this.img.scale.y;
            ctx.drawImage(
                this.img,
                this.x - drawW / 2 + _offsetX,
                this.y - drawH / 2 + _offsetY,
                drawW,
                drawH
            );
        } else {
           
            ctx.save();
            ctx.fillStyle = this.color;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle * Math.PI / 180);
            ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
            ctx.restore();
        }
    }

    move() {
        this.x = this.x + this.vx;
        this.y = this.y + this.vy;
    }

    top() { return { x: this.x, y: this.y - this.h / 2 }; }
    bottom() { return { x: this.x, y: this.y + this.h / 2 }; }
    left() { return { x: this.x - this.w / 2, y: this.y }; }
    right() { return { x: this.x + this.w / 2, y: this.y }; }

    
    overlaps(_obj) {
        if (
            this.top().y < _obj.bottom().y &&
            this.bottom().y > _obj.top().y &&
            this.left().x < _obj.right().x &&
            this.right().x > _obj.left().x
        ) {
            return true;
        }
        return false;
    }

    isOverPoint(_point) {
        if (
            this.top().y < _point.y &&
            this.bottom().y > _point.y &&
            this.left().x < _point.x &&
            this.right().x > _point.x
        ) {
            return true;
        }
        return false;
    }
}
