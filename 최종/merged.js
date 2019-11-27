Function.prototype.member = function(name, value){
   this.prototype[name] = value
}

//////// Game Definition
function Game(){}
Game.start = function(room, welcome){
   game.start(room.id)
   printMessage(welcome)
}
Game.end = function(){
   game.clear()
}
Game.move = function(room){
   game.move(room.id)
}
Game.handItem = function(){
   return game.getHandItem()
}

//////// Room Definition
function Room(name, background){
   this.name = name
   this.background = background
   this.id = game.createRoom(name, background)
}
Room.member('setRoomLight', function(intensity){
   this.id.setRoomLight(intensity)
})

//////// Object Definition
function Object(room, name, image){
   this.room = room
   this.name = name
   this.image = image

   if (room !== undefined){
      this.id = room.id.createObject(name, image)
   }
}
Object.STATUS = { OPENED: 0, CLOSED: 1, LOCKED: 2 }

Object.member('setSprite', function(image){
   this.image = image
   this.id.setSprite(image)
})
Object.member('resize', function(width){
   this.id.setWidth(width)
})
Object.member('setDescription', function(description){
   this.id.setItemDescription(description)
})

Object.member('getX', function(){
   return this.id.getX()
})
Object.member('getY', function(){
   return this.id.getY()
})
Object.member('locate', function(x, y){
   this.room.id.locateObject(this.id, x, y)
})
Object.member('move', function(x, y){
   this.id.moveX(x)
   this.id.moveY(y)
})
Object.member('show', function(){
   this.id.show()
})
Object.member('hide', function(){
   this.id.hide()
})
Object.member('open', function(){
   this.id.open()
})
Object.member('close', function(){
   this.id.close()
})
Object.member('lock', function(){
   this.id.lock()
})
Object.member('unlock', function(){
   this.id.unlock()
})
Object.member('isOpened', function(){
   return this.id.isOpened()
})
Object.member('isClosed', function(){
   return this.id.isClosed()
})
Object.member('isLocked', function(){
   return this.id.isLocked()
})
Object.member('pick', function(){
   this.id.pick()
})
Object.member('isPicked', function(){
   return this.id.isPicked()
})

////// MoveRoom Definition
function MoveRoom(room, name, image, connectedTo) {
  Object.call(this, room, name, image)

  // this.image = image
  this.connectedTo = connectedTo
}

MoveRoom.prototype = new Object()

MoveRoom.member('onClick', function(){
  Game.move(this.connectedTo)
})

///// MoveRoom_Print Definition
function MoveRoom_Print(room, name, image, connectedTo, message) {
   MoveRoom.call(this, room, name, image, connectedTo)

   this.message = message

}

MoveRoom_Print.prototype = new MoveRoom()

MoveRoom_Print.member('onClick', function() {
   Game.move(this.connectedTo)
   printMessage(this.message)
})

/////// Item Definition
function Item(room, name, image){
   Object.call(this, room, name, image)
}
// inherited from Object
Item.prototype = new Object()

Item.member('onClick', function(){
   this.id.pick()
})
Item.member('isHanded', function(){
   return Game.handItem() == this.id
})

///// Conversation Definition
function Conversation(room, name, image) {
   Object.call(this, room, name, image)

   this.id.hide()
}

Conversation.prototype = new Object()

Conversation.member('onClick', function() {
  this.id.hide()
})

//////// Keypad Definition
function Keypad(room, name, image, password, callback, type){
   Object.call(this, room, name, image)

   // Keypad properties
   this.password = password
   this.callback = callback
   this.type = type
}
// inherited from Object
Keypad.prototype = new Object()

Keypad.member('onClick', function(){
   showKeypad(this.type, this.password, this.callback)
})

//////// Door Definition
function Door(room, name, closedImage, openedImage, connectedTo){
   Object.call(this, room, name, closedImage)

   // Door properties
   this.closedImage = closedImage
   this.openedImage = openedImage
   this.connectedTo = connectedTo
}
// inherited from Object
Door.prototype = new Object()

Door.member('onClick', function(){
   if (!this.id.isLocked() && this.id.isClosed()){
      this.id.open()
   }
   else if (this.id.isOpened()){
      if (this.connectedTo !== undefined){
         Game.move(this.connectedTo)
      }
      else {
         Game.end()
      }
   }
})
Door.member('onOpen', function(){
   this.id.setSprite(this.openedImage)
})
Door.member('onClose', function(){
   this.id.setSprite(this.closedImage)
})






// =======================================================================================================================
///////// Make Room
//집
hallway = new Room('hallway', '복도1.png') // 2층복도
room2 = new Room('room2', '배경-1.png') //빈방
living_room = new Room('living_room', '거실-4.png')// 1층 거실
laundry = new Room('laundry', '욕실타일.png') // 세탁실
ground = new Room('ground', '집마당.png') // 마당



