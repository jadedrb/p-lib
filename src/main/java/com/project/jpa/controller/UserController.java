package com.project.jpa.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.jpa.exception.AuthException;
import com.project.jpa.model.Room;
import com.project.jpa.model.Shelf;
import com.project.jpa.model.User;
import com.project.jpa.repository.RoomRepository;
import com.project.jpa.repository.UserRepository;
import com.project.jpa.services.UserService;

@CrossOrigin//(origins="http://localhost:3000")
@RestController
@RequestMapping("/api")
public class UserController implements UserService {
	
	@Autowired
	UserRepository userRepo;
	
	@Autowired
	RoomRepository roomRepo;

	@Override
	public User validateUser(String email, String password) throws AuthException {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public User registerUser(String email, String password) throws AuthException {
		// TODO Auto-generated method stub
		return null;
	}

//	@Override
//	public User registerUser(String email, String password) throws AuthException {
//		// TODO Auto-generated method stub
//		if (email != null) 
//			email = email.toLowerCase();
//		
//		Integer count = userRepo.getCountByEmail(email);
//		
//		if (count > 0)
//			throw new AuthException("Email in use.");
//		
//		Integer userId = userRepo.create(email, password);
//		// ^ will return primary key of newly created user
//		
//		return userRepo.findById(userId);
//	}
	
//	@GetMapping("/test")
//	public List<User> test() {
//		System.out.println("do we reach here?");
//		return userRepo.joinUserAndRoom();
//	}
	
	@GetMapping("/users")
	public List<User> getAllShelves() {
		return userRepo.findAll(); // equivalent to SELECT * FROM students
	}
	
	@GetMapping("/users/add/{user}")
	public void addTest(@PathVariable String user) {
		User userE = new User(user + "@gmail.com", user + "123", user);
		userRepo.save(userE);
	}
	
	@GetMapping("/users/{user}/rooms")
	public List<Room> findRoomsForUser(@PathVariable String user) {
		//User userE = new User(user + "@gmail.com", user + "123", user);
	
		List<User> u = userRepo.findByUsername(user);
		
		return u.get(0).getRooms();
		
	}
	
	@GetMapping("/test")
	public List<Object> test() {
		List<Object> ul = userRepo.joinUserAndRoom();
	
		return ul;
		
	}

}
