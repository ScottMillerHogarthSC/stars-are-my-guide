var gameSpeed = 1;
var introSpeed = 1;
var cheat = "";
var isCheat = false;



var container,controllerWrap,jumpingtxt,speechtxt,audio,oww,pointstxt,points=0;
var body = document.body,
html = document.documentElement;
var pageHeight = Math.max( body.scrollHeight, body.offsetHeight, 
html.clientHeight, html.scrollHeight, html.offsetHeight );

var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

var btnMoveUp, btnMoveForwards, btnMoveBackwards, btnMoveDown, btnJump, btnOption, replayBtn, shareBtn;
var mobileControls, btns, mobilePause;

var tlIntroScreen = gsap.timeline(),
    tlintro = gsap.timeline(),
    tlInstructions = gsap.timeline(),
    tlMainGame = gsap.timeline(),
    tlfg = gsap.timeline(),
    tlbg = gsap.timeline(),
    tlstarsBG = gsap.timeline(),
    tlMountainsBG = gsap.timeline(),
    tlhair = gsap.timeline(),
    tlramp = gsap.timeline(),
    tlLyrics = gsap.timeline(),
    tlScream=gsap.timeline(),
    tlEnding = gsap.timeline(),
    primScreamTL = gsap.timeline(),
    tlFlyPast = gsap.timeline(),
    tlCruisePast = gsap.timeline();

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
            gameSpeed = 0.5;
            introSpeed = 10;
            break;

        case "quickerMode":
            isCheat = true;        
            cheatstxt.innerHTML=cheat;
            cheatstxt.style.display="block";
            gameSpeed = 0.6;
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
    controllerWrap = document.getElementById("controllerWrap");
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
    

    btns = document.getElementById("btns");
    mobilePause = document.getElementById("mobilePause");
    mobileControls = document.getElementById("mobileControls");
    btnMoveUp = document.getElementById("btnMoveUp");
    btnMoveForwards = document.getElementById("btnMoveForwards");
    btnMoveBackwards = document.getElementById("btnMoveBackwards");
    btnMoveDown = document.getElementById("btnMoveDown");
    btnJump = document.getElementById("btnJump");
    btnOption = document.getElementById("btnOption");
    
    resizeWindow();

    $( window ).resize(resizeWindow);




    gsap.set(player,{x:0,y:0,scale:1,autoAlpha:1});
    gsap.set([flame,gameover],{autoAlpha:0});


    if (audio.canPlayType('audio/ogg')) {
        // console.log("canPlayType ogg");

        // audio.setAttribute('src','01_stars_are_my_guide.ogg');
        audio.setAttribute('src','01_stars_are_my_guide.ogg');

    } else if (audio.canPlayType('audio/mpeg')) {
        // console.log("canPlayType mp3");

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
    
        // console.log("loaded Audio");
    
        
        document.getElementById("loadingContent").style.display="none";
        
        container.style.display = "block";
    
        controllerWrap.addEventListener('touchend', playIntroScreen);
        controllerWrap.addEventListener('click', playIntroScreen);
        document.body.addEventListener('keypress', playIntroScreen);
    }
}


function introBindShowSkip(){
    controllerWrap.addEventListener('touchend', introShowSkip);
    controllerWrap.addEventListener('click', introShowSkip);
    document.body.addEventListener('keypress', introShowSkip);

    btns.addEventListener('touchstart', mobileBtnDoNothing);
    btns.addEventListener('touchend', mobileBtnDoNothing);
}

function introShowSkip() {
    controllerWrap.removeEventListener('touchend', introShowSkip);
    controllerWrap.removeEventListener('click', introShowSkip);
    document.body.removeEventListener('keypress', introShowSkip);

    gsap.to(skipIntro,0,{display:"block"});
    
    skipIntro.addEventListener('touchend', introPlayed);
    skipIntro.addEventListener('click', introPlayed);
    document.body.addEventListener('keypress', introPlayed);
}



var introPlaying = false;
function playIntroScreen() {


    controllerWrap.removeEventListener('touchend', playIntroScreen);
    controllerWrap.removeEventListener('click', playIntroScreen);
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
    tlIntroScreen = gsap.timeline({onComplete:introPlayedFully});
    
    tlIntroScreen.timeScale(introSpeed);

    tlIntroScreen.addLabel('introScreen')

        // move game screen down:
        .to(tilt, 0, {autoAlpha:1,scale:1.8,x:388,y:100},"<")
        .to([bgStars1,bgToGo3,introBG,introStars,introTxtTitle,introTxtLogo],0,{scale:1.2,transformOrigin:"left bottom"},"<")


        // hide 'play' button
        .to(introPlay,0,{autoAlpha:0})

        // setup intro BGs
        .to([introStars],0,{y:0,autoAlpha:1})
        .to([introBG],0,{y:0,autoAlpha:0})
        .to(introStars,38,{y:"-1880px",autoAlpha:0.4,rotationZ:0.01,ease:Power1.easeInOut})
        .to(introStars,18,{autoAlpha:0.4,ease:Linear.easeNone},20)
        .to(introBG,38,{y:"-423px",autoAlpha:1,rotationZ:0.01,ease:Power1.easeInOut},0)
        
        // intro copy:
        .to(introLogo,3,{autoAlpha:1,ease:Linear.easeNone},3)
        .to(introTxt01,3,{autoAlpha:1,ease:Linear.easeNone},"<2")
        .to([introTxt01,introLogo],0.5,{autoAlpha:0,ease:Linear.easeNone},">")

        .to(introTxt_volume,0.2,{autoAlpha:.4,repeatDelay:.4,ease:Linear.easeNone,repeat:13,yoyo:true},">")

        .to(introTxt05,3,{autoAlpha:1,ease:Linear.easeNone},"<")
        .to(introTxt05a,0,{autoAlpha:0,ease:Linear.easeNone},"<")
        .call(typeText,["#introTxt05a",2],"<1")
        .to(introTxt05a,3,{autoAlpha:1,ease:Linear.easeNone},"<")
        .to([introTxt05],0.5,{autoAlpha:0,ease:Linear.easeNone},">2")
        
        .to(introTxt02,3,{autoAlpha:1,ease:Linear.easeNone},">")
        .to(introTxt02a,0,{autoAlpha:0,ease:Linear.easeNone},"<")
        .call(typeText,["#introTxt02a",2],"<1")
        .to(introTxt02a,3,{autoAlpha:1,ease:Linear.easeNone},"<")
        .to(introTxt02b,3,{autoAlpha:1,ease:Linear.easeNone},"<1")
        .to([introTxt02],0.5,{autoAlpha:0,ease:Linear.easeNone},">")
        
        .to(introTxt03,3,{autoAlpha:1,ease:Linear.easeNone},">")
        .to(introTxt03a,0,{autoAlpha:0,ease:Linear.easeNone},"<")
        .call(typeText,["#introTxt03a",2],"<1")
        .to(introTxt03a,3,{autoAlpha:1,ease:Linear.easeNone},"<")
        .to(introTxt03b,3,{autoAlpha:1,ease:Linear.easeNone},"<1")
        .to([introTxt03],0.5,{autoAlpha:0,ease:Linear.easeNone},">1")

        .to([introTxt04],3,{autoAlpha:1,ease:Linear.easeNone},">")
        .to([introLogo2],3,{autoAlpha:1,ease:Linear.easeNone},"<1")
        .to([introTxt04,introLogo2],0.5,{autoAlpha:0,ease:Linear.easeNone},">")

        

        
        .to(tilt, 7, {y:-380,ease:Power1.easeOut},">")

        .to(tilt, 10, {scale:1,x:0,y:0,ease:Power1.easeInOut},">")

        .to([bgStars1,bgToGo3,introBG,introStars,introTxtTitle,introTxtLogo],10,{scale:1,ease:Power1.easeInOut},"<")
        .to(introScreen,5,{scale:1,transformOrigin:"left bottom",ease:Power1.easeInOut},"<")

        .to([introTxtTitle],3,{autoAlpha:1,ease:Linear.easeNone},"<2")

        .to(introScreen,1,{autoAlpha:0,ease:Linear.easeNone},"<4")

        .to([introTxtLogo],3,{autoAlpha:1,ease:Linear.easeNone},">")
        .addLabel("IntroScreen_ended");
        
}

