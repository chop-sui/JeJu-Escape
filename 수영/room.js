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


//////// Keypad Definition

function Keypad(room, name, image, password, callback){
	Object.call(this, room, name, image)

	// Keypad properties
	this.password = password
	this.callback = callback
}
// inherited from Object
Keypad.prototype = new Object()

Keypad.member('onClick', function(){
	showKeypad('number', this.password, this.callback)
})


//////// DoorLock Definition
function DoorLock(room, name, image, password, door, message){
	Keypad.call(this, room, name, image, password, function(){
		printMessage(message)
		door.unlock()
	})
}
// inherited from Object
DoorLock.prototype = new Keypad()

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



//방생성

ground = new Room('ground', '집마당.png')	
olle_ent1 = new Room('olle_ent1', '올래입구.png')	




////세탁실
laundry = new Room('laundry', '욕실타일.png')	


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



////마당

ground.house=new MoveRoom_Print(ground, 'house', '집.png',laundry,'집으로 다시 들어왔다.')
ground.house.resize(850)
ground.house.locate(680,355)

ground.car=new MoveRoom_Print(ground, 'car', '자동차.png',olle_ent1,'올래시장으로 왔다!')
ground.car.resize(350)
ground.car.locate(380,630)




//올래시장
olle_ent1.ent=new MoveRoom_Print(olle_ent1, 'ent', '올래간판.png',laundry,"시장 안으로 들어왔다")
olle_ent1.ent.resize(1200)
olle_ent1.ent.locate(680,370)


olle_ent1.car=new MoveRoom_Print(olle_ent1, 'car', '자동차.png',ground,"집으로 왔다!")
olle_ent1.car.resize(550)
olle_ent1.car.locate(900,630)










Game.start(olle_ent1, '방탈출에 오신 것을 환영합니다!')