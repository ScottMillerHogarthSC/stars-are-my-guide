var container,jumpingtxt,speechtxt,audio,oww,pointstxt,points=0,
    _currentLoop=0,
    _totalLoops=1,
    _useReplayBtn=true,
    _endframeReached=false;
var body = document.body,
html = document.documentElement;
var pageHeight = Math.max( body.scrollHeight, body.offsetHeight, 
html.clientHeight, html.scrollHeight, html.offsetHeight );


var tlintro = gsap.timeline(),
    tl = gsap.timeline(),
    tlfg = gsap.timeline(),
    tlbg = gsap.timeline(),
    tlstarsBG = gsap.timeline(),
    tlhair = gsap.timeline(),
    tlLyrics = gsap.timeline();


function init()
{
    console.log("init");

    // main content
    container = document.getElementById("container");
    jumpingtxt = document.getElementById("jumpingtxt");
    speechtxt = document.getElementById("speechtxt");
    pointstxt = document.getElementById("pointstxt");

    btnReplay = document.getElementById("btnReplay");
    introTxt0 = document.getElementById("introTxt0");
    cta = document.getElementById("cta");
    
    bg = document.getElementsByClassName("bg");
    audio = document.getElementById("audio");
    oww = document.getElementById("oww");
        
    
    resizeWindow()


    gsap.set(player,{x:0,y:0,scale:1,alpha:1});
    gsap.set([flame,gameover],{alpha:0});

    preloadAudio();   
}

function preloadAudio(){
    console.log("preloadAudio");

    // audio.addEventListener('canplaythrough', loadedAudio, false);
    // loadedAudio();

    // [todo] preloader for audio!
    loadedAudio();
}

function loadedAudio(){
    console.log("loaded Audio");

    // Start Ad
    document.getElementById("loadingContent").style.display="none";
    container.style.display = "block";

    document.body.addEventListener('keypress', startGame);
}

var holdFrame = function(frame, time) {
    var delay = time*1000;
    frameWaitTimer = window.setTimeout(function(){showFrame(frame);}, delay);
}

function keypress(e){
    if(!collided && !isSongToEnding){

    
        if(e.code=="KeyJ") {
            wheelie();
        }
        if(e.code=="KeyK") {
            gsap.killTweensOf(backtoBounce);
            $('#introBtnK').addClass('pressedK');
            
            jump();
        }
        if(e.code=="KeyL") {
            nollie();
        }


        if(e.code=="KeyD") {
            forwards();
            $('#introBtn').addClass('pressedD');
        }
        if(e.code=="KeyA") {
            backwards();
            $('#introBtn').addClass('pressedA');

        }
        if(e.code=="KeyW") {
            upwards();
            $('#introBtn').addClass('pressedW');
        }
        if(e.code=="KeyS") {
            downwards();
            $('#introBtn').addClass('pressedS');
        }

        // pause 
        if(e.code=="KeyZ"){
            gamePause();
            pausedtxt.innerHTML="paused";

        }
        // mute (pause) 
        if(e.code=="KeyM"){
            gamePause();
            pausedtxt.innerHTML="muted";
        }

        // // end 
        // if(e.code=="KeyZ"){
        //     // playerCollided();
        // }

    }
}

function keyUp(){
    $('#introBtn,#introBtnK').removeClass();
}

function shoot() {

}

function gamePause() {
    gsap.killTweensOf(detectCollision);
        
    audio.pause();


    document.body.removeEventListener('keypress', startGame);
    
    tlfg.pause();
    tlbg.pause();
    tlstarsBG.pause();
    tlintro.pause();
    tl.pause();

    $('#rider').removeClass('riderBounce');
    $('#rider').removeClass('riderFly');
    $('#shadow').removeClass('shadowBounce');


    jumpingtxt.innerHTML="pause";
    gsap.set(pausedtxt,{alpha:1});

    document.body.addEventListener('keypress', gameResume);

}

