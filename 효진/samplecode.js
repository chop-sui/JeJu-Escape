Function.prototype.member = function (name, value) {

    this.prototype[name] = value

}



//////// Game Definition

function Game() { }

Game.start = function (room, welcome) {

    game.start(room.id)

    printMessage(welcome)

}

Game.end = function () {

    game.clear()

}

Game.move = function (room) {

    game.move(room.id)

}

Game.handItem = function () {

    return game.getHandItem()

}





//////// Room Definition



function Room(name, background) {

    this.name = name

    this.background = background

    this.id = game.createRoom(name, background)

}

Room.member('setRoomLight', function (intensity) {

    this.id.setRoomLight(intensity)

})



//////// Object Definition



function Object(room, name, image) {

    this.room = room

    this.name = name

    this.image = image



    if (room !== undefined) {

        this.id = room.id.createObject(name, image)

    }

}

Object.STATUS = { OPENED: 0, CLOSED: 1, LOCKED: 2 }



Object.member('setSprite', function (image) {

    this.image = image

    this.id.setSprite(image)

})

Object.member('resize', function (width) {

    this.id.setWidth(width)

})

Object.member('setDescription', function (description) {

    this.id.setItemDescription(description)

})



Object.member('getX', function () {

    return this.id.getX()

})

Object.member('getY', function () {

    return this.id.getY()

})

Object.member('locate', function (x, y) {

    this.room.id.locateObject(this.id, x, y)

})

Object.member('move', function (x, y) {

    this.id.moveX(x)

    this.id.moveY(y)

})



Object.member('show', function () {

    this.id.show()

})

Object.member('hide', function () {

    this.id.hide()

})

Object.member('open', function () {

    this.id.open()

})

Object.member('close', function () {

    this.id.close()

})

Object.member('lock', function () {

    this.id.lock()

})

Object.member('unlock', function () {

    this.id.unlock()

})

Object.member('isOpened', function () {

    return this.id.isOpened()

})

Object.member('isClosed', function () {

    return this.id.isClosed()

})

Object.member('isLocked', function () {

    return this.id.isLocked()

})

Object.member('pick', function () {

    this.id.pick()

})

Object.member('isPicked', function () {

    return this.id.isPicked()

})



//////// Door Definition



function Door(room, name, closedImage, openedImage, connectedTo) {

    Object.call(this, room, name, closedImage)



    // Door properties

    this.closedImage = closedImage

    this.openedImage = openedImage

    this.connectedTo = connectedTo

}

// inherited from Object

Door.prototype = new Object()



Door.member('onClick', function () {

    if (!this.id.isLocked() && this.id.isClosed()) {

        this.id.open()

    }

    else if (this.id.isOpened()) {

        if (this.connectedTo !== undefined) {

            Game.move(this.connectedTo)

        }

        else {

            Game.end()

        }

    }

})

Door.member('onOpen', function () {

    this.id.setSprite(this.openedImage)

})

Door.member('onClose', function () {

    this.id.setSprite(this.closedImage)

})





//////// Keypad Definition



function Keypad(room, name, image, password, callback) {

    Object.call(this, room, name, image)



    // Keypad properties

    this.password = password

    this.callback = callback

}

// inherited from Object

Keypad.prototype = new Object()



Keypad.member('onClick', function () {

    showKeypad('number', this.password, this.callback)

})





//////// DoorLock Definition

function DoorLock(room, name, image, password, door, message) {

    Keypad.call(this, room, name, image, password, function () {

        printMessage(message)

        door.unlock()

    })

}

// inherited from Object

DoorLock.prototype = new Keypad()



/////// Item Definition



function Item(room, name, image) {

    Object.call(this, room, name, image)

}

// inherited from Object

Item.prototype = new Object()



Item.member('onClick', function () {

    this.id.pick()

})

Item.member('isHanded', function () {

    return Game.handItem() == this.id

})





function MoveRoom(room, name, image, connectedTo) {
    Object.call(this, room, name, image)

    // this.image = image
    this.connectedTo = connectedTo
}

