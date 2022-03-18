package com.project.jpa.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

import com.project.jpa.model.Room;
import com.project.jpa.model.User;
import com.project.jpa.repository.RoomRepository;
import com.project.jpa.repository.UserRepository;

@CrossOrigin//(origins="http://localhost:3000")
@RestController
@RequestMapping("/api")
public class RoomController {

	@Autowired
	private RoomRepository roomRepo;
	
	@Autowired
	private UserRepository userRepo;
	
	public void validUserAccess(Room room) throws Exception {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		String incomingUser = auth.getName();
		String outgoingUser = room.getUser().getUsername();
		if (!incomingUser.equals(outgoingUser)) 
			throw new Exception("improper relationship with requested data");
	}
	
// This is used by getRoomsForUser from frontend
	@GetMapping("/rooms/{user}")
	public List<Room> roomsOfUser(@PathVariable String user) throws Exception {
	
			System.out.println("join user and rooms and order");
			List<Room> rooms = roomRepo.joinUserAndRoom(user);
			
			if (!rooms.isEmpty())
				validUserAccess(rooms.get(0));
				
			return rooms;
	}
	
// This is used by createRoomForUser from frontend
	@PostMapping("/rooms/{name}")
	public Room roomForUser(@PathVariable String name, @RequestBody Room room) throws Exception {
		User user = userRepo.findByUsername(name).get(0);
		room.setUser(user);
		
		validUserAccess(room);
		
		user.addRoom(room);
		
		return roomRepo.save(room);
	}

// This is the removeRoomFromUser from frontend
	@DeleteMapping("/rooms/{id}/users/{name}")
	public Map<String, Boolean> roomFromUser(@PathVariable Long id, @PathVariable String name) {
		Map<String, Boolean> res = new HashMap<>();
		try {
			User user = userRepo.findByUsername(name).get(0);
			Room room = roomRepo.findById(id).orElseThrow();
			
			validUserAccess(room);
			
			user.removeRoom(room);
			roomRepo.delete(room);
			res.put("deleted", Boolean.TRUE);
		}
		catch(Exception e) {
			res.put("deleted", Boolean.FALSE);
		}
		return res;
	}
	
// This is the updateRoomForUser from frontend
	@PutMapping("/rooms/{id}/users/{name}")
	public Room updateRoomForUser(@PathVariable long id, @RequestBody Room newRoom) throws Exception {
		
		Room oldRoom = roomRepo.findById(id).orElseThrow();
		
		validUserAccess(oldRoom);
		
		oldRoom.setHeight(newRoom.getHeight());
		oldRoom.setName(newRoom.getName());
		oldRoom.setWidth(newRoom.getWidth());
		oldRoom.setTile(newRoom.getTile());
		
		return roomRepo.save(oldRoom);
	}
	
	// This is used by getRoomsForUser from frontend
		@GetMapping("/room/{id}")
		public Room roomOfUser(@PathVariable long id) throws Exception {
			Room room = roomRepo.findById(id).orElseThrow();
			validUserAccess(room);
			return room;
		}
}


// orphanRemoval = true ... auto deletes child entities while deleting parent
