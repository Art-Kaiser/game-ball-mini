const canvas = document.getElementById("game");
const context = canvas.getContext("2d");

let record_id = document.getElementById('record_id');
record_id.innerHTML = localStorage.getItem('record_id_point') | 0; 

let record_id_ball = document.getElementById('record_id_ball');
record_id_ball.innerHTML = localStorage.getItem('record_id_ball') | 0; 

let timerHtml = document.getElementById('timer');
let audio = document.getElementById('audio');
let img_audio = document.getElementById('img_audio');
let audioIsStop = true; 

audio.muted = true; 
audio.volume = 0.1;
img_audio.src = 'https://game-ball-4c061.firebaseapp.com/images/mute.svg'; 

let audio_button = document.getElementById('audio_button');
audio_button.addEventListener('click', () => {
    if (audioIsStop) {
        audio.play()
        audioIsStop = false; 
        img_audio.src = 'https://game-ball-4c061.firebaseapp.com/images/volume.svg'; 
        audio.muted = false; 
    }else{
        audio.pause();
        audioIsStop = true; 
        img_audio.src = 'https://game-ball-4c061.firebaseapp.com/images/mute.svg'; 
    }
})

let gameStop = false; 
let requestId = 0; 

let all = 0; 
let totalBall = 0; 

let timer = 0;
let timerEnd = 60;
let timeSpeed = 100

let ballArray = [];
let colorsBall = [];
let exp = [];

let bonusx2 = [];
let expBon = [];
let isBonus = true;
let bonusList = {x: Math.random() * 500, y: 600, spx: 1, spy: 1};
let x2 = 1;


let point= 0;
let skipped = 0;
let lostPoint = 0;


let pin = {xPin: 0, yPin: 0};

let wind = [];
let isWind = true;
let direction = 0;
let timerWind = 0;

let isDanger = true;
let expDan = [];
let danger = [];

const bcImage = new Image();
bcImage.src = "https://game-ball-4c061.firebaseapp.com/images/asd.png";

const ballImage = new Image();
ballImage.src = "https://game-ball-4c061.firebaseapp.com/images/ball.png";

const redBallImage = new Image();
redBallImage.src = "https://game-ball-4c061.firebaseapp.com/images/redBall.png";

const gBallImage = new Image();
gBallImage.src = "https://game-ball-4c061.firebaseapp.com/images/greenBall.png";

const pBallImage = new Image();
pBallImage.src = "https://game-ball-4c061.firebaseapp.com/images/purpleBall.png";

const bBallImage = new Image();
bBallImage.src = "https://game-ball-4c061.firebaseapp.com/images/blueBall.png";

const pinImage = new Image();
pinImage.src = "https://game-ball-4c061.firebaseapp.com/images/pin1.png";

const expImage = new Image();
expImage.src = "https://game-ball-4c061.firebaseapp.com/images/x.png";

const bonusImage = new Image();
bonusImage.src = "https://game-ball-4c061.firebaseapp.com/images/x2.png";

const minImage = new Image();
minImage.src = "https://game-ball-4c061.firebaseapp.com/images/min.png";

const expDanImage = new Image();
expDanImage.src = "https://game-ball-4c061.firebaseapp.com/images/xz.png";

const windLeft = new Image();
windLeft.src = "https://game-ball-4c061.firebaseapp.com/images/wind_1.png";

const windRight = new Image();
windRight.src = "https://game-ball-4c061.firebaseapp.com/images/wind_2.png";

colorsBall = [ballImage, redBallImage, gBallImage, pBallImage, bBallImage];

bcImage.onload = () => gameStart();

let timerEndId = setInterval(()=>{
    timerEnd--;
    timerHtml.innerHTML = timerEnd;
}, 1000)

setInterval(()=>{
    direction = direction == 1 ? 0 : 1;
}, 5000)

setTimeout(()=>{
    timeSpeed = 50;
  }, 10000)

setTimeout(()=>{
    timeSpeed = 20;
  }, 30000)

setTimeout(()=>{
    timeSpeed = 5;
  }, 45000)

setTimeout(()=>{
    timeSpeed = 1;
    isWind = false;
  }, 55000)

setTimeout(()=>{
    timerHtml.innerHTML = 'Время вышло';
    gameStop = true;
    clearInterval(timerEndId);
  }, 60000)

let gameStart = () => {
  update();
  render();
  requestId = requestAnimationFrame(gameStart);
};

