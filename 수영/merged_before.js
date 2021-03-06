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
}
Conversation.prototype = new Object()
Conversation.member('onClick', function() {
  this.id.hide()
})







///// 방 생성

market = new Room('market', '시장 안.PNG') // 시장
bean_shop = new Room('bean_shop', '콩나물 가게.png') // 콩나물 가게
gift_shop = new Room('gift_shop', '기념품 가게.jpg') // 기념품 가게
fish_diner = new Room('fish_diner', '갈치 식당.jpg') // 갈치 식당
ground = new Room('ground', '집마당.png')
olle_ent1 = new Room('olle_ent1', '올래입구.png')
olle_ent2 = new Room('olle_ent2', '올래입구.png')
laundry = new Room('laundry', '욕실타일.png')
airport = new Room('airport', '공항.png')
f_room=new Room('f_room','f_room.png')



//////////////f_room 
//제니사진
f_room.picture = new Object(f_room, 'picture', '액자사진.png')
f_room.picture.resize(70)
f_room.picture.locate(250, 300)
f_room.picture.onClick = function() {
	printMessage('제니 사진이 있다..')
}



//달력
f_room.calender = new Object(f_room, 'calender', '달력.png')
f_room.calender.resize(100)
f_room.calender.locate(900, 300)
f_room.calender.onClick = function() {
    showImageViewer("달력_확대.png")
}



//문
f_room.door = new Door(f_room, 'door', '방문_닫.png', '방문_열.png', laundry)
f_room.door.resize(150)
f_room.door.locate(370, 370)








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



///// 올래 시장(들어갈때)
olle_ent1.ent=new MoveRoom_Print(olle_ent1, 'ent', '올래간판.png',market,"시장 안으로 들어왔다")
olle_ent1.ent.resize(1200)
olle_ent1.ent.locate(680,370)

olle_ent1.car=new MoveRoom_Print(olle_ent1, 'car', '자동차.png',ground,"집으로 왔다!")
olle_ent1.car.resize(550)
olle_ent1.car.locate(900,630)



///// 올래 시장(나갈때)
olle_ent2.ent=new MoveRoom_Print(olle_ent2, 'ent', '올래간판.png',market,"시장 안으로 들어왔다")
olle_ent2.ent.resize(1200)
olle_ent2.ent.locate(680,370)

olle_ent2.car=new MoveRoom_Print(olle_ent2, 'car', '자동차.png',airport,"공항으로 왔다!")
olle_ent2.car.resize(550)
olle_ent2.car.locate(900,630)







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
market.move4 = new MoveRoom(market, 'move4', '시장 입구 이동.png', olle_ent1)
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

fish_diner.owner.onClick = function() {
	printMessage('ㅇㅇ')
}








// 시장으로 이동.
fish_diner.toMarket = new MoveRoom(fish_diner, 'toMarket', '화살표.png', market)
fish_diner.toMarket.resize(70)
fish_diner.toMarket.locate(50, 350)









///// 기념품 가게
//핸드폰 - 직원에서 조건문도 변경
gift_shop.phone=new Item(gift_shop, 'phone', '핸드폰.png')
gift_shop.phone.resize(100)
gift_shop.phone.locate(300, 350)


// 직원 생성
gift_shop.staff = new Object(gift_shop, 'staff', '기념품 가게 직원.png')
gift_shop.staff.resize(170)
gift_shop.staff.locate(700, 500)


gift_shop.staff.onClick = function(){ 
    if(gift_shop.phone.isHanded()){    
        printMessage('잘 됨')
    }
    else{
        printMessage('!@#$%^&*(*&^%$#@#$%^&*(&^ (알아들을 수 없는 제주도사투리)')
    }
}







// 시장으로 이동.
gift_shop.toMarket = new MoveRoom(gift_shop, 'toMarket', '화살표.png', market)
gift_shop.toMarket.resize(70)
gift_shop.toMarket.locate(150, 400)



// 게임 시작
Game.start(gift_shop, '')
