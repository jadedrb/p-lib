package com.project.jpa.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
	
	
	
	@GetMapping("/rooms")
	public List<Room> getAllBooks() {
		return roomRepo.findAll(); // equivalent to SELECT * FROM students
	}
	
// This is used by getRoomsForUser from frontend
	@GetMapping("/rooms/{user}")
	public List<Room> roomsOfUser(@PathVariable String user) {
		try {
			System.out.println("join user and rooms and order");
			return roomRepo.joinUserAndRoom(user);
//			 return userRepo.findByUsername(user).get(0).getRooms();
		}
		catch (Exception e) {
			return new ArrayList<>();
		}
	}
	
// This is used by createRoomForUser from frontend
	@PostMapping("/rooms/{name}")
	public Room roomForUser(@PathVariable String name, @RequestBody Room room) {
		User user = userRepo.findByUsername(name).get(0);
		user.addRoom(room);
		room.setUser(user);
		return roomRepo.save(room);
	}

// This is the removeRoomFromUser from frontend
	@DeleteMapping("/rooms/{id}/users/{name}")
	public Map<String, Boolean> roomFromUser(@PathVariable Long id, @PathVariable String name) {
		Map<String, Boolean> res = new HashMap<>();
		try {
			User user = userRepo.findByUsername(name).get(0);
			Room room = roomRepo.findById(id).orElseThrow();
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
	public Room updateRoomForUser(@PathVariable long id, @RequestBody Room newRoom) {
		
		Room oldRoom = roomRepo.findById(id).orElseThrow();
		
		oldRoom.setHeight(newRoom.getHeight());
		oldRoom.setName(newRoom.getName());
		oldRoom.setWidth(newRoom.getWidth());
		oldRoom.setTile(newRoom.getTile());
		
		return roomRepo.save(oldRoom);
	}
	
	// This is used by getRoomsForUser from frontend
		@GetMapping("/room/{id}")
		public Room roomOfUser(@PathVariable long id) {
			return roomRepo.findById(id).orElseThrow();
		}
}


//List<User> ul = roomRepo.joinUserAndRoom(user);


// https://betterprogramming.pub/how-to-delete-child-records-in-onetomany-relationship-from-database-in-jpa-38d78e02d7a1
// orphanRemoval = true ... auto deletes child entities while deleting parent
