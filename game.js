window.addEventListener('load',game,false);

var canvas=document.getElementById("canvas");
var ctx= canvas.getContext("2d");

document.getElementById('1').hidden=true;
document.getElementById('2').hidden=true;
document.getElementById('3').hidden=true;
document.getElementById('4').hidden=true;
document.getElementById('5').hidden=true;

var box=50; // 1 satır veya sütunda toplam 12 kutu, duvarlar haricinde 10 kutu
var face={
    x:box,
    y:box
};
var ghost = new Image();
ghost.onload = function(){
    ctx.drawImage(ghost,face.x,face.y,box,box);
};
ghost.src='ghost.png';

//anahtarın koordinatlarını tutacak parametreler
var xKey;
var yKey;
var keyCount=0;
var keyimg = new Image();

//kapının koordinatlarını tutacak parametreler
var xDoor;
var yDoor;

//oyunun devam edip etmediğini belirleyecek parametre
var running=true; 

//hareket yönünü belirlemede yardımcı parametreler
var right=false;
var left=false;
var up=false;
var down=false;


function drawFace(){
    //duvarlar haricinde oyun alanını her seferinde sıfırlayıp yeni koordinatlara göre karekteri çizen fonksiyon
    ctx.clearRect(box,box,canvas.width-(2*box),canvas.height-(2*box));
    ctx.drawImage(ghost,face.x,face.y,box,box);
}

function move(){
    //yönü belirleyen fonksiyon
    onkeydown = function(event){
        var key=event.key
        if(key=="ArrowRight"){
            right=true;
            left=false;
            up=false;
            down=false;
        }
        if(key=="ArrowLeft"){
            right=false;
            left=true;
            up=false;
            down=false;
        }
        if(key=="ArrowUp"){
            right=false;
            left=false;
            up=true;
            down=false;
        }
        if(key=="ArrowDown"){
            right=false;
            left=false;
            up=false;
            down=true;
        }
    };

    //belirlenen yöne göre hareketi karaktere uygulayan kısım
    if(left){
        face.x=face.x-box;
    }
    if(right){
        face.x=face.x+box;
    }
    if(up){
        face.y=face.y-box;
    }
    if(down){
        face.y=face.y+box;
    }
}

function drawKeys(){
    //anahtarların duvarların iç kısmında kalması istenir
    //bu yüzden 0 ile 9 arasında rastgele değer üretilir
    //ancak koordinat verilirken bu üretilen değere 1 eklenir
    //böylece duvarların üzerine anahtar gelmesi önlenir
    xKey=(Math.floor(Math.random()*10))+1;
    xKey=xKey*box;
    yKey=(Math.floor(Math.random()*10))+1;
    yKey=yKey*box;
    keyimg.onload = function(){
    ctx.drawImage(keyimg,xKey,yKey,box,box);
    };
    keyimg.src='key.png';
}

function checkKeys(){
    if((xKey==face.x)&&(yKey==face.y)){ //toplanması gereken 5 anahtar henüz toplanmamışsa
        keyCount++;
        document.getElementById(keyCount.toString()).hidden=false;
        if(keyCount!=5){
            drawKeys();//yeni anahtar üretilir
        }
    }
    else{ //aynı anahtar tekrar çizdirilir
        if(keyCount!=5){
            ctx.drawImage(keyimg,xKey,yKey,box,box);
        }
    }
}

function drawWalls(){ //oyunun alanının etrafını duvarlarla çevirir
    var wall=new Image();
    wall.onload = function(){
        for(var i=0;i<144;i++){
            if(i<12){ //üst duvarlar
                ctx.drawImage(wall,i*box,0,box,box);
            }
            if(i%12==0){ //sol duvarlar
                ctx.drawImage(wall,0,(i/12)*box,box,box);
            }
            if(i%12==11){ //sağ duvarlar
                ctx.drawImage(wall,11*box,(i%11)*box,box,box);
            }
            if(i>131){ //alt duvarlar
                ctx.drawImage(wall,(i%12)*box,11*box,box,box);
            }
        }
    };
    wall.src='wall.jpg';
}

