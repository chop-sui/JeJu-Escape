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

   //this.image = image
   this.connectedTo = connectedTo
}

MoveRoom.prototype = new Object()
MoveRoom.member('onClick', function(){
   Game.move(this.connectedTo)
})

////// MoveRoom_Print Definition
function MoveRoom_Print(room, name, image, connectedTo, message) {
    MoveRoom.call(this, room, name, image, connectedTo)
    this.message = message
}

MoveRoom_Print.prototype = new MoveRoom()

MoveRoom_Print.member('onClick', function(){
    Game.move(this.connectedTo)
    printMessage(this.message)
})


////// Item Definition
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

//// Item_Print Definition
function Item_Print(room, name, image, message) {
    Item.call(this, room, name, image)
    this.message = message
}

// inherited from Item
Item_Print.prototype = new Item()

Item_Print.prototype.onClick = function(){
    Item.prototype.onClick.call(this);
    printMessage(this.message)
}

/*
Item_Print.member('onClick', function() {
  this.id.pick()
  printMessage(message)
})*/

////// Conversation Definition
function Conversation(room, name, image) {
    Object.call(this, room, name, image)

    this.id.setWidth(1280)
    this.room.id.locateObject(this.id, 640, 600)
    this.id.hide()
}

Conversation.prototype = new Object()

Conversation.member('onClick', function() {
   this.id.hide()
})


////// ObjectChange Definition
function ObjectChange(room, name, closedImage, openedImage){
	Object.call(this, room, name, closedImage)

	// ObjectChange properties
	this.closedImage = closedImage
	this.openedImage = openedImage
}

// inherited from Object
ObjectChange.prototype = new Object()

ObjectChange.member('onClick', function(){
	if (this.id.isClosed()){
		this.id.open()
	}

	else if (this.id.isOpened()){
		this.id.close()
	}
})

ObjectChange.member('onOpen', function(){
	this.id.setSprite(this.openedImage)
})

ObjectChange.member('onClose', function(){
	this.id.setSprite(this.closedImage)
})

////// Keypad Definition
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

//// ObjectLock Definition
function ObjectLock(room, name, image, password, obj, type, message){
	Keypad.call(this, room, name, image, password, function(){
		printMessage(message)
		obj.unlock()
	}, type)
}
// inherited from Object
ObjectLock.prototype = new Keypad()

////// Door Definition
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
       else {}
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
////집
hallway = new Room('hallway', '복도1.png') // 2층복도
room2 = new Room('room2', '배경-1.png') //빈방
room3 = new Room('room3', '배경-1.png')
living_room = new Room('living_room', '거실-4.png')// 1층 거실
laundry = new Room('laundry', '욕실타일.png') // 세탁실
ground = new Room('ground', '집마당.png') // 마당
f_room = new Room('f_room', 'Room2.png') //친구방
//주인공방
room1_mainview = new Room('room1_mainview', 'Room1_mainview.png')
room1_sidetableview = new Room('room1_sidetableview', 'Room1_sidetableview.png')
room1_rightview = new Room('room1_rightview', 'Room1_rightview.png')
room1_tvview = new Room('room1_tvview', 'Room1_tvview.png')
room1_drawerview = new Room('room1_drawerview', 'Room1_drawerview.png')


////시장
olle_ent = new Room('olle_ent', '올래입구.png') // 시장입구
market = new Room('market', '시장 안.PNG') // 시장
bean_shop = new Room('bean_shop', '콩나물 가게.png') // 콩나물 가게
gift_shop = new Room('gift_shop', '기념품 가게.jpg') // 기념품 가게
fish_diner = new Room('fish_diner', '갈치 식당.jpg') // 갈치 식당
rice_cake = new Room('rice_cake', '떡집.jpg')
stone = new Room('stone', '철물점.jpg')
side_dish = new Room('side_dish', '반찬가게.png')


////공항
airport = new Room('airport', '공항.png')





// =======================================================================================================================
///////// 집


///////// 2층 복도 /////////
// 우도방이동 (주인공방)
hallway.item1 = new MoveRoom_Print(hallway, 'item1', '우도.png', room1_mainview, '내 방인 우도방으로 들어왔다.')
hallway.item1.resize(200)
hallway.item1.locate(330,300)

// 한라산방이동 (친구방)
hallway.item2 = new MoveRoom_Print(hallway, 'item2', '한라산.png', f_room, '친구방인 한라산방으로 들어왔다.')
hallway.item2.resize(200)
hallway.item2.locate(1000, 300)

