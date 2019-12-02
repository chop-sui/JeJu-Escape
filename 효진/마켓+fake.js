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
rice_cake = new Room('rice_cake', '떡집.jpg')
stone = new Room('stone', '철물점.jpg')
side_dish = new Room('side_dish', '반찬가게.png')


///// 시장
// 콩나물 가게 이동.
market.move1 = new MoveRoom_Print(market, 'move1', '콩나물간판.png', bean_shop, 'GPS 상으론 여기에 에어팟이 있다고 나오는데...?')
market.move1.resize(100)
market.move1.locate(200, 280)

// 갈치 식당 이동.
market.move2 = new MoveRoom(market, 'move2', '갈치간판.png', fish_diner)
market.move2.resize(60)
market.move2.locate(378, 362)

// 기념품 가게 이동.
market.move3 = new MoveRoom(market, 'move3', '기념품샵간판.png', gift_shop)
market.move3.resize(105)
market.move3.locate(1145, 255)

//반찬가게 이동.
market.move4 = new MoveRoom_Print(market, 'move4', '반찬간판.png', side_dish, '반찬가게다...')
market.move4.resize(100)
market.move4.locate(1050, 300)

//철물점 이동
market.move5 = new MoveRoom_Print(market, 'move5', '철물점간판.png', stone, '철물점에 필요가 도구가 있을수도 있어!! ')
market.move5.resize(80)
market.move5.locate(315,327)
//떡집 이동
market.move6 = new MoveRoom_Print(market, 'move6', '떡집간판.png', rice_cake, '배고프다...')
market.move6.resize(70)
market.move6.locate(950, 350)



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

////떡집
//시장으로 이동
rice_cake.toMarket = new MoveRoom(rice_cake, 'toMarket', '화살표.png', market)
rice_cake.toMarket.resize(70)
rice_cake.toMarket.locate(150,400)
////반찬가게
//시장으로 이동
side_dish.toMarket = new MoveRoom(side_dish, 'toMarket', '화살표.png', market)
side_dish.toMarket.resize(70)
side_dish.toMarket.locate(150, 400)
////철물점
//시장으로 이동
stone.toMarket = new MoveRoom(stone, 'toMarket', '화살표.png', market)
stone.toMarket.resize(70)
stone.toMarket.locate(150, 400)
// 게임 시작
Game.start(market, '')