function showTitles(speed) {

    tlIntroScreen.seek("IntroScreen_ended");

    gsap.to(tilt, 0, {scale:1,x:0,y:0});

    gsap.to([bgStars1,bgToGo3,introBG,introStars,introTxtTitle,introTxtLogo],0,{scale:1});
    gsap.to(introScreen,0,{scale:1,transformOrigin:"left bottom"});
    
    if(speed=="slowly") {
        gsap.to(instructionsTxt0,3,{autoAlpha:1,ease:Linear.easeNone});
        gsap.to(instructions_optionsTxt,0,{autoAlpha:0,display:"block"});
        gsap.to(instructions_optionsTxt,3,{autoAlpha:0.5,delay:1,ease:Linear.easeNone});

        gsap.to(instructionsTxt0,{className:"instructionsTxtButt flashing hidden copy",delay:4});
    } else {
        gsap.to(instructionsTxt0,0,{autoAlpha:1});
        gsap.to(instructions_optionsTxt,0,{autoAlpha:0.5,display:"block"});
        gsap.to(instructionsTxt0,{className:"instructionsTxtButt flashing hidden copy",delay:0});
        gsap.to([introTxtTitle,introTxtLogo],0,{autoAlpha:1});
    }
}

function introPlayedFully(){
    introPlayed("slowly")
}

function introPlayed(slowly) {
    gsap.killTweensOf(introBindShowSkip);
    tlIntroScreen.pause();

    controllerWrap.removeEventListener('touchend', introShowSkip);
    controllerWrap.removeEventListener('click', introShowSkip);
    document.body.removeEventListener('keypress', introShowSkip);


    showTitles(slowly);

    gsap.to("#mobileControls",0,{className:"pulseMobileControls"});
    gsap.to(skipIntro,0,{display:"none"});
    // reset intro stuff:
    gsap.to(["#bgStars1","#bgToGo3"],0,{scale:1});
    gsap.to("#introScreen",0,{display:"none"});

    skipIntro.removeEventListener('touchend', introPlayed);
    skipIntro.removeEventListener('click', introPlayed);
    document.body.removeEventListener('keypress', introPlayed);

    // add StartGame event listeners:
    BindButtons_startGame();   
}


function BindButtons_gameResume(){
    // console.log("BindButtons_gameResume");
    
    btnWheelie.addEventListener('touchend', gameResume);
    document.body.addEventListener('keypress', gameResume);

    mobileControls.removeEventListener("touchstart", mobileBtnDoNothing);
    mobileControls.removeEventListener("touchend", mobileBtnDoNothing);
}

function unBindButtons_gameResume(){
    // console.log("unBindButtons_gameResume");

    btnWheelie.removeEventListener('touchend', gameResume);
    document.body.removeEventListener('keypress', gameResume);
}

function BindButtons_startGame(){
    // console.log("BindButtons_startGame");

     // mobile
    btnWheelie.addEventListener('touchend', startGame);
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
    gsap.to([introTxtTitle,introTxtLogo],0,{autoAlpha:0});
    gsap.to(optionsScreen,0,{autoAlpha:1,display:"block"});

    optionsBike.addEventListener('click',function(){ optionsBike_chosen(0); });
    optionsBike1.addEventListener('click',function(){ optionsBike_chosen(1); });
    optionsBike2.addEventListener('click',function(){ optionsBike_chosen(2); });

    optionsBike.addEventListener('touchend',function(){ optionsBike_chosen(0); });
    optionsBike1.addEventListener('touchend',function(){ optionsBike_chosen(1); });
    optionsBike2.addEventListener('touchend',function(){ optionsBike_chosen(2); });  
}



function optionsBike_chosen(bikeNo){
    if(bikeNo==undefined || bikeNo==0) {bikeNo="";}
    gsap.to("#bike-go",0,{className: "bike"+bikeNo});
    gsap.to([introTxtTitle,introTxtLogo],0,{autoAlpha:1});
    gsap.to(optionsScreen,0,{autoAlpha:0,display:"none"});

    $('#mobileControls').removeClass("optionsShowing");

    BindButtons_startGame();

}

function unBindButtons_startGame(){
    // console.log("unBindButtons_startGame");

    btnWheelie.removeEventListener('touchend', startGame);
    document.body.removeEventListener('keypress', startGame);
}


function BindButtons_gamePlay(){
    // console.log("BindButtons_gamePlay")

    // remove StartGame Event Listeners 
    unBindButtons_startGame();
    unBindButtons_gameResume();

            mobileControls.addEventListener("touchstart", mobileBtnDoNothing);
            mobileControls.addEventListener("touchend", mobileBtnDoNothing);

            mobilePause.addEventListener("touchstart", gamePause);



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

            
            mobilePause.removeEventListener("touchstart", gamePause);

    // bind the mobile buttons to do nothing! 
            btnsMove.addEventListener("touchstart", mobileBtnDoNothing);
            btnsMove.addEventListener("touchend", mobileBtnDoNothing);


            btnMoveUp.addEventListener("touchstart", mobileBtnDoNothing);
            btnMoveForwards.addEventListener("touchstart", mobileBtnDoNothing);
            btnMoveBackwards.addEventListener("touchstart", mobileBtnDoNothing);
            btnJump.addEventListener("touchstart", mobileBtnDoNothing);
            btnWheelie.addEventListener("touchstart", mobileBtnDoNothing);

            btnMoveUp.addEventListener("touchend", mobileBtnDoNothing);
            btnMoveForwards.addEventListener("touchend", mobileBtnDoNothing);
            btnMoveBackwards.addEventListener("touchend", mobileBtnDoNothing);
            btnJump.addEventListener("touchend", mobileBtnDoNothing);
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
            $('#introBtnK').addClass('pressed');
            $('#btns').addClass('pressedJump');
        }
        if(this.id=="btnWheelie") {
            gsap.killTweensOf(backtoBounce);
            wheelie();
            $('#introBtnJ').addClass('pressed');
            $('#btns').addClass('pressedWheelie');
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
        $('#btns').removeClass('pressedJump');
    }
    if(this.id=="btnWheelie") {
        $('#introBtnJ').removeClass('pressed');
        $('#btns').removeClass('pressedWheelie');
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
                $('#btns').addClass('pressedWheelie');
            }
        }
        else if(e.code=="KeyK") {
            if(keyDown!="K"){
                gsap.killTweensOf(backtoBounce);

                jump();

                keyDown = "K";
                $('#introBtnK').addClass('pressed');
                $('#btns').addClass('pressedJump');
            }
        }
        else if(e.code=="KeyD") {
            if(keyDown!="D"){
                forwards();

                keyDown = "D";
                $('#introBtn').addClass('pressedD');
                $('#btnsMove').addClass('forwards');
            }
        }
        else if(e.code=="KeyA") {            
            if(keyDown!="A"){
                backwards();

                keyDown = "A";
                $('#introBtn').addClass('pressedA');
                $('#btnsMove').addClass('backwards');
            }
        }
        else if(e.code=="KeyW") {
            if(keyDown!="W"){
                upwards();
                $('#introBtn').addClass('pressedW');
                $('#btnsMove').addClass('up');

                keyDown="W";
            }
        }
        else if(e.code=="KeyS") {
            if(keyDown!="S"){
                downwards();
                $('#introBtn').addClass('pressedS');
                $('#btnsMove').addClass('down');

                keyDown="S";
            }
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
    $('#btnsMove').removeClass('backwards').removeClass('forwards').removeClass('up').removeClass('down');
    $('#btns').removeClass('pressedWheelie');
    $('#btns').removeClass('pressedJump');
}