function drawDoor(){
    var loc=Math.floor(Math.random()*4);//üst,sol,sağ,alt belirleyecek
    var pos=(Math.floor(Math.random()*10))+1;//1 ile 9 arası sayı üretip koordinatı belirleyecek
    if(loc==0){ //üst kenarda
        xDoor=pos*box;
        yDoor=0;
    }
    else if(loc==1){ //sol kenarda
        xDoor=0;
        yDoor=pos*box;
    }
    else if(loc==2){ //sağ kenarda
        xDoor=11*box;
        yDoor=pos*box;
    }
    else{ //alt kenarda
        xDoor=pos*box;
        yDoor=11*box;
    }

    //resim yüklenir
    var door=new Image();
    door.onload = function(){
        ctx.drawImage(door,xDoor,yDoor,box,box);
    };
    door.src='door.jpg';
    
}

function checkGame(){ //oyunun bitip bitmediğini kontrol eder
    //eğer duvarlara çarpılmışsa
    if((face.x<box) || (face.x>(10*box)) || (face.y<box) || (face.y>(10*box))){ 
        running=false;
        gameOver();
        if(keyCount!=5){ //ve anahtar sayısı 5 değilse
            failure(); //yenilgi
        }
        else{ //anahtar sayısı 5 ise
            if((xDoor==face.x)&&(yDoor==face.y)){ //çarpılan duvar mı kapı mı?
                victory(); //kapı ise zafer
            }
            else{
                failure(); //değil ise yenilgi
            }
        }
    }
}

function gameOver(){ //sadece bilgilendirme yazısı yazdırır
    ctx.fillStyle="white";
    ctx.font = "bold 50px Arial";
    ctx.fillText("GAME OVER",150,300);
    ctx.font = "20px Arial";
    ctx.fillText("Click the game area to restart.",170,400);
}
function victory(){ //sadece bilgilendirme yazısı yazdırır
    ctx.fillStyle="white";
    ctx.font = "20px Arial";
    ctx.fillText("You've won!",250,330);
}
function failure(){ //sadece bilgilendirme yazısı yazdırır
    ctx.fillStyle="white";
    ctx.font = "20px Arial";
    ctx.fillText("You've lost!",250,330);
}

function instructions(){ //sadece bilgilendirme yazısı yazdırır
    if(right==false && left==false && up==false && down==false){
        ctx.fillStyle="white";
        ctx.font ="bold 30px Arial";
        ctx.fillText("WELCOME TO ESCAPE ROOM",75,250);
        ctx.font = "25px Arial";
        ctx.fillText("1) Collect 5 keys.",200,300);
        ctx.fillText("2) Go to the door.",200,330);
        ctx.fillText("3) Win the game!",200,360);
        ctx.fillText("Press arrow keys to start...",150,425);
    }
}

function restart(){ //kullanıcının mouse tıklamasıyla oyun tekrar başlar
    window.addEventListener('click',function(event){
        //mouse tıklamasının koordinatları belirlenir
        var xmouse = event.pageX - canvas.offsetLeft;
        var ymouse = event.pageY - canvas.offsetTop;
        //eğer mouse canvas sınırları içinde ise
        if(xmouse>0 && xmouse<canvas.width && ymouse>0 && ymouse<canvas.height){
            //oyun parametreleri en baştaki haline geri döndürülür
            keyCount=0;
            face.x=box;
            face.y=box;
            right=false;
            left=false;
            up=false;
            down=false;
            running=true;
            document.getElementById('1').hidden=true;
            document.getElementById('2').hidden=true;
            document.getElementById('3').hidden=true;
            document.getElementById('4').hidden=true;
            document.getElementById('5').hidden=true;

            //gerekli fonksiyonlar tekrar çağırılır
            drawKeys();
            drawWalls();
            drawDoor();
            game();
        }
    });
    
}


drawKeys();
drawWalls();
drawDoor();

function game(){
    move();
    drawFace();
    checkKeys();
    checkGame();
    instructions();
    if(running){
        setTimeout(game,200);
    }
    else{
        restart();
    }
}
