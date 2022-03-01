package com.project.jpa.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.jpa.model.Bookcase;
import com.project.jpa.model.Room;
import com.project.jpa.model.User;
import com.project.jpa.repository.BookcaseRepository;
import com.project.jpa.repository.RoomRepository;

@CrossOrigin//(origins="http://localhost:3000")
@RestController
@RequestMapping("/api")
public class BookcaseController {
	
	@Autowired
	private RoomRepository roomRepo;

	@Autowired
	private BookcaseRepository bkcaseRepo;
	
	
	
	@GetMapping("/bookcases")
	public List<Room> getAllBooks() {
		return roomRepo.findAll(); // equivalent to SELECT * FROM students
	}
	
	
//	@GetMapping("/bookcases/{room}")
//	public List<Room> test(@PathVariable String room) {
//		List<User> ul = bkcaseRepo.joinRoomAndBookcases(room);
//
//		try {
//			return ul.get(0).getRooms();
//		}
//		catch (Exception e) {
//			return new ArrayList<>();
//		}
//	
//	}
	
	
	
		@GetMapping("/bookcases/{room}")
		public List<Bookcase> bookcasesOfRoom(@PathVariable int room) {
			try {
				return roomRepo.findById(room).orElseThrow().getBookcases();
			}
			catch (Exception e) {
				return new ArrayList<>();
			}
		}
		

		@PostMapping("/bookcases/{roomId}")
		public Bookcase bookcaseForRoom(@PathVariable int roomId, @RequestBody Bookcase bookcase) {
			Room room = roomRepo.findById(roomId).orElseThrow();
			room.addBookcase(bookcase);
			bookcase.setRoom(room);
			return bkcaseRepo.save(bookcase);
		}
		
		@DeleteMapping("/bookcases/{bkcaseId}/rooms/{roomId}")
		public Map<String, Boolean> bookcaseFromRoom(@PathVariable Integer bkcaseId, @PathVariable Integer roomId) {
			Map<String, Boolean> res = new HashMap<>();
			try {
				Bookcase bookcase = bkcaseRepo.findById(bkcaseId).orElseThrow();
				Room room = roomRepo.findById(roomId).orElseThrow();
				room.removeBookcase(bookcase);
				bkcaseRepo.delete(bookcase);
				res.put("deleted", Boolean.TRUE);
			}
			catch(Exception e) {
				res.put("deleted", Boolean.FALSE);
			}
			return res;
		}


		@PutMapping("/bookcases/{bkcaseId}")
		public Bookcase updateBookcaseForRoom(@PathVariable int bkcaseId, @RequestBody Bookcase newBkcase) {
			
			Bookcase oldBkcase = bkcaseRepo.findById(bkcaseId).orElseThrow();
			
			oldBkcase.setHeight(newBkcase.getHeight());
			oldBkcase.setLocation(newBkcase.getLocation());
			oldBkcase.setWidth(newBkcase.getWidth());
			
			return bkcaseRepo.save(oldBkcase);
		}

}
