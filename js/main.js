var gameSpeed = 1;
var introSpeed = 1;
var cheat = "";
var isCheat = false;



var container,jumpingtxt,speechtxt,audio,oww,pointstxt,points=0;
var body = document.body,
html = document.documentElement;
var pageHeight = Math.max( body.scrollHeight, body.offsetHeight, 
html.clientHeight, html.scrollHeight, html.offsetHeight );

var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

var btnMoveUp, btnMoveForwards, btnMoveBackwards, btnMoveDown, btnJump, btnOption, replayBtn, shareBtn;

var tlIntroScreen = gsap.timeline(),
    tlintro = gsap.timeline(),
    tlInstructions = gsap.timeline(),
    tl = gsap.timeline(),
    tlfg = gsap.timeline(),
    tlbg = gsap.timeline(),
    tlstarsBG = gsap.timeline(),
    tlMountainsBG = gsap.timeline(),
    tlCloudsBG = gsap.timeline(),
    tlhair = gsap.timeline(),
    tlramp = gsap.timeline(),
    tlLyrics = gsap.timeline(),
    tlScream=gsap.timeline(),
    tlEnding = gsap.timeline(),
    primScreamTL = gsap.timeline(),
    tlFlyPast = gsap.timeline();

// turn on any cheats
if(window.location.search!=""){
    cheat = window.location.search.split("?")[1];

    switch (cheat){
        case "rampMode":
            isCheat = true;
            cheatstxt.innerHTML=cheat;
            cheatstxt.style.display="block";        
            break;
        
        case "clearMode":
            isCheat = true;        
            cheatstxt.innerHTML=cheat;
            cheatstxt.style.display="block";        
            break;

        case "fastMode":
            isCheat = true;        
            cheatstxt.innerHTML=cheat;
            cheatstxt.style.display="block";
            gameSpeed = .5;
            introSpeed = 10;
            break;

        case "quickerMode":
            isCheat = true;        
            cheatstxt.innerHTML=cheat;
            cheatstxt.style.display="block";
            gameSpeed = .6;
            // introSpeed = 10;
            break;

        case "fzeroMode":
            isCheat = true;        
            cheatstxt.innerHTML=cheat;
            cheatstxt.style.display="block";
            document.getElementById("optionsScreen").classList.add("fzero");
            document.getElementById("area").classList.add("fzero");
            break;
    }
}


function init()
{
    console.log("init");

    // main content
    container = document.getElementById("container");
    jumpingtxt = document.getElementById("jumpingtxt");
    speechtxt = document.getElementById("speechtxt");
    pointstxt = document.getElementById("pointstxt");
    cheatstxt = document.getElementById("cheatstxt");

    replayBtn = document.getElementById("replayBtn");
    shareBtn = document.getElementById("shareBtn");
    cta = document.getElementById("cta");

    skipIntro = document.getElementById("skipIntro");
    
    bg = document.getElementsByClassName("bg");
    audio = document.getElementById("audio");
    // oww = document.getElementById("oww");
    
    btnMoveUp = document.getElementById("btnMoveUp");
    btnMoveForwards = document.getElementById("btnMoveForwards");
    btnMoveBackwards = document.getElementById("btnMoveBackwards");
    btnMoveDown = document.getElementById("btnMoveDown");
    btnJump = document.getElementById("btnJump");
    btnOption = document.getElementById("btnOption");
    
    resizeWindow()

    $( window ).resize(resizeWindow);




    gsap.set(player,{x:0,y:0,scale:1,autoAlpha:1});
    gsap.set([flame,gameover],{autoAlpha:0});


    if (audio.canPlayType('audio/ogg')) {
        console.log("canPlayType ogg");

        // audio.setAttribute('src','01_stars_are_my_guide.ogg');
        audio.setAttribute('src','01_stars_are_my_guide.ogg');

    } else if (audio.canPlayType('audio/mpeg')) {
        console.log("canPlayType mp3");

        // audio.setAttribute('src','01_stars_are_my_guide.mp3');
        audio.setAttribute('src','01_stars_are_my_guide.mp3');
    } 
     else {
        console.log("browser doesnt support audio");
    }


    if (audio.readyState > 3) {
    	loadedAudio();
    } else {
    	preloadAudio();	
    }
}

function preloadAudio(){
    console.log("preloadAudio");

    audio.addEventListener('canplay', loadedAudio);
    audio.addEventListener('error', failedtoLoadAudio);

    audio.load(); 
}

function failedtoLoadAudio(e){
    console.log("COULD NOT LOAD AUDIO");
}

var audioLoaded = false;
function loadedAudio(){
    if(!audioLoaded){
        audioLoaded = true;
    
        audio.removeEventListener('canplay', loadedAudio);
        audio.addEventListener('error', failedtoLoadAudio);
    
    
        $(document).on('show.visibility', function() {
            if(tlbg.isActive() || introPlaying && !endingComplete){
                audio.play();    
            }
        });
        $(document).on('hide.visibility', function() {
            audio.pause();
        });
    
        console.log("loaded Audio");
    
        
        document.getElementById("loadingContent").style.display="none";
        
        container.style.display = "block";
    
        container.addEventListener('touchend', playIntroScreen);
        container.addEventListener('click', playIntroScreen);
        document.body.addEventListener('keypress', playIntroScreen);
    }
}


function introBindShowSkip(){
    container.addEventListener('touchend', introShowSkip);
    container.addEventListener('click', introShowSkip);
    document.body.addEventListener('keypress', introShowSkip);

}

function introShowSkip() {
    container.removeEventListener('touchend', introShowSkip);
    container.removeEventListener('click', introShowSkip);
    document.body.removeEventListener('keypress', introShowSkip);

    gsap.to(skipIntro,0,{display:"block"});
    
    skipIntro.addEventListener('touchend', introPlayed);
    skipIntro.addEventListener('click', introPlayed);
    document.body.addEventListener('keypress', introPlayed);
}



var introPlaying = false;
function playIntroScreen() {


    container.removeEventListener('touchend', playIntroScreen);
    container.removeEventListener('click', playIntroScreen);
    document.body.removeEventListener('keypress', playIntroScreen);


    // add delay to avoid accidentally skipping intro (mostly on mobile)
    gsap.delayedCall(1, introBindShowSkip);

    container.className="";

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();

    

    // play the song
    gsap.fromTo(audio,1,{volume:0},{volume:1,ease:Power1.easeIn});
    audio.currentTime=0;
    audio.volume = 1;
    audio.play();
    introPlaying=true;

    audio.addEventListener("timeupdate",traceAudioTime);
    tlIntroScreen = gsap.timeline({onComplete:introPlayed})
    
    tlIntroScreen.timeScale(introSpeed);

    tlIntroScreen.addLabel('introScreen')

        // move game screen down:
        .to(tilt, 0, {autoAlpha:1,scale:1.8,x:388,y:100},"<")
        .to([bgStars1,bgToGo3,introBG,introStars,introTxt05,introTxt05a],0,{scale:1.2,transformOrigin:"left bottom"},"<")


        // hide 'play' button
        .to(introPlay,0,{autoAlpha:0})

        // setup intro BGs
        .to([introStars],0,{y:0,autoAlpha:1})
        .to([introBG],0,{y:0,autoAlpha:0})
        .to(introStars,30,{y:"-1880px",autoAlpha:.4,rotationZ:0.01,ease:Power1.easeInOut})
        .to(introStars,10,{autoAlpha:.4,ease:Linear.easeNone},20)
        .to(introBG,30,{y:"-423px",autoAlpha:1,rotationZ:0.01,ease:Power1.easeInOut},0)
        
        // intro copy:
        .to(introLogo,3,{autoAlpha:1,ease:Linear.easeNone},3)
        .to(introTxt01,3,{autoAlpha:1,ease:Linear.easeNone},"<2")
        .to([introTxt01,introLogo],.5,{autoAlpha:0,ease:Linear.easeNone},">")
        
        .to(introTxt02,3,{autoAlpha:1,ease:Linear.easeNone},">")
        .to(introTxt02a,0,{autoAlpha:0,ease:Linear.easeNone},"<")
        .call(typeText,["#introTxt02a",2],"<1")
        .to(introTxt02a,3,{autoAlpha:1,ease:Linear.easeNone},"<")
        .to(introTxt02b,3,{autoAlpha:1,ease:Linear.easeNone},"<1")
        .to([introTxt02],.5,{autoAlpha:0,ease:Linear.easeNone},">")
        
        .to(introTxt03,3,{autoAlpha:1,ease:Linear.easeNone},">")
        .to(introTxt03a,0,{autoAlpha:0,ease:Linear.easeNone},"<")
        .call(typeText,["#introTxt03a",2],"<1")
        .to(introTxt03a,3,{autoAlpha:1,ease:Linear.easeNone},"<")
        .to([introTxt03],.5,{autoAlpha:0,ease:Linear.easeNone},">")

        .to([introTxt04],3,{autoAlpha:1,ease:Linear.easeNone},">")
        .to([introLogo2],3,{autoAlpha:1,ease:Linear.easeNone},"<1")
        .to([introTxt04,introLogo2],.5,{autoAlpha:0,ease:Linear.easeNone},">")

        
        .to(tilt, 7, {y:-380,ease:Power1.easeOut},">")

        .to(tilt, 10, {scale:1,x:0,y:0,ease:Power1.easeInOut},">")

        .to([bgStars1,bgToGo3,introBG,introStars,introTxt05,introTxt05a],10,{scale:1,ease:Power1.easeInOut},"<")
        .to(introScreen,5,{scale:1,transformOrigin:"left bottom",ease:Power1.easeInOut},"<")

        .to([introTxt05],3,{autoAlpha:1,ease:Linear.easeNone},"<2")

        .to(introScreen,1,{autoAlpha:0,ease:Linear.easeNone},"<4")

        .to([introTxt05a],3,{autoAlpha:1,ease:Linear.easeNone},">")
        .addLabel("IntroScreen_ended")
        
}