let update = () => {
  timer++;
  timerWind+=0.5;

  if (timer % timeSpeed == 0 && !gameStop) {
    ballArray.push(
        {
            xBall: Math.random()*600,
            yBall: 600,
            xSpeed: 0,
            ySpeed: Math.random() * (4 - 2) + 2,
            time: Math.random() * 5,
            width: Math.random() * (130 - 80) + 80,
            color: colorsBall[Math.floor(Math.random() * colorsBall.length)],
            flagDeath: 0
        }
    )
  }

    if (timer % 300 == 0 && !gameStop) {
        danger.push(
            {
                x: Math.random()*600,
                y: 600,
                spx: Math.random() * 1,
                spy: Math.random() * 2,
                flagDeath: 0
            }
        )
    }

    if (timer % 1000 == 0 && !gameStop) {
        bonusx2.push(
            {
                x: Math.random()*600,
                y: 600,
                spx: Math.random() * 1,
                spy: Math.random() * 2,
                flagDeath: 0
            }
        )
    }

    if (isWind) {       
        let directionX = -500;
        let directionY = 50;

        if (direction) {
            directionX = 650;
            directionY = 50;
        }

        if (timerWind % 300 == 0 && !gameStop) {
            wind.push(
                {
                    x: directionX,
                    y: directionY,
                    spx: 1,
                    spy: 0,
                    flagDeath: 0
                }
            )
        }
    }

    for (let i = 0; i < ballArray.length; i++) {
        ballArray[i].xBall = ballArray[i].xBall + ballArray[i].xSpeed * ballArray[i].time;
        ballArray[i].yBall -= ballArray[i].ySpeed * ballArray[i].time;
        
        if (isWind) {
            for (let z = 0; z < wind.length; z++) {
                let windPower = wind[z].spx;
                if (direction) {
                    wind[z].x -= wind[z].spx;
                }else{
                    wind[z].x += wind[z].spx;
                }

                if (direction) {
                    if (wind[z].x !== 100) {
                        if (Math.abs(ballArray[i].xBall - wind[z].x) < 600 && Math.abs(ballArray[i].yBall - wind[z].y) < 650) {
                            ballArray[i].xBall -= windPower;
                            ballArray[i].yBall -= windPower;
                        }

                        if (wind[z].x <= 400) {
                            wind[z].spx = 1;
                        }else if (wind[z].x <= 200) {
                            wind[z].spx = 0.5;
                        }
                    }
    
                } else {
                        if (wind[z].x !== 600) {
                            if (Math.abs(ballArray[i].xBall - wind[z].x) < 600 && Math.abs(ballArray[i].yBall - wind[z].y) < 650) {
                                ballArray[i].xBall += windPower;
                                ballArray[i].yBall -= windPower;
                            }
                            if (wind[z].x <= 400) {
                                wind[z].spx = 1;
                            }else if (wind[z].x <= 200) {
                                wind[z].spx = 0.5;
                            }
                    }
                }
            }
        }

        for (let i = 0; i < danger.length; i++) {
            if (isDanger) {
                danger[i].x = danger[i].x + danger[i].spx;
                danger[i].y = danger[i].y - danger[i].spy;
                
                if (danger[i].x >= 500 || danger[i].x < -50) {
                    danger[i].spx = -danger[i].spx;
                }

                if (Math.abs(danger[i].x - pin.xPin) < 50 && Math.abs(danger[i].y - pin.yPin) < 65) {
                    danger[i].flagDeath = 1;
                    point -= 10000;
                    lostPoint += 10000;
                    expDan.push({x: danger[i].x, y: danger[i].y, spx: 0, spy: 0});
                }

                if (danger[i]) {
                    if (danger[i].flagDeath === 1) {
                        danger.splice(i, 1);
                    }
                }
            }

            for (let g = 0; g < expDan.length; g++) {
               expDan[g].spy+=0.1;
                if (expDan[g].spx > 1) {
                    expDan[g].spy++;
                    expDan[g].spx = 0;
                }
                if (expDan[g].spy > 6) {
                    expDan.splice(g, 1);
                }
            }
        }

        for (let i = 0; i < bonusx2.length; i++) {
            if (isBonus) {
                bonusx2[i].x = bonusx2[i].x + bonusx2[i].spx;
                bonusx2[i].y = bonusx2[i].y - bonusx2[i].spy;

                if (bonusx2[i].x >= 500 || bonusx2[i].x < -50) {
                    bonusx2[i].spx = -bonusx2[i].spx;
                }

                if (Math.abs(bonusx2[i].x - pin.xPin) < 50 && Math.abs(bonusx2[i].y - pin.yPin) < 65) {
                    bonusx2[i].flagDeath = 1;
                    x2 *= 2;
                    expBon.push({x: bonusx2[i].x, y: bonusx2[i].y, spx: 0, spy: 0});
                }

                if (bonusx2) {
                    if (bonusx2[i].flagDeath === 1) {
                        bonusx2.splice(i, 1);
                    }
                }
            }
        }


        if (Math.abs(ballArray[i].xBall - pin.xPin) < 50 && Math.abs(ballArray[i].yBall - pin.yPin) < 65) {
            ballArray[i].flagDeath = 1;
            let pointOne = 0;
            
            if (Math.abs(bonusList.x - pin.xPin) < 50 && Math.abs(bonusList.y - pin.yPin) < 65) {
                x2 = 2;
            }

            if (!gameStop) {
                switch (ballArray[i].color.src) {
                    case redBallImage.src:
                        point += (100 * x2);
                        pointOne = (100 * x2);
                        break;
                    case ballImage.src:
                        point += (50 * x2);
                        pointOne = (50 * x2);
                        break;
                    case gBallImage.src:
                        point += (150 * x2);
                        pointOne = (150 * x2);
                        break;
                    case bBallImage.src:
                        point += (200 * x2);
                        pointOne = (200 * x2);
                        break;
                    case pBallImage.src:
                        point += (300 * x2);
                        pointOne = (300 * x2);
                        break;
                    default:
                        break;
                }
                exp.push({x: ballArray[i].xBall, y: ballArray[i].yBall, anx: 0, any: 0, point: pointOne});
            }
            if (!gameStop) {
                totalBall++;
            }
        }
       
            if (ballArray[i].xBall < -50) {
                ballArray[i].xBall = -50;
            }else if(ballArray[i].xBall >= 550){
                ballArray[i].xBall = 550;
            }

            if (ballArray[i].yBall <= -75) {
                if (!gameStop) {
                    skipped++;
                }
                ballArray.splice(i, 1);
            }

            if (ballArray[i]) {
                if (ballArray[i].flagDeath === 1) {
                    ballArray.splice(i, 1);
                }
            }


            for (let g = 0; g < exp.length; g++) {
                exp[g].anx += 1;
                if (exp[g].anx > 5) {
                    exp[g].any++;
                    exp[g].anx = 0;
                }
                if (exp[g].any > 4) {
                    exp.splice(g, 1);
                }
            }


        }

        
        if (gameStop) {
            for (let i = 0; i < ballArray.length; i++) {
              ballArray[i].xSpeed = 0;
              ballArray[i].ySpeed = 10; 
        }
    }
};

