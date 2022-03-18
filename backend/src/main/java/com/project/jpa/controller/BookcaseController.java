package com.project.jpa.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
	
	public void validUserAccess(Bookcase bookcase) throws Exception {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		String incomingUser = auth.getName();
		String outgoingUser = bookcase.getRoom().getUser().getUsername();
		if (!incomingUser.equals(outgoingUser)) 
			throw new Exception("improper relationship with requested data");
	}
	
//	@GetMapping("/bookcases")
//	public List<Room> getAllBooks() {
//		return roomRepo.findAll(); // equivalent to SELECT * FROM students
//	}

	
	
	
		@GetMapping("/bookcases/{room}")
		public List<Bookcase> bookcasesOfRoom(@PathVariable long room) throws Exception {
			List<Bookcase> bookcases = roomRepo.findById(room).orElseThrow().getBookcases();
			if (!bookcases.isEmpty())
				validUserAccess(bookcases.get(0));
			return bookcases;
		}
		
		
		@PostMapping("/bookcases/{roomId}")
		public List<Bookcase> bookcaseForRoom(@PathVariable long roomId, @RequestBody List<Bookcase> bookcases) throws Exception {
			Room room = roomRepo.findById(roomId).orElseThrow();
			for (Bookcase bookcase : bookcases) {
				bookcase.setRoom(room);
				validUserAccess(bookcase);
				room.addBookcase(bookcase);
			}
			return bkcaseRepo.saveAll(bookcases);
		}
		
		@DeleteMapping("/bookcases/{bkcaseId}/rooms/{roomId}")
		public Map<String, Boolean> bookcaseFromRoom(@PathVariable long bkcaseId, @PathVariable long roomId) {
			Map<String, Boolean> res = new HashMap<>();
			try {
				Bookcase bookcase = bkcaseRepo.findById(bkcaseId).orElseThrow();
				validUserAccess(bookcase);
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
		public Bookcase updateBookcaseForRoom(@PathVariable long bkcaseId, @RequestBody Bookcase newBkcase) throws Exception {
			
			Bookcase oldBkcase = bkcaseRepo.findById(bkcaseId).orElseThrow();
			
			validUserAccess(oldBkcase);
			
			if (newBkcase.getHeight() != 0) 
				oldBkcase.setHeight(newBkcase.getHeight());
			if (newBkcase.getWidth() != 0) 
				oldBkcase.setWidth(newBkcase.getWidth());
			
			if (newBkcase.getLocation() != null) 
				oldBkcase.setLocation(newBkcase.getLocation());
			if (newBkcase.getColor() != null) 
				oldBkcase.setColor(newBkcase.getColor());
			
			if (newBkcase.getRowHigh() != 0) 
				oldBkcase.setRowHigh(newBkcase.getRowHigh());
			if (newBkcase.getRowLow() != 0) 
				oldBkcase.setRowLow(newBkcase.getRowLow());
			if (newBkcase.getColHigh() != 0) 
				oldBkcase.setColHigh(newBkcase.getColHigh());
			if (newBkcase.getColLow() != 0) 
				oldBkcase.setColLow(newBkcase.getColLow());
			
			return bkcaseRepo.save(oldBkcase);
		}

}