function showTitles() {

    tlIntroScreen.seek("IntroScreen_ended");

    gsap.to(tilt, 0, {scale:1,x:0,y:0})

    gsap.to([bgStars1,bgToGo3,introBG,introStars,introTxt05,introTxt05a],0,{scale:1})
    gsap.to(introScreen,0,{scale:1,transformOrigin:"left bottom"})

    gsap.to([instructionsTxt0],0,{autoAlpha:1})
    gsap.to([instructions_optionsTxt],0,{autoAlpha:.5,display:"block"})
    gsap.to([instructionsTxt0],{className:"instructionsTxtButt flashing hidden copy",delay:0});
    gsap.to([introTxt05,introTxt05a],0,{autoAlpha:1});
}
function introPlayed() {
    gsap.killTweensOf(introBindShowSkip);
    tlIntroScreen.pause();

    container.removeEventListener('touchend', introShowSkip);
    container.removeEventListener('click', introShowSkip);
    document.body.removeEventListener('keypress', introShowSkip);


    showTitles();

    gsap.to(mobileControls,0,{className:"pulseMobileControls"});
    gsap.to(skipIntro,0,{display:"none"});
    // reset intro stuff:
    gsap.to(["#bgStars1","#bgToGo3"],0,{scale:1})
    gsap.to("#introScreen",0,{display:"none"});


    

    //[todo]
    // gsap.to("#tilt",0,{y:0,autoAlpha:1})

    skipIntro.removeEventListener('touchend', introPlayed);
    skipIntro.removeEventListener('click', introPlayed);
    document.body.removeEventListener('keypress', introPlayed);

    // add StartGame event listeners:
    console.log("introPlayed calls BindButtons_startGame")
    BindButtons_startGame();   
}


function BindButtons_gameResume(){
    // console.log("BindButtons_gameResume");
    
    btnMoveDown.addEventListener('touchend', gameResume);
    document.body.addEventListener('keypress', gameResume);
}

function unBindButtons_gameResume(){
    // console.log("unBindButtons_gameResume");

    btnMoveDown.removeEventListener('touchend', gameResume);
    document.body.removeEventListener('keypress', gameResume);
}

function BindButtons_startGame(){
    console.log("BindButtons_startGame");

     // mobile
    btnMoveDown.addEventListener('touchend', startGame);
    btnOption.addEventListener('touchend', showOptions);

	 //keyboard
    document.body.addEventListener('keypress', introScreenBtnPressed);
}





var instructions_optionsTxt = document.getElementById('instructions_optionsTxt'),
    optionsBike = document.getElementById('optionsBike'),
    optionsBike1 = document.getElementById('optionsBike1'),
    optionsBike2 = document.getElementById('optionsBike2');

function introScreenBtnPressed(e){
    if(e.code=="KeyS") {
        btnOption.removeEventListener('touchend', showOptions);
        document.body.removeEventListener('keypress', introScreenBtnPressed);
        
        startGame(e);

    } else if(e.code=="KeyO"){

        document.body.addEventListener('keypress', introScreenBtnPressed);

        showOptions();

    } else {

    }
}




function showOptions(){
    btnOption.removeEventListener('touchend',showOptions);
    unBindButtons_startGame();

    $('#mobileControls').addClass("optionsShowing");


    // show options screen: 
    gsap.to([introTxt05,introTxt05a],0,{autoAlpha:0});
    gsap.to(optionsScreen,0,{autoAlpha:1,display:"block"});

    optionsBike.addEventListener('click',function(){ optionsBike_chosen()});
    optionsBike1.addEventListener('click',function(){ optionsBike_chosen(1)});
    optionsBike2.addEventListener('click',function(){ optionsBike_chosen(2)});

    optionsBike.addEventListener('touchend',function(){ optionsBike_chosen()});
    optionsBike1.addEventListener('touchend',function(){ optionsBike_chosen(1)});
    optionsBike2.addEventListener('touchend',function(){ optionsBike_chosen(2)});  
}



function optionsBike_chosen(bikeNo){
    if(bikeNo==undefined) {bikeNo=""}
    gsap.to("#bike-go",0,{className: "bike"+bikeNo})
    gsap.to([introTxt05,introTxt05a],0,{autoAlpha:1});
    gsap.to(optionsScreen,0,{autoAlpha:0,display:"none"});

    $('#mobileControls').removeClass("optionsShowing");

    BindButtons_startGame();

}

function unBindButtons_startGame(){
    console.log("unBindButtons_startGame");

    btnMoveDown.removeEventListener('touchend', startGame);
    document.body.removeEventListener('keypress', startGame);
}


function BindButtons_gamePlay(){
    console.log("BindButtons_gamePlay")

    // remove StartGame Event Listeners 
    unBindButtons_startGame();
    unBindButtons_gameResume();


        // unbind the "do nothing" events of mobile buttons:
            btnsMove.removeEventListener("touchstart", mobileBtnDoNothing);
            btnsMove.removeEventListener("touchend", mobileBtnDoNothing);


            btnMoveUp.removeEventListener("touchstart", mobileBtnDoNothing);
            btnMoveForwards.removeEventListener("touchstart", mobileBtnDoNothing);
            btnMoveBackwards.removeEventListener("touchstart", mobileBtnDoNothing);
            btnJump.removeEventListener("touchstart", mobileBtnPressed);
            btnWheelie.removeEventListener("touchstart", mobileBtnDoNothing);

            btnMoveUp.removeEventListener("touchend", mobileBtnDoNothing);
            btnMoveForwards.removeEventListener("touchend", mobileBtnDoNothing);
            btnMoveBackwards.removeEventListener("touchend", mobileBtnDoNothing);
            btnJump.removeEventListener("touchend", mobileBtnPressed);
            btnWheelie.removeEventListener("touchend", mobileBtnDoNothing);
        

    // add Key Press listeners for game controls:

        // btns pressed:

            document.body.addEventListener('keypress', keypress);

            btnMoveUp.addEventListener("touchstart", mobileBtnPressed);
            btnMoveForwards.addEventListener("touchstart", mobileBtnPressed);
            btnMoveBackwards.addEventListener("touchstart", mobileBtnPressed);
            btnMoveDown.addEventListener("touchstart", mobileBtnPressed);
            btnJump.addEventListener("touchstart", mobileBtnPressed);
            btnWheelie.addEventListener("touchstart", mobileBtnPressed);

        // btns released :

            document.body.addEventListener('keyup', keyUp);

            btnMoveUp.addEventListener("touchend", mobileBtnReleased);
            btnMoveForwards.addEventListener("touchend", mobileBtnReleased);
            btnMoveBackwards.addEventListener("touchend", mobileBtnReleased);
            btnMoveDown.addEventListener("touchend", mobileBtnReleased);
            btnJump.addEventListener("touchend", mobileBtnReleased);
            btnWheelie.addEventListener("touchend", mobileBtnReleased);

}

function unBindButtons_gamePlay(){

    // remove Key Press listeners for game controls:

        // btns pressed:

            document.body.removeEventListener('keypress', keypress);

            btnMoveUp.removeEventListener("touchstart", mobileBtnPressed);
            btnMoveForwards.removeEventListener("touchstart", mobileBtnPressed);
            btnMoveBackwards.removeEventListener("touchstart", mobileBtnPressed);
            btnMoveDown.removeEventListener("touchstart", mobileBtnPressed);
            btnJump.removeEventListener("touchstart", mobileBtnPressed);
            btnWheelie.removeEventListener("touchstart", mobileBtnPressed);

        // btns released :

            document.body.removeEventListener('keyup', keyUp);

            btnMoveUp.removeEventListener("touchend", mobileBtnReleased);
            btnMoveForwards.removeEventListener("touchend", mobileBtnReleased);
            btnMoveBackwards.removeEventListener("touchend", mobileBtnReleased);
            btnMoveDown.removeEventListener("touchend", mobileBtnReleased);
            btnJump.removeEventListener("touchend", mobileBtnReleased);
            btnWheelie.removeEventListener("touchend", mobileBtnReleased);

            
    // bind the mobile buttons to do nothing! (except down as that is in use)
            btnsMove.addEventListener("touchstart", mobileBtnDoNothing);
            btnsMove.addEventListener("touchend", mobileBtnDoNothing);


            btnMoveUp.addEventListener("touchstart", mobileBtnDoNothing);
            btnMoveForwards.addEventListener("touchstart", mobileBtnDoNothing);
            btnMoveBackwards.addEventListener("touchstart", mobileBtnDoNothing);
            btnJump.addEventListener("touchstart", mobileBtnPressed);
            btnWheelie.addEventListener("touchstart", mobileBtnDoNothing);

            btnMoveUp.addEventListener("touchend", mobileBtnDoNothing);
            btnMoveForwards.addEventListener("touchend", mobileBtnDoNothing);
            btnMoveBackwards.addEventListener("touchend", mobileBtnDoNothing);
            btnJump.addEventListener("touchend", mobileBtnPressed);
            btnWheelie.addEventListener("touchend", mobileBtnDoNothing);
}

function mobileBtnDoNothing(ev){
    if(ev.cancelable) {
        ev.preventDefault();
    }
}

