package com.project.jpa.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.jpa.model.Shelf;
import com.project.jpa.repository.ShelfRepository;

@CrossOrigin//(origins="http://localhost:3000")
@RestController
@RequestMapping("/api")
public class ShelfController {

	@Autowired
	private ShelfRepository shelfRepo;

	
	@GetMapping("/shelves")
	public List<Shelf> getAllShelves() {
		return shelfRepo.findAll(); // equivalent to SELECT * FROM students
	}
	
	

}