var gameStarted = false;
/*///////////////////////  ////////////////////////////////*/
/*/////////////////////// START GAME ////////////////////////////////*/
/*///////////////////////  ////////////////////////////////*/
/*///////////////////////  ////////////////////////////////*/
function startGame(ev,didAutoPlay){
    if(!gameStarted){
        gameStarted=true;

        // prevent touch default:
        if(ev.cancelable) {
            ev.preventDefault();
        }


        // setup all listeners for gaming:
        BindButtons_gamePlay();

        tlIntroScreen.pause();

        gsap.to("#mobileControls",0,{className:""});

        gsap.from("#mobileControls",3,{autoAlpha:0},"<1")
        gsap.to("#mobileControls",0,{display:"block"},"<");

        gsap.to([introScreen,btnOption],0,{display:"none"});

        gsap.to("#tilt",0,{y:0});

        points=0;

        introPlaying=false;

        if(!didAutoPlay){
            audio.currentTime=84.00; 
            // console.log(audio.currentTime);
        }
        
        
        

        
        // reset
        gsap.set([flame,gameover,"#rider-stopped",instructionsTxt0,instructions_optionsTxt,introTxtTitle,introTxtLogo,optionsScreen],{autoAlpha:0,overwrite:true});
        gsap.set([player,"#rider-go",pointstxt,jumpingtxt],{autoAlpha:1});

        backtoBounce();
            


        //
        setupGamePlayTimelines();
        
        
        

        

        
        gsap.fromTo(tlstarsBG,4,{timeScale:0},{timeScale:1,ease:Power1.easeIn});
        gsap.fromTo(tlbg,4,{timeScale:0},{timeScale:1,ease:Power1.easeIn});
    }
}
    


/////// TIME LINE VARS /////
var fgWidth = 1800,
    fgSpeed = gameSpeed*2;

var bgWidth = 1800,
    bgSpeed = gameSpeed*10;

var starsBGWidth = 1300,
    starsBGSpeed = gameSpeed*5;

var mountainsBGWidth = 1800,
    mountainsBGSpeed = gameSpeed*5;

var hairspeed = 1,
    maxhairspeed=5;

