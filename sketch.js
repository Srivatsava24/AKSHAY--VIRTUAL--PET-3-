var dog,sadDog,happyDog,garden,washroom, database;
var foodS,foodStock;
var fedTime,lastFed,currentTime;
var feed,addFood;
var button2, button1;
var foodObj;
var gameState,readState;

function preload(){
sadDog=loadImage("Images/Dog.png");
happyDog=loadImage("Images/happy dog.png");
garden=loadImage("Images/Garden.png");
washroom=loadImage("Images/Wash Room.png");
bedroom=loadImage("Images/Bed Room.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1350,630);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  //read game state from database
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });

  var greeting = createElement('h3');
   var greeting1 = createElement('h3');

  
  dog=createSprite(670,350,10,60);
  dog.addImage("dog1", sadDog);
  dog.addImage("dog2", happyDog);
  dog.scale=0.5;

  feed=createButton("Feed your Dog");
  feed.position(1200,385);
  feed.mousePressed(feedDog);

  addFood=createButton("Buy Milk Bottles");
  addFood.position(920,385);
  addFood.mousePressed(addFoods);

  input = createInput ("Enter your Dog's Name"); 
  input.position (1025, 295); 

  var name = input.value();

  input1 = createInput ("Fill opinion about your dog"); 
  input1.position (1000, 470);
  var opinion = input1.value();

  var button1 = createButton("submit");
  button1.position(1170, 470);
  

  var button2 = createButton("submit");
  button2.position(1195, 295);

  button2.mousePressed(function(){


    greeting.html("Master I am Hungry");
    greeting.position(800, 150);
    greeting1.html("Please feed me");
    greeting1.position(805, 195);
 })

  button1.mousePressed(function(){

    dog.changeAnimation("dog1", sadDog);

    greeting.html("Thank you Master😀😄 ");
    greeting.position(800, 150);
    greeting1.html("Meet you soon");
    greeting1.position(805, 195);
 })
}

function draw() {
  background("blue")

  
  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }

   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
     button2.hide();
     button1.hide();
     input.hide();
     input1.hide();
     dog.remove();
   }else{
    feed.show();
    addFood.show();
    //button2.show();
    //button1.show();
     input.show();
     input1.show();
    dog.addImage(sadDog);
   }

  drawSprites();

  strokeWeight(3);
  stroke("blue")
  fill("white");
  textSize(30);
  text("Milk bottles left in stock : " + foodS, 30, 605);


  fill("white");
  textSize(18);
  text("NOTE: To be filled only after feeding your dog. ", 950, 610);


  fill("WHITE");
  textSize(50);
  textStyle(BOLD);
  textFont("segoe script");
  text("AKSHAY'S VIRTUAL PET - 3 2020",200,80);

}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.changeAnimation("dog2", happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}



//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

//update gameState
function update(state){
  database.ref('/').update({
    gameState:state
  })
} 