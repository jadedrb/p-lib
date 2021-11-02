package com.project.jpa.controller;

import java.util.List;

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
import com.project.jpa.repository.BookRepository;

@CrossOrigin//(origins="http://localhost:3000")
@RestController
@RequestMapping("/api")
public class BookController {

	@Autowired
	private BookRepository bookRepo;
	
	
	
	@GetMapping("/books")
	public List<Book> getAllBooks() {
		return bookRepo.findAll(); // equivalent to SELECT * FROM students
	}
	
//	@GetMapping("/books/{name}")
//	public List<Book> getByName(@PathVariable String name) {
//		return bookRepo.findByName(name);
//	}
	
	
	@GetMapping("/books/{id}")
	public ResponseEntity<Book> getStudentById(@PathVariable int id) {
		
		
		Book stu = bookRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not Found..."));
	
		 
		return ResponseEntity.ok(stu);
		
	}
	
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
	
	
	
	@PostMapping("/books")
	public Book newBook(@RequestBody Book stu) {
		
		return bookRepo.save(stu);
	}
	
	
	
	@DeleteMapping("/books/{id}")
	public String deleteBook(@PathVariable int id) {
		
		// Student stu = studentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not Found..."));
		
		bookRepo.deleteById(id);
		
		// studentRepository.deleteById(id);
		
		return "deleted item with id: " + id;
	}
	
	
	
	
	@PutMapping("/books/{id}")
	public ResponseEntity<Book> updateBook(@PathVariable int id, @RequestBody Book stuNew) {
		
		Book stuOld = bookRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not Found..."));
		
		stuOld.setTitle(stuNew.getTitle());
		//stuOld.setName(stuNew.getName());
		
		final Book stuUpdated = bookRepo.save(stuOld);
		
		return ResponseEntity.ok(stuUpdated);
	}
	
}
