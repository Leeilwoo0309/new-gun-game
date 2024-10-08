var Projectile = /** @class */ (function () {
    function Projectile() {
        this.angle = 0;
        this.absPos = { x: 0, y: 0 };
        this.speed = 15;
        this._movedDistance = 0;
        this.isArrive = true;
        this.isSent = false;
        this.isCollide = false;
        this.damage = 0;
        this.critical = [0, 0];
        this.reach = -1;
        this.style = {
            color: undefined,
            opacity: undefined,
        };
        this.ignoreObj = false;
        this.onhit = undefined;
        this.targetEnemy = [false, team];
        this.canPass = false;
    }
    Projectile.prototype.start = function (type) {
        var _this = this;
        var _main = document.querySelector('.projectiles');
        var _bullet = document.createElement('div');
        _bullet.className = "".concat(type, " bullet");
        _bullet.style.width = "".concat(this.size.width, "px");
        _bullet.style.height = "".concat(this.size.height, "px");
        _bullet.style.rotate = "".concat(-this.angle + Math.PI / 2, "rad");
        var offsetX = players[team].size / 2 - this.size.width / 2;
        // let offsetY = players[team].size / 2 - this.size.height / 1.5
        // let offsetX = 4;
        var offsetY = -players[type].size / 2 + this.size.height / 2;
        if (type === team) {
            _bullet.style.left = "".concat(absolutePosition[team].x - cameraPosition.x + offsetX, "px");
            _bullet.style.top = "".concat(-absolutePosition[team].y - cameraPosition.y - offsetY, "px");
            this.absPos.x = absolutePosition[team].x + offsetX;
            this.absPos.y = absolutePosition[team].y - offsetY;
        }
        else {
            _bullet.style.left = "".concat(absolutePosition[getEnemyTeam()].x - cameraPosition.x + offsetX, "px");
            _bullet.style.top = "".concat(-absolutePosition[getEnemyTeam()].y - cameraPosition.y - offsetY, "px");
            this.absPos.x = absolutePosition[getEnemyTeam()].x + offsetX;
            this.absPos.y = absolutePosition[getEnemyTeam()].y - offsetY;
        }
        if (this.damage == 0) {
            _bullet.style.opacity = "20%";
            _bullet.style.backgroundColor = "black";
        }
        if (this.style.color !== undefined)
            _bullet.style.backgroundColor = "".concat(this.style.color);
        if (this.style.opacity !== undefined)
            _bullet.style.opacity = "".concat(this.style.opacity, "%");
        _main.appendChild(_bullet);
        var update = setInterval(function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
            // clearInterval(update);
            _this._movedDistance += _this.speed;
            var enemyTar = _this.targetEnemy[1] == 'blue' ? 'red' : 'blue';
            var totalDamage = { melee: 0, magic: 0, true: 0 };
            if (_this.targetEnemy[0]) {
                _this.angle = Math.atan2(absolutePosition[enemyTar].y - _this.absPos.y - offsetY, absolutePosition[enemyTar].x - _this.absPos.x + offsetX);
                _this.absPos.x += _this.speed * Math.cos(_this.angle);
                _this.absPos.y += _this.speed * Math.sin(_this.angle);
            }
            else {
                _this.absPos.x += -_this.speed * Math.cos(_this.angle);
                _this.absPos.y += -_this.speed * Math.sin(_this.angle);
            }
            _bullet.style.left = "".concat(_this.absPos.x - cameraPosition.x + offsetX, "px");
            _bullet.style.top = "".concat(-_this.absPos.y - cameraPosition.y - 2 * offsetY, "px");
            // on-hit
            var isCritical = Math.random() <= _this.critical[0] / 100;
            if (type === getEnemyTeam() && _this.damage > 0) {
                if (_this.isCollideWithPlayer2(_bullet, team) && !_this.isCollide) {
                    var damageCoefficient_1 = {
                        melee: (1 / (1 + (players[team].spec.armor * (1 - players[getEnemyTeam()].spec.ignoreArmorPercent / 100) - players[getEnemyTeam()].spec.ignoreArmor) * 0.01)),
                        magic: (1 / (1 + players[team].spec.magicRegist * 0.01)),
                        true: 1
                    };
                    var criticalDamage_1 = _this.damage * (1.75 + _this.critical[1] / 100);
                    _this.isCollide = true;
                    if (!_this.canPass)
                        _this.isArrive = false;
                    if (skillHit.vampire == true)
                        return;
                    if (skillHit.ashe == true)
                        return;
                    // 크리티컬 데미지
                    if (isCritical) {
                        // players[team].hp[1] -= criticalDamage * damageCoefficient[this.damageType];
                        totalDamage[_this.damageType] += criticalDamage_1 * damageCoefficient_1[_this.damageType];
                        // damageAlert(this.damageType, damageCoefficient[this.damageType] * criticalDamage, true, type == 'blue' ? 'red' : 'blue');
                    }
                    else {
                        // players[team].hp[1] -= this.damage * damageCoefficient[this.damageType];
                        totalDamage[_this.damageType] += _this.damage * damageCoefficient_1[_this.damageType];
                        // damageAlert(this.damageType, this.damage * damageCoefficient[this.damageType], false, type == 'blue' ? 'red' : 'blue');
                    }
                    ;
                    // 아이템 감지
                    players[getEnemyTeam()].items.forEach(function (e) {
                        var _a, _b;
                        if ((e === null || e === void 0 ? void 0 : e.name[1]) == '3_molwang' && !((_a = _this.onhit) === null || _a === void 0 ? void 0 : _a.includes('skill'))) {
                            // players[team].hp[1] -= players[team].hp[1] * (e.extra[0] / 100) * damageCoefficient.melee;
                            totalDamage.melee += players[team].hp[1] * (e.extra[0] / 100) * damageCoefficient_1.melee;
                            // socket.send(JSON.stringify({
                            //     body: {
                            //         msg: 'damageAlert',
                            //         info: [
                            //             "melee",
                            //             players[team].hp[1] * (e.extra[0] / 100) * damageCoefficient.melee,
                            //             false,
                            //             type == 'blue' ? 'red' : 'blue'
                            //         ]
                            //     }
                            // }));
                            // damageAlert("melee", players[team].hp[1] * (e.extra[0] / 100) * damageCoefficient.melee, false, type == 'blue' ? 'red' : 'blue');
                        }
                        if ((e === null || e === void 0 ? void 0 : e.name[1]) == '3_nashor' && !((_b = _this.onhit) === null || _b === void 0 ? void 0 : _b.includes('skill'))) {
                            // players[team].hp[1] -= e.extra[0] * damageCoefficient.magic;
                            totalDamage.magic += e.extra[0] * damageCoefficient_1.magic;
                            // socket.send(JSON.stringify({
                            //     body: {
                            //         msg: 'damageAlert',
                            //         info: [
                            //             "magic",
                            //             e.extra[0] * damageCoefficient.magic,
                            //             false,
                            //             type == 'blue' ? 'red' : 'blue'
                            //         ]
                            //     }
                            // }));
                            // damageAlert("magic", e.extra[0] * damageCoefficient.magic, false, type == 'blue' ? 'red' : 'blue');
                        }
                        if ((e === null || e === void 0 ? void 0 : e.name[1]) == '3_rapid_firecannon') {
                            var alphaDamage = playerDistance / findItem('3_rapid_firecannon').body.extra[1] / 2; // 1000에서 1.2가 나오도록
                            console.log(alphaDamage, playerDistance);
                            if (alphaDamage > findItem('3_rapid_firecannon').body.extra[0])
                                alphaDamage = findItem('3_rapid_firecannon').body.extra[0];
                            // players[team].hp[1] -= this.damage * alphaDamage * damageCoefficient.melee;
                            totalDamage.melee += _this.damage * alphaDamage * damageCoefficient_1.melee;
                        }
                        if ((e === null || e === void 0 ? void 0 : e.name[1]) == '3_collector') {
                            if (players[team].hp[1] / players[team].hp[0] <= findItem('3_collector').body.extra[0] / 100) {
                                // players[team].hp[1] -= 9999;
                                totalDamage.true += 9999;
                                // socket.send(JSON.stringify({
                                //     body: {
                                //         msg: 'damageAlert',
                                //         info: [
                                //             "true",
                                //             9999,
                                //             false,
                                //             type == 'blue' ? 'red' : 'blue'
                                //         ]
                                //     }
                                // }));
                                // damageAlert("true", 9999, false, type == 'blue' ? 'red' : 'blue');
                                // damageAlert("melee", e.extra[0] * this.damage * playerDistance / 3000 * damageCoefficient.melee, false, type == 'blue' ? 'red' : 'blue');
                            }
                        }
                        if ((e === null || e === void 0 ? void 0 : e.name[1]) == '3_shadowflame' && _this.damageType == 'magic' && isCritical) {
                            // players[team].hp[1] -= this.damage * criticalDamage * damageCoefficient.magic;
                            totalDamage.magic += criticalDamage_1 * damageCoefficient_1.magic;
                        }
                    });
                    // 플레이어가 가지고 있는 아이템에 따라..
                    if (hasItem('3_shieldbow') && cooldownItem.shieldbow == 0 && players[team].hp[1] / players[team].hp[0] <= 0.35 && players[team].hp[1] > 0) {
                        var shieldbow = findItem('3_shieldbow').body;
                        players[team].barrier.push([players[team].hp[0] * (shieldbow.extra[0] / 100) + shieldbow.extra[2], shieldbow.extra[3] * 100]);
                        cooldownItem.shieldbow = findItem("3_shieldbow").body.extra[1];
                    }
                    if (((_a = players[team].marker) === null || _a === void 0 ? void 0 : _a.ezreal) == true) {
                        absolutePosition[team].x += 3;
                        absolutePosition[team].y -= 3;
                        // players[team].hp[1] -= (
                        //     players[getEnemyTeam()].spec.ap * enemySkillInfo.passive.ap +
                        //     players[getEnemyTeam()].spec.ad * enemySkillInfo.passive.ad +
                        //     enemySkillInfo.passive.damage) * damageCoefficient.magic
                        players[team].marker.ezreal = false;
                        totalDamage.magic += (players[getEnemyTeam()].spec.ap * enemySkillInfo.passive.ap +
                            players[getEnemyTeam()].spec.ad * enemySkillInfo.passive.ad +
                            enemySkillInfo.passive.damage) * damageCoefficient_1.magic;
                        // damageAlert("magic", (
                        //     players[getEnemyTeam()].spec.ap * enemySkillInfo.passive.ap +
                        //     players[getEnemyTeam()].spec.ad * enemySkillInfo.passive.ad +
                        //     enemySkillInfo.passive.damage) * damageCoefficient.magic
                        // , false, type == 'blue' ? 'red' : 'blue');
                        // socket.send(JSON.stringify({
                        //     body: {
                        //         msg: 'damageAlert',
                        //         info: [
                        //             "magic",
                        //             (players[getEnemyTeam()].spec.ap * enemySkillInfo.passive.ap +
                        //             players[getEnemyTeam()].spec.ad * enemySkillInfo.passive.ad +
                        //             enemySkillInfo.passive.damage) * damageCoefficient.magic,
                        //             false,
                        //             type == 'blue' ? 'red' : 'blue'
                        //         ]
                        //     }
                        // }));
                    }
                    // 캐릭터별 온힛 효과
                    if (((_b = _this.onhit) === null || _b === void 0 ? void 0 : _b.includes("ezreal")) && ((_c = _this.onhit) === null || _c === void 0 ? void 0 : _c.includes(" e"))) {
                        absolutePosition[team].x -= 3;
                        absolutePosition[team].y += 3;
                        players[team].marker.ezreal = true;
                    }
                    else if ((_d = _this.onhit) === null || _d === void 0 ? void 0 : _d.includes("samira")) {
                        socket.send(JSON.stringify({
                            body: {
                                msg: "samiraOnhit", damageType: (_e = _this.onhit) === null || _e === void 0 ? void 0 : _e.split(' ')[_this.onhit.split(' ').length - 1]
                            }
                        }));
                        if ((_f = _this.onhit) === null || _f === void 0 ? void 0 : _f.includes(" e")) {
                            canMove = false;
                            setTimeout(function () {
                                canMove = true;
                            }, enemySkillInfo.e.duration * 10);
                        }
                        if (_this.damage > 0)
                            onhitCount[type] += 1;
                        socket.send(JSON.stringify({ body: { msg: "onhit", target: 'enemy', type: "skill" } }));
                    }
                    else if (char[getEnemyTeam()] == 'vayne') {
                        if (players[team].marker.vayne === undefined)
                            players[team].marker.vayne = 0;
                        players[team].marker.vayne += 1;
                        if (players[team].marker.vayne == 3) {
                            players[team].marker.vayne = 0;
                            totalDamage.true += players[team].hp[0] * (enemySkillInfo.passive.damage + enemySkillInfo.passive.ap * players[getEnemyTeam()].spec.ap) / 100;
                            // players[team].hp[1] -= players[team].hp[0] * (enemySkillInfo.passive.damage + enemySkillInfo.passive.ap * players[getEnemyTeam()].spec.ap) / 100;
                            // socket.send(JSON.stringify({
                            //     body: {
                            //         msg: 'damageAlert',
                            //         info: [
                            //             "true",
                            //             players[team].hp[0] * (enemySkillInfo.passive.damage + enemySkillInfo.passive.ap * players[getEnemyTeam()].spec.ap) / 100,
                            //             false,
                            //             type == 'blue' ? 'red' : 'blue'
                            //         ]
                            //     }
                            // }));
                            // damageAlert("true", players[team].hp[0] * (enemySkillInfo.passive.damage + enemySkillInfo.passive.ap * players[getEnemyTeam()].spec.ap) / 100, false, type == 'blue' ? 'red' : 'blue');
                        }
                        if ((_g = _this.onhit) === null || _g === void 0 ? void 0 : _g.includes('bondage')) {
                            canMove = false;
                            setTimeout(function () {
                                canMove = true;
                            }, enemySkillInfo.shift.duration * 10);
                        }
                    }
                    else if ((_h = _this.onhit) === null || _h === void 0 ? void 0 : _h.includes('vampire skill e')) {
                        skillHit.vampire = true;
                        setTimeout(function () {
                            skillHit.vampire = false;
                        }, 100);
                    }
                    else if ((_j = _this.onhit) === null || _j === void 0 ? void 0 : _j.includes('aphelios')) {
                        if (players[team].marker.aphelios.Calibrum && _this.onhit.includes('aa') && _this.onhit.includes('Cali-true')) {
                            players[team].marker.aphelios.Calibrum = false;
                            players[team].marker.aphelios.CalibrumWheel = false;
                            //@ts-ignore
                            totalDamage.melee += (4 + 0.3 * players[getEnemyTeam()].spec.ad) * damageCoefficient_1.melee;
                            //@ts-ignore
                            // players[team].hp[1] -= (4 + 0.3 * players[getEnemyTeam()].spec.ad) * damageCoefficient.melee;
                        }
                        // if (players[team].marker.aphelios === undefined) players[team].marker.aphelios = {Calibrum: false, Gravitum: false};
                        if ((_k = _this.onhit) === null || _k === void 0 ? void 0 : _k.includes('sub-Calibrum')) {
                            players[team].marker.aphelios.Calibrum = true;
                            if ((_l = _this.onhit) === null || _l === void 0 ? void 0 : _l.includes('wheel')) {
                                players[team].marker.aphelios.CalibrumWheel = true;
                            }
                        }
                        else if ((_m = _this.onhit) === null || _m === void 0 ? void 0 : _m.includes('ravitum')) {
                            players[team].marker.aphelios.Gravitum = true;
                            slowness = (players[team].specINIT.moveSpd + players[team].specItem.moveSpd) * 0.25;
                            slowTime = 400;
                            if (_this.onhit.includes('wheel')) {
                                slowness = (players[team].specINIT.moveSpd + players[team].specItem.moveSpd) * 0.7;
                                setTimeout(function () {
                                    slowness = (players[team].specINIT.moveSpd + players[team].specItem.moveSpd) * 0.25;
                                }, 150);
                            }
                        }
                        else if ((_o = _this.onhit) === null || _o === void 0 ? void 0 : _o.includes('sub-Crescendum')) {
                            socket.send(JSON.stringify({ body: { msg: "aphlios-crescendum" } }));
                            if ((_p = _this.onhit) === null || _p === void 0 ? void 0 : _p.includes('wheel')) {
                                socket.send(JSON.stringify({ body: { msg: "aphlios-crescendum" } }));
                                socket.send(JSON.stringify({ body: { msg: "aphlios-crescendum" } }));
                                socket.send(JSON.stringify({ body: { msg: "aphlios-crescendum" } }));
                                socket.send(JSON.stringify({ body: { msg: "aphlios-crescendum" } }));
                                socket.send(JSON.stringify({ body: { msg: "aphlios-crescendum" } }));
                            }
                        }
                    }
                    else if ((_q = _this.onhit) === null || _q === void 0 ? void 0 : _q.includes('ashe')) {
                        players[team].marker.ashe = 1;
                        slowness = (players[team].specINIT.moveSpd + players[team].specItem.moveSpd) * 0.2;
                        slowTime = 250;
                        if ((_r = _this.onhit) === null || _r === void 0 ? void 0 : _r.includes('ashe skill e')) {
                            skillHit.ashe = true;
                            setTimeout(function () {
                                skillHit.ashe = false;
                            }, 100);
                        }
                        else if ((_s = _this.onhit) === null || _s === void 0 ? void 0 : _s.includes('ashe skill wheel')) {
                            canMove = false;
                            charClass.cooldown.q += enemySkillInfo.wheel.duration;
                            charClass.cooldown.e += enemySkillInfo.wheel.duration;
                            charClass.cooldown.shift += enemySkillInfo.wheel.duration;
                            charClass.cooldown.wheel += enemySkillInfo.wheel.duration;
                            atkWait += enemySkillInfo.wheel.duration;
                            setTimeout(function () {
                                canMove = true;
                            }, enemySkillInfo.wheel.duration * 10);
                        }
                    }
                    if ((_t = _this.onhit) === null || _t === void 0 ? void 0 : _t.includes('skill')) {
                        socket.send(JSON.stringify({ body: { msg: "onhit", target: 'enemy', type: "skill" } }));
                    }
                    else {
                        socket.send(JSON.stringify({ body: { msg: "onhit", target: 'enemy', type: "aa" } }));
                    }
                    socket.send(JSON.stringify({
                        body: {
                            msg: 'damageAlert',
                            info: [
                                "melee",
                                totalDamage.melee,
                                isCritical,
                                type == 'blue' ? 'red' : 'blue'
                            ]
                        }
                    }));
                    socket.send(JSON.stringify({
                        body: {
                            msg: 'damageAlert',
                            info: [
                                "magic",
                                totalDamage.magic,
                                isCritical,
                                type == 'blue' ? 'red' : 'blue'
                            ]
                        }
                    }));
                    socket.send(JSON.stringify({
                        body: {
                            msg: 'damageAlert',
                            info: [
                                "heal",
                                (totalDamage.melee + totalDamage.magic) * players[type].spec.vamp / 100,
                                false,
                                type
                            ]
                        }
                    }));
                    socket.send(JSON.stringify({
                        body: {
                            msg: 'damageAlert',
                            info: [
                                "true",
                                totalDamage.true,
                                false,
                                type == 'blue' ? 'red' : 'blue'
                            ]
                        }
                    }));
                    damageAlert("melee", totalDamage.melee, isCritical, type == 'blue' ? 'red' : 'blue');
                    damageAlert("magic", totalDamage.magic, isCritical, type == 'blue' ? 'red' : 'blue');
                    damageAlert("true", totalDamage.true, isCritical, type == 'blue' ? 'red' : 'blue');
                    damageAlert("heal", (totalDamage.melee + totalDamage.magic) * players[type].spec.vamp / 100, false, type);
                    var totalDamageSum = totalDamage.magic + totalDamage.melee + totalDamage.true;
                    //     if (players[team].barrier.length > 0) {
                    //         let index: number = 0;
                    //         while (true) {
                    //             if (players[team].barrier.length < index) break;
                    //             let barrierMax = players[team].barrier[index][0]
                    //             players[team].barrier[index][0] -= totalDamageSum;
                    //             if (players[team].barrier[index][0] < 0) {
                    //                 totalDamageSum -= barrierMax;
                    //                 index += 1;
                    //             } else {
                    //                 totalDamageSum = 0;
                    //                 break;
                    //             }
                    //         }
                    //         players[team].hp[1] -= totalDamageSum;
                    //     } else {
                    //         players[team].hp[1] -= totalDamageSum;
                    //     }
                }
                var nexusIndex = { blue: [7, 8], red: [9, 10] };
                if (_this.isCollideWithNexus(gameObjects[nexusIndex[team][1]].objSelector, _bullet) && gameObjects[nexusIndex[team][0]].isCollide(players[getEnemyTeam()].selector) && !_this.isCollide) {
                    if (nexusHp[team][1] <= 0)
                        return;
                    nexusHp[team][1] -= (1 / (1 + 50 * 0.01)) * _this.damage;
                    nexusHp[team][1] -= players[getEnemyTeam()].spec.ap * 0.7 * (1 / (1 + 30 * 0.01));
                    _this.isCollide = true;
                    socket.send(JSON.stringify({ body: { msg: 'onhit', target: 'nexus' } }));
                }
            }
            else {
                if (_this.isCollideWithPlayer(_bullet, getEnemyTeam()) && !_this.isCollide) {
                    var damageCoefficient = 0;
                    if (_this.damageType == 'melee')
                        damageCoefficient = (1 / (1 + (players[getEnemyTeam()].spec.armor * (1 - players[team].spec.ignoreArmorPercent / 100) - players[team].spec.ignoreArmor) * 0.01));
                    if (_this.damageType == 'magic')
                        damageCoefficient = (1 / (1 + players[getEnemyTeam()].spec.magicRegist * 0.01));
                    if (_this.damageType == 'true')
                        damageCoefficient = 1;
                    if (isCritical) {
                        var criticalDamage = _this.damage * (1.75 + _this.critical[1] / 100);
                        // damageAlert(this.damageType, damageCoefficient * criticalDamage, true, type == 'blue' ? 'red' : 'blue');
                    }
                    else {
                        // damageAlert(this.damageType, this.damage * damageCoefficient, isCritical, type == 'blue' ? 'red' : 'blue');
                    }
                    ;
                    if (_this.damage > 0)
                        onhitCount[type] += 1;
                    if (!_this.canPass)
                        _this.isArrive = false;
                    if (char[team] == 'ezreal' && ((_u = _this.onhit) === null || _u === void 0 ? void 0 : _u.includes('skill'))) {
                        _this.isCollide = true;
                        charClass.cooldown.q -= skillInfo.passive.skillHaste;
                        charClass.cooldown.e -= skillInfo.passive.skillHaste;
                        charClass.cooldown.shift -= skillInfo.passive.skillHaste;
                        charClass.cooldown.wheel -= skillInfo.passive.skillHaste;
                    }
                    if (char[team] == 'sniper' && charClass.isActive.q)
                        charClass.isActive.q = false;
                    if (char[team] === 'aphelios' && _this.onhit.includes('wheel')) {
                        if (apheliosWeapon[0] === 'Severum') {
                            var heal = players[team].hp[0] * 0.2 + players[team].spec.ad * 0.3;
                            players[team].hp[1] += heal;
                            damageAlert("heal", heal, false, team);
                        }
                    }
                }
            }
            // 화면 밖으로 나가면 탄환 제거
            gameObjects.forEach(function (e) {
                if (_this.ignoreObj)
                    return false;
                if (e.isCollide(_bullet) && e.extra.canCollide && _this.isArrive) {
                    _this.isArrive = false;
                }
            });
            if (_this._movedDistance >= _this.reach * 1.5 && _this.isArrive) {
                _this.isArrive = false;
            }
            if (!_this.isArrive) {
                clearInterval(update);
                _main.removeChild(_bullet);
            }
        }, 16);
    };
    Projectile.prototype.isCollideWithPlayer = function (projectileSelector, team) {
        var r1 = players[team].selector.offsetWidth / 2;
        var r2 = projectileSelector.offsetWidth / 2;
        var x1 = players[team].selector.offsetLeft + r1;
        var y1 = players[team].selector.offsetTop + r1;
        var x2 = projectileSelector.offsetLeft + r2;
        var y2 = projectileSelector.offsetTop + r2;
        var distance = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
        return distance <= (r1 + r2);
    };
    Projectile.prototype.isCollideWithPlayer2 = function (projectileSelector, team) {
        var rect1 = players[team].selector.getBoundingClientRect();
        var rect2 = projectileSelector.getBoundingClientRect();
        return !(rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom);
    };
    Projectile.prototype.isCollideWithNexus = function (victim, projectileSelector) {
        var _a;
        if ((_a = this.onhit) === null || _a === void 0 ? void 0 : _a.includes('skill'))
            return false;
        var r1 = projectileSelector.offsetWidth / 2;
        var r2 = victim.offsetWidth / 2;
        var x1 = projectileSelector.offsetLeft + r1;
        var y1 = projectileSelector.offsetTop + r1;
        var x2 = victim.offsetLeft + r2;
        var y2 = victim.offsetTop + r2;
        var distance = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
        return distance <= (r1 + r2);
    };
    return Projectile;
}());
var ProjectileBuilder = /** @class */ (function () {
    function ProjectileBuilder() {
        this.projectile = new Projectile();
    }
    ProjectileBuilder.prototype.setDegree = function (degree) {
        this.projectile.angle = degree;
        return this;
    };
    ProjectileBuilder.prototype.setDamage = function (damage, type, random) {
        this.projectile.damage = damage;
        this.projectile.damageType = type;
        return this;
    };
    ProjectileBuilder.prototype.setSpeed = function (spd) {
        this.projectile.speed = spd;
        return this;
    };
    ProjectileBuilder.prototype.setPos = function (x, y) {
        this.projectile.absPos.x = x;
        this.projectile.absPos.y = y;
        return this;
    };
    ProjectileBuilder.prototype.setReach = function (time) {
        this.projectile.reach = time;
        return this;
    };
    ProjectileBuilder.prototype.setCritical = function (chance, damage) {
        this.projectile.critical = [chance, damage];
        return this;
    };
    ProjectileBuilder.prototype.setSize = function (size) {
        this.projectile.size = size;
        return this;
    };
    ProjectileBuilder.prototype.setStyle = function (color, opacity) {
        this.projectile.style.color = color;
        this.projectile.style.opacity = opacity;
        return this;
    };
    ProjectileBuilder.prototype.onHit = function (msg) {
        this.projectile.onhit = msg;
        return this;
    };
    ProjectileBuilder.prototype.ignoreObj = function (boolean) {
        if (boolean === void 0) { boolean = true; }
        this.projectile.ignoreObj = boolean;
        return this;
    };
    ProjectileBuilder.prototype.setTarget = function (boolean, tarTeam) {
        if (boolean === void 0) { boolean = true; }
        if (tarTeam === void 0) { tarTeam = team; }
        this.projectile.targetEnemy = [boolean, tarTeam];
        return this;
    };
    ProjectileBuilder.prototype.canPass = function (boolean) {
        if (boolean === void 0) { boolean = true; }
        this.projectile.canPass = boolean;
        return this;
    };
    ProjectileBuilder.prototype.build = function (type) {
        this.projectile.start(type);
        return this.projectile;
    };
    return ProjectileBuilder;
}());