function setupGamePlayTimelines() {

    tlhair = gsap.timeline({repeat:-1});
    tlhair.timeScale(hairspeed/maxhairspeed);
    
    tlhair.to(['#hair-go3','#hair-go2'],0,{autoAlpha:0},"<")
        .to('#hair-go1',0,{autoAlpha:1},"<")
        .to('#hair-go1',0,{autoAlpha:0},">0.1")
        .to('#hair-go2',0,{autoAlpha:1},">")
        .to('#hair-go2',0,{autoAlpha:0},">0.1")
        .to('#hair-go3',0,{autoAlpha:1},">")
        .to('#hair-go3',0,{autoAlpha:0},">0.1")
        .add(function(){ 
            if(hairspeed<maxhairspeed) {
                hairspeed++;
                tlhair.timeScale(hairspeed/maxhairspeed);
            }
        },"<");
    

    tlintro = gsap.timeline({onComplete:showIntructions});
    tlintro.addLabel("FGsBGs", "<")
        .to("#fg-intro",0, {autoAlpha:1},"<")
        
        // reset obs
        .to(".obstacle", 0, {autoAlpha:1,left:obsStartLeft}, "<")

        .to("#fg-intro",4,{x:"-100%",ease:Power1.easeIn},"<")
        .to("#fgs",{autoAlpha:1},"-=1.25")
        .to(fgToGo1,0,{autoAlpha:1,x:fgWidth},"-=1.25")
        .to(fgToGo1,(fgSpeed/2),{x:0,ease:Linear.easeNone},">")

        .add(playFGs,"<");
    
       

    tlbg = gsap.timeline({repeat:-1});
    tlbg.addLabel('bgLoop', '<')
        .to([bgToGo1],0,{x:0,rotationZ:0})
        .to([bgToGo2],0,{x:bgWidth,rotationZ:0})
        .to([bgToGo3],0,{x:bgWidth,rotationZ:0})
        
        .to(bgToGo1,bgSpeed,{x:-bgWidth,rotationZ:0.01,ease:Linear.easeNone},">")
        .to(bgToGo2,bgSpeed,{x:0,rotationZ:0.01,ease:Linear.easeNone},"-="+bgSpeed)
        .to(bgToGo2,bgSpeed,{x:-bgWidth,rotationZ:0.01,ease:Linear.easeNone},">")
        .to(bgToGo3,bgSpeed,{x:0,rotationZ:0.01,ease:Linear.easeNone},"-="+bgSpeed);

    
    tlstarsBG = gsap.timeline({repeat:-1});
    tlstarsBG.addLabel('starsBGLoop', '<')
        .to([bgStars1],0,{x:0,rotationZ:0})
        .to([bgStars2],0,{x:starsBGWidth,rotationZ:0})
        .to([bgStars3],0,{x:starsBGWidth,rotationZ:0})
        
        .to(bgStars1,starsBGSpeed,{x:-starsBGWidth,rotationZ:0.01,ease:Linear.easeNone},">")
        .to(bgStars2,starsBGSpeed,{x:0,rotationZ:0.01,ease:Linear.easeNone},"-="+starsBGSpeed+"")
        .to(bgStars2,starsBGSpeed,{x:-starsBGWidth,rotationZ:0.01,ease:Linear.easeNone},">")
        .to(bgStars3,starsBGSpeed,{x:0,rotationZ:0.01,ease:Linear.easeNone},"-="+starsBGSpeed);

    
    tlfg = gsap.timeline({onComplete:fgTimeLineComplete,paused:true});
    tlfg.addLabel('fg loop', '<')
        .to([fgToGo3],0,{autoAlpha:0},">")
        
        .to([fgToGo1],0,{x:0,rotationZ:0,},"<")
        .to([fgToGo2],0,{x:fgWidth,rotationZ:0},"<")
        
        .to([fgToGo1],fgSpeed,{x:-fgWidth,rotationZ:0.01,ease:Linear.easeNone},">")
        .to([fgToGo2],fgSpeed,{x:0,rotationZ:0.01,ease:Linear.easeNone},"<");

    tlFlyPast = gsap.timeline({paused:true});
    tlFlyPast.addLabel('flypast','<')
    .to(flyPast,0,{x:0,z:0.01},'<')
    .to(flyPast,2,{x:300,z:-0.01,ease:Back.easeOut},'>')
    .to(flyPast,1,{x:1220,z:-0.01,ease:Power1.easeIn},'>');


    tlCruisePast = gsap.timeline({paused:true});
    tlCruisePast.addLabel('cruisepast','<')
    .add(function(){
        speakingLocked = true;
        console.log("speakingLocked");
    },"<")
    .to(flyPast,0,{x:0,z:0.01},'<')
    .to(flyPast,3,{x:1220,z:-0.01,ease:Linear.easeNone},'>')
    .add(function(){
        speechtxt.innerHTML="what the hell?";
        console.log('wth');
    }, "<1")
    .to(speechbub,0,{autoAlpha:1},"<")
    .to(flyPast,0.7,{y:"-70",scale:0.65,ease:Power1.easeInOut},'>.7')
    .add(function(){
        gsap.to(speechbub,0,{autoAlpha:0})
        speechtxt.innerHTML="";
        speakingLocked = false;
        console.log('speakingLocked false')
    },">");
    
        
    tlScream = gsap.timeline({paused:true});
    tlScream.addLabel('scream')
    .to(".rider-scream",0,{autoAlpha:1},0)
    .to([".rider-go",".hair-go",".rider-scream2"],0,{autoAlpha:0},0)
    .to([".rider-scream","#rider-jets"],0,{autoAlpha:0},"1")
    .to("#rider-stopped",0,{autoAlpha:1},"1")
    .addLabel('screamDone');
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
    tlintro.pause();
    tlInstructions.pause();
    tlMainGame.pause();
    tlLyrics.pause();
    tlramp.pause();
    tlhair.pause();

    gsap.set(lyricstxt,{autoAlpha:0});

    $('#rider').removeClass('riderBounce');
    $('#rider').removeClass('riderFly');
    $('#shadow').removeClass('shadowBounce');

    gsap.set(["#rider-stopped"],{autoAlpha:1});
    gsap.set(["#rider-go"],{autoAlpha:0});
    gsap.to(["#rider-go","#bike-go"],0,{rotationZ:0});
    gsap.to("#rider-jets",0,{autoAlpha:0});

    jumpingtxt.innerHTML="paused";
    gsap.set(pausedtxt,{autoAlpha:1});


    gsap.set(controller,{className:"pulseController"});
    
    gsap.set([instructionsTxt3,instructionsTxt4], {className:"copy instructionsTxt instructionsTxtButt hidden paused" });


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


    // console.log('resume');

    

    // resuming after crash
    if(collided) {
        collided=false;
        gsap.set(resumetxt,{autoAlpha:0,className:"copy"});
        gsap.set([flame,".rider-scream"],{autoAlpha:0});
        gsap.to(shadow,0,{autoAlpha:0.4});
        
        hideSpeechBub();


        // reset from "fallen down hole":
        gsap.set(playerMovements,{x:0,y:0,rotationZ:0,rotationY:0,scale:1,autoAlpha:1});

        // reset player pos:
        gsap.set(player,{x:0,y:0,rotationZ:0,rotationY:0,scale:1,autoAlpha:1});

        // flash player for 1s
        gsap.to(player,0.1,{autoAlpha:0,yoyo:true,repeat:9});

        gsap.delayedCall(1,detectCollision);
    } else {

        // reumsing after pause: 
        gsap.set(controller,{className:""});
        gsap.set([instructionsTxt3,instructionsTxt4], {className:"copy instructionsTxt instructionsTxtButt hidden" });

        gsap.set(lyricstxt,{autoAlpha:1});
        gsap.delayedCall(0.01,detectCollision);
    }
    collideAll="";
    audio.play();
    audio.volume = 1;

    
    tlintro.resume();
    tlInstructions.resume();
    tlMainGame.resume();
    tlbg.resume();  
    tlstarsBG.resume();
    tlfg.resume();  
    tlhair.resume();  
    tlramp.resume();
    tlLyrics.resume();
    
    if(MountainsPlaying){
        if(tlMountainsBG.time()>0)
            tlMountainsBG.resume();
        else {
            tlMountainsBG.play();
        }
    }


    $('#rider').addClass('riderBounce');
    $('#rider').addClass('riderFly');
    $('#shadow').addClass('shadowBounce');

    tlScream.pause();
    tlScream.seek(0);

    gsap.set("#rider-stopped",{autoAlpha:0});
    gsap.set(["#rider-go",".rider-go","#rider-jets"],{autoAlpha:1});

    
    jumpingtxt.innerHTML="go";
    
    
    gsap.set(pausedtxt,{autoAlpha:0});
    
    

    BindButtons_gamePlay();
}               





// speech
var jumpPhrases = ["to the void we ride",
                "rising high",
                "feel it soaring",
                "slice the air",
                "primitaaaii"];

var brakingPhrases = ["hit the brakes",
                    "what the hell?",
                    "woah!",
                    "hang back",
                    "yo butt head!!"];
                    
var goPhrases = ["drive!",
                "let's go!",
                "go go go",
                "no time to lose",
                "my road goes on forever",
                "the quest goes on",
                "pedal to the floor"];

var wheeliePhrases = ["right on!",
                    "out of control",
                    "stop for no man",
                    "on the loose",
                    "too fast to die",
                    "above the law"];

var collidedPhrases=["move the wreck!",
                "move the wreck!",
                "outta my way!!",
                "outta my way!!",
                "aaargh",
                "oh no!",
                "@#$%&!0",
                "@#$%&!0"];

var vortexPhrases = ["aaargh",
                    "to the void we ride",
                    "vortex warping"];


var speakingLocked = false;
function doSpeech(whatOccurred,delay,count,factor){

    gsap.killTweensOf(hideSpeechBub);

    if(!speakingLocked){
        if(whatOccurred==collidedPhrases){
            var whichPhrase = Math.floor(Math.random() * whatOccurred.length-1) + 1; 
            speechtxt.innerHTML=whatOccurred[whichPhrase];
        
            gsap.set(speechbub,{autoAlpha:1,top:"4px",rotation:0,delay:0.7});
            
            gsap.delayedCall(delay+0.7, hideSpeechBub);

        } else if(whatOccurred==vortexPhrases){
            var whichPhrase = Math.floor(Math.random() * whatOccurred.length-1) + 1; 
            speechtxt.innerHTML=whatOccurred[whichPhrase];

            gsap.set(speechbub,{autoAlpha:1});
            gsap.delayedCall(delay,hideSpeechBub);

        } else if(count != undefined && count % factor === 0){
            var whichPhrase = Math.floor(Math.random() * whatOccurred.length-1) + 1; 
            speechtxt.innerHTML=whatOccurred[whichPhrase];

            gsap.set(speechbub,{autoAlpha:1});
            gsap.delayedCall(delay,hideSpeechBub);
        } else {
            gsap.delayedCall(.5,hideSpeechBub);
        }
    }
}