canvas.addEventListener('mousemove', (event)=>{
    if (!gameStop) {
        if (event.offsetX <= 25 || event.offsetX <= 585) {
            pin.xPin = event.offsetX - 30;
        }  
    }  
})


let render = () => {
  context.drawImage(bcImage, 0, 0, 600, 600);

    for (let g = 0; g < wind.length; g++) {
        if (direction) {
            context.drawImage(windLeft, wind[g].x, wind[g].y, 500, 500);
        }else{
            context.drawImage(windRight, wind[g].x, wind[g].y, 500, 500);
        }      
    }
   
    for (let g = 0; g < bonusx2.length; g++) {
        context.drawImage(bonusImage, bonusx2[g].x, bonusx2[g].y, 125, 125);
    }
    
    for (let g = 0; g < ballArray.length; g++) {
        context.drawImage(ballArray[g].color, ballArray[g].xBall, ballArray[g].yBall, ballArray[g].width, ballArray[g].width);
    }

    context.drawImage(pinImage, pin.xPin, pin.yPin, 75, 75);


    for (let g = 0; g < danger.length; g++) {
        context.drawImage(minImage, danger[g].x, danger[g].y, 100, 110);
    }

    for (let i = 0; i < exp.length; i++) {
        context.drawImage(expImage, Math.floor(exp[i].anx) * 175, Math.floor(exp[i].any) * 175, 200, 200, exp[i].x, exp[i].y, 125, 125);
        context.fillText(`+${exp[i].point}`, exp[i].x, exp[i].y, 150, 150);
        context.font = 'bold 18px sans-serif';
        context.fillStyle = 'rgb(1, 255, 1)';
    }

    for (let i = 0; i < expDan.length; i++) {
       
        context.drawImage(expDanImage, Math.floor(expDan[i].spx) * 150, Math.floor(expDan[i].spy) * 250, 200, 200, expDan[i].x, expDan[i].y, 75, 75);
        context.fillText(`-10000`, expDan[i].x, expDan[i].y, 150, 150);
        context.font = 'bold 18px sans-serif';   
        context.fillStyle = 'rgb(255, 43, 43)';
    }


  if (gameStop) {
    pin.xPin = -25;

    let colorBlack = 'black';
    let colorRed = 'red';
    let colorGreen = 'rgb(81, 255, 58)';

    context.font = 'bold 30px sans-serif';

    context.fillStyle = colorBlack;
    context.fillText("Конец игры", 200, 145);
    context.fillText("Статистика:", 200, 175);
    context.fillText(`Всего: ${all = point + lostPoint}`, 200, 205);

    context.fillStyle = colorGreen
    context.fillText(`Бонусы: x${x2}`, 200, 235);
    context.fillText(`Засчитано очков: ${point}`, 200, 260);
    context.fillText(`Лопнуто: ${totalBall}`, 200, 285);
   
    context.font = 'bold 30px sans-serif';

    context.fillStyle = colorRed;
    context.fillText(`Пропущено шариков: ${skipped}`, 200, 330);
    context.fillText(`Потеряно очков: ${lostPoint}`, 200, 355);
    
    context.font = 'bold 30px sans-serif';
    context.fillStyle = 'black';


    if (point > localStorage.getItem('record_id_point')) {
        localStorage.setItem('record_id_point', point);
        record_id.innerHTML = localStorage.getItem('record_id_point');
    }
    
    if (totalBall > localStorage.getItem('record_id_ball')) {
        localStorage.setItem('record_id_ball', totalBall);
        record_id_ball.innerHTML = localStorage.getItem('record_id_ball');
    }

   
    cancelAnimationFrame(requestId)
  }
};