//시장
olle_ent1 = new Room('olle_ent1', '올래입구.png') // 집-시장 연결
market = new Room('market', '시장 안.PNG') // 시장
bean_shop = new Room('bean_shop', '콩나물 가게.png') // 콩나물 가게
gift_shop = new Room('gift_shop', '기념품 가게.jpg') // 기념품 가게
fish_diner = new Room('fish_diner', '갈치 식당.jpg') // 갈치 식당
olle_ent2 = new Room('olle_ent2', '올래입구.png') // 시장-공항 연결

//공항
airport = new Room('airport', '공항.png')











// =======================================================================================================================
///////// House

///// 2층 복도
hallway.item1 = new MoveRoom_Print(hallway, 'item1', '우도.png', room2, '우도방으로 들어왔다.')
hallway.item1.resize(200)
hallway.item1.locate(330,300)


hallway.item2 = new MoveRoom_Print(hallway, 'item2', '한라산.png', room2, '한라산방으로 들어왔다.')
hallway.item2.resize(200)
hallway.item2.locate(1000, 300)


hallway.item3 = new MoveRoom_Print(hallway, 'item3', '협재.png', room2, '협재방으로 들어왔다! 그런데 여기는 빈방이네...')
hallway.item3.resize(150)
hallway.item3.locate(500,300)

hallway.item4 = new MoveRoom(hallway, 'item4', '1층화살표.png', living_room)
hallway.item4.resize(100)
hallway.item4.locate(150, 300)






////// 1층 거실
// 소주,생선
living_room.item1 = new Object(living_room, 'item1', '소주+생선.png')
living_room.item1.resize(300)
living_room.item1.locate(730, 540)
living_room.item1.onClick = function()
{
    printMessage('어제 갈치를 먹었나...')
}

// 쓰레기
living_room.item2 = new Object(living_room, 'item2', '쓰레기.png')
living_room.item2.resize(40)
living_room.item2.locate(450, 600)
living_room.item2.onClick = function()
{
    printMessage('왠 종이냐...')
}

// 2층 아이콘
living_room.floor = new MoveRoom_Print(living_room, 'floor', '2층아이콘.png', hallway, '2층으로 올라왔다..!') 
living_room.floor.resize(300)
living_room.floor.locate(70,650)

// 마당 아이콘
living_room.yard = new MoveRoom_Print(living_room, 'yard', '마당아이콘.png', ground, '마당으로 나왔다..!')
living_room.yard.resize(300)
living_room.yard.locate(600, 650)

//세탁실 아이콘
living_room.laundry = new MoveRoom_Print(living_room, 'laundry', '세탁실아이콘.png', laundry, '세탁실로 들어왔다..!')
living_room.laundry.resize(300)
living_room.laundry.locate(1130, 650)








///// 세탁실
//문
laundry.door = new Door(laundry, 'door', '방문_닫.png', '방문_열.png', ground)
laundry.door.resize(230)
laundry.door.locate(350, 380)

//망치 - 세탁기에서 조건문도 변경
laundry.hammer=new Item(laundry, 'hammer', '망치.png')
laundry.hammer.resize(100)
laundry.hammer.locate(300, 350)

//세탁기
laundry.washer = new Object(laundry, 'washer', '세탁기_닫.png')
laundry.washer.resize(300)
laundry.washer.locate(960, 460)

laundry.washer.onClick = function(){
    if(laundry.hammer.isHanded()){
        laundry.wallet.show()
        laundry.washer.setSprite("세탁기_열.png")
        printMessage('세탁기에서 지갑을 찾았다!')}
    else{
        printMessage('단단하게 잠겨있는데.. 부술것 없나..')
    }
}

//지갑
laundry.wallet = new Item(laundry, 'wallet', '지갑_열.png')
laundry.wallet.resize(100)
laundry.wallet.locate(800, 600)
laundry.wallet.hide()
laundry.wallet.setDescription('기념품을 산 영수증이 들어있네..!')










///// 마당
ground.house=new MoveRoom_Print(ground, 'house', '집.png',laundry,'집으로 다시 들어왔다.')
ground.house.resize(850)
ground.house.locate(680,355)

ground.car=new MoveRoom_Print(ground, 'car', '자동차.png',olle_ent1,'올래시장으로 왔다!')
ground.car.resize(350)
ground.car.locate(380,630)



// =======================================================================================================================
///////// Market

///// 올래 시장(집-시장)
olle_ent1.ent=new MoveRoom_Print(olle_ent1, 'ent', '올래간판.png',market,"시장 안으로 들어왔다")
olle_ent1.ent.resize(1200)
olle_ent1.ent.locate(680,370)


