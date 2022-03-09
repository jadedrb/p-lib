package com.project.jpa.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.jpa.exception.ResourceNotFoundException;
import com.project.jpa.model.Book;
import com.project.jpa.model.Bookcase;
import com.project.jpa.model.Room;
import com.project.jpa.model.Shelf;
import com.project.jpa.model.User;
import com.project.jpa.repository.BookRepository;
import com.project.jpa.repository.RoomRepository;
import com.project.jpa.repository.ShelfRepository;
import com.project.jpa.repository.UserRepository;

@CrossOrigin//(origins="http://localhost:3000")
@RestController
@RequestMapping("/api")
public class BookController {
	
	@Autowired
	private RoomRepository roomRepo;

	@Autowired
	private BookRepository bookRepo;
	
	@Autowired
	private ShelfRepository shelfRepo;
	
	@Autowired
	private UserRepository userRepo;
	
	
	@GetMapping("/books")
	public List<Book> getAllBooks() {
		return bookRepo.findAll(); // equivalent to SELECT * FROM students
	}

	
	@GetMapping("/books/search={piece}")
	public List<Book> getByPiece(@PathVariable String piece) {
		return bookRepo.findByTitleContainingIgnoreCase(piece);
	}
	
	@Transactional
	@DeleteMapping("/name/{name}")
	public String deleteBookByName(@PathVariable String name) {
		
		
		//studentRepository.delete(stu2);
		try {
			Book stu2 = bookRepo.findOneByTitle(name);
			System.out.println(stu2.toString());
			bookRepo.deleteByTitle(name);
		}
		catch (Exception e) {
			return "cannot delete because there's more than one " + name;
		}
		
		return "done deleting " + name;
	}
	
	
	// New Mappings
	
	@GetMapping("/books/{book}")
	public List<Book> booksOfShelf(@PathVariable int book) {
		try {
			return shelfRepo.findById(book).orElseThrow().getBooks();
		}
		catch (Exception e) {
			return new ArrayList<>();
		}
	}
	

	@PostMapping("/books/{shelfId}/users/{userId}")
	public Book bookForShelf(@PathVariable int shelfId, @PathVariable String userId, @RequestBody Book book) {
//		Room room = roomRepo.findById(shelf.getBookcase().getRoom().getId()).orElseThrow();
		Shelf shelf = shelfRepo.findById(shelfId).orElseThrow();
		User user = userRepo.findByUsername(userId).get(0);		
		Room room = shelf.getBookcase().getRoom();
		Bookcase bookcase = shelf.getBookcase();
		
		room.addBook(book);
		shelf.addBook(book);
		user.addBook(book);
		bookcase.addBook(book);
		
		book.setBookcase(bookcase);
		book.setRoom(room);
		book.setUser(user);
		book.setShelf(shelf);
		
		return bookRepo.save(book);
	}
	
	@DeleteMapping("/books/{bookId}/shelves/{shelfId}/users/{userId}")
	public Map<String, Boolean> bookFromShelf(@PathVariable Integer bookId, @PathVariable Integer shelfId, @PathVariable String userId) {
		Map<String, Boolean> res = new HashMap<>();
		try {
			User user = userRepo.findByUsername(userId).get(0);
//			Shelf shelf = shelfRepo.findById(shelfId).orElseThrow();
			Book book = bookRepo.findById(bookId).orElseThrow();
//			shelf.removeBook(book);
			user.removeBook(book);
			bookRepo.delete(book);
			res.put("deleted", Boolean.TRUE);
		}
		catch(Exception e) {
			res.put("deleted", Boolean.FALSE);
		}
		return res;
	}


	@PutMapping("/books/{bookId}")
	public Book updateBookForShelf(@PathVariable int bookId, @RequestBody Book newBook) {
		
		Book oldBook = bookRepo.findById(bookId).orElseThrow();
		
		oldBook.setTitle(newBook.getTitle());
		oldBook.setAuthor(newBook.getAuthor());
		oldBook.setGenre(newBook.getGenre());
		oldBook.setPages(newBook.getPages());
		oldBook.setPdate(newBook.getPdate());
		oldBook.setColor(newBook.getColor());
		oldBook.setMore(newBook.getMore());
		
		return bookRepo.save(oldBook);
	}
	
	// Search books for user 
	
	@GetMapping("/books/{username}/search/title={title}")
	public List<Book> getByTitle(@PathVariable String username, @PathVariable String title) {
		System.out.println("search by title");
		return bookRepo.findTitleForUser(title, username);
	}
	
	@GetMapping("/books/{username}/search/genre={genre}")
	public List<Book> getByGenre(@PathVariable String username, @PathVariable String genre) {
		System.out.println("search by genre");
		return bookRepo.findGenreForUser(genre, username);
	}
	