function hideSpeechBub(){
    speechtxt.innerHTML="";
    gsap.to(speechbub,0,{autoAlpha:0});
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

        if (tlfg.isActive() && jumpCount % 9 === 0) {
            
            // every 9 jumps do a stand-up scream

            speakingLocked = true;

            tlhair.pause();
            primScreamTL = gsap.timeline({onComplete:function(){ tlhair.play(); }});

            speechtxt.innerHTML="primitaaaii";
            
            primScreamTL.addLabel('primScream')
                .to('.rider-scream2',0,{autoAlpha:1},"<")
                .to(['.rider-go','.hair-go'],0,{autoAlpha:0},"<")
                .to(speechbub,0,{autoAlpha:1,top:"-40px",rotation:-5},0)
                .to(speechbub,0,{autoAlpha:0,top:"4px",rotation:0},1.5)
                .to('.rider-scream2',0,{autoAlpha:0},1.5)
                .to(['.rider-go','.hair-go'],0,{autoAlpha:1},1.5)
                .add(function(){speakingLocked=false},2.5);

        } else if(tlMainGame.isActive()){

            doSpeech(jumpPhrases,1.5,jumpCount,3);

        }
        

        $('#rider').removeClass('riderBounce');
        $('#shadow').removeClass('shadowBounce');

        $('#rider-jets').addClass('jumpJets');

        gsap.delayedCall(1,function(){
            $('#rider-jets').removeClass('jumpJets');
        });


        gsap.to([rider],1,{y:-110});
        gsap.to([speechbub],1,{y:-167});
        
        gsap.to([speechbub],1.5,{y:-57,delay:1,ease:Bounce.easeOut});
        gsap.to([rider],1.5,{y:0,delay:1,ease:Bounce.easeOut});

        gsap.set(shadow,{autoAlpha:0.4});
        gsap.to(shadow,1,{autoAlpha:0,scaleX:0.6});
        
        gsap.to(shadow,1.5,{autoAlpha:0.5,scaleX:1,delay:1,ease:Bounce.easeOut});
        
        gsap.delayedCall(1.7,notJumping);
    }
}

function notJumping(){
    isJumping=false; 
    jumpingtxt.innerHTML="go";
    gsap.delayedCall(0.6,backtoBounce);
}

var wheelieCount=0;
var isFlipping=false;
function wheelie() {

    wheelieCount++;
    
    $('#rider').removeClass('riderBounce');
    $('#shadow').removeClass('shadowBounce');
    
    if(!isRampFlying) {
        jumpingtxt.innerHTML="&#47;&#47;";
        gsap.delayedCall(0.7,function(){
            jumpingtxt.innerHTML="go";
        });

        if(tlMainGame.isActive())
        {
            doSpeech(wheeliePhrases,0.7,wheelieCount,3);
        }

        points++;
        
        gsap.to(["#rider-go","#bike-go"],1,{rotationZ:-30});

        // do jets anim:
        gsap.to(["#rider-jets"],1,{top:30});
        $('#rider-jets').addClass('wheelieJets');

        gsap.delayedCall(1,function(){
            $('#rider-jets').removeClass('wheelieJets');
        });
        gsap.to(["#rider-jets"],1.5,{top:2,delay:1,ease:Bounce.easeOut});


        // shadow        
        gsap.to(shadow,1,{x:-10,scaleX:0.7});
        gsap.to(shadow,1.5,{x:0,scaleX:1,delay:1,ease:Bounce.easeOut});
        
        gsap.to(["#rider-go","#bike-go"],1.5,{rotationZ:0,delay:1,ease:Bounce.easeOut});

        gsap.delayedCall(2.4,backtoBounce);
    } else {
        if(!isFlipping)
        {
            isFlipping=true;
            points = points + 100;
                
            gsap.to(rider,1.5,{rotation:-360,ease:Sine.easeInOut});
            gsap.to(rider,0,{rotation:0,delay:1.5,onComplete:function(){isFlipping=false;}});
        }
    }
}

var backwardsCount = 0;
function backwards() {
    backwardsCount++;
    
    if($('#player').hasClass('forwards7')){
        $('#player').removeClass('forwards7');
        
    }
    else if($('#player').hasClass('forwards6')){
        $('#player').removeClass('forwards6');

    }
    else if($('#player').hasClass('forwards5')){
        $('#player').removeClass('forwards5');

    }
    else if($('#player').hasClass('forwards4')){
        $('#player').removeClass('forwards4');

    }
    else if($('#player').hasClass('forwards3')){
        $('#player').removeClass('forwards3');

    } 
    else if($('#player').hasClass('forwards2')){        
        $('#player').removeClass('forwards2');

    } 
    else if($('#player').hasClass('forwards')){
        $('#player').removeClass('forwards');

    } 
    
    $('#rider-jets').addClass('backJets');

    gsap.delayedCall(0.2,function(){
        $('#rider-jets').removeClass('backJets');
    });

    

    jumpingtxt.innerHTML="brakes";
    gsap.delayedCall(0.7,function(){
        jumpingtxt.innerHTML="go";
    });



    if(tlMainGame.isActive())
    {
        doSpeech(brakingPhrases,0.7,backwardsCount,5);
    }
}

var forwardsCount = 0;
function forwards() {
    forwardsCount++;
    if($('#player').hasClass('forwards7'))
    {
        // do nothing
    }
    else if($('#player').hasClass('forwards6'))
    {
        $('#player').addClass('forwards7');
    }
    else if($('#player').hasClass('forwards5'))
    {
        $('#player').addClass('forwards6');
    }
    else if($('#player').hasClass('forwards4'))
    {
        $('#player').addClass('forwards5');
    }
    else if($('#player').hasClass('forwards3'))
    {
        $('#player').addClass('forwards4');   
    }
    else if($('#player').hasClass('forwards2'))
    {
        $('#player').addClass('forwards3');
    } 
    else if($('#player').hasClass('forwards')){
         
         $('#player').addClass('forwards2');
    } 
    else if ( !$('#player').hasClass('forwards')) {
         $('#player').addClass('forwards');
    }

    $('#rider-jets').addClass('forwJets');

    gsap.delayedCall(0.2,function(){
        $('#rider-jets').removeClass('forwJets');
    });
    
    jumpingtxt.innerHTML="drive";

    if(tlMainGame.isActive())
    {
        doSpeech(goPhrases,1,forwardsCount,2);
    }
    gsap.delayedCall(1,function(){
        jumpingtxt.innerHTML="go";
    });
}

var playerTopPos = 245,
    playerBotPos = 345;
function upwards() {
    gsap.to(player,0.6,{top:+playerTopPos+"px",ease:Power1.easeInOut});
    gsap.to(playerMovements,0.6,{z:-100,ease:Power1.easeInOut});

    jumpingtxt.innerHTML="turn";
    gsap.delayedCall(0.2,function(){
        jumpingtxt.innerHTML="go";
    });
}

function downwards() {
    gsap.to(player,0.6,{top:playerBotPos+"px",ease:Power1.easeInOut});
    gsap.to(playerMovements,0.6,{z:0,ease:Power1.easeInOut});
    jumpingtxt.innerHTML="turn";
    gsap.delayedCall(0.2,function(){
        jumpingtxt.innerHTML="go";
    });
}

function backtoBounce(){
    if(isJumping){
        isJumping=false;
    }
        
    $('#rider-jets').removeClass('backJets').removeClass('forwJets').removeClass('wheelieJets').removeClass('jumpJets');
    gsap.to("#rider-jets",0,{top:2});
    

    
    $('#rider').addClass('riderBounce');
    $('#shadow').addClass('shadowBounce');
    $('#rider').addClass('riderFly');
}