function gameResume() {
    console.log('resume');

    document.body.removeEventListener('keypress', gameResume);

    // resuming after crash
    if(collided) {
        collided=false;

        gsap.set([speechbub,flame,resumetxt],{alpha:0});
        gsap.set(player,{x:0,y:0,rotationZ:0,rotationY:0,scale:1,alpha:1});



        gsap.delayedCall(1,detectCollision);
    } else {
        gsap.delayedCall(0.01,detectCollision);
    }
    collideAll="";
    audio.play();
    audio.volume = 1;

    


    
    tlintro.resume();
    tl.resume();
    tlbg.resume();  
    tlstarsBG.resume();
    tlfg.resume();  

    $('#rider').addClass('riderBounce');
    $('#rider').addClass('riderFly');
    $('#shadow').addClass('shadowBounce');

    
    jumpingtxt.innerHTML="go";
    
    
    gsap.set(pausedtxt,{alpha:0});

    document.body.addEventListener('keypress', keypress);
    document.body.addEventListener('keyup', keyUp);
}




var isJumping = false;
var jumpCount = 0;
function jump() {
    gsap.killTweensOf(notJumping);
    gsap.killTweensOf(backtoBounce);


    isJumping=true;
    jumpCount++;
    jumpingtxt.innerHTML="jump";

    if(jumpCount % 4 === 0){
        speechtxt.innerHTML="primitaaaii";    
        gsap.set(speechbub,{alpha:1});
        gsap.to(speechbub,0,{alpha:0,delay:1.5});
    }
    

    $('#rider').removeClass('riderBounce');
    $('#shadow').removeClass('shadowBounce');

    gsap.to([rider],1,{y:-100})
    gsap.to([speechbub],1,{y:-157})
    
    gsap.to([speechbub],1.5,{y:-57,delay:1,ease:Bounce.easeOut})
    gsap.to([rider],1.5,{y:0,delay:1,ease:Bounce.easeOut})

    gsap.set(shadow,{alpha:.4})
    gsap.to(shadow,1,{alpha:0,scaleX:.6})
    
    gsap.to(shadow,1.5,{alpha:.5,scaleX:1,delay:1,ease:Bounce.easeOut})
    
    gsap.delayedCall(1.7,notJumping);
}

function notJumping(){
    isJumping=false; 
    jumpingtxt.innerHTML="go";
    gsap.delayedCall(.6,backtoBounce);
}

var wheelieCount=0;
function wheelie() {
    wheelieCount++;

    $('#rider').removeClass('riderBounce');
    $('#shadow').removeClass('shadowBounce');

    if(tl.isActive() && wheelieCount % 3 === 0)
    {
        speechtxt.innerHTML="right on!!";    
        gsap.set(speechbub,{alpha:1});
        gsap.delayedCall(.7,function(){
            jumpingtxt.innerHTML="go";
            speechtxt.innerHTML="";
            gsap.to(speechbub,0,{alpha:0});
        })
    }

    points++;
    
    gsap.to("#rider-go",1,{rotationZ:-30})
    gsap.to("#rider-jets",1,{x:2,y:24,skewY:13})
    
    gsap.to(shadow,1,{x:-10,scaleX:.7})
    gsap.to(shadow,1.5,{x:0,scaleX:1,delay:1,ease:Bounce.easeOut})
    
    gsap.to("#rider-go",1.5,{rotationZ:0,delay:1,ease:Bounce.easeOut});
    gsap.to("#rider-jets",1.5,{x:0,y:0,skewY:0,delay:1,ease:Bounce.easeOut})
    gsap.delayedCall(2.4,backtoBounce);
}


function nollie() {
    $('#rider').removeClass('riderBounce');
    $('#shadow').removeClass('shadowBounce');

    jumpingtxt.innerHTML="woah";
    speechtxt.innerHTML="";

    gsap.to(rider,1,{rotationZ:30})
    gsap.to(shadow,1,{x:-45})
    gsap.to(shadow,1.5,{x:0,delay:1,ease:Bounce.easeOut})
    
    gsap.to(rider,1.5,{rotationZ:0,delay:1,ease:Bounce.easeOut});
    gsap.delayedCall(2.4,backtoBounce);
}