olle_ent1.car=new MoveRoom_Print(olle_ent1, 'car', '자동차.png',ground,"집으로 왔다!")
olle_ent1.car.resize(550)
olle_ent1.car.locate(900,630)



///// 올래 시장(시장-공항)
olle_ent2.ent=new MoveRoom_Print(olle_ent2, 'ent', '올래간판.png',market,"시장 안으로 들어왔다")
olle_ent2.ent.resize(1200)
olle_ent2.ent.locate(680,370)


olle_ent2.car=new MoveRoom_Print(olle_ent2, 'car', '자동차.png',airport,"공항으로 왔다!")
olle_ent2.car.resize(550)
olle_ent2.car.locate(900,630)


///// 시장
// 콩나물 가게 이동.
market.move1 = new MoveRoom_Print(market, 'move1', '콩나물 가게 이동.png', bean_shop, 'GPS 상으론 여기에 에어팟이 있다고 나오는데...?')
market.move1.resize(150)
market.move1.locate(550, 500)

// 갈치 식당 이동.
market.move2 = new MoveRoom(market, 'move2', '갈치 식당 이동.png', fish_diner)
market.move2.resize(150)
market.move2.locate(730, 500)

// 기념품 가게 이동.
market.move3 = new MoveRoom(market, 'move3', '기념품 가게 이동.png', gift_shop)
market.move3.resize(150)
market.move3.locate(550, 600)

// 시장 입구로 이동.
market.move4 = new MoveRoom(market, 'move4', '시장 입구 이동.png', olle_ent2)
market.move4.resize(150)
market.move4.locate(730, 600)

///// 콩나물 가게
// 에어팟 생성
bean_shop.airpods = new Item(bean_shop, 'airpods', '에어팟.png')
bean_shop.airpods.resize(40)
bean_shop.airpods.locate(500, 400)

// 시장으로 이동.
bean_shop.toMarket = new MoveRoom(bean_shop, 'toMarket', '화살표.png', market)
bean_shop.toMarket.resize(70)
bean_shop.toMarket.locate(217, 600)

///// 갈치 식당
// 식당 주인 생성
fish_diner.owner = new Object(fish_diner, 'owner', '식당 주인.png')
fish_diner.owner.resize(170)
fish_diner.owner.locate(950, 270)

// 대화 상자1 생성
fish_diner.conv1 = new Conversation(fish_diner, 'conv1', '식당 주인 대화1.png')
fish_diner.conv1.resize(1280)
fish_diner.conv1.locate(640, 600)

// 퀴즈1 정답 키패드 생성
fish_diner.answer1 = new Keypad(fish_diner, 'answer1', '퀴즈1.png', '709', function(){
  printMessage('맞아맞아 709호였지 금방 다녀올게 아이패드로 퀴즈라도 풀고 있어~')
  fish_diner.owner.hide()
  fish_diner.answer1.hide()
  fish_diner.ipad.show()
}, 'telephone')
fish_diner.answer1.resize(500)
fish_diner.answer1.locate(600,400)
fish_diner.answer1.hide()

// 아이패드 생성
fish_diner.ipad = new Object(fish_diner, 'ipad', '아이패드.png')
fish_diner.ipad.hide()

// 대화
// 주인 누르면 대화 상자 show.
fish_diner.owner.onClick = function() {
   fish_diner.conv1.show()
}

fish_diner.conv1.onClick = function() {
  fish_diner.conv1.hide()
  fish_diner.answer1.show()
  showImageViewer("퀴즈1.png", "")
}

// 시장으로 이동.
fish_diner.toMarket = new MoveRoom(fish_diner, 'toMarket', '화살표.png', market)
fish_diner.toMarket.resize(70)
fish_diner.toMarket.locate(50, 350)

///// 기념품 가게
// 직원 생성
gift_shop.staff = new Object(gift_shop, 'staff', '기념품 가게 직원.png')
gift_shop.staff.resize(170)
gift_shop.staff.locate(700, 500)

// 시장으로 이동.
gift_shop.toMarket = new MoveRoom(gift_shop, 'toMarket', '화살표.png', market)
gift_shop.toMarket.resize(70)
gift_shop.toMarket.locate(150, 400)

// =======================================================================================================================
///////// Airport

////공항
//여권 - 승무원 조건문 변경
airport.passport=new Item(airport,'passport','여권.jpg')
airport.passport.locate(300,350)


//승무원
airport.crew=new Object(airport,'crew','승무원.png')
airport.crew.resize(100)
airport.crew.locate(1060, 420)

airport.crew.onClick = function(){ 
    if(airport.passport.isHanded()){    
        Game.end()}
    else{
        printMessage('여권을 들고오세요^^')
    }
}




// 게임 시작
Game.start(olle_ent1, '')
