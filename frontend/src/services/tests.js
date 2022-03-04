// import Rooms from "./RoomService"
// import Bookcases from "./BookcaseService"
// import Shelves from "./ShelfService";
import Books from "./BookService";
import Users from "./UserService.js";

export const test0 = async () => { 
    // let room = {
    //   name: "mud room",
    //   height: 1,
    //   width: 50,
    //   tile: 25,
    // }
    // let bookcase = {
    //   location: "by the bed",
    //   height: 30,
    //   width: 60
    // }
    // let shelf = {}
    // let book = {
    //   title: "DuNe",
    //   author: "Herman Melville",
    //   genre: "Epic",
    //   pages: 500,
    //   pdate: 1938,
    //   color: "blue",
    //   more: ""
    // }
    
    console.log('Room Requests: ')
    console.log('add...')
    // await Rooms.addRoomForUser(room, "bob")
    // await Rooms.addRoomForUser({...room, name: "living room"}, "bob")

    // await Bookcases.addBookcaseForRoom(bookcase, 1)
    // await Shelfs.addShelfForBookcase(shelf, 1)
    // await Books.addBookForShelfAndUser(book, 1, "bob")

    // await Bookcases.addBookcaseForRoom(bookcase, 2)
    // await Shelfs.addShelfForBookcase(shelf, 2)
    // await Books.addBookForShelfAndUser({...book, title: "wow"}, 2, "bob")

    // await Bookcases.addBookcaseForRoom(bookcase, 2)
    // await Shelfs.addShelfForBookcase(shelf, 3)
    // await Books.addBookForShelfAndUser({...book, title: "okay"}, 3, "bob")

    await Users.getUserByName("bob")

    // await Rooms.removeRoomFromUser(2, "bob")

    // await Users.getUserByName("bob")

    // console.log('update...')
    // await Rooms.updateRoomOfIdForUser(room, 1, "bob")
    // console.log('get...')
    // await Rooms.getRoomsForUser("bob")
    // await Rooms.getRoomsForUser("bob")
    // // console.log('remove...')
    // // await Rooms.removeRoomFromUser(1, "bob")
    // console.log('Bookcase Requests: ')
    // console.log('add...')
    // await Bookcases.addBookcaseForRoom(bookcase, 1)
    // console.log('update...')
    // await Bookcases.updateBookcaseForRoom(bookcase, 1)
    // console.log('get...')
    // await Bookcases.getBookcasesForRoom(1)
    // // // console.log('remove...')
    // // // await Bookcases.removeBookcaseFromRoom(1, 2)
    // console.log('Shelf Requests: ')
    // console.log('add...')
    // await Shelfs.addShelfForBookcase(shelf, 1)
    // console.log('update...')
    // await Shelfs.updateShelfForBookcase(shelf, 1)
    // console.log('get...')
    // await Shelfs.getShelvesForBookcase(1)
    // // // console.log('remove...')
    // console.log('Book Requests: ')
    // console.log('add...')
    // await Books.addBookForShelfAndUser(book, 1, "bob")
    // // book.title = "harry potter"
    // // await Books.addBookForShelfAndUser(book, 1, "bob")
    // // book.title = "catch 22"
    // // await Books.addBookForShelfAndUser(book, 1, "bob")
    // console.log('update...')
    // await Books.updateBookForShelf(book, 1)
    // console.log('get...')
    // await Books.getBooksForShelf(1)
    // await Rooms.getRoomsForUser("bob")
    // // console.log('everything before...')
    // // await Rooms.getRoomsForUser("bob")
    // // await Users.getUserByName("bob")
    // // await Rooms.removeRoomFromUser(1, "bob")
    // await Users.getUserByName("bob")
    // await Books.removeBookFromShelfAndUser(1, 1, "bob")
    // await Shelfs.removeShelfFromBookcase(1, 1)
    // await Bookcases.removeBookcaseFromRoom(1, 2)


}


export const test1 = async () => { 
    await Books.getAllForUser("epi", "bob");
}