var backwardsCount = 0;
function backwards() {
    backwardsCount++;
    $('#player').removeClass('forwards');   

    jumpingtxt.innerHTML="hit the brakes";

    if(tl.isActive() && backwardsCount % 3 === 0)
    {
        jumpingtxt.innerHTML="yo butt head!!";
        speechtxt.innerHTML="what the hell?";
        gsap.set(speechbub,{alpha:1});
        gsap.delayedCall(.7,function(){
            jumpingtxt.innerHTML="go";
            speechtxt.innerHTML="";
            gsap.to(speechbub,0,{alpha:0});
        })
    }

    

}
function forwards() {
    $('#player').addClass('forwards');
    jumpingtxt.innerHTML="drive";
    gsap.delayedCall(1,function(){
        jumpingtxt.innerHTML="go";
    })
}
function upwards() {
    gsap.to(player,.75,{top:"210px",ease:Power1.easeInOut});
    gsap.to(playerMovements,.75,{z:-75,ease:Power1.easeInOut});

    jumpingtxt.innerHTML="turn";
    gsap.delayedCall(0.2,function(){
        jumpingtxt.innerHTML="go";
    })
}
function downwards() {
    gsap.to(player,.75,{top:"345px",ease:Power1.easeInOut});
    gsap.to(playerMovements,.75,{z:0,ease:Power1.easeInOut});
    jumpingtxt.innerHTML="turn";
    gsap.delayedCall(0.2,function(){
        jumpingtxt.innerHTML="go";
    })
}

function backtoBounce(){
    if(isJumping){
        isJumping=false;
    }
    // jumpingtxt.innerHTML="go";
    // speechtxt.innerHTML="";


    $('#rider').addClass('riderBounce');
        $('#shadow').addClass('shadowBounce');
        $('#rider').addClass('riderFly');
    }



    /**
     * switch statement for animating ad
     */
    function startGame()
    {
        points=0;

        audio.currentTime=85;
        audio.play();

        document.body.removeEventListener('keypress', startGame);

        // reset
        gsap.set([flame,gameover,"#rider-stopped"],{alpha:0});
        gsap.set(["#player","#rider-go"],{alpha:1});

        $("#introTxt0").hide();
        
        backtoBounce();
            
    document.body.addEventListener('keypress', keypress);
    document.body.addEventListener('keyup', keyUp);
    
    

    tlbg = gsap.timeline({repeat:-1});
    tlstarsBG = gsap.timeline({repeat:-1});
    tlhair = gsap.timeline({repeat:-1});
    tlLyrics = gsap.timeline();

    tlfg = gsap.timeline({onComplete:fgTimeLineComplete});

    TweenMax.fromTo(tlstarsBG,4,{timeScale:0},{timeScale:1,ease:Power1.easeIn})
    TweenMax.fromTo(tlbg,4,{timeScale:0},{timeScale:1,ease:Power1.easeIn})


    tlintro = gsap.timeline({onComplete:playObstaclesTL});
    tlintro.addLabel("FGs BGs", "<")
        .add(writeLyrics, "<")
        .add(playBGs,"<")
        .add(playStarsBG,"<")
        .add(playHairTl,"<")
        
        .set("#fg-intro",{alpha:1},"<")
        
        // reset obs
        .set(".obstacle", {alpha:1,left:obsStartLeft}, "<")

        .to("#fg-intro",5,{x:"-100%",ease:Power1.easeIn},"<")

        .set(fgToGo1,{alpha:1,x:fgWidth},"-=1.25")
        .to(fgToGo1,(fgSpeed/2),{x:0,ease:Linear.easeNone},">")

        .add(playFGs,"<")
    
    // .addLabel("intro txt", "1")
        .set(introTxt1,{alpha:1},"1")
        .call(typeText,["introTxt1"],"1")
        
        .set(introTxt1,{alpha:0},"4")
        
        .call(typeText,["introTxt2"],"5")
        .set(introTxt2,{alpha:1},"5")
        .set(introTxt2,{alpha:0},"8")

        .set(introTxt3,{alpha:1},"<1")
        .set(introTxt3,{alpha:0},"<5")

        .set(introTxt4,{alpha:1},"<.75")
        .set(introTxt4,{alpha:0},"<2");
        
}