function mobileBtnPressed(ev){
    if(ev.cancelable) {
        ev.preventDefault();
    }

    if(!collided && !isSongToEnding){
        if(this.id=="btnJump") {
            gsap.killTweensOf(backtoBounce);
            jump();
            $('#introBtnK').addClass('pressed')
            $('#btnJump').addClass('pressed')
        }
        if(this.id=="btnWheelie") {
            gsap.killTweensOf(backtoBounce);
            wheelie();
            $('#introBtnJ').addClass('pressed');
            $('#btnWheelie').addClass('pressed');
        }
        if(this.id=="btnMoveForwards") {
            forwards();
            $('#btnsMove').addClass('forwards');
            $('#introBtn').addClass('pressedD');
        }
        if(this.id=="btnMoveBackwards") {
            backwards();
            $('#btnsMove').addClass('backwards');
            $('#introBtn').addClass('pressedA');
        }
        if(this.id=="btnMoveUp") {
            upwards();
            $('#btnsMove').addClass('up');
            $('#introBtn').addClass('pressedW');
        }
        if(this.id=="btnMoveDown") {
            downwards();
            $('#btnsMove').addClass('down');
            $('#introBtn').addClass('pressedS');
        }
    }
}
function mobileBtnReleased(ev) {
    if(ev.cancelable) {
        ev.preventDefault();
    }

    if(this.id=="btnMoveForwards") {
        $('#btnsMove').removeClass("forwards");
        $('#introBtn').removeClass('pressedD');
    }
    if(this.id=="btnMoveBackwards") {
        $('#btnsMove').removeClass("backwards");
        $('#introBtn').removeClass('pressedA');

    }
    if(this.id=="btnMoveUp") {
        $('#btnsMove').removeClass("up");
        $('#introBtn').removeClass('pressedW');

    }
    if(this.id=="btnMoveDown") {
        $('#btnsMove').removeClass("down");
        $('#introBtn').removeClass('pressedS');
    }
    if(this.id=="btnJump") {
        $('#introBtnK').removeClass('pressed');
        $('#btnJump').removeClass('pressed');
    }
    if(this.id=="btnWheelie") {
        $('#introBtnJ').removeClass('pressed');
        $('#btnWheelie').removeClass('pressed');
    }
    
}

var keyDown = "";
function keypress(e){
    if(!collided && !isSongToEnding){
        if(e.code=="KeyJ") {
            if(keyDown!="J"){
                gsap.killTweensOf(backtoBounce);
            
                wheelie();

                keyDown = "J";
                $('#introBtnJ').addClass('pressed');
            }
        }
        else if(e.code=="KeyK") {
            if(keyDown!="K"){
                gsap.killTweensOf(backtoBounce);

                jump();

                keyDown = "K";
                $('#introBtnK').addClass('pressed');
            }
        }
        else if(e.code=="KeyD") {
            if(keyDown!="D"){
                forwards();

                keyDown = "D";
                $('#introBtn').addClass('pressedD');
            }
        }
        else if(e.code=="KeyA") {            
            if(keyDown!="A"){
                backwards();

                keyDown = "A";
                $('#introBtn').addClass('pressedA');
            }
        }
        else if(e.code=="KeyW") {
            if(keyDown!="W"){
                upwards();
                $('#introBtn').addClass('pressedW');

                keyDown="W";
            }
        }
        else if(e.code=="KeyS") {
            if(keyDown!="S"){
                downwards();
                $('#introBtn').addClass('pressedS');

                keyDown="S";
            }
        }
        // mute (pause) 
        else if(e.code=="KeyM"){
            gamePause();
            pausedtxt.innerHTML="muted";
        }
        // pause 
        else{
            gamePause();
            pausedtxt.innerHTML="paused";
        }
    }
}
function keyUp(){
    keyDown = "";

    $('#introBtn,#introBtnK,#introBtnJ').removeClass();
}


var gameStarted = false;
/*///////////////////////  ////////////////////////////////*/
/*/////////////////////// START GAME ////////////////////////////////*/
/*///////////////////////  ////////////////////////////////*/
/*///////////////////////  ////////////////////////////////*/
function startGame(ev,didAutoPlay)
{
	if(!gameStarted){
		gameStarted=true;

        // prevent touch default:
        if(ev.cancelable) {
            ev.preventDefault();
        }


	// setup all listeners for gaming:
    BindButtons_gamePlay();

    tlIntroScreen.pause();

    gsap.to(mobileControls,0,{className:""});
    gsap.to([introScreen,btnOption],0,{display:"none"});

    gsap.to("#tilt",0,{y:0})

    points=0;

    introPlaying=false;

    if(!didAutoPlay){
        audio.currentTime=84.00; 
        console.log(audio.currentTime);
    }
    
    
    

    
    // reset
    gsap.set([flame,gameover,"#rider-stopped",instructionsTxt0,instructions_optionsTxt,introTxt05,introTxt05a,optionsScreen],{autoAlpha:0,overwrite:true});
    gsap.set([player,"#rider-go",pointstxt,jumpingtxt],{autoAlpha:1});

    backtoBounce();
        


    
    
    

    tlbg = gsap.timeline({repeat:-1});
    tlstarsBG = gsap.timeline({repeat:-1});

    tlhair = gsap.timeline({onComplete:playHairTl});
    tlfg = gsap.timeline({onComplete:fgTimeLineComplete});

    
    gsap.fromTo(tlstarsBG,4,{timeScale:0},{timeScale:1,ease:Power1.easeIn});
    gsap.fromTo(tlbg,4,{timeScale:0},{timeScale:1,ease:Power1.easeIn});

    
    tlintro = gsap.timeline({onComplete:showIntructions});

    tlintro.addLabel("FGs BGs", "<")
        .add(playBGs,"<")
        .add(playStarsBG,"<")
        .add(playHairTl,"<")
        
        .to("#fg-intro",0, {autoAlpha:1},"<")
        
        // reset obs
        .to(".obstacle", 0, {autoAlpha:1,left:obsStartLeft}, "<")

        .to("#fg-intro",4,{x:"-100%",ease:Power1.easeIn},"<")
        .to("#fgs",{autoAlpha:1},"-=1.25")
        .to(fgToGo1,0,{autoAlpha:1,x:fgWidth},"-=1.25")
        .to(fgToGo1,(fgSpeed/2),{x:0,ease:Linear.easeNone},">")

        .add(playFGs,"<")
 	}       

    // set up flyPast timeline but dont play:
    tlFlyPast = gsap.timeline({paused:true});

    tlFlyPast.addLabel('flypast','<')
    .to(flyPast,0,{x:0,z:0.01},'<')
    .to(flyPast,2,{x:300,z:-0.01,ease:Back.easeOut},'>')
    .to(flyPast,1,{x:1220,z:-0.01,ease:Power1.easeIn},'>');

}

function showIntructions(){
    if(!isCheat){
        tlInstructions.addLabel('play instructions')
            .to(instructionsTxt3,0,{autoAlpha:1},"0")
            .to(instructionsTxt3,0,{autoAlpha:0},"+=4")

            .to(instructionsTxt4,0,{autoAlpha:1},"<.75")
            .to(instructionsTxt4,0,{autoAlpha:0},"+=4")
            .add(playObstaclesTL,">");

    } else {
        playObstaclesTL();
    }
}


function gamePause() {
    gsap.killTweensOf(detectCollision);
    gsap.killTweensOf(backtoBounce);

    gsap.killTweensOf(BindButtons_gameResume);
        
    audio.pause();

    tlfg.pause();
    tlbg.pause();
    tlstarsBG.pause();
    tlMountainsBG.pause();
    tlCloudsBG.pause();
    tlintro.pause();
    tlInstructions.pause();
    tl.pause();
    tlLyrics.pause();
    tlramp.pause()
    tlhair.pause();

    $('#rider').removeClass('riderBounce');
    $('#rider').removeClass('riderFly');
    $('#shadow').removeClass('shadowBounce');

    gsap.set(["#rider-stopped"],{autoAlpha:1});
    gsap.set(["#rider-go"],{autoAlpha:0});
    gsap.to(["#rider-go","#bike-go"],0,{rotationZ:0});
    gsap.to("#rider-jets",0,{top:"0px",skewY:0,autoAlpha:0})

    jumpingtxt.innerHTML="paused";
    gsap.set(pausedtxt,{autoAlpha:1});


    unBindButtons_gamePlay();
    unBindButtons_gameResume(); 

    if(isJumping) {
        gsap.killTweensOf(notJumping);
        isJumping=false;

        gsap.delayedCall(1.7, BindButtons_gameResume);
    } else {
        BindButtons_gameResume();
    }
}

function gameResume(ev) {
    if(ev.cancelable) {
        ev.preventDefault();
    }


    console.log('resume');

    

    // resuming after crash
    if(collided) {
        collided=false;

        gsap.set([speechbub,flame,".rider-scream",resumetxt],{autoAlpha:0});


        // reset from "fallen down hole":
        gsap.set(playerMovements,{x:0,y:0,rotationZ:0,rotationY:0,scale:1,autoAlpha:1});

        // reset player pos:
        gsap.set(player,{x:0,y:0,rotationZ:0,rotationY:0,scale:1,autoAlpha:1});

        // flash player for 1s
        gsap.to(player,0.1,{autoAlpha:0,yoyo:true,repeat:9})

        gsap.delayedCall(1,detectCollision);
    } else {
        gsap.delayedCall(0.01,detectCollision);
    }
    collideAll="";
    audio.play();
    audio.volume = 1;

    
    // [todo] - fly past testing
    // doFlyPast();
    
    tlintro.resume();
    tlInstructions.resume();
    tl.resume();
    tlbg.resume();  
    tlstarsBG.resume();
    tlMountainsBG.resume();
    tlCloudsBG.resume();
    tlfg.resume();  
    tlhair.resume();  
    tlramp.resume();
    tlLyrics.resume();


    $('#rider').addClass('riderBounce');
    $('#rider').addClass('riderFly');
    $('#shadow').addClass('shadowBounce');

    tlScream.pause();
    tlScream.seek(0);

    gsap.set("#rider-stopped",{autoAlpha:0});
    gsap.set(["#rider-go,.rider-go,#rider-jets"],{autoAlpha:1});

    
    jumpingtxt.innerHTML="go";
    
    
    gsap.set(pausedtxt,{autoAlpha:0});

    BindButtons_gamePlay();
}


