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

///// 방 생성
fish_diner = new Room('fish_diner', '갈치 식당.jpg') // 갈치 식당

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
fish_diner.answer1 = new Keypad(fish_diner, 'answer1', '퀴즈1.png', '904', function(){
  printMessage('맞아맞아 904호였지 금방 다녀올게 아이패드로 퀴즈라도 풀고 있어~')
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

// 게임 시작
Game.start(fish_diner, '')