// 협재방이동 (빈방)
hallway.item3 = new MoveRoom_Print(hallway, 'item3', '협재.png', room2, '협재방으로 들어왔다! 여기는 누가 쓰는거지?')
hallway.item3.resize(150)
hallway.item3.locate(500,300)

// 1층 이동
hallway.item4 = new MoveRoom(hallway, 'item4', '1층화살표.png', living_room)
hallway.item4.resize(100)
hallway.item4.locate(150, 300)

// 한라봉방이동 (빈방)
hallway.item5 = new MoveRoom_Print(hallway, 'item5', '한라봉.png',room3,  '한라봉방으로 들어왔다.')
hallway.item5.resize(150)
hallway.item5.locate(770,300)




////////// 주인공 방 //////////
/////메인 뷰

// 침대
room1_mainview.bed = new Object(room1_mainview, 'bed', 'bed.png')
room1_mainview.bed.resize(700)
room1_mainview.bed.locate(740, 470)

// 가방
room1_mainview.bag = new Object(room1_mainview, 'bag', 'bag_closed.png')
room1_mainview.bag.resize(200)
room1_mainview.bag.locate(270, 650)

room1_mainview.bag.onClick = function()
{
	this.id.setSprite('bag_opened.png')
	this.id.locate(270, 600)
	printMessage('어? 내 여권, 내 지갑.. 소지품이 다 없어졌어..!')
}

// 탁자
room1_mainview.sidetable = new Door(room1_mainview, 'sidetable', 'sidetable_closed.png', 'sidetable_opened.png', room1_sidetableview)
room1_mainview.sidetable.resize(170)
room1_mainview.sidetable.locate(380,500)
room1_mainview.sidetable.lock()

room1_mainview.sidetable.onClick = function(){
    if (this.id.isLocked()){
        Game.move(this.connectedTo)
    }
    if (this.id.isOpened()){}
}

room1_mainview.sidetable.onOpen = function(){
	this.id.setSprite('sidetable_opened.png')
	room1_mainview.keypad1_closed.setSprite('keypad1_opened.png')
	room1_mainview.keypad1_closed.locate(435,526)
}

room1_mainview.keypad1_closed = new Object(room1_mainview, 'keypad1_closed', 'keypad1_closed.png')
room1_mainview.keypad1_closed.resize(40)
room1_mainview.keypad1_closed.locate(438, 495)

room1_mainview.keypad1_closed.onClick = function(){
	Game.move(room1_sidetableview)
}

/////탁자 뷰

// 탁자
room1_sidetableview.sidetable = new Door(room1_sidetableview, 'sidetable', 'sidetable2_closed.png', 'sidetable2_opened.png')
room1_sidetableview.sidetable.resize(400)
room1_sidetableview.sidetable.locate(300, 300)
room1_sidetableview.sidetable.lock()