var isJumping = false;
var jumpCount = 0;
function jump() {
    
    if(isRamping){ 
        // ramp has been hit so cant jump!
    }

    else {

        gsap.killTweensOf(notJumping);
        gsap.killTweensOf(backtoBounce);


        isJumping=true;
        jumpCount++;
        jumpingtxt.innerHTML="jump";


        if(tl.isActive() && jumpCount % 4 === 0){
            
            speechtxt.innerHTML="primitaaaii";    
            gsap.set(speechbub,{autoAlpha:1});
            gsap.to(speechbub,0,{autoAlpha:0,delay:1.5});

        } else if (tl.isActive() && jumpCount % 15 === 0) {

            // every 9 jumps do a stand-up scream
        
            tlhair.pause();
            primScreamTL = gsap.timeline({onComplete:function(){ tlhair.play(); }});

            speechtxt.innerHTML="primitaaaii"
            
            primScreamTL.addLabel('primScream')
                .to('.rider-scream2',0,{autoAlpha:1},"<")
                .to(['.rider-go','.hair-go'],0,{autoAlpha:0},"<")
                .to(speechbub,0,{autoAlpha:1,top:"-40px",rotation:-5},0)
                .to(speechbub,0,{autoAlpha:0,top:"4px",rotation:0},1.5)
                .to('.rider-scream2',0,{autoAlpha:0},1.5)
                .to(['.rider-go','.hair-go'],0,{autoAlpha:1},1.5);
        }
        

        $('#rider').removeClass('riderBounce');
        $('#shadow').removeClass('shadowBounce');

        gsap.to("#rider-jets",0.2,{scaleX:1.4,scaleY:1.1,x:10,y:-2,filter:"hue-rotate(150deg)"});
        gsap.to("#rider-jets",0.2,{scaleX:1,scaleY:1,x:0,y:0,filter:"hue-rotate(0deg)",delay:1});


        gsap.to([rider],1,{y:-110})
        gsap.to([speechbub],1,{y:-167})
        
        gsap.to([speechbub],1.5,{y:-67,delay:1,ease:Bounce.easeOut})
        gsap.to([rider],1.5,{y:0,delay:1,ease:Bounce.easeOut})

        gsap.set(shadow,{autoAlpha:.4})
        gsap.to(shadow,1,{autoAlpha:0,scaleX:.6})
        
        gsap.to(shadow,1.5,{autoAlpha:.5,scaleX:1,delay:1,ease:Bounce.easeOut})
        
        gsap.delayedCall(1.7,notJumping);
    }
}

function notJumping(){
    isJumping=false; 
    jumpingtxt.innerHTML="go";
    gsap.delayedCall(.6,backtoBounce);
}

var wheelieCount=0;
var isFlipping=false;
function wheelie() {

    wheelieCount++;
    
    $('#rider').removeClass('riderBounce');
    $('#shadow').removeClass('shadowBounce');
    
    if(!isRamping) {
        jumpingtxt.innerHTML="&#47;&#47;";
        gsap.delayedCall(.7,function(){
            jumpingtxt.innerHTML="go";
        });

        if(tl.isActive() && wheelieCount % 3 === 0)
        {
            speechtxt.innerHTML="right on!!";    
            gsap.set(speechbub,{autoAlpha:1});
            gsap.delayedCall(.7,function(){
                speechtxt.innerHTML="";
                gsap.to(speechbub,0,{autoAlpha:0});
            })
        }

        points++;
        
        gsap.to(["#rider-go","#bike-go"],1,{rotationZ:-30})

        // if()
        gsap.to("#rider-jets",1,{top:"30px",skewY:13})

        
        gsap.to(shadow,1,{x:-10,scaleX:.7})
        gsap.to(shadow,1.5,{x:0,scaleX:1,delay:1,ease:Bounce.easeOut})
        
        gsap.to(["#rider-go","#bike-go"],1.5,{rotationZ:0,delay:1,ease:Bounce.easeOut});
        gsap.to("#rider-jets",1.5,{top:"0px",skewY:0,delay:1,ease:Bounce.easeOut})
        gsap.delayedCall(2.4,backtoBounce);
    } else {
        if(!isFlipping)
        {
            isFlipping=true;
            points = points + 100;
                
            gsap.to(rider,1.5,{rotation:-360,ease:Sine.easeInOut})
            gsap.to(rider,0,{rotation:0,delay:1.5,onComplete:function(){isFlipping=false;}})
        }
    }
}

var backwardsCount = 0;
var brakingPhrases = ["hit the brakes",
                    "what the hell?",
                    "yo butt head!!"];
function backwards() {
    backwardsCount++;
    
    if($('#player').hasClass('forwards3')){
        
        $('#player').removeClass('forwards3');

    } 
    else if($('#player').hasClass('forwards2')){
        
        $('#player').removeClass('forwards2');
    } 
    else if($('#player').hasClass('forwards')){
        
        $('#player').removeClass('forwards');
    } 
    

    gsap.to("#rider-jets",0,{scaleX:.35,scaleY:.9,x:-20,y:2,alpha:.6})
    gsap.to("#rider-jets",0,{scaleX:1,scaleX:1,x:0,y:0,alpha:1,delay:.2})

    jumpingtxt.innerHTML="brakes";
    gsap.delayedCall(.7,function(){
        jumpingtxt.innerHTML="go";
    });



    if(tl.isActive() && backwardsCount % 5 === 0)
    {
        var whichPhrase = Math.floor(Math.random() * brakingPhrases.length-1) + 1; 
        speechtxt.innerHTML=brakingPhrases[whichPhrase];;
        gsap.set(speechbub,{autoAlpha:1});
        gsap.delayedCall(.7,function(){
            speechtxt.innerHTML="";
            gsap.to(speechbub,0,{autoAlpha:0});
        })
    }
}

var forwardsCount = 0;
var goPhrases = ["drive!",
                "pedal to the metal",
                "let's go!",
                "go go go"];
function forwards() {
    forwardsCount++;
    if($('#player').hasClass('forwards3'))
    {
        // do nothing
    } 
    else if($('#player').hasClass('forwards2'))
    {
        $('#player').addClass('forwards3');
    } 
    else if($('#player').hasClass('forwards')){
         
         $('#player').addClass('forwards2');
    } else if ( !$('#player').hasClass('forwards')) {
         $('#player').addClass('forwards');
    }

    gsap.to("#rider-jets",0,{scaleX:1.25,x:7,filter:"hue-rotate(61deg)"})
    gsap.to("#rider-jets",0,{scaleX:1,x:0,filter:"hue-rotate(0deg)",delay:.2})
    
    jumpingtxt.innerHTML="drive";

    if(tl.isActive() && forwardsCount % 2 === 0)
    {
        var whichPhrase = Math.floor(Math.random() * goPhrases.length-1) + 1; 
        speechtxt.innerHTML=goPhrases[whichPhrase];;
        gsap.set(speechbub,{autoAlpha:1});
        
        gsap.delayedCall(.7,function(){
            speechtxt.innerHTML="";
            gsap.to(speechbub,0,{autoAlpha:0});
        })
    }
    gsap.delayedCall(1,function(){
        jumpingtxt.innerHTML="go";
    })
}
var playerTopPos = 245,
    playerBotPos = 345;
function upwards() {
    gsap.to(player,.6,{top:+playerTopPos+"px",ease:Power1.easeInOut});
    gsap.to(playerMovements,.6,{z:-100,ease:Power1.easeInOut});

    jumpingtxt.innerHTML="turn";
    gsap.delayedCall(0.2,function(){
        jumpingtxt.innerHTML="go";
    })
}
function downwards() {
    gsap.to(player,.6,{top:playerBotPos+"px",ease:Power1.easeInOut});
    gsap.to(playerMovements,.6,{z:0,ease:Power1.easeInOut});
    jumpingtxt.innerHTML="turn";
    gsap.delayedCall(0.2,function(){
        jumpingtxt.innerHTML="go";
    })
}

function backtoBounce(){
    if(isJumping){
        isJumping=false;
    }
    gsap.to("#rider-jets",0,{scaleX:1,scaleY:1,x:0,y:0,filter:"hue-rotate(0deg)",top:"0px",skewY:0});

    
    $('#rider').addClass('riderBounce');
    $('#shadow').addClass('shadowBounce');
    $('#rider').addClass('riderFly');
}

function typeText(whichEle, thisLength){
    // typewriter text
    var mySplitText = new SplitText(whichEle, {type:"words,chars"}),
        numChars = mySplitText.chars.length,
        characterTime = (thisLength/(numChars+6));
        gsap.set(whichEle,{autoAlpha:1})
        gsap.set(mySplitText.chars, {autoAlpha:0});
        for(var i = 0; i < numChars; i++){
            gsap.to(mySplitText.chars[i], 0, {autoAlpha:1, delay:(i * characterTime),ease:Linear.easeNone});
        }
}



var fgWidth = 1800;
var fgSpeed = gameSpeed*2;
function playFGs() {

    tlfg.addLabel('fg loop', '<')
        .to([fgToGo3],0,{autoAlpha:0},">")
        
        .to([fgToGo1],0,{x:0,z:0,},"<")
        .to([fgToGo2],0,{x:fgWidth,z:0},"<")
        
        .to([fgToGo1],fgSpeed,{x:-fgWidth,rotationZ:0.01,ease:Linear.easeNone},">")
        .to([fgToGo2],fgSpeed,{x:0,rotationZ:0.01,ease:Linear.easeNone},"<");
}


var bgWidth = 1800,
    bgSpeed = gameSpeed*10;
function playBGs() {
    tlbg.addLabel('bgLoop', '<')
        .to([bgToGo1],0,{x:0,z:0})
        .to([bgToGo2],0,{x:bgWidth,z:0})
        .to([bgToGo3],0,{x:bgWidth,z:0})
        
        .to(bgToGo1,bgSpeed,{x:-bgWidth,rotationZ:0.01,ease:Linear.easeNone},">")
        .to(bgToGo2,bgSpeed,{x:0,rotationZ:0.01,ease:Linear.easeNone},"-="+bgSpeed)
        .to(bgToGo2,bgSpeed,{x:-bgWidth,rotationZ:0.01,ease:Linear.easeNone},">")
        .to(bgToGo3,bgSpeed,{x:0,rotationZ:0.01,ease:Linear.easeNone},"-="+bgSpeed)
}


var starsBGWidth = 1300,
    starsBGSpeed = gameSpeed*5;
function playStarsBG() {

    tlstarsBG.addLabel('starsBGLoop', '<')
        .to([bgStars1],0,{x:0,z:0})
        .to([bgStars2],0,{x:starsBGWidth,z:0})
        .to([bgStars3],0,{x:starsBGWidth,z:0})
        
        .to(bgStars1,starsBGSpeed,{x:-starsBGWidth,rotationZ:0.01,ease:Linear.easeNone},">")
        .to(bgStars2,starsBGSpeed,{x:0,rotationZ:0.01,ease:Linear.easeNone},"-="+starsBGSpeed+"")
        .to(bgStars2,starsBGSpeed,{x:-starsBGWidth,rotationZ:0.01,ease:Linear.easeNone},">")
        .to(bgStars3,starsBGSpeed,{x:0,rotationZ:0.01,ease:Linear.easeNone},"-="+starsBGSpeed);
}

