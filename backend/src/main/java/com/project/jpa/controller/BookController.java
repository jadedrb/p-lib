package com.project.jpa.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
import com.project.jpa.repository.BookcaseRepository;
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
	private BookcaseRepository bkcaseRepo;
	
	@Autowired
	private UserRepository userRepo;
	
	public void validUserAccess(Book book) throws Exception {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		String incomingUser = auth.getName();
		String outgoingUser = book.getUser().getUsername();
		if (!incomingUser.equals(outgoingUser)) 
			throw new Exception("improper relationship with requested data");
	}
	
	
//	@GetMapping("/books")
//	public List<Book> getAllBooks() {
//		return bookRepo.findAll(); // equivalent to SELECT * FROM students
//	}

//	
//	@GetMapping("/books/search={piece}")
//	public List<Book> getByPiece(@PathVariable String piece) {
//		return bookRepo.findByTitleContainingIgnoreCase(piece);
//	}
//	
//	@Transactional
//	@DeleteMapping("/name/{name}")
//	public String deleteBookByName(@PathVariable String name) {
//		
//		
//		//studentRepository.delete(stu2);
//		try {
//			Book stu2 = bookRepo.findOneByTitle(name);
//			System.out.println(stu2.toString());
//			bookRepo.deleteByTitle(name);
//		}
//		catch (Exception e) {
//			return "cannot delete because there's more than one " + name;
//		}
//		
//		return "done deleting " + name;
//	}
//	
	
	// New Mappings
	
	@GetMapping("/books/{shelfId}")
	public List<Book> booksOfShelf(@PathVariable long shelfId) throws Exception {
		List<Book> books = shelfRepo.findById(shelfId).orElseThrow().getBooks();
		if (!books.isEmpty())
			validUserAccess(books.get(0));
		return books;
	}
	

	@PostMapping("/books/{shelfId}/users/{userId}")
	public List<Book> bookForShelf(@PathVariable long shelfId, @PathVariable String userId, @RequestBody List<Book> books) throws Exception {
//		Room room = roomRepo.findById(shelf.getBookcase().getRoom().getId()).orElseThrow();
		Shelf shelf = shelfRepo.findById(shelfId).orElseThrow();
		User user = userRepo.findByUsername(userId).get(0);		
		Room room = shelf.getBookcase().getRoom();
		Bookcase bookcase = shelf.getBookcase();
		
		for (Book book : books) {
			book.setUser(user);
			
			validUserAccess(book);
			
			book.setBookcase(bookcase);
			book.setRoom(room);
			book.setShelf(shelf);
			
			room.addBook(book);
			shelf.addBook(book);
			user.addBook(book);
			bookcase.addBook(book);
		}
		
		return bookRepo.saveAll(books);
	}
	
	@DeleteMapping("/books/{bookId}/shelves/{shelfId}/users/{userId}")
	public Map<String, Boolean> bookFromShelf(@PathVariable Long bookId, @PathVariable Long shelfId, @PathVariable String userId) {
		Map<String, Boolean> res = new HashMap<>();
		try {
			Book book = bookRepo.findById(bookId).orElseThrow();
			validUserAccess(book);
			User user = userRepo.findByUsername(userId).get(0);
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
	public Book updateBookForShelf(@PathVariable long bookId, @RequestBody Book newBook) throws Exception {
		
		Book oldBook = bookRepo.findById(bookId).orElseThrow();
		
		validUserAccess(oldBook);
		
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
	public List<Book> getByTitle(@PathVariable String username, @PathVariable String title) throws Exception {
		System.out.println("search by title");
		List<Book> books = bookRepo.findTitleForUser(title, username);
		if (!books.isEmpty())
			validUserAccess(books.get(0));
		return books;
	}
	
	@GetMapping("/books/{username}/search/genre={genre}")
	public List<Book> getByGenre(@PathVariable String username, @PathVariable String genre) throws Exception {
		System.out.println("search by genre");
		List<Book> books = bookRepo.findGenreForUser(genre, username);
		if (!books.isEmpty())
			validUserAccess(books.get(0));
		return books;
	}
	
	@GetMapping("/books/{username}/search/genretitle={search}")
	public List<Book> getByGenreAndTitle(@PathVariable String username, @PathVariable String search) throws Exception {
		System.out.println("search by genre and title");
		List<Book> books = bookRepo.findTitleAndGenreForUser(search, username);
		if (!books.isEmpty())
			validUserAccess(books.get(0));
		return books;
	}
	
	@GetMapping("/books/{username}/search/more={more}")
	public List<Book> getByMore(@PathVariable String username, @PathVariable String more) throws Exception {
		System.out.println("search by more");
		List<Book> books = bookRepo.findMoreForUser(more, username);
		if (!books.isEmpty())
			validUserAccess(books.get(0));
		return books;
	}
	
	@GetMapping("/books/{username}/search/all={all}")
	public List<Book> getByAll(@PathVariable String username, @PathVariable String all) throws Exception {
		System.out.println("search by all");
		List<Book> books = bookRepo.findAllForUser(all, username);
		if (!books.isEmpty())
			validUserAccess(books.get(0));
		return books;
	}
	
	@GetMapping("/books/{username}/search/color={color}")
	public List<Book> getByColor(@PathVariable String username, @PathVariable String color) throws Exception {
		System.out.println("search by color");
		List<Book> books = bookRepo.findColorForUser(color, username);
		if (!books.isEmpty())
			validUserAccess(books.get(0));
		return books;
	}
	
	@GetMapping("/books/{username}/search/author={author}")
	public List<Book> getByAuthor(@PathVariable String username, @PathVariable String author) throws Exception {
		System.out.println("search by author");
		List<Book> books = bookRepo.findAuthorForUser(author, username);
		if (!books.isEmpty())
			validUserAccess(books.get(0));
		return books;
	}
	
	@GetMapping("/books/{username}/search/published={low}&{high}")
	public List<Book> getByPublishDate(@PathVariable String username, @PathVariable int low, @PathVariable int high) throws Exception {
		System.out.println("search by publish date");
		List<Book> books = bookRepo.findPublishDateForUser(low, high, username);
		if (!books.isEmpty())
			validUserAccess(books.get(0));
		return books;
	}
	
	@GetMapping("/books/{username}/search/pages={low}&{high}")
	public List<Book> getByPages(@PathVariable String username, @PathVariable int low, @PathVariable int high) throws Exception {
		System.out.println("search by pages");
		List<Book> books = bookRepo.findPagesForUser(low, high, username);
		if (!books.isEmpty())
			validUserAccess(books.get(0));
		return books;
	}
	
	@GetMapping("/books/{id}/coord")
	public Map<String, Long> getBookCoordinates(@PathVariable long id) throws Exception {
		System.out.println("search by all");
		Book book = bookRepo.getById(id);
		validUserAccess(book);
		Map<String, Long> res = new HashMap<>();
		res.put("book", book.getId());
		res.put("shelf", book.getShelf().getId());
		res.put("bookcase", book.getShelf().getBookcase().getId());
		res.put("room", book.getShelf().getBookcase().getRoom().getId());
		return res;
	}
	
	@GetMapping("/books/{name}/roll") 
	public Book findRandomBookForUser(@PathVariable String name) throws Exception {

		User user = userRepo.findByUsername(name).get(0);
	
		List<Book> books = user.getBooks();
	
		Random random = new Random();
		
		Book book = books.get(random.nextInt(books.size()));

		System.out.println(book.toString());
		
		validUserAccess(book);
	

		return book;
	}
	
	
	@GetMapping("/books/{name}/{category}") 
	public Map<String, Integer> findCountForEachCategory(@PathVariable String name, @PathVariable String category) throws Exception {
		
		User user = userRepo.findByUsername(name).get(0);
		
		List<Book> books = user.getBooks();
		
		validUserAccess(books.get(0));
		
		Map<String, Integer> catInfoDraft = new HashMap<>();
		Map<String, Integer> catInfoFinal = new HashMap<>();
		
		for (Book book : books) {
			
			String key = "";
			
			if (category.equals("authors"))
				key = book.getAuthor();
			
			if (category.equals("colors"))
				key = book.getColor();
			
			if (category.equals("genres"))
				key = book.getGenre();
			
			if (key.contains("/")) {
				for (String k : key.split("/")) {
					k = k.trim();
					catInfoDraft.put(k, catInfoDraft.getOrDefault(k, 0) + 1);
					
					if (catInfoDraft.get(k) >= 3 || !category.equals("authors")) 
						catInfoFinal.put(k, catInfoDraft.get(k));
				}
			}
			else if (key.contains("&")) {
				for (String k : key.split("&")) {
					k = k.trim();
					catInfoDraft.put(k, catInfoDraft.getOrDefault(k, 0) + 1);
					
					if (catInfoDraft.get(k) >= 3 || !category.equals("authors")) 
						catInfoFinal.put(k, catInfoDraft.get(k));
				}
			}
			else {
				catInfoDraft.put(key, catInfoDraft.getOrDefault(key, 0) + 1);
				
				if (catInfoDraft.get(key) >= 3 || !category.equals("authors")) 
					catInfoFinal.put(key, catInfoDraft.get(key));
			}
				
		
		}
		

		return catInfoFinal;
	}
	
	
	// Search for books in room
	
	@GetMapping("/books/search/in/room/{id}/title={title}")
	public List<Book> getByTitleInRoom(@PathVariable long id, @PathVariable String title) throws Exception {
		System.out.println("search by title in room");
		List<Book> books = bookRepo.findTitleInRoom(title, id);
		if (!books.isEmpty())
			validUserAccess(books.get(0));
		return books;
	}	
	
	@GetMapping("/books/search/in/room/{id}/genre={genre}")
	public List<Book> getByGenreInRoom(@PathVariable long id, @PathVariable String genre) throws Exception {
		System.out.println("search by title in room");
		List<Book> books = bookRepo.findGenreInRoom(genre, id);
		if (!books.isEmpty())
			validUserAccess(books.get(0));
		return books;
	}	
	
	@GetMapping("/books/search/in/room/{id}/genretitle={search}")
	public List<Book> getByGenreAndTitleInRoom(@PathVariable long id, @PathVariable String search) throws Exception {
		System.out.println("search by genre and title in room");
		List<Book> books = bookRepo.findGenreAndTitleInRoom(search, id);
		if (!books.isEmpty())
			validUserAccess(books.get(0));
		return books;
	}	
	
	@GetMapping("/books/search/in/room/{id}/all={all}")
	public List<Book> getByAllInRoom(@PathVariable long id, @PathVariable String all) throws Exception {
		System.out.println("search by more in room");
		List<Book> books = bookRepo.findAllInRoom(all, id);
		if (!books.isEmpty())
			validUserAccess(books.get(0));
		return books;
	}	
	
	@GetMapping("/books/search/in/room/{id}/color={color}")
	public List<Book> getByColorInRoom(@PathVariable long id, @PathVariable String color) throws Exception {
		System.out.println("search by color in room");
		List<Book> books = bookRepo.findColorInRoom(color, id);
		if (!books.isEmpty())
			validUserAccess(books.get(0));
		return books;
	}
	
	@GetMapping("/books/search/in/room/{id}/author={author}")
	public List<Book> getByAuthorInRoom(@PathVariable long id, @PathVariable String author) throws Exception {
		System.out.println("search by author in room");
		List<Book> books = bookRepo.findAuthorInRoom(author, id);
		if (!books.isEmpty())
			validUserAccess(books.get(0));
		return books;
	}
	
	@GetMapping("/books/search/in/room/{id}/more={more}")
	public List<Book> getByMoreInRoom(@PathVariable long id, @PathVariable String more) throws Exception {
		System.out.println("search by more in room");
		List<Book> books = bookRepo.findMoreInRoom(more, id);
		if (!books.isEmpty())
			validUserAccess(books.get(0));
		return books;
	}
	
	@GetMapping("/books/search/in/room/{id}/published={low}&{high}")
	public List<Book> getByPublishDateInRoom(@PathVariable long id, @PathVariable int low, @PathVariable int high) throws Exception {
		System.out.println("search by publish date in room");
		List<Book> books = bookRepo.findPublishDateInRoom(low, high, id);
		if (!books.isEmpty())
			validUserAccess(books.get(0));
		return books;
	}
	
	@GetMapping("/books/search/in/room/{id}/pages={low}&{high}")
	public List<Book> getByPagesInRoom(@PathVariable long id, @PathVariable int low, @PathVariable int high) throws Exception {
		System.out.println("search by pages in room");
		List<Book> books = bookRepo.findPagesInRoom(low, high, id);
		if (!books.isEmpty())
			validUserAccess(books.get(0));
		return books;
	}
	
	
	// Search for books in bookcase
	
	@GetMapping("/books/search/in/bookcase/{id}/title={title}")
	public List<Book> getByTitleInBookcase(@PathVariable long id, @PathVariable String title) throws Exception {
		System.out.println("search by title in bookcase");
		List<Book> books = bookRepo.findTitleInBookcase(title, id);
		if (!books.isEmpty())
			validUserAccess(books.get(0));
		return books;
	}	
	
	@GetMapping("/books/search/in/bookcase/{id}/genre={genre}")
	public List<Book> getByGenreInBookcase(@PathVariable long id, @PathVariable String genre) throws Exception {
		System.out.println("search by genre in bookcase");
		List<Book> books = bookRepo.findGenreInBookcase(genre, id);
		if (!books.isEmpty())
			validUserAccess(books.get(0));
		return books;
	}	
	
	@GetMapping("/books/search/in/bookcase/{id}/genretitle={search}")
	public List<Book> getByGenreAndTitleInBookcase(@PathVariable long id, @PathVariable String search) throws Exception {
		System.out.println("search by genre and title in bookcase");
		List<Book> books = bookRepo.findGenreAndTitleInBookcase(search, id);
		if (!books.isEmpty())
			validUserAccess(books.get(0));
		return books;
	}	
	
	@GetMapping("/books/search/in/bookcase/{id}/all={all}")
	public List<Book> getByAllInBookcase(@PathVariable long id, @PathVariable String all) throws Exception {
		System.out.println("search by all in bookcase");
		List<Book> books = bookRepo.findAllInBookcase(all, id);
		if (!books.isEmpty())
			validUserAccess(books.get(0));
		return books;
	}	
	
	@GetMapping("/books/search/in/bookcase/{id}/color={color}")
	public List<Book> getByColorInBookcase(@PathVariable long id, @PathVariable String color) throws Exception {
		System.out.println("search by color in bookcase");
		List<Book> books = bookRepo.findColorInBookcase(color, id);
		if (!books.isEmpty())
			validUserAccess(books.get(0));
		return books;
	}
	
	@GetMapping("/books/search/in/bookcase/{id}/author={author}")
	public List<Book> getByAuthorInBookcase(@PathVariable long id, @PathVariable String author) throws Exception {
		System.out.println("search by author in bookcase");
		List<Book> books = bookRepo.findAuthorInBookcase(author, id);
		if (!books.isEmpty())
			validUserAccess(books.get(0));
		return books;
	}
	
	@GetMapping("/books/search/in/bookcase/{id}/more={more}")
	public List<Book> getByMoreInBookcase(@PathVariable long id, @PathVariable String more) throws Exception {
		System.out.println("search by more in bookcase");
		List<Book> books = bookRepo.findMoreInBookcase(more, id);
		if (!books.isEmpty())
			validUserAccess(books.get(0));
		return books;
	}
	
	@GetMapping("/books/search/in/bookcase/{id}/published={low}&{high}")
	public List<Book> getByPublishDateInBookcase(@PathVariable long id, @PathVariable int low, @PathVariable int high) throws Exception {
		System.out.println("search by publish date in bookcase");
		List<Book> books = bookRepo.findPublishDateInBookcase(low, high, id);
		if (!books.isEmpty())
			validUserAccess(books.get(0));
		return books;
	}
	
	@GetMapping("/books/search/in/bookcase/{id}/pages={low}&{high}")
	public List<Book> getByPagesInBookcase(@PathVariable long id, @PathVariable int low, @PathVariable int high) throws Exception {
		System.out.println("search by pages in bookcase");
		List<Book> books = bookRepo.findPagesInBookcase(low, high, id);
		if (!books.isEmpty())
			validUserAccess(books.get(0));
		return books;
	}

	
	// Search for books in shelf
	
	@GetMapping("/books/search/in/shelf/{id}/title={title}")
	public List<Book> getByTitleInShelf(@PathVariable long id, @PathVariable String title) throws Exception {
		System.out.println("search by title in shelf");
		List<Book> books = bookRepo.findTitleInShelf(title, id);
		if (!books.isEmpty())
			validUserAccess(books.get(0));
		return books;
	}	
	
	@GetMapping("/books/search/in/shelf/{id}/genre={genre}")
	public List<Book> getByGenreInShelf(@PathVariable long id, @PathVariable String genre) throws Exception {
		System.out.println("search by genre in shelf");
		List<Book> books = bookRepo.findGenreInShelf(genre, id);
		if (!books.isEmpty())
			validUserAccess(books.get(0));
		return books;
		
	}	
	
	@GetMapping("/books/search/in/shelf/{id}/genretitle={search}")
	public List<Book> getByGenreAndTitleInShelf(@PathVariable long id, @PathVariable String search) throws Exception {
		System.out.println("search by genre and title in shelf");
		List<Book> books = bookRepo.findGenreAndTitleInShelf(search, id);
		if (!books.isEmpty())
			validUserAccess(books.get(0));
		return books;
	}	
	
	@GetMapping("/books/search/in/shelf/{id}/all={all}")
	public List<Book> getByAllInShelf(@PathVariable long id, @PathVariable String all) throws Exception {
		System.out.println("search by all in shelf");
		List<Book> books = bookRepo.findAllInShelf(all, id);
		if (!books.isEmpty())
			validUserAccess(books.get(0));
		return books;
		
	}	
	
	@GetMapping("/books/search/in/shelf/{id}/color={color}")
	public List<Book> getByColorInShelf(@PathVariable long id, @PathVariable String color) throws Exception {
		System.out.println("search by color in shelf");
		List<Book> books = bookRepo.findColorInShelf(color, id);
		if (!books.isEmpty())
			validUserAccess(books.get(0));
		return books;
		
	}
	
	@GetMapping("/books/search/in/shelf/{id}/author={author}")
	public List<Book> getByAuthorInShelf(@PathVariable long id, @PathVariable String author) throws Exception {
		System.out.println("search by author in shelf");
		List<Book> books = bookRepo.findAuthorInShelf(author, id);
		if (!books.isEmpty())
			validUserAccess(books.get(0));
		return books;
		
	}
	
	@GetMapping("/books/search/in/shelf/{id}/more={more}")
	public List<Book> getByMoreInShelf(@PathVariable long id, @PathVariable String more) throws Exception {
		System.out.println("search by more in shelf");
		List<Book> books = bookRepo.findMoreInShelf(more, id);
		if (!books.isEmpty())
			validUserAccess(books.get(0));
		return books;
	
	}
	
	@GetMapping("/books/search/in/shelf/{id}/published={low}&{high}")
	public List<Book> getByPublishDateInShelf(@PathVariable long id, @PathVariable int low, @PathVariable int high) throws Exception {
		System.out.println("search by publish date in shelf");
		List<Book> books = bookRepo.findPublishDateInShelf(low, high, id);
		if (!books.isEmpty())
			validUserAccess(books.get(0));
		return books;
	}
	
	@GetMapping("/books/search/in/shelf/{id}/pages={low}&{high}")
	public List<Book> getByPagesInShelf(@PathVariable long id, @PathVariable int low, @PathVariable int high) throws Exception {
		System.out.println("search by pages in shelf");
		List<Book> books = bookRepo.findPagesInShelf(low, high, id);
		if (!books.isEmpty())
			validUserAccess(books.get(0));
		return books;
	}

}