room1_sidetableview.sidetable.onClick = function(){
	if (!this.id.isLocked() && this.id.isClosed()){
        this.id.open()
        room1_mainview.sidetable.open()
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

room1_sidetableview.sidetable.onOpen = function(){
    this.id.setSprite(this.openedImage)
    this.id.locate(300,347)
}

// 탁자 키패드
room1_sidetableview.keypad2_closed = new ObjectLock(room1_sidetableview, 'keypad2_closed', 'keypad2_closed.png', '0884', room1_sidetableview.sidetable, 'number', '철커덕')
room1_sidetableview.keypad2_closed.resize(150)
room1_sidetableview.keypad2_closed.locate(415, 283)

// 휴대폰
//room1_sidetableview.phone = new Item(room1_sidetableview, 'phone', '핸드폰.png')
room1_sidetableview.phone = new Item_Print(room1_sidetableview, 'phone', '핸드폰.png', '엥? 내 휴대폰이 왜 여기에 있지?')
room1_sidetableview.phone.resize(100)
room1_sidetableview.phone.locate(343, 340)
room1_sidetableview.phone.hide()
room1_sidetableview.phone.setDescription('휴대폰을 어디에 사용할 수 있을까..?')

/*room1_sidetableview.phone.onClick = function(){
	printMessage('엥? 내 휴대폰이 왜 여기에 있지?')
	this.id.pick()
}*/
room1_sidetableview.phone.setDescription("화면이 안켜진다.")

// 이동 화살표
room1_sidetableview.leftarrow = new MoveRoom(room1_sidetableview, 'leftarrow', 'arrow_left.png', room1_mainview)
room1_sidetableview.leftarrow.resize(120)
room1_sidetableview.leftarrow.locate(55, 350)

room1_mainview.rightarrow = new MoveRoom(room1_mainview, 'rightarrow', 'arrow_right.png', room1_rightview)
room1_mainview.rightarrow.resize(120)
room1_mainview.rightarrow.locate(1250, 400)

/////우측 뷰

// 이동 화살표
room1_rightview.rightarrow = new MoveRoom(room1_rightview, 'rightarrow', 'arrow_right.png', hallway)
room1_rightview.rightarrow.resize(120)
room1_rightview.rightarrow.locate(1150, 400)

room1_rightview.leftarrow = new MoveRoom(room1_rightview, 'leftarrow', 'arrow_left.png', room1_mainview)
room1_rightview.leftarrow.resize(120)
room1_rightview.leftarrow.locate(150, 400)

// 이동 스팟(티비)
room1_rightview.tv_click = new MoveRoom(room1_rightview, 'tv_click', 'click_spot.png', room1_tvview)
room1_rightview.tv_click.resize(320)
room1_rightview.tv_click.locate(780, 340)

room1_rightview.drawer_click = new MoveRoom(room1_rightview, 'drawer_click', 'click_spot.png', room1_drawerview)
room1_rightview.drawer_click.resize(320)
room1_rightview.drawer_click.locate(780, 578)

/////티비 뷰

// 이동 화살표
room1_tvview.downarrow = new MoveRoom(room1_tvview, 'downarrow', 'arrow_down.png', room1_rightview)
room1_tvview.downarrow.resize(80)
room1_tvview.downarrow.locate(610, 660)

room1_tvview.downarrow.onClick = function(){
	Game.move(room1_rightview)
    room1_tvview.tv.setSprite('tv_off.png')
    room1_tvview.icon_note.hide()
    room1_tvview.icon_find.hide()
    room1_tvview.todo.hide()
	room1_tvview.map.hide()
}

// 티비
room1_tvview.tv = new ObjectChange(room1_tvview, 'tv', 'tv_off.png', 'tv_error.png')
room1_tvview.tv.move(-5, -47)

room1_tvview.tv.onClick = function(){
    if (!room1_sidetableview.phone.isHanded()){
        this.id.open()
        printMessage('휴대폰을 연결해봐야겠다.')
    }
    
    else {
        this.id.close()
		room1_tvview.icon_note.show()
		room1_tvview.icon_find.show()
		room1_tvview.todo.hide()
		room1_tvview.map.hide()
	}
}

// 위치추적 아이콘
room1_tvview.icon_find = new Object(room1_tvview, 'icon_find', 'icon_find.png')
room1_tvview.icon_find.resize(140)
room1_tvview.icon_find.locate(500, 300)
room1_tvview.icon_find.hide()

room1_tvview.icon_find.onClick = function(){
	room1_tvview.map.show()
	printMessage('어? 어제갔던 시장에 내 에어팟이??..')
	this.id.hide()
    room1_tvview.icon_note.hide()
    market.move1.show()
}

// 메모장 아이콘
room1_tvview.icon_note = new Object(room1_tvview, 'icon_note', 'icon_note.png')
room1_tvview.icon_note.resize(140)
room1_tvview.icon_note.locate(770, 300)
room1_tvview.icon_note.hide()

room1_tvview.icon_note.onClick = function(){
	room1_tvview.todo.show()
	printMessage('챙겨야 할 것들이군..')
	this.id.hide()
	room1_tvview.icon_find.hide()
}

// 위치추적 이미지
room1_tvview.map = new Object(room1_tvview, 'map', '위치추적.png')
room1_tvview.map.resize(230)
room1_tvview.map.locate(610, 310)
room1_tvview.map.hide()

room1_tvview.map.onClick = function(){
	this.id.hide()
	room1_tvview.icon_find.show()
    room1_tvview.icon_note.show()


}

// 메모장 이미지
room1_tvview.todo = new Object(room1_tvview, 'todo', '폰메모장.png')
room1_tvview.todo.resize(230)
room1_tvview.todo.locate(610, 310)
room1_tvview.todo.hide()

room1_tvview.todo.onClick = function(){
	this.id.hide()
	room1_tvview.icon_find.show()
	room1_tvview.icon_note.show()
}

/////서랍 뷰

// 이동 화살표
room1_drawerview.downarrow = new MoveRoom(room1_drawerview, 'downarrow', 'arrow_down.png', room1_rightview)
room1_drawerview.downarrow.resize(80)
room1_drawerview.downarrow.locate(610, 660)

// 서랍
room1_drawerview.drawer = new ObjectChange(room1_drawerview, 'drawer', 'drawer_closed.png', 'drawer_opened.png')
room1_drawerview.drawer.locate(765, 508)

room1_drawerview.drawer.onClick = function(){
	if (this.id.isClosed()){
		this.id.open()
		room1_drawerview.note.show()
	}

	else if (this.id.isOpened()){
		this.id.close()
		room1_drawerview.note.hide()
	}

}

room1_drawerview.drawer.onOpen = function(){
    this.id.setSprite(this.openedImage)
	this.id.move(20, 50)
}

room1_drawerview.drawer.onClose = function(){
    this.id.setSprite(this.closedImage)
	this.id.move(-20, -50)
}

// 쪽지
room1_drawerview.note = new Object(room1_drawerview, 'note', '쪽지.png')
room1_drawerview.note.resize(100)
room1_drawerview.note.locate(760, 555)
room1_drawerview.note.hide()

room1_drawerview.note.onClick = function(){
	showImageViewer('쪽지내용.png', '')
}





////////// 친구방 //////////

// 캐비넷
f_room.cabinet_closed = new Door(f_room, 'cabinet_closed', 'cabinet_closed.png', 'cabinet_opened.png')
f_room.cabinet_closed.resize(180)
f_room.cabinet_closed.locate(635, 400)
f_room.cabinet_closed.lock()


f_room.cabinet_closed.onClick = function()
{
	if (!this.id.isLocked() && this.id.isClosed()){
		this.id.open()
		this.id.locate(642, 401)
		f_room.keypad_front.hide()
	    f_room.carkey.show()
	}
	else if (this.id.isOpened()){}
}

// 차키
f_room.carkey = new Item_Print(f_room, 'carkey', 'carkey.png', '차 키를 주웠다')
f_room.carkey.resize(30)
f_room.carkey.locate(670, 409)
f_room.carkey.hide()

// 캐비넷 키패드
f_room.keypad_front = new ObjectLock(f_room, 'keypad_front', 'keypad_front.png', '0116', f_room.cabinet_closed, 'number', '잠금이 풀렸다')
f_room.keypad_front.resize(23)
f_room.keypad_front.locate(667, 400)

// 망치
f_room.hammer = new Item_Print(f_room, 'hammer', '망치.png', '망치를 주웠다! 이걸 어디에 쓰지...?')
f_room.hammer.resize(70)
f_room.hammer.locate(300, 600)

// 제니사진
f_room.picture = new Object(f_room, 'picture', '액자사진.png')
f_room.picture.resize(70)
f_room.picture.locate(250, 300)
f_room.picture.onClick = function() {
   printMessage('제니 사진이 있다 예쁘다...')
   showImageViewer('액자사진.png', '')
}

// 달력
f_room.calender = new Object(f_room, 'calender', '달력.png')
f_room.calender.resize(100)
f_room.calender.locate(900, 300)

f_room.calender.onClick = function(){
    if (!room3.glasses.isHanded()){
        printMessage('이놈의 시력.. 글씨가 잘 안보인다...')
    }

    else{
        showImageViewer('달력_확대.png', '')
        printMessage('아 이제 좀 보인다')
    }
}

// 문
f_room.door = new Door(f_room, 'door', '방문_닫.png', '방문_열.png', hallway)
f_room.door.resize(150)
f_room.door.locate(370, 370)







//////// 빈방 ////////

// 문
room2.door_to_hallway = new MoveRoom(room2, 'door_to_hallway', '문-우-열림.png', hallway)
room2.door_to_hallway.resize(120)
room2.door_to_hallway.locate(1100,310)

room2.bad = new Object(room2, 'bad', '침대-2.png')
room2.bad.resize(400)
room2.bad.locate(550,400)

room2.picture = new Object(room2, 'picture', '액자.png')
room2.picture.resize(600)
room2.picture.locate(150, 200)

room2.table = new Object(room2, 'table', '테이블-왼쪽.png')
room2.table.resize(250)
room2.table.locate(200, 400)

room2.chair = new Object(room2, 'chair', '의자-3.png')
room2.chair.resize(100)
room2.chair.locate(250,450)

room2.hanger = new Object(room2, 'hanger', '행거.png')
room2.hanger.resize(250)
room2.hanger.locate(650,200)

room2.G1 = new Object(room2, 'G1', '귤1.png')
room2.G1.resize(200)
room2.G1.locate(150, 330)

room2.G2 = new Object(room2, 'G2', '귤2.png')
room2.G2.resize(50)
room2.G2.locate(215, 330)

room2.G3 = new Object(room2, 'G3', '귤3.png')
room2.G3.resize(150)
room2.G3.locate(250, 310)



/////// room3추가 ///////

// 선반
room3.shelf = new Object(room3,'shelf', '선반-좌.png')
room3.shelf.resize(460)
room3.shelf.locate( 250, 150)

/*room3.book = room1.createObject("book", "책3-1.png")
room3.book.setWidth(80)
room3.locateObject(room1.book, 100, 140)*/

// 식물
room3.plant = new Object(room3,'plant', '식물2-1.png')
room3.plant.resize(250)
room3.plant.locate( 500, 310)

// 책상
room3.table = new Object(room3,'table', '테이블-왼쪽.png')
room3.table.resize(300)
room3.table.locate( 300, 370)

// 의자
room3.chair = new Object(room3,'chair', '의자1-7.png')
room3.chair.resize(180)
room3.chair.locate(450, 380)

// 액자
room3.picture = new Object(room3, 'picture', '액자2.png')
room3.picture.resize(500)
room3.picture.locate(800,150)

// 맥컴퓨터
room3.mac = new Object(room3, 'mac', '맥-좌.png')
room3.mac.resize(130)
room3.mac.locate(310, 230)

room3.mac.onClick = function () {
    if (room3.safe.isLocked()){
        showImageViewer('아스키코드.png', '')
        printMessage('퍼센트 d? 아.. 예전에 배웠던 것 같은데.. 뭐더라..?')
    }
    else{}
}

// 금고
room3.safe = new Door(room3, 'safe', '금고_닫.png', '금고_열.png')
room3.safe.resize(140)
room3.safe.locate(700, 400)
room3.safe.lock()

room3.safe.onClick = function()
{
	if (!this.id.isLocked() && this.id.isClosed()){
        this.id.open()
        this.id.move(-14, 0)
		room3.safelock.hide()
	    room3.glasses.show()
	}
    else if (this.id.isOpened()){}
    
    else{
        printMessage('단단히 잠겨있다. 5개의 알파벳을 맞춰야하나보다..')
    }
}

// 금고 키패드
room3.safelock = new ObjectLock(room3, 'safelock', '알파벳키.png', 'PAPER', room3.safe, 'alphabet', '철컥')
room3.safelock.resize(60)
room3.safelock.locate(672, 385)

// 안경
room3.glasses = new Item_Print(room3, 'glasses', '안경.png', '아 이게 필요했어!!')
room3.glasses.resize(60)
room3.glasses.locate(686, 430)
room3.glasses.hide()

// 문
room3.doortohallway = new MoveRoom(room3, 'doortohallway', '문-우-열림.png', hallway)
room3.doortohallway.resize(120)
room3.doortohallway.locate(1100, 310)



///////////////// 1층 거실 /////////////////

// 소주,생선
living_room.item1 = new Object(living_room, 'item1', '소주+생선.png')
living_room.item1.resize(300)
living_room.item1.locate(730, 540)
living_room.item1.onClick = function()
{
    printMessage('어제 갈치를 먹었나...')
    market.move2.show()
}

// 쓰레기
living_room.item2 = new Object(living_room, 'item2', '쓰레기.png')
living_room.item2.resize(40)
living_room.item2.locate(450, 600)
living_room.item2.onClick = function()
{
    printMessage('왠 종이냐...')
}

// 2층이동아이콘
living_room.floor = new MoveRoom_Print(living_room, 'floor', '2층아이콘.png', hallway, '2층으로 올라왔다..!')
living_room.floor.resize(300)
living_room.floor.locate(70,650)

// 마당이동아이콘
living_room.yard = new MoveRoom_Print(living_room, 'yard', '마당아이콘.png', ground, '마당으로 나왔다..!')
living_room.yard.resize(300)
living_room.yard.locate(600, 650)

// 세탁실이동아이콘
living_room.laundry = new MoveRoom_Print(living_room, 'laundry', '세탁실아이콘.png', laundry, '세탁실로 들어왔다..!')
living_room.laundry.resize(300)
living_room.laundry.locate(1130, 650)




///////// 세탁실 /////////

// 문
laundry.door = new Door(laundry, 'door', '방문_닫.png', '방문_열.png', living_room)
laundry.door.resize(230)
laundry.door.locate(350, 380)

// 세탁기
laundry.washer = new ObjectChange(laundry, 'washer', '세탁기_닫.png', '세탁기_열.png')
laundry.washer.resize(300)
laundry.washer.locate(960, 460)

laundry.washer.onClick = function(){
    if (this.id.isClosed() && f_room.hammer.isHanded()){
        this.id.open()
    }

    else if (this.id.isOpened()){
    }
    else{
        printMessage('단단하게 잠겨있는데.. 부술것 없나..')
    }
}

laundry.washer.onOpen = function(){
    laundry.pants.show()
    laundry.washer.setSprite(this.openedImage)
    printMessage("어제 입은 바지다")
}

// 바지
laundry.pants = new Object(laundry, 'pants', '바지.png')
laundry.pants.resize(200)
laundry.pants.locate(1000, 500)
laundry.pants.hide()

laundry.pants.onClick = function() {
  laundry.wallet.show()
  printMessage('바지 안에서 지갑이 떨어졌다!')
}

// 지갑
laundry.wallet = new Item_Print(laundry, 'wallet', '지갑_열.png', '지갑 안에 기념품을 산 영수증이 들어있다..!')
laundry.wallet.resize(100)
laundry.wallet.locate(800, 600)
laundry.wallet.hide()


laundry.wallet.onClick = function() {
  Item_Print.prototype.onClick.call(this)
  market.move3.show()
}

laundry.wallet.setDescription('기념품을 산 영수증이 들어있네..!')



/////// 마당 ///////

// 집이동
ground.house=new MoveRoom_Print(ground, 'house', '집.png',living_room,'집으로 다시 들어왔다.')
ground.house.resize(850)
ground.house.locate(680,355)

// 이동버튼
ground.goto_market = new Object(ground, 'goto_market', '시장버튼.png')
ground.goto_market.locate(500,410)
ground.goto_market.hide()

ground.goto_market.onClick = function(){
    Game.move(olle_ent)
    ground.goto_market.hide()
    ground.goto_airport.hide()
}

ground.goto_airport = new Object(ground, 'goto_airport', '공항버튼.png')
ground.goto_airport.locate(730,410)
ground.goto_airport.hide()

ground.goto_airport.onClick = function(){
    if (fish_diner.passport.isPicked() && gift_shop.camera.isPicked() && bean_shop.airpods.isPicked() && laundry.wallet.isPicked() && room1_sidetableview.phone.isPicked()){
      Game.move(airport)
      printMessage('후... 빨리 가자!')
      ground.goto_market.hide()
      ground.goto_airport.hide()
    }
    else{
      printMessage('아직 못 찾은 물건이 있어!')
    }

}

// 자동차
ground.car = new Object(ground, 'car', '자동차.png')
ground.car.resize(350)
ground.car.locate(380,630)

ground.car.onClick = function(){
    if(f_room.carkey.isHanded()){
        ground.goto_airport.show()
        ground.goto_market.show()
    }
    else{
        printMessage('자동차키가 필요할 것 같은데..')
    }
}




// =======================================================================================================================
///////// Market

/////// 올래 시장입구 ///////

// 시장들어가기
olle_ent.ent=new MoveRoom_Print(olle_ent, 'ent', '올래간판.png',market,'시장 안으로 들어왔다')
olle_ent.ent.resize(1200)
olle_ent.ent.locate(680,370)

//이동버튼
olle_ent.goto_home = new Object(olle_ent, 'goto_home', '집버튼.png')
olle_ent.goto_home.locate(500,410)
olle_ent.goto_home.hide()

olle_ent.goto_airport = new Object(olle_ent, 'goto_airport', '공항버튼.png')
olle_ent.goto_airport.locate(730,410)
olle_ent.goto_airport.hide()

olle_ent.goto_home.onClick = function(){
    Game.move(ground)
    olle_ent.goto_home.hide()
    olle_ent.goto_airport.hide()
}

olle_ent.goto_airport.onClick = function(){
  if (fish_diner.passport.isPicked() && gift_shop.camera.isPicked() && bean_shop.airpods.isPicked() && laundry.wallet.isPicked() && room1_sidetableview.phone.isPicked()){
    Game.move(airport)
    printMessage('후... 빨리 가자!')
    olle_ent.goto_home.hide()
    olle_ent.goto_airport.hide()
  }
  else {
    printMessage('아직 못 찾은 물건이 있어!')
  }
}

// 자동차
olle_ent.car = new Object(olle_ent, 'car', '자동차.png')
olle_ent.car.resize(450)
olle_ent.car.locate(680,630)

olle_ent.car.onClick = function(){
    if(f_room.carkey.isHanded()){
        olle_ent.goto_airport.show()
        olle_ent.goto_home.show()
    }
    else{
        printMessage('자동차키가 필요할 것 같은데..')
    }
}








////////// 시장내부 ///////////

// 콩나물 가게 이동.
market.move1 = new MoveRoom_Print(market, 'move1', '콩나물간판.png', bean_shop, 'GPS 상으론 여기에 에어팟이 있다고 나오는데...?')
market.move1.resize(100)
market.move1.locate(200, 280)
market.move1.hide()

// 갈치 식당 이동.
market.move2 = new MoveRoom(market, 'move2', '갈치간판.png', fish_diner)
market.move2.resize(60)
market.move2.locate(378, 362)
market.move2.hide()

// 기념품 가게 이동.
market.move3 = new MoveRoom(market, 'move3', '기념품샵간판.png', gift_shop)
market.move3.resize(105)
market.move3.locate(1145, 255)
market.move3.hide()

//반찬가게 이동.
market.move4 = new MoveRoom_Print(market, 'move4', '반찬간판.png', side_dish, '반찬가게다...')
market.move4.resize(100)
market.move4.locate(1050, 300)

// 철물점 이동
market.move5 = new MoveRoom_Print(market, 'move5', '철물점간판.png', stone, '철물점에 필요가 도구가 있을수도 있어!! ')
market.move5.resize(80)
market.move5.locate(315,327)

// 떡집 이동
market.move6 = new MoveRoom_Print(market, 'move6', '떡집간판.png', rice_cake, '배고프다...')
market.move6.resize(70)
market.move6.locate(950, 350)

// 시장 입구로 이동.
market.move7 = new MoveRoom(market, 'move7', 'arrow_down.png', olle_ent)
market.move7.resize(150)
market.move7.locate(640, 600)




/////// 콩나물 가게 ///////
// 에어팟
bean_shop.airpods = new Item_Print(bean_shop, 'airpods', '에어팟.png', '뭐야 에어팟이 왜 여기에 있지...?')
bean_shop.airpods.resize(40)
bean_shop.airpods.locate(500, 400)

// 시장으로 이동.
bean_shop.toMarket = new MoveRoom(bean_shop, 'toMarket', '화살표.png', market)
bean_shop.toMarket.resize(100)
bean_shop.toMarket.locate(217, 600)






/////// 갈치 식당 ///////
// 식당 주인 생성
fish_diner.owner = new Object(fish_diner, 'owner', '식당 주인.png')
fish_diner.owner.resize(170)
fish_diner.owner.locate(950, 270)

// 집 갔다온 주인.
fish_diner.owner2 = new Object(fish_diner, 'owner2', '식당 주인.png')
fish_diner.owner2.resize(170)
fish_diner.owner2.locate(950, 270)
fish_diner.owner2.hide()

// 여권 생성
fish_diner.passport = new Item_Print(fish_diner, 'passport', '여권.jpg', '(후... 내 여권 ㅠㅠ) 정말 감사합니다!!')
fish_diner.passport.resize(30)
fish_diner.passport.locate(1000, 285)
fish_diner.passport.hide()

// 대화 상자1 생성
fish_diner.conv1 = new Conversation(fish_diner, 'conv1', '식당 주인 대화1.png')

// 퀴즈1 정답 키패드 생성
fish_diner.quiz1 = new Keypad(fish_diner, 'quiz1', '퀴즈1.png', '709', function(){
   printMessage('맞아맞아 709호였지~ 금방 다녀올게 퀴즈라도 풀고 있어~~')
   fish_diner.owner.hide()
   fish_diner.quiz1.hide()
   fish_diner.quiz2.show()
}, 'telephone')
fish_diner.quiz1.resize(500)
fish_diner.quiz1.locate(600,400)
fish_diner.quiz1.hide()

// 퀴즈2 생성
fish_diner.quiz2 = new Keypad(fish_diner, 'quiz2', '퀴즈2.png', '4848', function(){
   fish_diner.owner2.show()
   fish_diner.quiz2.hide()
   printMessage('미안해 내가 쫌 늦었지~ 여권 가지고 왔어!')
   fish_diner.passport.show()
}, 'number')
fish_diner.quiz2.resize(600)
fish_diner.quiz2.locate(600,400)
fish_diner.quiz2.hide()

// 대화
// 주인 누르면 대화 상자 show.
fish_diner.owner.onClick = function() {
    fish_diner.conv1.show()
}

fish_diner.conv1.onClick = function() {
   fish_diner.conv1.hide()
   fish_diner.quiz1.show()
   //showImageViewer("퀴즈1.png", "")
}

// 시장으로 이동.
fish_diner.toMarket = new MoveRoom(fish_diner, 'toMarket', '화살표.png', market)
fish_diner.toMarket.resize(70)
fish_diner.toMarket.locate(50, 350)





//////////// 기념품 가게 //////////////
// 직원 생성
gift_shop.staff = new Object(gift_shop, 'staff', '기념품 가게 직원.png')
gift_shop.staff.resize(170)
gift_shop.staff.locate(700, 500)

// 카메라 가져온 직원 생성
gift_shop.staff2 = new Object(gift_shop, 'staff2', '기념품 가게 직원.png')
gift_shop.staff2.resize(170)
gift_shop.staff2.locate(700, 500)
gift_shop.staff2.hide()

// 카메라 생성
gift_shop.camera = new Item_Print(gift_shop, 'camera', '카메라.png', '(다행이다 내 카메라...) 감사합니다! ㅠㅠ')
gift_shop.camera.resize(100)
gift_shop.camera.locate(630, 500)
gift_shop.camera.hide()

// 대화 생성
gift_shop.conv1 = new Conversation(gift_shop, 'conv1', '기념품 가게 대화1.png')
gift_shop.conv2 = new Conversation(gift_shop, 'conv2', '기념품 가게 대화2.png')
gift_shop.conv3 = new Conversation(gift_shop, 'conv3', '기념품 가게 대화3.png')

gift_shop.staff.onClick = function(){
    if(room1_sidetableview.phone.isHanded()){
        gift_shop.conv1.show()
    }
    else{
        printMessage('!@#$%^&*(*&^%$#@#$%^&*(&^ (알아들을 수 없는 제주도사투리. 핸드폰에 번역기가 있던 것 같던데...)')
    }
}

gift_shop.conv1.onClick = function() {
  gift_shop.conv1.hide()
  gift_shop.conv2.show()
}

gift_shop.conv2.onClick = function() {
  gift_shop.conv2.hide()
  gift_shop.camera.show()
  gift_shop.staff2.show()
  gift_shop.conv3.show()
}

// 시장으로 이동.
gift_shop.toMarket = new MoveRoom(gift_shop, 'toMarket', '화살표.png', market)
gift_shop.toMarket.resize(70)
gift_shop.toMarket.locate(150, 400)

//// 떡집
// 시장으로 이동
rice_cake.toMarket = new MoveRoom(rice_cake, 'toMarket', '화살표.png', market)
rice_cake.toMarket.resize(70)
rice_cake.toMarket.locate(200,340)

//// 반찬가게
// 시장으로 이동
side_dish.toMarket = new MoveRoom(side_dish, 'toMarket', '화살표.png', market)
side_dish.toMarket.resize(70)
side_dish.toMarket.locate(200, 400)

//// 철물점
// 시장으로 이동
stone.toMarket = new MoveRoom(stone, 'toMarket', '화살표.png', market)
stone.toMarket.resize(70)
stone.toMarket.locate(360, 270)






// =======================================================================================================================
///////// Airport /////////
// 승무원
airport.crew = new Object(airport, 'crew', '승무원.png')
airport.crew.resize(100)
airport.crew.locate(1060, 420)

airport.crew.onClick = function(){
    if(fish_diner.passport.isHanded()){
        Game.end()}
    else{
        printMessage('여권을 들고오세요^^')
    }
}

// 이동버튼
airport.goto_home = new Object(airport, 'goto_home', '집버튼.png')
airport.goto_home.locate(500,410)
airport.goto_home.hide()

airport.goto_olle_ent = new Object(airport, 'goto_olle_ent', '시장버튼.png')
airport.goto_olle_ent.locate(730,410)
airport.goto_olle_ent.hide()

airport.goto_home.onClick = function(){
    Game.move(ground)
    airport.goto_home.hide()
    airport.goto_olle_ent.hide()
}

airport.goto_olle_ent.onClick = function(){
    Game.move(olle_ent)
    airport.goto_home.hide()
    airport.goto_olle_ent.hide()
}

//화살표
airport.togo=new Object(airport,'togo','arrow_left.png')
airport.togo.resize(270)
airport.togo.locate(150,600)

airport.togo.onClick = function(){
    airport.goto_home.show()
    airport.goto_olle_ent.show()
}


// 게임 시작
Game.start(room1_mainview, '아 머리가 너무 아파...')