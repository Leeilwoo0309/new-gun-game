class Projectile {
    public angle: number = 0;
    public absPos: {x: number, y:  number} = {x: 0, y: 0};
    public speed: number = 15;
    private _movedDistance: number = 0;
    public isArrive: boolean = true;
    public isSent: boolean = false;
    public isCollide: boolean = false;
    public damage: number = 0;
    public reach: number = -1;

    public start(type: "ally" | "enemy" = "ally") {
        const _main: HTMLElement = document.querySelector('.projectiles');
        let _bullet: HTMLDivElement = document.createElement('div');

        _bullet.className = `${ type } bullet`;
        
        if (type == "ally") {
            _bullet.style.top = `${ -absolutePosition.ally.y - cameraPosition.y + 4}px`;
            _bullet.style.left = `${ absolutePosition.ally.x - cameraPosition.x + 4}px`;
            
            this.absPos.x = absolutePosition.ally.x;
            this.absPos.y = absolutePosition.ally.y;
        } else if (type == "enemy") {
            _bullet.style.top = `${ -absolutePosition.enemy.y - cameraPosition.y + 4}px`;
            _bullet.style.left = `${ absolutePosition.enemy.x - cameraPosition.x + 4}px`;
            
            this.absPos.x = absolutePosition.enemy.x;
            this.absPos.y = absolutePosition.enemy.y;
        }


        if (this.damage == 0) {
            _bullet.style.opacity = `20%`;
            _bullet.style.backgroundColor = `black`;
        }
        
        _main.appendChild(_bullet);

        const update = setInterval(() => {
            // _bullet.style.left = `${ this.absPos.x - cameraPosition.x }px`;
            // _bullet.style.top = `${ -this.absPos.y - cameraPosition.y }px`;

            // this.absPos.x = parseFloat(_bullet.style.left);
            // this.absPos.y = parseFloat(_bullet.style.top);
            this._movedDistance += this.speed;

            // const bulletX = parseFloat(_bullet.style.left);
            // const bulletY = parseFloat(_bullet.style.top);

            // const newX = bulletX - this.speed * Math.cos(this.angle);
            // const newY = bulletY + this.speed * Math.sin(this.angle);

            this.absPos.x += -this.speed * Math.cos(this.angle);
            this.absPos.y += -this.speed * Math.sin(this.angle);

            //  console.log(this.absPos);

            _bullet.style.left = `${ this.absPos.x - cameraPosition.x }px`;
            _bullet.style.top = `${ -this.absPos.y - cameraPosition.y }px`;
            // _bullet.style.left = `${ newX }px`;
            // _bullet.style.top = `${ newY }px`;

            // on-hit
            if (type == "enemy") {
                if (this.isCollideWithPlayer(_bullet) && !this.isCollide) {
                    console.log('맞음!1');
                    this.isCollide = true;

                    players.ally.hp[1] -= this.damage;
                }
            }

            let isNeedToDie: boolean = false;

            // 화면 밖으로 나가면 탄환 제거
            gameObjects.forEach((e) => {
                if (e.isCollide(_bullet) && this.isArrive) {
                    this.isArrive = false;
                    _main.removeChild(_bullet);
                }
            })

            if (this._movedDistance >= this.reach * 1.5 && this.isArrive) {
                this.isArrive = false;
                _main.removeChild(_bullet);
            }

            if (!this.isArrive) {
                clearInterval(update);
            }
        }, 16);
    }

    public isCollideWithPlayer(projectileSelector: HTMLDivElement): boolean {
        const r1 = players.ally.selector.offsetWidth / 2;
        const r2 = projectileSelector.offsetWidth / 2;

        const x1 = players.ally.selector.offsetLeft + r1;
        const y1 = players.ally.selector.offsetTop + r1;
        const x2 = projectileSelector.offsetLeft + r2;
        const y2 = projectileSelector.offsetTop + r2;

        const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

        return distance <= (r1 + r2);
    }
}

class ProjectileBuilder {
    private projectile: Projectile;

    constructor() {
        this.projectile = new Projectile();
    }

    public setDegree(degree: number): ProjectileBuilder {
        this.projectile.angle = degree;
        return this;
    }

    public setDamage(damage: number, random?: number): ProjectileBuilder {
        this.projectile.damage = damage;
        return this;
    }

    public setSpeed(spd: number): ProjectileBuilder {
        this.projectile.speed = spd;
        return this;
    }

    public setPos(x: number, y: number): ProjectileBuilder {
        this.projectile.absPos.x = x;
        this.projectile.absPos.y = y;

        return this;
    }

    public setReach(time: number): ProjectileBuilder {
        this.projectile.reach = time;
        return this;
    }

    public build(type: "ally" | "enemy" = "ally") {
        this.projectile.start(type);

        return this.projectile;
    }
}