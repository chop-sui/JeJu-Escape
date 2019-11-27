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

//////// MoveRoom Definition
function MoveRoom(room, name, image, connectedTo){
	Object.call(this, room, name, image)

	this.image = image
	this.connectedTo = connectedTo 
}

MoveRoom.prototype = new Object()
MoveRoom.member('onClick', function(){
	Game.move(this.connectedTo)
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

//////// LockedObj Definition
function Sidetable(room, name, closedImage, openedImage, connectedTo){
	Object.call(this, room, name, closedImage)

	// Sidetable properties
	this.closedImage = closedImage
	this.openedImage = openedImage
	this.connectedTo = connectedTo
}
// inherited from Object
Sidetable.prototype = new Object()

Sidetable.member('onClick', function(){
	if (!this.id.isLocked() && this.id.isClosed()){
		this.id.open()
	}
	else if (this.id.isLocked()){
		Game.move(this.connectedTo)
	}
	
	else if (this.id.isOpened()){
		if (this.connectedTo !== undefined){
			Game.move(this.connectedTo)
		}
		else {}
	}
})
Sidetable.member('onOpen', function(){
	this.id.setSprite(this.openedImage)
	this.id.locate(300,347)
	room1_mainview.sidetable.setSprite('sidetable_opened.png')
	room1_mainview.keypad1_closed.setSprite('keypad1_opened.png')
	room1_mainview.keypad1_closed.locate(435,526)
})
Sidetable.member('onClose', function(){
	this.id.setSprite(this.closedImage)
})

//////// Drawer Definition
function Drawer(room, name, closedImage, openedImage){
	Object.call(this, room, name, closedImage)

	// Sidetable properties
	this.closedImage = closedImage
	this.openedImage = openedImage
}
// inherited from Object
Drawer.prototype = new Object()

Drawer.member('onClick', function(){
	if (this.id.isClosed()){
		this.id.open()
	}
	
	else if (this.id.isOpened()){
		this.id.close()
	}
})
Drawer.member('onOpen', function(){
	this.id.setSprite(this.openedImage)
	this.id.move(20, 50)
})
Drawer.member('onClose', function(){
	this.id.setSprite(this.closedImage)
	this.id.move(-20, -50)
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








room1_mainview = new Room('room1_mainview', 'Room1_mainview.png')		// 변수명과 이름이 일치해야 한다.
room1_sidetableview = new Room('room1_sidetableview', 'Room1_sidetableview.png')
room1_rightview = new Room('room1_rightview', 'Room1_rightview.png')
room1_tvview = new Room('room1_tvview', 'Room1_tvview.png')
room1_drawerview = new Room('room1_drawerview', 'Room1_drawerview.png')
f_room = new Room('f_room', 'Room2.png')




f_room.cabinet_closed = new Object(f_room, 'cabinet_closed', 'cabinet_closed.png')
f_room.cabinet_closed.resize(180)
f_room.cabinet_closed.locate(635, 400)

f_room.cabinet_closed.onClick = function()
{
	this.id.setSprite('cabinet_opened.png')
	this.id.locate(642, 401)
	f_room.keypad_front.hide()
	f_room.carkey.show()
}

f_room.carkey = new Item(f_room, 'carkey', 'carkey.png')
f_room.carkey.resize(30)
f_room.carkey.locate(670, 409)
f_room.carkey.hide()

f_room.keypad_front = new Keypad(f_room, 'keypad_front', 'keypad_front.png', '0116', function(){
	printMessage('잠금이 풀렸다')
})
f_room.keypad_front.resize(23)
f_room.keypad_front.locate(667, 400)

f_room.hammer = new Item(f_room, 'hammer', '망치.png')
f_room.hammer.resize(70)
f_room.hammer.locate(300, 600)

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
    showImageViewer('달력_확대.png', '')
}


//문
f_room.door = new Door(f_room, 'door', '방문_닫.png', '방문_열.png', room1_mainview) //ConnectedTo 복도로 바꾸기
f_room.door.resize(150)
f_room.door.locate(370, 370)

room1_mainview.bed = new Object(room1_mainview, 'bed', 'bed.png')
room1_mainview.bed.resize(700)
room1_mainview.bed.locate(740, 470)

room1_mainview.bag = new Object(room1_mainview, 'bag', 'bag_closed.png')
room1_mainview.bag.resize(200)
room1_mainview.bag.locate(270, 650)

room1_mainview.bag.onClick = function()
{
	this.id.setSprite('bag_opened.png')
	this.id.locate(270, 600)
	printMessage('어? 내 여권, 내 지갑.. 소지품이 다 없어졌어..!')
}

room1_mainview.sidetable = new Sidetable(room1_mainview, 'sidetable', 'sidetable_closed.png', 'sidetable_opened.png', room1_sidetableview)
room1_mainview.sidetable.resize(170)
room1_mainview.sidetable.locate(380,500)
room1_mainview.sidetable.lock()

room1_mainview.keypad1_closed = new Object(room1_mainview, 'keypad1_closed', 'keypad1_closed.png')
room1_mainview.keypad1_closed.resize(40)
room1_mainview.keypad1_closed.locate(438, 495)

room1_mainview.keypad1_closed.onClick = function(){
	Game.move(room1_sidetableview)
}

room1_sidetableview.sidetable = new Sidetable(room1_sidetableview, 'sidetable', 'sidetable2_closed.png', 'sidetable2_opened.png')
room1_sidetableview.sidetable.resize(400)
room1_sidetableview.sidetable.locate(300, 300)
room1_sidetableview.sidetable.lock()

room1_sidetableview.sidetable.onClick = function(){
	if (!this.id.isLocked() && this.id.isClosed()){
		this.id.open()
		room1_sidetableview.keypad2_closed.hide()
		room1_sidetableview.phone.show()
	}
	else if (room1_sidetableview.sidetable.isLocked()){
		printMessage('잠겨있다')
	}
	else if (this.id.isOpened()){
		if (this.connectedTo !== undefined){
			Game.move(this.connectedTo)
		}
		else {}
	}
}

room1_sidetableview.keypad2_closed = new DoorLock(room1_sidetableview, 'keypad2_closed', 'keypad2_closed.png', '1111', room1_sidetableview.sidetable, '철커덕')
room1_sidetableview.keypad2_closed.resize(150)
room1_sidetableview.keypad2_closed.locate(415, 283)

room1_sidetableview.phone = new Item(room1_sidetableview, 'phone', '핸드폰.png')
room1_sidetableview.phone.resize(100)
room1_sidetableview.phone.locate(343, 340)
room1_sidetableview.phone.hide()

room1_sidetableview.phone.onClick = function(){
	printMessage('엥? 내 휴대폰이 왜 여기에 있지?')
	this.id.pick()
}
room1_sidetableview.phone.setDescription("밧데리가 없어서 안켜진다.. 충전기를 찾아봐야겠어")

room1_sidetableview.leftarrow = new MoveRoom(room1_sidetableview, 'leftarrow', 'arrow_left.png', room1_mainview)
room1_sidetableview.leftarrow.resize(120)
room1_sidetableview.leftarrow.locate(55, 350)

room1_mainview.rightarrow = new MoveRoom(room1_mainview, 'rightarrow', 'arrow_right.png', room1_rightview)
room1_mainview.rightarrow.resize(120)
room1_mainview.rightarrow.locate(1250, 400)

room1_rightview.rightarrow = new MoveRoom(room1_rightview, 'rightarrow', 'arrow_right.png', f_room)
room1_rightview.rightarrow.resize(120)
room1_rightview.rightarrow.locate(1150, 400)

room1_rightview.leftarrow = new MoveRoom(room1_rightview, 'leftarrow', 'arrow_left.png', room1_mainview)
room1_rightview.leftarrow.resize(120)
room1_rightview.leftarrow.locate(150, 400)


room1_rightview.tv_click = new MoveRoom(room1_rightview, 'tv_click', 'click_spot.png', room1_tvview)
room1_rightview.tv_click.resize(320)
room1_rightview.tv_click.locate(780, 340)

room1_tvview.downarrow = new MoveRoom(room1_tvview, 'downarrow', 'arrow_down.png', room1_rightview)
room1_tvview.downarrow.resize(80)
room1_tvview.downarrow.locate(610, 660)

room1_tvview.downarrow.onClick = function(){
	Game.move(room1_rightview)
	room1_tvview.tv_off.setSprite('tv_off.png')
}

room1_rightview.drawer_click = new MoveRoom(room1_rightview, 'drawer_click', 'click_spot.png', room1_drawerview)
room1_rightview.drawer_click.resize(320)
room1_rightview.drawer_click.locate(780, 578)

room1_drawerview.downarrow = new MoveRoom(room1_drawerview, 'downarrow', 'arrow_down.png', room1_rightview)
room1_drawerview.downarrow.resize(80)
room1_drawerview.downarrow.locate(610, 660)

room1_drawerview.drawer_closed = new Drawer(room1_drawerview, 'drawer_closed', 'drawer_closed.png', 'drawer_opened.png')
room1_drawerview.drawer_closed.locate(765, 508)

Drawer.member('onClick', function(){
	if (this.id.isClosed()){
		this.id.open()
	}
	
	else if (this.id.isOpened()){
		this.id.close()
	}
	room1_drawerview.charger.show()
})

room1_drawerview.charger = new Item(room1_drawerview, 'charger', 'charger.png')
room1_drawerview.charger.resize(100)
room1_drawerview.charger.locate(760, 555)
room1_drawerview.charger.hide()

room1_drawerview.phone_connected = new Object(room1_drawerview, 'phone_connected', 'phone_connected.png')
room1_drawerview.phone_connected.resize(40)
room1_drawerview.phone_connected.hide()

//game.makeCombination(room1_sidetableview.phone, room1_drawerview.charger, room1_drawerview.phone_connected)

room1_tvview.tv_off = new Object(room1_tvview, 'tv_off', 'tv_off.png')
room1_tvview.tv_off.move(-5, -47)
room1_tvview.tv_off.onClick = function(){
	this.id.setSprite('tv_error.png')
}
room1_tvview.icon_find = new Object(room1_tvview, 'icon_find', 'icon_find.png')
room1_tvview.icon_find.resize(140)
room1_tvview.icon_find.locate(500, 300)
room1_tvview.icon_find.hide()

room1_tvview.icon_note = new Object(room1_tvview, 'icon_note', 'icon_note.png')
room1_tvview.icon_note.resize(140)
room1_tvview.icon_note.locate(770, 300)
room1_tvview.icon_note.hide()

Game.start(room1_mainview, '아 머리가 너무 아프다...')