function typeText(whichEle){

    // typewriter text
    var whichEleID = document.getElementById(whichEle);
    var txtToType = whichEleID.innerText;
    var tmpTextArr=[];
    var totalletters=txtToType.length;
    for(i=0; i<totalletters;i++){
        tmpTextArr[i] = txtToType.charAt(i);
    }
    whichEleID.innerText="";
    var count=0;
    function writeLetter (){
            if(tmpTextArr[count]==" ") {
                whichEleID.innerHTML+="&nbsp";
            } else {
            whichEleID.innerText+=tmpTextArr[count];
        }
        count++;
    }
    var speed = 0.1;
    for(i=0; i<totalletters;i++){
        gsap.delayedCall(i*speed, writeLetter)
    }
}



var fgWidth = 1800;
var fgSpeed = 2;
function playFGs() {
    
    // console.log('fg timeline go');
    tlfg.addLabel('fg loop', '<')
        .set([fgToGo1],{alpha:1,x:0},"<")
        .set([fgToGo2],{alpha:1,x:fgWidth},"<")
        .set([fgToGo3],{alpha:1,x:fgWidth},"<")
        
        .to(fgToGo1,fgSpeed,{x:-fgWidth,ease:Linear.easeNone},">")
        .to(fgToGo2,fgSpeed,{x:0,ease:Linear.easeNone},"-="+fgSpeed)
        .to(fgToGo2,fgSpeed,{x:-fgWidth,ease:Linear.easeNone},">")
        .to(fgToGo3,fgSpeed,{x:0,ease:Linear.easeNone},"-="+fgSpeed)
}


var bgWidth = 1800,
    bgSpeed = 10;
function playBGs() {
    tlbg.addLabel('bgLoop', '<')
        .set([bgToGo1],{alpha:1,x:0})
        .set([bgToGo2],{alpha:1,x:bgWidth})
        .set([bgToGo3],{alpha:1,x:bgWidth})
        
        .to(bgToGo1,bgSpeed,{x:-bgWidth,ease:Linear.easeNone},">")
        .to(bgToGo2,bgSpeed,{x:0,ease:Linear.easeNone},"-="+bgSpeed)
        .to(bgToGo2,bgSpeed,{x:-bgWidth,ease:Linear.easeNone},">")
        .to(bgToGo3,bgSpeed,{x:0,ease:Linear.easeNone},"-="+bgSpeed)
}


var starsBGWidth = 1300,
    starsBGSpeed = 5;
function playStarsBG() {

    tlstarsBG.addLabel('starsBGLoop', '<')
        .set([bgStars1],{alpha:.3,x:0})
        .set([bgStars2],{alpha:.3,x:starsBGWidth})
        .set([bgStars3],{alpha:.3,x:starsBGWidth})
        
        .to(bgStars1,starsBGSpeed,{x:-starsBGWidth,ease:Linear.easeNone},">")
        .to(bgStars2,starsBGSpeed,{x:0,ease:Linear.easeNone},"-="+starsBGSpeed+"")
        .to(bgStars2,starsBGSpeed,{x:-starsBGWidth,ease:Linear.easeNone},">")
        .to(bgStars3,starsBGSpeed,{x:0,ease:Linear.easeNone},"-="+starsBGSpeed);
}


var hairspeed = 1,
    maxhairspeed=5;