function typeText(whichEle, thisLength){
    // typewriter text
    var mySplitText = new SplitText(whichEle, {type:"words,chars"}),
        numChars = mySplitText.chars.length,
        characterTime = (thisLength/(numChars+6));
        gsap.set(whichEle,{autoAlpha:1});
        gsap.set(mySplitText.chars, {autoAlpha:0});
        for(var i = 0; i < numChars; i++){
            gsap.to(mySplitText.chars[i], 0, {autoAlpha:1, delay:(i * characterTime),ease:Linear.easeNone});
        }
}

function playFGs() {
    tlfg.restart();
}


var MountainsPlaying = false;
function playMountainsBG() {
    MountainsPlaying=true;

    tlMountainsBG = gsap.timeline({paused:true});
    tlMountainsBG.addLabel('mountainsBGLoop', '<')
        .to([bgMountains1,bgMountains2,bgMountains3,bgMountains4,bgMountains5,bgMountains6],0,{autoAlpha:1,x:mountainsBGWidth,z:0})
        .to([bgMountains4,bgMountains5,bgMountains6],0,{scaleX:-1})
        .to(bgMountains,0,{display:"block"})
        
        .to(bgMountains1,mountainsBGSpeed*2,{x:-mountainsBGWidth,ease:Linear.easeNone},">")
        .to(bgMountains2,mountainsBGSpeed*2,{x:-mountainsBGWidth,ease:Linear.easeNone},"-="+mountainsBGSpeed+"")
        .to(bgMountains3,mountainsBGSpeed*2,{x:-mountainsBGWidth,ease:Linear.easeNone},"-="+mountainsBGSpeed+"")
        
        .to(bgMountains4,mountainsBGSpeed*2,{x:-mountainsBGWidth,ease:Linear.easeNone},"-="+mountainsBGSpeed+"")
        .to(bgMountains5,mountainsBGSpeed*2,{x:-mountainsBGWidth,ease:Linear.easeNone},"-="+mountainsBGSpeed+"")
        .to(bgMountains6,mountainsBGSpeed*2,{x:-mountainsBGWidth,ease:Linear.easeNone},"-="+mountainsBGSpeed+"")
        .to(bgMountains,0,{display:"none"});

    if(tlfg.isActive()) {
        tlMountainsBG.play();
    }
}

function doFlyPast(which) {
    gsap.to(flyPast,0,{className:""});
    gsap.to(tlFlyPast, 0, {timeScale:1.25});

    
    if(which=="toad"){
        gsap.to(flyPast,0,{className:"+=toad"});
        tlCruisePast.play("cruisepast");

    } else if(which=="sergio"){
        gsap.to(flyPast,0,{className:"+=sergio"}); 
        gsap.to(tlFlyPast, 0, {timeScale:.5});
        tlFlyPast.restart();

    } else if(which=="fzero"){
        gsap.to(flyPast,0,{className:"+=fzero"}); 
        tlFlyPast.restart();

    }  
}

var obsSpeed = gameSpeed*5;
var obsStartLeft = 2200;
var obsEndLeft = -2200;
function playObstaclesTL(){
    // obstacles timeline! 
    gsap.killTweensOf(detectCollision);
    detectCollision();

    tlMainGame = gsap.timeline({onComplete:tlMainGameComplete});

    if(!isCheat){

    tlMainGame.addLabel("stage1", "<")
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


        

        
            .addLabel("labelUpdown",">")
            // rock R
            .to("#obstacle5", 0, {left:obsStartLeft+"px"}, "labelUpdown")
            .call(setWarningTxt,["updown"],"<")
            .to("#obstacle5", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},"<")

            // rock L
            .to("#obstacle2", 0, {left:obsStartLeft+"px"},"-="+(obsSpeed*0.8))
            .to("#obstacle2", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},"<")

            // rock R
            .to("#obstacle5a", 0, {left:obsStartLeft+"px"},"-="+(obsSpeed*0.8))
            .to("#obstacle5a", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},"<")

            // rock L
            .to("#obstacle2a", 0, {left:obsStartLeft+"px"},"-="+(obsSpeed*0.8))
            .to("#obstacle2a", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},"<")
                


            
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


        // updown :
        .addLabel("labelUpdown2", ">")
            // rock R
            .to("#obstacle5", 0, {left:obsStartLeft+"px"}, "labelUpdown2")
            .call(setWarningTxt,["updown"],"<")
            .to("#obstacle5", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},"<")

            // rock L
            .to("#obstacle2", 0, {left:obsStartLeft+"px"},"-="+(obsSpeed*0.8))
            .to("#obstacle2", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},"<")

            // rock R
            .to("#obstacle5a", 0, {left:obsStartLeft+"px"},"-="+(obsSpeed*0.8))
            .to("#obstacle5a", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},"<")

            // rock L
            .to("#obstacle2a", 0, {left:obsStartLeft+"px"},"-="+(obsSpeed*0.8))
            .to("#obstacle2a", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},"<")

            // rock R
            .to("#obstacle5", 0, {left:obsStartLeft+"px"},"-="+(obsSpeed*0.8))
            .call(setWarningTxt,["updown"],"<")
            .to("#obstacle5", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},"<")

            // rock L
            .to("#obstacle2", 0, {left:obsStartLeft+"px"},"-="+(obsSpeed*0.8))
            .to("#obstacle2", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},"<")

            // rock R
            .to("#obstacle5a", 0, {left:obsStartLeft+"px"},"-="+(obsSpeed*0.8))
            .to("#obstacle5a", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},"<")

            // rock L
            .to("#obstacle2a", 0, {left:obsStartLeft+"px"},"-="+(obsSpeed*0.8))
            .to("#obstacle2a", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},"<")



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
        
        tlMainGame.addLabel("rampMode", "<")
        // ramp
        .to(".ramp", 0, {left:obsStartLeft+"px"}, ">1")
        .call(setWarningTxt,["ramp"],"<")
        .to(".ramp", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">");


    } else if(cheat=="clearMode"){
        tlMainGame.addLabel("clear", "<");

        
    } else if(cheat=="fastMode" || cheat=="quickerMode"){
        
        tlMainGame.addLabel("fastMode", "<")

        // // ramp
        .to(".ramp", 0, {left:obsStartLeft+"px"}, ">2")
        .call(setWarningTxt,["ramp"],"<")
        .to(".ramp", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">")


        
            // rock R
            .to("#obstacle5", 0, {left:obsStartLeft+"px"}, "labelUpdown2")
            .call(setWarningTxt,["updown"],"<")
            .to("#obstacle5", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},"<")

            // rock L
            .to("#obstacle2", 0, {left:obsStartLeft+"px"},"-="+(obsSpeed*0.8))
            .to("#obstacle2", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},"<")

            // rock R
            .to("#obstacle5a", 0, {left:obsStartLeft+"px"},"-="+(obsSpeed*0.8))
            .to("#obstacle5a", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},"<")

            // rock L
            .to("#obstacle2a", 0, {left:obsStartLeft+"px"},"-="+(obsSpeed*0.8))
            .to("#obstacle2a", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},"<")

            // rock R
            .to("#obstacle5", 0, {left:obsStartLeft+"px"},"-="+(obsSpeed*0.8))
            .call(setWarningTxt,["updown"],"<")
            .to("#obstacle5", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},"<")

            // rock L
            .to("#obstacle2", 0, {left:obsStartLeft+"px"},"-="+(obsSpeed*0.8))
            .to("#obstacle2", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},"<")

            // rock R
            .to("#obstacle5a", 0, {left:obsStartLeft+"px"},"-="+(obsSpeed*0.8))
            .to("#obstacle5a", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},"<")

            // rock L
            .to("#obstacle2a", 0, {left:obsStartLeft+"px"},"-="+(obsSpeed*0.8))
            .to("#obstacle2a", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},"<")

            // // ramp
        .to(".ramp", 0, {left:obsStartLeft+"px"}, ">2")
        .call(setWarningTxt,["ramp"],"<")
        .to(".ramp", obsSpeed, {left:obsEndLeft,ease:Linear.easeNone},">");


    }
}

