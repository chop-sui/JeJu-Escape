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
laundry = new Room('laundry', '욕실타일.png')

///// 세탁실
//문
laundry.door = new Door(laundry, 'door', '방문_닫.png', '방문_열.png', ground)
laundry.door.resize(230)
laundry.door.locate(350, 380)


//지갑
laundry.wallet = new Item(laundry, 'wallet', '지갑_닫.png')
laundry.wallet.resize(100)
laundry.wallet.locate(800, 650)
laundry.wallet.hide()


//세탁기
laundry.washer = new Object(laundry, 'washer', '세탁기_열.png')
laundry.washer.resize(300)
laundry.washer.locate(960, 460)

laundry.washer.onClick = function(){
    laundry.wallet.show()
    printMessage('세탁기에서 지갑을 찾았다!')
}

///// 마당
ground.house=new MoveRoom_Print(ground, 'house', '집.png',laundry,'집으로 다시 들어왔다.')
ground.house.resize(850)
ground.house.locate(680,355)

ground.car=new MoveRoom_Print(ground, 'car', '자동차.png',olle_ent1,'올래시장으로 왔다!')
ground.car.resize(350)
ground.car.locate(380,630)

///// 올래 시장
olle_ent1.ent=new MoveRoom_Print(olle_ent1, 'ent', '올래간판.png',market,"시장 안으로 들어왔다")
olle_ent1.ent.resize(1200)
olle_ent1.ent.locate(680,370)


olle_ent1.car=new MoveRoom_Print(olle_ent1, 'car', '자동차.png',ground,"집으로 왔다!")
olle_ent1.car.resize(550)
olle_ent1.car.locate(900,630)

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
// 직원 생성
gift_shop.staff = new Object(gift_shop, 'staff', '기념품 가게 직원.png')
gift_shop.staff.resize(170)
gift_shop.staff.locate(700, 500)

// 시장으로 이동.
gift_shop.toMarket = new MoveRoom(gift_shop, 'toMarket', '화살표.png', market)
gift_shop.toMarket.resize(70)
gift_shop.toMarket.locate(150, 400)

// 게임 시작
Game.start(olle_ent1, '')