function playHairTl() {
    tlhair.addLabel('rider','<')
        .add(function(){ 
            if(hairspeed<maxhairspeed) {
                hairspeed++;
                tlhair.timeScale(hairspeed/maxhairspeed);
                console.log("hair:"+hairspeed/maxhairspeed);

            }
        })
        .set('#hair-go1',{alpha:1},"<")
        .set('#hair-go1',{alpha:0},"+=0.1")
        .set('#hair-go2',{alpha:1},"<")
        .set('#hair-go2',{alpha:0},"+=0.1")
        .set('#hair-go3',{alpha:1},"<")
        .set('#hair-go3',{alpha:0},"+=0.1")
        
}



function increaseSpeed(initspeed,maxspeed,thisTL){ 
    if(initspeed<maxspeed) {
        initspeed++;
        thisTL.timeScale(initspeed/maxspeed);
    }
}

var obsSpeed = 1.5;
var obsStartLeft = 1000;
var obsEndLeft = -420;
function playObstaclesTL(){
    // obstacles timeline! 
    gsap.killTweensOf(detectCollision);
    detectCollision();

    tl = gsap.timeline({onComplete:timeLineComplete});
    tl.addLabel("stage1", "<")
        .set("#player", {alpha:1}, "<")

        // hole
        .set(".hole", {left:obsStartLeft+"px"}, ">2")
        .to(".hole", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">")

        // bridge
        .set("#obstacle4", {left:obsStartLeft+"px"}, ">2")
        .to("#obstacle4", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">")

        // bridge
        .set("#obstacle4", {left:obsStartLeft+"px"}, ">2")
        .to("#obstacle4", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">")

        // bridge
        .set("#obstacle4", {left:obsStartLeft+"px"}, ">2")
        .to("#obstacle4", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">")

        // bridge
        .set("#obstacle4", {left:obsStartLeft+"px"}, ">2")
        .to("#obstacle4", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">")

        // bridge
        .set("#obstacle4", {left:obsStartLeft+"px"}, ">2")
        .to("#obstacle4", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">")

        // bridge
        .set("#obstacle4", {left:obsStartLeft+"px"}, ">2")
        .to("#obstacle4", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">")
        



        // wall R
        .set("#obstacle3", {left:obsStartLeft+"px"}, ">")
        .to("#obstacle3", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">1")

        // wall R
        .set("#obstacle3", {left:obsStartLeft+"px"}, ">")
        .to("#obstacle3", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">1")

        // wall L
        .set("#obstacle2", {left:obsStartLeft+"px"}, ">2")
        .to("#obstacle2", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">1")

        // wall L
        .set("#obstacle2", {left:obsStartLeft+"px"}, ">")
        .to("#obstacle2", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">1")
        
        // hole
        .set("#obstacle1", {left:obsStartLeft+"px"}, ">2")
        .to("#obstacle1", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">")


        // wall R
        .set("#obstacle3", {left:obsStartLeft+"px"}, ">3")
        .to("#obstacle3", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">")

        // wall R
        .set("#obstacle3", {left:obsStartLeft+"px"}, ">")
        .to("#obstacle3", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">")

        // wall L
        .set("#obstacle2", {left:obsStartLeft+"px"}, ">2")
        .to("#obstacle2", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">")

        // wall L
        .set("#obstacle2", {left:obsStartLeft+"px"}, ">")
        .to("#obstacle2", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">")
            
            
        .to("#tilt",10,{rotationZ:5,x:0,y:10},">")
        
        .set("#obstacle1", {alpha:1,left:obsStartLeft+"px"}, ">")
        .to("#obstacle1", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">1")
        
        .to("#tilt",10,{rotationZ:0,x:0,y:0},">")
}

var reps = 0;
var numberOfLoops = 20;
var collided = false;
function timeLineComplete() {
    // console.log(audio.currentTime);
    if (reps < numberOfLoops) {
        if(!collided && !isSongToEnding)
            tl.restart();
    } else {
        // stop playing
    }

    reps++;
}



var collided = false;
var isSongToEnding = false;
var songEndTime = 283;
// var songEndTime = 90; [for testing]
var endingPlayed = false;
function fgTimeLineComplete() {
    gsap.to(".fgToGo",{alpha:1});

    if(Math.floor(audio.currentTime)>=songEndTime) {
        isSongToEnding=true;
    }
    if (!isSongToEnding && !collided) {
        //

    } else if(!endingPlayed){    
        playEnding();
    }
    
    tlfg.restart();
}