var reps = 0;
var numberOfLoops = 100;
var collided = false;
function tlMainGameComplete() {
    // console.log(audio.currentTime);
    if (reps < numberOfLoops) {
        if(!collided && !isSongToEnding)

            // if(reps)
            // gameSpeed++
            
            tlMainGame.restart();
    } else {
        // stop playing
        playEnding();
    }

    reps++;
}


function setWarningTxt(txt){
    // console.log('setWarningTxt')
    warningtxt.className = "copy hidden "+txt;

    var warningtxtTl = gsap.timeline({onComplete:function(){
        warningtxt.className = "copy hidden";
    }});
    switch(txt) {
        case "down":
            warningtxt.innerHTML="<div><<</div>";
            warningtxtTl.addLabel('warningtxtDown')
                .to("#warningtxt",0,{autoAlpha:1},"<")
                .to("#warningtxt",0,{autoAlpha:0},">1");
        break;
        case "up":
            warningtxt.innerHTML="<div>>></div>";
            warningtxtTl.addLabel('warningtxtUp')
                .to("#warningtxt",0,{autoAlpha:1},"<")
                .to("#warningtxt",0,{autoAlpha:0},">1");
        break;
        case "updown":
            warningtxt.innerHTML="<span class='arrowUp'></span><span class='arrowDown'></span><span class='arrowUp'></span><span class='arrowDown'></span>";
            warningtxtTl.addLabel('warningtxtS')
                .to("#warningtxt", 0, {autoAlpha:1},"<")
                .to("#warningtxt span", 0, {autoAlpha:0},"<")
                .staggerTo("#warningtxt span",0.3,{autoAlpha:1,stagger:0.2},"<")
                .staggerTo("#warningtxt span", 0, {autoAlpha:0,stagger:0.2},"<.5");
        break;
        case "asteroid":
            warningtxt.innerHTML=">|";
            warningtxtTl.addLabel('warningtxtAsteroid')
            .to("#warningtxt",0.1,{autoAlpha:1,yoyo:true,repeat:9},"<")
            .to("#warningtxt",0,{autoAlpha:0},">1");
        break;
        case "hole":
            warningtxt.innerHTML="<div>@</div>";
            warningtxtTl.addLabel('warningtxtHole')
                .to("#warningtxt",0,{autoAlpha:1},"<")
                .to("#warningtxt",1,{autoAlpha:0},">1");
        break;
        case "ramp":
            warningtxt.innerHTML="<div>>>>></div>";
            warningtxtTl.addLabel('warningtxtRamp')
                .to("#warningtxt",{autoAlpha:1},"<")
                .to("#warningtxt",1,{autoAlpha:0},">1");
        break;
    }
    
}

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

    unBindButtons_gamePlay();
    unBindButtons_gameResume();

    
    // play ending!!
    gsap.killTweensOf(detectCollision);
    gsap.killTweensOf(backtoBounce);
    gsap.killTweensOf(notJumping);

    gsap.set(resumetxt,{autoAlpha:0,className:"copy"});


    gsap.to([".obstacle",pausedtxt],0,{autoAlpha:0});
    gsap.set(resumetxt,{autoAlpha:0,className:"copy"});

    tlMainGame.pause();

    gsap.set([pointstxt,jumpingtxt],{autoAlpha:0});
    gsap.to([".mobileControl"],0,{display:"none"});


    
    $('#shadow').removeClass('shadowBounce');

    gsap.to(player,0,{className:"forwards3"});
    
    tlEnding = gsap.timeline({onComplete:tlEndingComplete});

        tlEnding.addLabel("ending", "<")
        .to("#car-shadow",0,{autoAlpha:0.4,x:900},"<")
        .to(".car",0,{autoAlpha:1,x:900},"<")
        .to([".car","#car-shadow"],6,{x:0,ease:Power1.easeOut},">")
        .to("#player",1,{top:"270px"},"<")
        
        .to(["#rider-go","#bike-go"],1,{rotationZ:-30},"-=3")
        .to("#rider-jets",0,{display:"none"},"<")
        .to("#rider", {className: 'riderBounce'},"<")

    
        .to(["#rider-go","#bike-go"],1.5,{rotationZ:0,ease:Bounce.easeOut},">")


        .to("#rider-stopped", 0, {autoAlpha:0},">")
        .to("#rider-go", 0, {autoAlpha:1},"<")
        .to("#car-shadow",2,{autoAlpha:0},">")


        .to("#tilt,#bgMountains",5,{y:250,ease:Power1.easeIn},"<")
        .to("#player",2,{rotationZ:-10,ease:Power1.easeIn},"<")
        .to("#player",5,{x:222,y:-370,ease:Power1.easeIn},"<")
        
        .to("#player",2,{x:1100,y:-630,ease:Back.easeIn},">")
        .to(".car-jets",0.75,{scaleX:3,ease:Power1.easeInOut},"-=1");
}

var endingComplete = false;
var endInitialsDelay = 3;
function tlEndingComplete(){
    endingComplete=true;
    // stop all timelines
    // show high score
    $("#scoretxt").html(points);
    
    $("#obstaclesHittxt").html(noObstaclesHit);
    if(noObstaclesHit==0){

        // play perfect game anim:

        gsap.to(endtxt_perf,0,{autoAlpha:1});
        gsap.from(endtxt_perf,1,{scale:0,ease:Elastic.easeOut});

        gsap.to(endtxt_perfBalloon,0,{autoAlpha:1,x:10});
        gsap.to(endtxt_perfBalloon,5,{top:215,ease:Linear.easeNone});

        endInitialsDelay = 5;
    }

    if(noObstaclesHit<4) {
        $('#obstaclesHittxt').addClass('colorRotateYellow');
        endInitialsDelay=3;
    } else {
        $('#obstaclesHittxt').addClass('colorRotateRed');
        endInitialsDelay=2;
    }
    
    $("#pointstxt").html(points);

    gsap.set(endtxt,{display:"block", autoAlpha:1});

    gsap.delayedCall(endInitialsDelay,function(){
        gsap.to(initailsWrap,0,{autoAlpha:1});
        document.getElementById('initialstxt').focus();
    });

    

    document.getElementById('initialstxt').addEventListener('keypress',highScoreEntered);

    tlintro.pause();
    tlMainGame.pause();
    tlfg.pause();
    // tlbg.pause();     /// -- keep stars moving after end
    // tlstarsBG.pause();
    tlhair.pause();
    tlLyrics.pause();
    // tlFlyPast.pause();
    // tlCruisePast.pause();

}





