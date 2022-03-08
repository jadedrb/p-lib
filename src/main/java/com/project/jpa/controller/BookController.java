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
import com.project.jpa.model.Shelf;
import com.project.jpa.model.User;
import com.project.jpa.repository.BookRepository;
import com.project.jpa.repository.ShelfRepository;
import com.project.jpa.repository.UserRepository;

@CrossOrigin//(origins="http://localhost:3000")
@RestController
@RequestMapping("/api")
public class BookController {

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
	
//	@GetMapping("/books/{name}")
//	public List<Book> getByName(@PathVariable String name) {
//		return bookRepo.findByName(name);
//	}
	

	
	@GetMapping("/books/search={piece}")
	public List<Book> getByPiece(@PathVariable String piece) {
		return bookRepo.findByTitleContainingIgnoreCase(piece);
	}
	
//	@GetMapping("/students/searchx={piece}")
//	public List<Book> getByTwo(@PathVariable String piece) {
//		// doesn't work... might only work if it's two columns of String data type
//		System.out.println(Integer.parseInt(piece));
//		return bookRepo.findByNameAndGradeContaining(piece, piece);
//	}
	
	
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
		
//		List<Student> stu = studentRepository.findByName(name);
//		if (stu.isEmpty()) {
//			return "nothing in here";
//		}
//		
//		String result = "";
//		for (Student item : stu) {
//			result = result + item.getId() + " ";
//			studentRepository.deleteById(item.getId());
//		}
//		return "deleted ids " + result + " with name " + name;
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
		Shelf shelf = shelfRepo.findById(shelfId).orElseThrow();
		User user = userRepo.findByUsername(userId).get(0);
		shelf.addBook(book);
		user.addBook(book);
		book.setUser(user);
		book.setShelf(shelf);
		return bookRepo.save(book);
	}
	
	@DeleteMapping("/books/{bookId}/shelves/{shelfId}/users/{userId}")
	public Map<String, Boolean> bookFromShelf(@PathVariable Integer bookId, @PathVariable Integer shelfId, @PathVariable String userId) {
		Map<String, Boolean> res = new HashMap<>();
		try {
			User user = userRepo.findByUsername(userId).get(0);
			Shelf shelf = shelfRepo.findById(shelfId).orElseThrow();
			Book book = bookRepo.findById(bookId).orElseThrow();
			shelf.removeBook(book);
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
	
	
}