function playEnding(){
    endingPlayed=true;
    
    // play ending!!
    gsap.killTweensOf(detectCollision);
    gsap.killTweensOf(backtoBounce);
    gsap.killTweensOf(notJumping);
    
    gsap.set([pointstxt,jumpingtxt],{alpha:0});

    
    $('#shadow').removeClass('shadowBounce');

    var tlEnding = gsap.timeline({onComplete:tlEndingComplete});
        tlEnding.addLabel("ending", "<")
        .to("#shadow",2,{alpha:0,overwrite:true},"0")
        .to("#tilt",5,{y:250,ease:Power1.easeIn},"<")
        .to("#player",2,{rotationZ:-10,ease:Power1.easeIn},"<")
        .to("#player",5,{x:222,y:-370,ease:Power1.easeIn},"<")
        .to("#player",2,{x:1000,y:-630,ease:Back.easeIn},">");
}

function tlEndingComplete(){
    // [todo]
    // all endin
    // stop all timelines
    // show high score
    $("#scoretxt").html(points);
    
    $("#pointstxt").html(points);

    gsap.set(endtxt,{display:"block", alpha:1})

    document.getElementById('initialstxt').focus();

    tl.pause();
    tlintro.pause();
    tlfg.pause();

}

var overlaps = (function () {
    function getPositions( elem ) {
        var pos, width, height;
        pos = $( elem ).position();
        width = $( elem ).width();
        height = $( elem ).height();
        return [ [ pos.left, pos.left + width ], [ pos.top, pos.top + height ] ];
    }

    function comparePositions( p1, p2 ) {
        var r1, r2;
        r1 = p1[0] < p2[0] ? p1 : p2;
        r2 = p1[0] < p2[0] ? p2 : p1;
        return r1[1] > r2[0] || r1[0] === r2[0];
    }

    return function ( a, b ) {
        var pos1 = getPositions( a ),
            pos2 = getPositions( b );
        return comparePositions( pos1[0], pos2[0] ) && comparePositions( pos1[1], pos2[1] );
    };
})();


var collidedTxts=["move the wreck!",
                "move the wreck!",
                "outta my way!!",
                "outta my way!!",
                "aaargh",
                "oh no!",
                "@#$%&!0",
                "@#$%&!0"];
var collide;
var collideAll;
var area = $( '#area' )[0],
    player = $( '#player' )[0];
function detectCollision() {
    
    collide = ($( area ).children().not( player ).map( function ( i ) {
        return 'obstacle'+(i+1) + ":" + overlaps( player, this );
    }).get());
    collideAll = collide.join( ',' );

    if(collideAll.includes("true")){

        for(i=0; i < collide.length; i++){
            if(collide[i].includes("true")) {
                console.log(collide);
                var obstacleHit = collide[i].split(':')[0];
                playerCollided(obstacleHit);
            }
        }
    }
    
    if(!collided) {
        points++;
        pointstxt.innerHTML=points;
        gsap.delayedCall(.025,detectCollision)
    }
} 