var highScores = [
    ["sco","7180"],
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

        gsap.set(endtxt,{display:"none", autoAlpha:0});
        var highScoreListLower = highScoreList.toLowerCase();

        $("#highscorestxt").html(highScoreListLower);
        
        gsap.to(["#highscorestxt","#endScreenBtns"],0,{autoAlpha:1});
        gsap.to(["#endScreenBtns"],0,{display:"block"});
        gsap.to(["#mobileControls"],0,{display:"none"});

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
        return (i+1) + ":" + overlaps( player, this );
    }).get());
    collideAll = collide.join( ',' );

    if(collideAll.includes("true")){

        for(i=0; i < collide.length; i++){
            if(collide[i].includes("true")) {
                var obstacleHit = collide[i].split(':')[0];
                playerCollided(obstacleHit);
            }
        }
    }
    
    if(!collided) {
        points++;
        pointstxt.innerHTML=points;
        gsap.delayedCall(0.025,detectCollision);
    }
} 

var isRamping = false;
var isRampFlying = false;
function playerCollided(whichObstacleHit) {

// whichObstacleHit is not an id it is in
    whichObstacleHit_Ele = $(".obstacle").eq(whichObstacleHit-1);



    // get player Pos so we can do right "falling down hole" and "ramp" animations:
    var playerTop = player.offsetTop,
    yAmount,
    rotateZAmount,
    rotateYAmount;

    switch (whichObstacleHit_Ele.attr("id")){

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

                gsap.to(playerMovements,1,{x:240,y:yAmount,rotationZ:rotateZAmount,rotationY:rotateYAmount,scale:0.4});
                gsap.to(player,0.5,{autoAlpha:0,delay:0.5});

                gsap.to(shadow,0.2,{autoAlpha:0});
                

                jumpingtxt.innerHTML="@";

                doSpeech(vortexPhrases,2);

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


        case "obstacle2a": // rock-top (can be jumped)

                if(!isJumping){
                    doObstacleHit();
                    doRiderCrash();
                }
            break;


        case "obstacle3":  
             // ramp

            if(isJumping){
                // hit a ramp while jumping true
                isJumping=false;
                doObstacleHit();

                doRiderCrash();

            } else {
                if(!isRamping){
                    isRamping=true;
                    isRampFlying=true;

                    var rampStartDelay=0;

                    if(playerTop==270){
                        // console.log(playerTop+" = player at middle");
                    } else if(playerTop<=340) {
                        // console.log(playerTop+" = player at top");
                        rampStartDelay = 0.1;
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
                        .to(shadow,0.2,{autoAlpha:0,scaleX:0},">")
                        .to(rider,1,{y:"-=250"},"<")
                        .to(speechbub,0.5,{x:-7},"<")
                        .to(speechbub,0.5,{y:-330},"<")

                        .to(rider,0.3,{rotationZ:-80},"<")
                        .to(rider,1.5,{rotationZ:0,ease:Sine.easeIn},'>')
                        .to(rider,2,{y:"+=250",ease:Bounce.easeOut},"-=.6")
                        .to(speechbub,2,{x:-57,y:-60,ease:Bounce.easeOut},"<")
                        .to(shadow,2,{autoAlpha:0.4,scaleX:1,ease:Bounce.easeOut},"<")
                        .add(function(){isRampFlying=false;},"-=2.5");
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

        case "obstacle5a":   // rock bottom (cannot be jumped)
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
    tlMainGame.pause();
    tlhair.pause();
    primScreamTL.pause();
    
    gsap.killTweensOf("#rider-jets");
    $('#rider-jets').removeClass('backJets').removeClass('forwJets').removeClass('wheelieJets').removeClass('jumpJets');
    gsap.to("#rider-jets",0,{autoAlpha:0,top:2,delay:1});

    tlScream.play();

    unBindButtons_gamePlay();
}

var crashCount=0;
function doRiderCrash(){
    crashCount++;

    points=points-100;
    pointstxt.innerHTML=points;


    $('#rider').removeClass('riderFly');

    // [todo] //better crash sound
    // oww.play();

    gsap.set(flame,{autoAlpha:1});

    jumpingtxt.innerHTML="crashed";

    // say something for crash
    doSpeech(collidedPhrases,3);
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
    doneSergioFlyBy = false,
    doneFlypastFzero = false;
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

        gsap.to(".bgStars",8,{autoAlpha:1,ease:Linear.easeNone});

        doFlyPast("toad");
    }
    
    // make BG normal aftee Chorus 1
    if(audio.currentTime-84>verse2Start && !doneChorusTintBack) {
        doneChorusTintBack=true;

        gsap.to(".bgStars",3,{autoAlpha:0.3,ease:Linear.easeNone});

        playMountainsBG();
    }

    // do fzero
    if(audio.currentTime-84>soloStart-20 && !doneFlypastFzero){
        doneFlypastFzero=true;
        doFlyPast("fzero");
    }

    // fly past sergio
    if(audio.currentTime-84>soloStart && !doneSergioFlyBy){
        doneSergioFlyBy=true;
        doFlyPast("sergio");
    }
    

    // flash lightning at heavy drop and go fast!!
    if(audio.currentTime-84>124.9 && !doneLightning) {

    // [todo] - testing fast mode:
    // if(audio.currentTime-84>14.9 && !doneLightning) {
        doneLightning=true;


        gsap.fromTo("#lightning", 
            { autoAlpha: 0 },
            {   duration: 0.01,
                autoAlpha: 0.6,
                yoyo: true,
                repeat: 29,
                repeatDelay: 0.02,
                ease: "none"
            }
        );
        gsap.to([tlMainGame,tlfg,tlbg,tlMountainsBG], 1, {timeScale:1.5, ease:Quad.easeIn});
        gsap.to([tlbg], 1, {timeScale:8, ease:Quad.easeIn});
        gsap.to([tlstarsBG], 1, {timeScale:4, ease:Quad.easeIn});

        // make long gap ramps show
        gsap.to("#obstacle3",0,{className:"hidden ramp rampLong obstacle"});

        // [todo] hyperspace
        gsap.to(".bgStars",0,{className:"bg bgStars fast",delay:0.8});
        gsap.to(".bgToGo",0,{className:"bg bgToGo fast",delay:0.8});
    }

    // slow back down for final chorus
    if(audio.currentTime-84>chorus2Start && !doneSlowdown) {
        doneSlowdown=true;

        gsap.to(".bgStars",8,{autoAlpha:1,ease:Linear.easeNone});

        gsap.to([tlMainGame,tlfg,tlbg,tlMountainsBG], 1, {timeScale:1.1, ease:Quad.easeOut});
        gsap.to([tlstarsBG], 1, {timeScale:1, ease:Quad.easeOut});

        // ramps back to normal length
        gsap.to("#obstacle3",0,{className:"hidden ramp obstacle"});

        gsap.to(".bgStars",0,{className:"bg bgStars"});
        gsap.to(".bgToGo",0,{className:"bg bgToGo"});

        playMountainsBG();
    }

    // more lightning at outro start and super fast to end:
    if(audio.currentTime-84>outroStart && !doneLightning2) {

        //[todo] 
        // lightning speed

        gsap.to(".bgStars",1,{autoAlpha:0.3});

        doneLightning2=true;

        gsap.fromTo("#lightning", 
            { autoAlpha: 0 },
            {   duration: 0.01,
                autoAlpha: 0.6,
                yoyo: true,
                repeat: 29,
                repeatDelay: 0.02,
                ease: "none"
            }
        );
        gsap.to([tlMainGame,tlfg,tlbg,tlstarsBG,tlMountainsBG], 1, {timeScale:1.6, ease:Quad.easeIn});

        // make long gap ramps show
        gsap.to("#obstacle3",0,{className:"hidden ramp rampLong obstacle"});
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
    body = document.body;
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