var mountainsBGWidth = 1800,
    mountainsBGSpeed = gameSpeed*5;
function playMountainsBG() {
    tlMountainsBG.addLabel('mountainsBGLoop', '<')
        .to([bgMountains1,bgMountains2,bgMountains3,bgMountains4,bgMountains5,bgMountains6],0,{autoAlpha:1,x:mountainsBGWidth,z:0})
        .to([bgMountains4,bgMountains5,bgMountains6],0,{scaleX:-1})
        
        .to(bgMountains1,mountainsBGSpeed*2,{x:-mountainsBGWidth,ease:Linear.easeNone},">")
        .to(bgMountains2,mountainsBGSpeed*2,{x:-mountainsBGWidth,ease:Linear.easeNone},"-="+mountainsBGSpeed+"")
        .to(bgMountains3,mountainsBGSpeed*2,{x:-mountainsBGWidth,ease:Linear.easeNone},"-="+mountainsBGSpeed+"")
        
        .to(bgMountains4,mountainsBGSpeed*2,{x:-mountainsBGWidth,ease:Linear.easeNone},"-="+mountainsBGSpeed+"")
        .to(bgMountains5,mountainsBGSpeed*2,{x:-mountainsBGWidth,ease:Linear.easeNone},"-="+mountainsBGSpeed+"")
        .to(bgMountains6,mountainsBGSpeed*2,{x:-mountainsBGWidth,ease:Linear.easeNone},"-="+mountainsBGSpeed+"")
        .to(bgMountains,0,{display:"none"});
}

// var cloudsBGWidth = 1300,
//     cloudsBGSpeed = gameSpeed*2;
// function playCloudsBG() {
//     gsap.from(bgClouds,cloudsBGSpeed*2,{y:-300,ease:Power1.easeOut,delay:cloudsBGSpeed});
//     gsap.to(bgClouds,cloudsBGSpeed*2,{y:-300,ease:Power1.easeIn,delay:cloudsBGSpeed*4}) 

//     tlCloudsBG.addLabel('cloudsBGLoop', '<')
//         .to([bgClouds1,bgClouds2,bgClouds3,bgLightning],0,{autoAlpha:1,x:cloudsBGWidth,z:0})
        
//         .to(bgClouds1,cloudsBGSpeed*2,{x:-cloudsBGWidth,ease:Linear.easeNone},">")
//         .to([bgClouds2],cloudsBGSpeed*2,{x:-cloudsBGWidth,ease:Linear.easeNone},"-="+cloudsBGSpeed+"")
//         .to([bgClouds3,bgLightning],cloudsBGSpeed*2,{x:-cloudsBGWidth,ease:Linear.easeNone},"-="+cloudsBGSpeed+"")
//         .to([bgClouds1,bgClouds2,bgLightning],0,{x:cloudsBGWidth,ease:Linear.easeNone},"-="+cloudsBGSpeed+"")
//         .to(bgClouds1,cloudsBGSpeed*2,{x:-cloudsBGWidth,ease:Linear.easeNone},"-="+cloudsBGSpeed+"")
//         .to([bgClouds2,bgLightning],cloudsBGSpeed*2,{x:-cloudsBGWidth,ease:Linear.easeNone},"-="+cloudsBGSpeed+"")
//         .to(bgClouds3,0,{x:cloudsBGWidth,ease:Linear.easeNone},"-="+cloudsBGSpeed+"")
//         .to(bgClouds3,cloudsBGSpeed*2,{x:-cloudsBGWidth,ease:Linear.easeNone},"-="+cloudsBGSpeed+"")
//         .to(bgClouds,0,{display:"none"});
// }


function doFlyPast(which) {
    if(which=="sergio"){
        gsap.to(flyPast,0,{className:"+=sergio"})
    } else {
        gsap.to(flyPast,0,{className:""})
    }

    tlFlyPast.restart();
}

var hairspeed = 1,
    maxhairspeed=5;
function playHairTl() {
    tlhair.addLabel('rider','<')
        .add(function(){ 
            if(hairspeed<maxhairspeed) {
                hairspeed++;
                tlhair.timeScale(hairspeed/maxhairspeed);
            }
        })
        .to('#hair-go1',0,{autoAlpha:1},"<")
        .to('#hair-go1',0,{autoAlpha:0},"+=0.1")
        .to('#hair-go2',0,{autoAlpha:1},"<")
        .to('#hair-go2',0,{autoAlpha:0},"+=0.1")
        .to('#hair-go3',0,{autoAlpha:1},"<")
        .to('#hair-go3',0,{autoAlpha:0},"+=0.1")
        
}


var obsSpeed = gameSpeed*5;
var obsStartLeft = 2200;
var obsEndLeft = -2200;
function playObstaclesTL(){
    // obstacles timeline! 
    gsap.killTweensOf(detectCollision);
    detectCollision();

    tl = gsap.timeline({onComplete:timeLineComplete});

    if(!isCheat){

    tl.addLabel("stage1", "<")
        .to("#player",0, {autoAlpha:1}, "<")
        

      
        // rock L
        .to("#obstacle2", 0, {left:obsStartLeft+"px"}, ">")
        .call(setWarningTxt,["down"],"<")
        .to("#obstacle2", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">")


        // rock R
        .to("#obstacle5", 0, {left:obsStartLeft+"px"}, ">")
        .call(setWarningTxt,["up"],"<")
        .to("#obstacle5", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">")

    
        // ramp
        .to(".ramp", 0, {left:obsStartLeft+"px"}, ">2")
        .call(setWarningTxt,["ramp"],"<")
        .to(".ramp", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">")


        // hole
        .to("#obstacle1", 0, {left:obsStartLeft+"px"}, ">2")
        .call(setWarningTxt,["hole"],"<")
        .to("#obstacle1", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">")

        // rock R
        .to("#obstacle5", 0, {left:obsStartLeft+"px"}, ">")
        .call(setWarningTxt,["up"],"<")
        .to("#obstacle5", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">")

        .to("#obstacle2", 0, {left:obsStartLeft+"px"}, "-=2")
        .call(setWarningTxt,["down"],"<")
        .to("#obstacle2", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">")
        

        // asteroid
        .to("#obstacle4", 0, {left:obsStartLeft+"px"}, "-=2")
        .call(setWarningTxt,["asteroid"],"<")
        .to("#obstacle4", obsSpeed, {left:(obsEndLeft*1.5),ease:Linear.easeNone},">")


        // hole
        .to("#obstacle1", 0, {left:obsStartLeft+"px"}, ">")
        .call(setWarningTxt,["hole"],"<")
        .to("#obstacle1", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">")
        
        // ramp
        .to(".ramp", 0, {left:obsStartLeft+"px"}, ">2")
        .call(setWarningTxt,["ramp"],"<")
        .to(".ramp", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">")

        // rock R
        .to("#obstacle5", 0, {left:obsStartLeft+"px"}, "-=3")
        .call(setWarningTxt,["up"],"+=1")
        .to("#obstacle5", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">")

        // rock L
        .to("#obstacle2", 0, {left:obsStartLeft+"px"}, "-=3")
        .to("#obstacle2", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">")

        // rock R
        .to("#obstacle5", 0, {left:obsStartLeft+"px"}, "-=3")
        // .call(setWarningTxt,["up"],"+=1")
        .to("#obstacle5", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">")

        // rock L
        .to("#obstacle2", 0, {left:obsStartLeft+"px"}, "-=2")
        // .call(setWarningTxt,["down"],"<")
        .to("#obstacle2", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">")
            
            
        .to("#tilt",7,{rotationZ:5,x:0,y:10},">")
            
        // hole
        .to("#obstacle1", 0, {autoAlpha:1,left:obsStartLeft+"px"}, "-=3.5")
        .call(setWarningTxt,["hole"],"<")
        .to("#obstacle1", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">1")

        .to("#tilt",5,{rotationZ:0,x:0,y:0},">")

        // ramp
        .to(".ramp", 0, {left:obsStartLeft+"px"}, ">")
        .call(setWarningTxt,["ramp"],"<")
        .to(".ramp", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">")

        // rock R
        .to("#obstacle5", 0, {left:obsStartLeft+"px"}, "-=3")
        .call(setWarningTxt,["updown",true],"+=1")
        .to("#obstacle5", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">")

        // rock L
        .to("#obstacle2", 0, {left:obsStartLeft+"px"}, "-=3")
        .to("#obstacle2", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">")


// rock L
        .to("#obstacle2", 0, {left:obsStartLeft+"px"}, ">")
        .call(setWarningTxt,["down"],"<")
        .to("#obstacle2", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">")


        // rock R
        .to("#obstacle5", 0, {left:obsStartLeft+"px"}, ">")
        .call(setWarningTxt,["up"],"<")
        .to("#obstacle5", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">")

        .to("#obstacle4", 0, {left:obsStartLeft+"px"}, "-=2")
        .call(setWarningTxt,["asteroid"],"<")
        .to("#obstacle4", obsSpeed, {left:(obsEndLeft*1.5),ease:Linear.easeNone},">")

    
        // ramp
        .to(".ramp", 0, {left:obsStartLeft+"px"}, ">2")
        .call(setWarningTxt,["ramp"],"<")
        .to(".ramp", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">")


        // hole
        .to("#obstacle1", 0, {left:obsStartLeft+"px"}, ">2")
        .call(setWarningTxt,["hole"],"<")
        .to("#obstacle1", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">")

        // rock R
        .to("#obstacle5", 0, {left:obsStartLeft+"px"}, ">")
        .call(setWarningTxt,["up"],"<")
        .to("#obstacle5", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">")

        .to("#obstacle2", 0, {left:obsStartLeft+"px"}, "-=2")
        .call(setWarningTxt,["down"],"<")
        .to("#obstacle2", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">")
        

        // asteroid
        .to("#obstacle4", 0, {left:obsStartLeft+"px"}, "-=2")
        .call(setWarningTxt,["asteroid"],"<")
        .to("#obstacle4", obsSpeed, {left:(obsEndLeft*1.5),ease:Linear.easeNone},">")

        
        // ramp
        .to(".ramp", 0, {left:obsStartLeft+"px"}, ">2")
        .call(setWarningTxt,["ramp"],"<")
        .to(".ramp", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">")

        // ramp
        .to(".ramp", 0, {left:obsStartLeft+"px"}, ">1")
        .call(setWarningTxt,["ramp"],"<")
        .to(".ramp", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">")

        // ramp
        .to(".ramp", 0, {left:obsStartLeft+"px"}, ">1")
        .call(setWarningTxt,["ramp"],"<")
        .to(".ramp", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">");



    } else if(cheat=="rampMode"){
        
        tl.addLabel("rampMode", "<")
        // ramp
        .to(".ramp", 0, {left:obsStartLeft+"px"}, ">1")
        .call(setWarningTxt,["ramp"],"<")
        .to(".ramp", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">");


    } else if(cheat=="clearMode"){
        tl.addLabel("clear", "<");

        
    } else if(cheat=="fastMode" || cheat=="quickerMode"){
        
        tl.addLabel("fastMode", "<")

        // rock L
        .to("#obstacle2", 0, {left:obsStartLeft+"px"}, ">")
        .call(setWarningTxt,["down"],"<")
        .to("#obstacle2", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">")


        // rock R
        .to("#obstacle5", 0, {left:obsStartLeft+"px"}, ">")
        .call(setWarningTxt,["up"],"<")
        .to("#obstacle5", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">")

    
        // ramp
        .to(".ramp", 0, {left:obsStartLeft+"px"}, ">")
        .call(setWarningTxt,["ramp"],"<")
        .to(".ramp", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">")


        // hole
        .to("#obstacle1", 0, {left:obsStartLeft+"px"}, ">3")
        .call(setWarningTxt,["hole"],"<")
        .to("#obstacle1", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">")

        // asteroid
        .to("#obstacle4", 0, {left:obsStartLeft+"px"}, ">")
        .call(setWarningTxt,["asteroid"],"<")
        .to("#obstacle4", obsSpeed, {left:(obsEndLeft),ease:Linear.easeNone},">")
    }
}