function playerCollided(whichObstacleHit) {
    if(!isJumping && whichObstacleHit!="obstacle4") {
        
        doObstacleHit();

        if(whichObstacleHit=="obstacle1" && !isJumping) {
            
            // hole

            points=points-100;
            pointstxt.innerHTML=points;


            // get player Pos so we can do right "falling down hole" animation:
            var playerTop = player.getBoundingClientRect().top,
                yAmount,
                rotateZAmount,
                rotateYAmount;

            // console.log(playerTop);
            if(playerTop<=500)
            {
                yAmount = 90;
                rotateZAmount = 40;
                rotateYAmount = 0;
            } else if(playerTop>=300 && playerTop<500){
                yAmount = 45;
                rotateZAmount = 40;
                rotateYAmount = 0;
            } else {
                yAmount = -20;
                rotateZAmount = 40;
                rotateYAmount = 20;
            }

            gsap.to(player,1,{x:240,y:yAmount,rotationZ:rotateZAmount,rotationY:rotateYAmount,scale:.4});
            gsap.to(player,.5,{alpha:0,delay:.5});

            gsap.to(shadow,.2,{alpha:0})
            
            // say random phrase:
            var whichPhrase = Math.floor(Math.random() * collidedTxts.length-1) + 1; 
            jumpingtxt.innerHTML=collidedTxts[whichPhrase];

            speechtxt.innerHTML=collidedTxts[4];

            gsap.set(speechbub,{alpha:1});
            gsap.to(speechbub,0,{alpha:1,delay:0});


            // setup kkeypress to resume:
            gsap.set(resumetxt,{alpha:1,delay:1,onComplete:function(){
                document.body.addEventListener('keypress', gameResume);
            }});
        } 
        else if(whichObstacleHit=="obstacle2" || whichObstacleHit=="obstacle3") {
            // wall
            doRiderCrash();
        }
    } else if(whichObstacleHit=="obstacle4") {

            if(!isJumping){
                // if we hit a bridge while not jumping (dont stop!)
                // do nothing
                console.log('went under bridge');
            } else {
                // if we hit a bridge while jumping
                isJumping=false;
                doObstacleHit();

                doRiderCrash();
            }
    }
}

function doObstacleHit() {
    collided=true;
        
    gsap.killTweensOf(backtoBounce);
    gsap.killTweensOf(notJumping);
    gsap.killTweensOf(detectCollision);
    gsap.killTweensOf(player);
    gsap.killTweensOf(playerMovements);

    audio.volume = 0.3;

    $('#rider').removeClass('riderBounce');
    $('#shadow').removeClass('shadowBounce');
    
    tlfg.pause();
    tlbg.pause();
    tlstarsBG.pause();
    tl.pause();
}

function doRiderCrash(){
    points=points-100;
    pointstxt.innerHTML=points;


    $('#rider').removeClass('riderFly');

    oww.play();

    gsap.set(flame,{alpha:1});

    // say random phrase:
    var whichPhrase = Math.floor(Math.random() * collidedTxts.length-1) + 1; 
    
    // say move the wreck hahah
    jumpingtxt.innerHTML=collidedTxts[whichPhrase];

    // another random phrase:
    whichPhrase = Math.floor(Math.random() * collidedTxts.length-1) + 1; 

    speechtxt.innerHTML=collidedTxts[whichPhrase];

    gsap.set(speechbub,{alpha:1});
    gsap.to(speechbub,0,{alpha:0,delay:3});

    // setup kkeypress to resume:
    gsap.set(resumetxt,{alpha:1,delay:1,onComplete:function(){
        document.body.addEventListener('keypress', gameResume);
    }});
}

function writeLyrics(){
    // var mySplitText = new SplitText(lyricstxt, {type:"lines",position:"absolute"}),
    //     numLines = mySplitText.lines.length;
        
    //     for(var i = 0; i < numLines; i++){
    //         TweenMax.set(mySplitText.lines[i], {alpha:0});
    //     }
    //     TweenMax.set(lyricstxt, {alpha:1}); 
    //     for(var i = 0; i < numLines; i++){
    //         TweenMax.set(mySplitText.lines[i], {alpha:1,delay:1*i});
    //         TweenMax.set(mySplitText.lines[i], {alpha:0,delay:(1*i)+1});
    //     }
}



function getWindowSize(){
    windowheight = window.innerHeight;
    windowwidth = window.innerWidth;
    body = document.body,
    html = document.documentElement;

    pageHeight = Math.max( body.scrollHeight, body.offsetHeight, 
    html.clientHeight, html.scrollHeight, html.offsetHeight );
}

function resizeWindow(){
    getWindowSize();
    console.log(windowwidth);
    gsap.set([wrap],{height:windowheight});
    gsap.set([wrap],{width:windowwidth});
    
}