MoveRoom.prototype = new Object()

MoveRoom.member('onClick', function () {
    Game.move(this.connectedTo)
})
// MoveRoom_Print Definition
function MoveRoom_Print(room, name, image, connectedTo, message) {
    MoveRoom.call(this, room, name, image, connectedTo)

    this.message = message

}

MoveRoom_Print.prototype = new MoveRoom()

MoveRoom_Print.member('onClick', function () {
    Game.move(this.connectedTo)
    printMessage(this.message)
})


////


hallway = new Room('hallway', '복도1.png')
room2 = new Room('room2', '배경-1.png')
living_room = new Room('living_room', '거실-4.png')

room2.bad = new Object(room2, 'bad', '침대-2.png')
room2.bad.resize(400)
room2.bad.locate(550,400)

room2.picture = new Object(room2, 'picture', '액자.png')
room2.picture.resize(600)
room2.picture.locate(150, 200)

room2.door_to_hallway = new MoveRoom(room2, 'door_to_hallway', '문-우-열림.png', hallway)
room2.door_to_hallway.resize(120)
room2.door_to_hallway.locate(1100,310)

room2.table = new Object(room2, 'table', '테이블-왼쪽.png')
room2.table.resize(250)
room2.table.locate(200, 400)

room2.chair = new Object(room2, 'chair', '의자-3.png')
room2.chair.resize(100)
room2.chair.locate(250, 450)

room2.G1 = new Object(room2, 'G1', '귤1.png')
room2.G1.resize(200)
room2.G1.locate(150, 330)

room2.G2 = new Object(room2, 'G2', '귤2.png')
room2.G2.resize(50)
room2.G2.locate(215, 330)

room2.G3 = new Object(room2, 'G3', '귤3.png')
room2.G3.resize(150)
room2.G3.locate(250, 310)

room2.hanger = new Object(room2, 'hanger', '행거.png')
room2.hanger.resize(250)
room2.hanger.locate(650,200)

hallway.item1 = new MoveRoom_Print(hallway, 'item1', '우도.png', room2, '우도방으로 들어왔다.')
hallway.item1.resize(200)
hallway.item1.locate(330,300)


hallway.item2 = new MoveRoom_Print(hallway, 'item2', '한라산.png', room2, '한라산방으로 들어왔다.')
hallway.item2.resize(200)
hallway.item2.locate(1000, 300)


hallway.item3 = new MoveRoom_Print(hallway, 'item3', '협재.png', room2, '협재방으로 들어왔다!')
hallway.item3.resize(150)
hallway.item3.locate(500,300)

hallway.item4 = new MoveRoom(hallway, 'item4', '1층화살표.png', living_room)
hallway.item4.resize(100)
hallway.item4.locate(150, 300)

living_room.item1 = new Object(living_room, 'item1', '소주+생선.png')
living_room.item1.resize(300)
living_room.item1.locate(730, 540)
living_room.item1.onClick = function()
{
    printMessage('어제 갈치를 먹었나...')
}

living_room.item2 = new Object(living_room, 'item2', '쓰레기.png')
living_room.item2.resize(40)
living_room.item2.locate(450, 600)
living_room.item2.onClick = function()
{
    printMessage('왠 종이냐...')
}

living_room.floor = new MoveRoom_Print(living_room, 'floor', '2층아이콘.png', hallway, '2층으로 올라왔다..!') 
living_room.floor.resize(300)
living_room.floor.locate(70,650)

living_room.yard = new MoveRoom_Print(living_room, 'yard', '마당아이콘.png', hallway, '마당으로 나왔다..!')
living_room.yard.resize(300)
living_room.yard.locate(600, 650)

living_room.laundry = new MoveRoom_Print(living_room, 'laundry', '세탁실아이콘.png', hallway, '세탁실로 들어왔다..!')
living_room.laundry.resize(300)
living_room.laundry.locate(1130, 650)


Game.start(hallway, '방탈출에 오신 것을 환영합니다!')