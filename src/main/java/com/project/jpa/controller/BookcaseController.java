package com.project.jpa.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.jpa.model.Room;
import com.project.jpa.repository.RoomRepository;

@CrossOrigin//(origins="http://localhost:3000")
@RestController
@RequestMapping("/api")
public class BookcaseController {

	@Autowired
	private RoomRepository roomRepo;
	
	
	
	@GetMapping("/bookcases")
	public List<Room> getAllBooks() {
		return roomRepo.findAll(); // equivalent to SELECT * FROM students
	}

}
