import RoomService from "../services/RoomService"
import BookcaseService from "../services/BookcaseService"
import ShelfService from "../services/ShelfService";
import BookService from "../services/BookService";
import UserService from "./UserService";

export const test0 = async () => { 
    let room = {
      name: "mud room",
      height: 1,
      width: 50,
      tile: 25,
    }
    let bookcase = {
      location: "by the bed",
      height: 30,
      width: 60
    }
    let shelf = {}
    let book = {
      title: "DuNe",
      author: "Herman Melville",
      genre: "Epic",
      pages: 500,
      pdate: 1938,
      color: "blue",
      more: ""
    }
    
    console.log('Room Requests: ')
    console.log('get...')
    await RoomService.getRoomsForUser("bob")
    console.log('add...')
    await RoomService.addRoomForUser(room, "bob")
    console.log('update...')
    await RoomService.updateRoomOfIdForUser(room, 1, "bob")
    console.log('remove...')
    await RoomService.removeRoomFromUser(1, "bob")
    console.log('Bookcase Requests: ')
    console.log('get...')
    await BookcaseService.getBookcasesForRoom(1)
    console.log('add...')
    await BookcaseService.addBookcaseForRoom(bookcase, 2)
    console.log('update...')
    await BookcaseService.updateBookcaseForRoom(bookcase, 1)
    // console.log('remove...')
    // await BookcaseService.removeBookcaseFromRoom(1, 2)
    console.log('Shelf Requests: ')
    console.log('add...')
    await ShelfService.addShelfForBookcase(shelf, 1)
    console.log('update...')
    await ShelfService.updateShelfForBookcase(shelf, 1)
    console.log('get...')
    await ShelfService.getShelvesForBookcase(1)
    // console.log('remove...')
    console.log('Book Requests: ')
    console.log('add...')
    await BookService.addBookForShelfAndUser(book, 1, "bob")
    book.title = "harry potter"
    await BookService.addBookForShelfAndUser(book, 1, "bob")
    book.title = "catch 22"
    await BookService.addBookForShelfAndUser(book, 1, "bob")
    console.log('update...')
    await BookService.updateBookForShelf(book, 1)
    console.log('get...')
    await BookService.getBooksForShelf(1)
    console.log('everything before...')
    await RoomService.getRoomsForUser("bob")
    await UserService.getUserByName("bob")
    // await BookService.removeBookFromShelfAndUser(1, 1, "bob")
    // await ShelfService.removeShelfFromBookcase(1, 1)
    // await BookcaseService.removeBookcaseFromRoom(1, 2)


}


export const test1 = async () => { 
    await BookService.getAllForUser("epi", "bob");
}