	@GetMapping("/books/{username}/search/genretitle={search}")
	public List<Book> getByGenreAndTitle(@PathVariable String username, @PathVariable String search) {
		System.out.println("search by genre and title");
		return bookRepo.findTitleAndGenreForUser(search, username);
	}
	
	@GetMapping("/books/{username}/search/more={more}")
	public List<Book> getByMore(@PathVariable String username, @PathVariable String more) {
		System.out.println("search by more");
		return bookRepo.findMoreForUser(more, username);
	}
	
	@GetMapping("/books/{username}/search/all={all}")
	public List<Book> getByAll(@PathVariable String username, @PathVariable String all) {
		System.out.println("search by all");
		return bookRepo.findAllForUser(all, username);
	}
	
	@GetMapping("/books/{id}/coord")
	public Map<String, Integer> getBookCoordinates(@PathVariable int id) {
		System.out.println("search by all");
		Book book = bookRepo.getById(id);
		Map<String, Integer> res = new HashMap<>();
		res.put("book", book.getId());
		res.put("shelf", book.getShelf().getId());
		res.put("bookcase", book.getShelf().getBookcase().getId());
		res.put("room", book.getShelf().getBookcase().getRoom().getId());
		return res;
	}
	
	// Search for books in room
	
	@GetMapping("/books/search/in/room/{id}/title={title}")
	public List<Book> getByTitleInRoom(@PathVariable int id, @PathVariable String title) {
		System.out.println("search by title in room");
		return bookRepo.findTitleInRoom(title, id);
	}	
	
	@GetMapping("/books/search/in/room/{id}/genre={genre}")
	public List<Book> getByGenreInRoom(@PathVariable int id, @PathVariable String genre) {
		System.out.println("search by title in room");
		return bookRepo.findGenreInRoom(genre, id);
	}	
	
	@GetMapping("/books/search/in/room/{id}/genretitle={search}")
	public List<Book> getByGenreAndTitleInRoom(@PathVariable int id, @PathVariable String search) {
		System.out.println("search by genre and title in room");
		return bookRepo.findGenreAndTitleInRoom(search, id);
	}	
	
	@GetMapping("/books/search/in/room/{id}/all={all}")
	public List<Book> getByMoreInRoom(@PathVariable int id, @PathVariable String all) {
		System.out.println("search by more in room");
		return bookRepo.findAllInRoom(all, id);
	}	
	
	// Search for books in bookcase
	
	@GetMapping("/books/search/in/bookcase/{id}/title={title}")
	public List<Book> getByTitleInBookcase(@PathVariable int id, @PathVariable String title) {
		System.out.println("search by title in bookcase");
		return bookRepo.findTitleInBookcase(title, id);
	}	
	
	@GetMapping("/books/search/in/bookcase/{id}/genre={genre}")
	public List<Book> getByGenreInBookcase(@PathVariable int id, @PathVariable String genre) {
		System.out.println("search by genre in bookcase");
		return bookRepo.findGenreInBookcase(genre, id);
	}	
	
	@GetMapping("/books/search/in/bookcase/{id}/genretitle={search}")
	public List<Book> getByGenreAndTitleInBookcase(@PathVariable int id, @PathVariable String search) {
		System.out.println("search by genre and title in bookcase");
		return bookRepo.findGenreAndTitleInBookcase(search, id);
	}	
	
	@GetMapping("/books/search/in/bookcase/{id}/all={all}")
	public List<Book> getByMoreInBookcase(@PathVariable int id, @PathVariable String all) {
		System.out.println("search by all in bookcase");
		return bookRepo.findAllInBookcase(all, id);
	}	
	
	// Search for books in shelf
	
	@GetMapping("/books/search/in/shelf/{id}/title={title}")
	public List<Book> getByTitleInShelf(@PathVariable int id, @PathVariable String title) {
		System.out.println("search by title in shelf");
		return bookRepo.findTitleInShelf(title, id);
	}	
	
	@GetMapping("/books/search/in/shelf/{id}/genre={genre}")
	public List<Book> getByGenreInShelf(@PathVariable int id, @PathVariable String genre) {
		System.out.println("search by genre in shelf");
		return bookRepo.findGenreInShelf(genre, id);
	}	
	
	@GetMapping("/books/search/in/shelf/{id}/genretitle={search}")
	public List<Book> getByGenreAndTitleInShelf(@PathVariable int id, @PathVariable String search) {
		System.out.println("search by genre and title in shelf");
		return bookRepo.findGenreAndTitleInShelf(search, id);
	}	
	
	@GetMapping("/books/search/in/shelf/{id}/all={all}")
	public List<Book> getByMoreInShelf(@PathVariable int id, @PathVariable String all) {
		System.out.println("search by all in shelf");
		return bookRepo.findAllInShelf(all, id);
	}	
	
}