var reps = 0;
var numberOfLoops = 100;
var collided = false;
function timeLineComplete() {
    // console.log(audio.currentTime);
    if (reps < numberOfLoops) {
        if(!collided && !isSongToEnding)

            // if(reps)
            // gameSpeed++
            
            tl.restart();
    } else {
        // stop playing
    }

    reps++;
}


function setWarningTxt(txt){
    var warningtxtTl = gsap.timeline();
    switch(txt) {
        case "down":
            warningtxt.innerHTML="<<";
            warningtxtTl.addLabel('warningtxtDown')
                .to("#warningtxt",0,{rotationZ:-90,rotationY:150,z:0,scaleX:4,scaleY:5},"<")
                .to("#warningtxt",{autoAlpha:1},"<")
                .to("#warningtxt",.3,{z:10,ease:Linear.easeNone,repeat:3},"<")
                .to("#warningtxt",0,{autoAlpha:0,rotationZ:0,rotationY:0,z:0,scaleX:2,scaleY:2},">");
        break;
        case "up":
            warningtxt.innerHTML=">>";
            warningtxtTl.addLabel('warningtxtUp')
                .to("#warningtxt",0,{rotationZ:-90,rotationY:150,z:0,scaleX:4,scaleY:5},"<")
                .to("#warningtxt",{autoAlpha:1},"<")
                .to("#warningtxt",.3,{z:-10,ease:Linear.easeNone,repeat:3},"<")
                .to("#warningtxt",0,{autoAlpha:0,rotationZ:0,rotationY:0,z:0,scaleX:2,scaleY:2},">");
        break;
        case "asteroid":
            warningtxt.innerHTML=">";
            warningtxtTl.addLabel('warningtxtAsteroid')
                .to("#warningtxt",0,{rotation:90,scaleY:2},"<")
                .to("#warningtxt",.1,{autoAlpha:1,yoyo:true,repeat:9},"<")
                .to("#warningtxt",0,{autoAlpha:0,y:0,rotation:0,scaleY:2},"+=1");
        break;
        case "hole":
            warningtxt.innerHTML="<div>@</div>";
            warningtxtTl.addLabel('warningtxtHole')
                .to("#warningtxt",0,{rotationZ:90,rotationY:41,scaleX:3,scaleY:4},"<")
                .to("#warningtxt div",2,{rotation:720,ease:Linear.easeNone},"<")
                .to("#warningtxt",{autoAlpha:1},"<")
                .to("#warningtxt",1,{autoAlpha:0},".5")
                .to("#warningtxt",0,{y:0,rotationZ:0,rotationY:0,scaleX:2,scaleY:2},">")
                .to("#warningtxt div",0,{rotation:0},">");
        break;
        case "ramp":
            warningtxt.innerHTML=">>>>";
            warningtxtTl.addLabel('warningtxtRamp')
                .to("#warningtxt",{autoAlpha:1},"<")
                .to("#warningtxt",.3,{x:50,ease:Power1.easeIn,repeat:3},"<")
                .to("#warningtxt",0,{autoAlpha:0,x:0},">");
        break;
    }
    
}

var collided = false;
var isSongToEnding = false;
var songEndTime = 315;
// var songEndTime = 90; //[for testing]
var endingPlayed = false;
function fgTimeLineComplete() {
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

    // [todo] how many obstacles
    console.log('you hit '+noObstaclesHit)

    gsap.to([".obstacle",pausedtxt],0,{autoAlpha:0});
    tl.pause();

    gsap.set([pointstxt,jumpingtxt],{autoAlpha:0});

    
    $('#shadow').removeClass('shadowBounce');
    
        tlEnding = gsap.timeline({onComplete:tlEndingComplete});

        tlEnding.addLabel("ending", "<")
        .to("#car-shadow",0,{autoAlpha:.4,x:900},"<")
        .to(".car",0,{autoAlpha:1,x:900},"<")
        .to([".car","#car-shadow"],6,{x:0,ease:Power1.easeOut},">")
        .to("#player",1,{top:"270px"},"<")
        
        .to(["#rider-go","#bike-go"],1,{rotationZ:-30},"-=3")
        .to("#rider", {className: 'riderBounce'},"<")

    
        .to(["#rider-go","#bike-go"],1.5,{rotationZ:0,ease:Bounce.easeOut},">")


        .to("#rider-stopped", 0, {autoAlpha:0},">")
        .to("#rider-go", 0, {autoAlpha:1},"<")
        .to("#car-shadow",2,{autoAlpha:0},">")


        .to("#tilt,#bgMountains",5,{y:250,ease:Power1.easeIn},"<")
        .to("#player",2,{rotationZ:-10,ease:Power1.easeIn},"<")
        .to("#player",5,{x:222,y:-370,ease:Power1.easeIn},"<")
        
        .to("#player",2,{x:1100,y:-630,ease:Back.easeIn},">")
        .to(".car-jets",.75,{scaleX:3,ease:Power1.easeInOut},"-=1");
}

var endingComplete = false;
function tlEndingComplete(){
    endingComplete=true;
    // stop all timelines
    // show high score
    $("#scoretxt").html(points);
    
    $("#obstaclesHittxt").html(noObstaclesHit);
    if(noObstaclesHit==0){

        // [todo] - one falling balloon animation:
        alert('perfect ride!! one falling balloon...')
    } else if(noObstaclesHit<4) {
        $('#obstaclesHittxt').addClass('colorRotateYellow');
    } else {
        $('#obstaclesHittxt').addClass('colorRotateRed');
    }
    
    $("#pointstxt").html(points);

    gsap.set(endtxt,{display:"block", autoAlpha:1})

    document.getElementById('initialstxt').focus();

    unBindButtons_gamePlay();
    unBindButtons_gameResume();

    document.getElementById('initialstxt').addEventListener('keypress',highScoreEntered);

    tlintro.pause();
    tl.pause();
    tlfg.pause();
    // tlbg.pause();     /// -- keep stars moving after end
    // tlstarsBG.pause();
    tlhair.pause();
    tlLyrics.pause();
    tlFlyPast.pause();

}





var highScores = [
    ["sco","7662"],
    ["jon","6437"],
    ["srj","5876"],
    ["guy","5211"]
];

var scoretxt = document.getElementById("scoretxt");
var obstaclesHittxt = document.getElementById("obstaclesHittxt");
var initialstxt = document.getElementById("initialstxt");

function highScoreEntered(e) {

    if(e.keyCode=="13") {

        var placedScore = false;
        var yourScore = Number(scoretxt.innerHTML);
        var yourNameScore = initialstxt.value;
        
        
        var highScoreList = "highest scores:<br><br>";
        for(i=0; i<highScores.length; i++){    
            if(yourScore > Number(highScores[i][1]) && !placedScore){
                highScores.splice(i,0,["<span>"+yourNameScore,yourScore.toString()+"</span>"]);
                placedScore=true;
            }
        }

        if(!placedScore) {
            highScores.push(["<span>"+yourNameScore,yourScore.toString()+"</span>"]);   
        }
        // console.log(highScores);
        
        for(i=0; i<highScores.length; i++){
            highScoreList+= highScores[i][0]+"........."+highScores[i][1]+"<br>";
        }

        gsap.set(endtxt,{display:"none", autoAlpha:0})
        var highScoreListLower = highScoreList.toLowerCase();

        $("#highscorestxt").html(highScoreListLower);
        
        gsap.to(["#mobileControls"],0,{display:"none"});
        gsap.to(["#highscorestxt","#endScreenBtns"],0,{autoAlpha:1});
        gsap.to(["#endScreenBtns"],0,{display:"block"});

        // share button
        shareBtn.href="mailto:everyone.i.know?&subject=amazing game by this band called primitai&body=this game made by this band primitai is absolutely brilliant, i crashed "+obstaclesHittxt.innerHTML+" times and scored "+scoretxt.innerHTML+" points: http://www.primitai.com";



    }
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


/*///////////////////////  ////////////////////////////////*/
/*/////////////////////// COLLISION DETECTION ////////////////////////////////*/
/*///////////////////////  ////////////////////////////////*/
/*///////////////////////  ////////////////////////////////*/
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
                // console.log(collide);
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

var isRamping = false;
function playerCollided(whichObstacleHit) {
    // get player Pos so we can do right "falling down hole" and "ramp" animations:
    var playerTop = player.offsetTop,
    yAmount,
    rotateZAmount,
    rotateYAmount;

    switch (whichObstacleHit){

        case "obstacle1":   // hole!
            if(!isJumping){
                doObstacleHit();

                points=points-100;
                pointstxt.innerHTML=points;
                
                
                if(playerTop==320)
                {
                    yAmount = 25;
                    rotateZAmount = 30;
                    rotateYAmount = 30;
                } else if(playerTop<playerBotPos){
                    yAmount = 160;
                    rotateZAmount = 40;
                    rotateYAmount = 0;
                } else {
                    yAmount = -5;
                    rotateZAmount = 40;
                    rotateYAmount = 20;
                }

                gsap.to(playerMovements,1,{x:240,y:yAmount,rotationZ:rotateZAmount,rotationY:rotateYAmount,scale:.4});
                gsap.to(player,.5,{autoAlpha:0,delay:.5});

                gsap.to(shadow,.2,{autoAlpha:0})
                

                jumpingtxt.innerHTML="@";

                // say random phrase:
                var whichPhrase = Math.floor(Math.random() * collidedTxts.length-1) + 1; 
                speechtxt.innerHTML=collidedTxts[4];

                gsap.set(speechbub,{autoAlpha:1});
                gsap.to(speechbub,0,{autoAlpha:1,delay:0});

            } else {
                // jumped hole
            }
            break;


        case "obstacle2": // rock-top (can be jumped)

                if(!isJumping){
                    doObstacleHit();
                    doRiderCrash();
                }
            break;


        case "obstacle3":   // ramp
            console.log("hit ramp");

            if(isJumping){
                // hit a ramp while isJumping true
                // [todo] 
                isJumping=false;
                doObstacleHit();

                doRiderCrash();

            } else {
                if(!isRamping){
                    isRamping=true;
                    var rampStartDelay=0;

                    if(playerTop==270){
                        // console.log(playerTop+" = player at middle");
                    } else if(playerTop<=340) {
                        // console.log(playerTop+" = player at top");
                        rampStartDelay = .1;
                    } else  {
                        // console.log(playerTop+" = player at bottom");
                    }

                    $('#rider').removeClass('riderBounce');
                    $('#shadow').removeClass('shadowBounce');

                    gsap.killTweensOf(notJumping);
                    gsap.killTweensOf(backtoBounce);

                    tlramp = gsap.timeline({onComplete:tlRampComplete});
                    tlramp.addLabel("hitRamp")
                        .to(rider,rampStartDelay,{autoAlpha:1})
                        .to(shadow,.2,{autoAlpha:0,scaleX:0},">")
                        .to(rider,1,{y:"-=250"},"<")
                        .to(speechbub,.5,{x:"+=50"},"<")
                        .to(speechbub,.5,{y:"-=270"},"<")

                        .to(rider,.3,{rotationZ:-80},"<")
                        .to(rider,1.5,{rotationZ:0,ease:Sine.easeIn},'>')
                        .to(rider,2,{y:"+=250",ease:Bounce.easeOut},"-=.6")
                        .to(speechbub,2,{y:"+=270",x:"-=50",ease:Bounce.easeOut},"<")
                        .to(shadow,2,{autoAlpha:.4,scaleX:1,ease:Bounce.easeOut},"<")
                }
            }
            break;


        case "obstacle4": // asteroid

            if(!isJumping){
                // if we hit a asteroid while not jumping (dont stop!)
                // do nothing
                // console.log('went under asteroid');
            } else {
                // if we hit a asteroid while jumping
                isJumping=false;
                doObstacleHit();

                doRiderCrash();
            }
    
        break;


        case "obstacle5":   // rock bottom (cannot be jumped)
            if(isJumping){
                isJumping=false;
            }
            doObstacleHit();
            doRiderCrash();

        break;
    } 
}

function tlRampComplete(){
    isRamping=false;
    $('#rider').addClass('riderBounce');
    $('#shadow').addClass('shadowBounce');
}


/*///////////////////////  ////////////////////////////////*/
/*/////////////////////// OBSTACLE HIT ////////////////////////////////*/
/*///////////////////////  ////////////////////////////////*/
/*///////////////////////  ////////////////////////////////*/
var audioIncreaseAmount=1;
var noObstaclesHit = 0; 
function doObstacleHit() {
    noObstaclesHit++;

    collided=true;
        
    gsap.killTweensOf(backtoBounce);
    gsap.killTweensOf(notJumping);
    gsap.killTweensOf(detectCollision);
    gsap.killTweensOf(player);
    gsap.killTweensOf(playerMovements);

    // volume increases each crash
    
    if(crashCount<20){
        if(0.3+(audioIncreaseAmount/20)<1){
            audio.volume=0.3+(audioIncreaseAmount/20);
            audioIncreaseAmount++;
        } else {
            audio.volume=1;
        }
    }
    
    // setup kkeypress to resume:
    gsap.set(resumetxt,{autoAlpha:1,className:"copy flashing",delay:1,onComplete:function(){
        BindButtons_gameResume();
    }});
    


    $('#rider').removeClass('riderBounce');
    $('#shadow').removeClass('shadowBounce');
    
    tlfg.pause();
    tlbg.pause();
    tlstarsBG.pause();
    tlMountainsBG.pause();
    tlCloudsBG.pause();
    tl.pause();
    tlhair.pause();
    primScreamTL.pause();
    
    gsap.killTweensOf("#rider-jets");
    gsap.to("#rider-jets",1,{scaleX:1,scaleY:1,x:0,y:0,filter:"hue-rotate(0deg)",top:"0px",skewY:0});


    
    tlScream.addLabel('scream')
        .to(".rider-scream",0,{autoAlpha:1},0)
        .to([".rider-go",".hair-go",".rider-scream2"],0,{autoAlpha:0},0)
        .to([".rider-scream","#rider-jets"],0,{autoAlpha:0},"1.5")
        .to("#rider-stopped",0,{autoAlpha:1},"1.5")
        .addLabel('screamDone');

    tlScream.play();

    unBindButtons_gamePlay();
}


var collidedTxts=["move the wreck!",
                "move the wreck!",
                "outta my way!!",
                "outta my way!!",
                "aaargh",
                "oh no!",
                "@#$%&!0",
                "@#$%&!0"];

var crashCount=0;
function doRiderCrash(){
    crashCount++;

    points=points-100;
    pointstxt.innerHTML=points;


    $('#rider').removeClass('riderFly');

    // [todo] //better crash sound
    // oww.play();

    gsap.set(flame,{autoAlpha:1});

    // say random phrase:
    var whichPhrase = Math.floor(Math.random() * collidedTxts.length-1) + 1; 
    
    
    jumpingtxt.innerHTML="crashed";

    // say something for crash
    whichPhrase = Math.floor(Math.random() * collidedTxts.length-1) + 1; 

    speechtxt.innerHTML=collidedTxts[whichPhrase];

    gsap.set(speechbub,{autoAlpha:1,top:"4px",rotation:0},1.5)
    gsap.to(speechbub,0,{autoAlpha:0,delay:3});
}




/*///////////////////////  ////////////////////////////////*/
/*/////////////////////// WRITE LYRICS ////////////////////////////////*/
/*///////////////////////  ////////////////////////////////*/
/*///////////////////////  ////////////////////////////////*/
var chorus1Start = 22,
    verse2Start = 42.35,
    soloStart = 157,
    chorus2Start = 178,
    outroStart = 209.5;

function writeLyrics(){
    gsap.set(lyricstxt,{autoAlpha:1});

    tlLyrics.addLabel('verse1')
        .to("#lyrics1",{display:"block",duration:0},1.25)
        .to("#lyrics1",{display:"none",duration:0},3)
        
        .to("#lyrics2",{display:"block",duration:0},4)
        .to("#lyrics2",{display:"none",duration:0},6)
        
        .to("#lyrics3",{display:"block",duration:0},6.5)
        .to("#lyrics3",{display:"none",duration:0},8.5)

        .to("#lyrics4",{display:"block",duration:0},8.5)
        .to("#lyrics4",{display:"none",duration:0},11)

        .to("#lyrics5",{display:"block",duration:0},12.5)
        .to("#lyrics5",{display:"none",duration:0},15)

        .to("#lyrics6",{display:"block",duration:0},15)
        .to("#lyrics6",{display:"none",duration:0},17.5)

        .to("#lyrics7",{display:"block",duration:0},18)
        .to("#lyrics7",{display:"none",duration:0},20)

        .to("#lyrics8",{display:"block",duration:0},20.5)
        .to("#lyrics8",{display:"none",duration:0},21.5) 


        .addLabel('chorus')
        .to("#lyrics22",{display:"block",duration:0},chorus1Start+0)        
        .call(typeText,["#lyrics22",5],chorus1Start+0)
        .to("#lyrics22",{display:"none",duration:0},chorus1Start+5)
        
        .to("#lyrics23",{display:"block",duration:0},chorus1Start+5.2)
        .call(typeText,["#lyrics23",5.3],chorus1Start+5.2)
        .to("#lyrics23",{display:"none",duration:0},chorus1Start+10.5)
        
        .to("#lyrics24",{display:"block",duration:0},chorus1Start+11)
        .call(typeText,["#lyrics24",3],chorus1Start+11)
        .to("#lyrics24",{display:"none",duration:0},chorus1Start+14)

        .to("#lyrics25",{display:"block",duration:0},chorus1Start+14)
        .call(typeText,["#lyrics25",2],chorus1Start+14)
        .to("#lyrics25",{display:"none",duration:0},chorus1Start+16)

        .to("#lyrics26",{display:"block",duration:0},chorus1Start+16)
        .call(typeText,["#lyrics26",5.5],chorus1Start+16)
        .to("#lyrics26",{display:"none",duration:0},chorus1Start+21.5)



        .addLabel('verse2')
        .to("#lyrics9",{display:"block",duration:0},verse2Start+1.25)
        .to("#lyrics9",{display:"none",duration:0},verse2Start+3)
        
        .to("#lyrics10",{display:"block",duration:0},verse2Start+4)
        .to("#lyrics10",{display:"none",duration:0},verse2Start+6)
        
        .to("#lyrics11",{display:"block",duration:0},verse2Start+6.5)
        .to("#lyrics11",{display:"none",duration:0},verse2Start+8.5)

        .to("#lyrics12",{display:"block",duration:0},verse2Start+9)
        .to("#lyrics12",{display:"none",duration:0},verse2Start+11)

        .to("#lyrics13",{display:"block",duration:0},verse2Start+13)
        .to("#lyrics13",{display:"none",duration:0},verse2Start+15.25)

        .to("#lyrics14",{display:"block",duration:0},verse2Start+15.25)
        .to("#lyrics14",{display:"none",duration:0},verse2Start+18.5)

        .to("#lyrics15",{display:"block",duration:0},verse2Start+18.5)
        .to("#lyrics15",{display:"none",duration:0},verse2Start+20.5)

        .to("#lyrics16",{display:"block",duration:0},verse2Start+20.5)
        .to("#lyrics16",{display:"none",duration:0},verse2Start+23)


        .addLabel('solo')
        .to("#lyrics17",{display:"block",duration:0},soloStart+1)
        .to("#lyrics17",{display:"none",duration:0},soloStart+3)


        .addLabel('chorus2')
        .to("#lyrics27",{display:"block",duration:0},chorus2Start+0)
        .call(typeText,["#lyrics27",5],chorus2Start+0)
        .to("#lyrics27",{display:"none",duration:0},chorus2Start+5)
        
        .to("#lyrics23",{display:"block",duration:0},chorus2Start+5.2)
        .call(typeText,["#lyrics23",5.3],chorus2Start+5.2)
        .to("#lyrics23",{display:"none",duration:0},chorus2Start+10.5)
        
        .to("#lyrics24",{display:"block",duration:0},chorus2Start+11)
        .call(typeText,["#lyrics24",3],chorus2Start+11)
        .to("#lyrics24",{display:"none",duration:0},chorus2Start+14)

        .to("#lyrics25",{display:"block",duration:0},chorus2Start+14)
        .call(typeText,["#lyrics25",2],chorus2Start+14)
        .to("#lyrics25",{display:"none",duration:0},chorus2Start+16)

        .to("#lyrics26",{display:"block",duration:0},chorus2Start+16)
        .call(typeText,["#lyrics26",5.5],chorus2Start+16)
        .to("#lyrics26",{display:"none",duration:0},chorus2Start+21.5)


        .addLabel('outro')
        .to("#lyrics18",{display:"block",duration:0},outroStart+1)
        .to("#lyrics18",{display:"none",duration:0},outroStart+3)
        
        .to("#lyrics19",{display:"block",duration:0},outroStart+3.5)
        .to("#lyrics19",{display:"none",duration:0},outroStart+6)
        
        .to("#lyrics20",{display:"block",duration:0},outroStart+6)
        .to("#lyrics20",{display:"none",duration:0},outroStart+8.5)

        .to("#lyrics21",{display:"block",duration:0},outroStart+9)
        .to("#lyrics21",{display:"none",duration:0},outroStart+12);

}




/*///////////////////////  ////////////////////////////////*/
/*/////////////////////// TRIGGERS FROM AUDIO ////////////////////////////////*/
/*///////////////////////  ////////////////////////////////*/
/*///////////////////////  ////////////////////////////////*/
var doneChorusTint = false,
    doneChorusTintBack = false,
    doneLightning = false,
    doneLightning2 = false,
    doneSlowdown = false,
    lyricsAreGo = false,
    doneSergioFlyBy = false;
function traceAudioTime(){
    // 84
    if(audio.currentTime>=84 && !lyricsAreGo){
        lyricsAreGo=true;
        writeLyrics();
    }


    if(audio.currentTime>=84 && introPlaying){
        introPlaying=false;

        // got to the point in the song:
        // do auto play
        unBindButtons_startGame();
        startGame(false,true);
    }
    
    // make BG red for Chorus 1
    if(audio.currentTime-84>chorus1Start && !doneChorusTint) {
        doneChorusTint=true;

        // playCloudsBG();
        gsap.to(".bgStars",8,{autoAlpha:1,ease:Linear.easeNone});

        // [todo] - something for chorus 1
        doFlyPast();
    }
    
    // make BG normal aftee Chorus 1
    if(audio.currentTime-84>verse2Start && !doneChorusTintBack) {
        doneChorusTintBack=true;

        gsap.to(".bgStars",3,{autoAlpha:.3,ease:Linear.easeNone});

        playMountainsBG();
        gsap.to(bgMountains,0,{display:"block"});
    }

    // fly past sergio
    if(audio.currentTime-84>soloStart && !doneSergioFlyBy){
        doneSergioFlyBy=true;
        doFlyPast("sergio")
    }
    

    // flash lightning at heavy drop and go fast!!
    if(audio.currentTime-84>124.9 && !doneLightning) {
    // if(audio.currentTime-84>14.9 && !doneLightning) {
        doneLightning=true;


        gsap.fromTo("#lightning", 
            { autoAlpha: 0 },
            {   duration: .01,
                autoAlpha: .6,
                yoyo: true,
                repeat: 29,
                repeatDelay: 0.02,
                ease: "none"
            }
        );
        gsap.to([tl,tlfg,tlbg,tlMountainsBG], 1, {timeScale:1.5, ease:Quad.easeIn})
        gsap.to([tlstarsBG], 1, {timeScale:4, ease:Quad.easeIn})

        // make long gap ramps show
        gsap.to("#obstacle3",0,{className:"hidden ramp rampLong obstacle"})

        // [todo] hyperspace
        gsap.to(".bgStars",0,{className:"bg bgStars fast",delay:.8})
        gsap.to(".bgToGo",1,{autoAlpha:0})
    }

    // slow back down for final chorus
    if(audio.currentTime-84>chorus2Start && !doneSlowdown) {
        doneSlowdown=true;

        gsap.to(".bgStars",8,{autoAlpha:1,ease:Linear.easeNone});

        gsap.to([tl,tlfg,tlbg,tlMountainsBG], 1, {timeScale:1.1, ease:Quad.easeOut})
        gsap.to([tlstarsBG], 1, {timeScale:1, ease:Quad.easeOut})

        // ramps back to normal length
        gsap.to("#obstacle3",0,{className:"hidden ramp obstacle"})

        gsap.to(".bgStars",0,{className:"bg bgStars"})
        gsap.to(".bgToGo",1,{autoAlpha:1})

        playMountainsBG();
        gsap.to(bgMountains,0,{display:"block"});

    }

    // more lightning at outro start and super fast to end:
    if(audio.currentTime-84>outroStart && !doneLightning2) {

        gsap.to(".bgStars",1,{autoAlpha:.3});

        doneLightning2=true;

        gsap.fromTo("#lightning", 
            { autoAlpha: 0 },
            {   duration: .01,
                autoAlpha: .6,
                yoyo: true,
                repeat: 29,
                repeatDelay: 0.02,
                ease: "none"
            }
        );
        gsap.to([tl,tlfg,tlbg,tlstarsBG,tlMountainsBG], 1, {timeScale:1.6, ease:Quad.easeIn})

        // make long gap ramps show
        gsap.to("#obstacle3",0,{className:"hidden ramp rampLong obstacle"})
    }

    // if the song is over!
    if(audio.currentTime==audio.duration){
        if(!endingPlayed){
            playEnding();
        }
    }
    // [todo] - if need to see audio playback time
    // console.log(audio.currentTime-84);
}



/*///////////////////////  ////////////////////////////////*/
/*/////////////////////// FULL WIDTH ////////////////////////////////*/
/*///////////////////////  ////////////////////////////////*/
/*///////////////////////  ////////////////////////////////*/
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
    // console.log(windowwidth);
    gsap.set([wrap],{height:windowheight});
    gsap.set([wrap],{width:windowwidth});
    
}


/*///////////////////////  ////////////////////////////////*/
/*/////////////////////// REPLAY BUTTON ////////////////////////////////*/
/*///////////////////////  ////////////////////////////////*/
/*///////////////////////  ////////////////////////////////*/
function replayGame() {
    replayBtn.removeEventListener("click", replayGame);
    replayBtn.removeEventListener("touchend", replayGame);

    window.location=window.location.href;
    // gsap.to([replayBtn,highscorestxt],0,{autoAlpha:0});

    // gsap.to([".car","#car-shadow"],0,{autoAlpha:0});
    // gsap.to(player,0,{autoAlpha:1});
    // gsap.to("#tilt",0,{autoAlpha:1,y:0,overwrite:true});
    // gsap.to(instructionsTxt0,0,{display:"block"});
    // gsap.to(playerMovements,0,{transform:"none"});

    // introPlayed();

    // points=0;

    // tl.seek(0);
    // tlEnding.seek(0);
    // tlIntroScreen.seek(0);
    // tlintro.seek(0);
    // tl.seek(0);
    // tlfg.seek(0);
    // tlbg.seek(0);
    // tlstarsBG.seek(0);
    // tlhair.seek(0);
    // tlramp.seek(0);
    // tlLyrics.seek(0);
    // tlScream.seek(0);

    // tlEnding.pause();
    // tlIntroScreen.pause();
    // tlintro.pause();
    // tl.pause();
    // tlfg.pause();
    // tlbg.pause();
    // tlstarsBG.pause();
    // tlhair.pause();
    // tlramp.pause();
    // tlLyrics.pause();
    // tlScream.pause();
}