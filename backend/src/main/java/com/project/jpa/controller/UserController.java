package com.project.jpa.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.authentication.AuthenticationManager;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.jpa.config.AuthRequest;
import com.project.jpa.config.JwtUtil;
import com.project.jpa.model.Bookcase;
import com.project.jpa.model.Room;
//import com.project.jpa.config.JwtUtil;
//import com.project.jpa.exception.AuthException;
//import com.project.jpa.model.Book;
//import com.project.jpa.model.Room;
//import com.project.jpa.model.Shelf;
import com.project.jpa.model.User;
import com.project.jpa.repository.RoomRepository;
import com.project.jpa.repository.UserRepository;

@CrossOrigin//(origins="http://localhost:3000")
@RestController("/")
public class UserController {
	
	@Autowired
	private JwtUtil jwtUtil;

	@Autowired
    BCryptPasswordEncoder passwordEncoder;

	@Autowired
	private AuthenticationManager authenticationManager;
	
	@Autowired
	UserRepository userRepo;
	
	@Autowired
	RoomRepository roomRepo;
	
	public void validUserAccess(User user) throws Exception {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		String incomingUser = auth.getName();
		String outgoingUser = user.getUsername();
		if (!incomingUser.equals(outgoingUser)) 
			throw new Exception("improper relationship with requested data");
	}
	
	@GetMapping("/auth/awaken")
	public String test() {
		return "hello there!";
	}
	
	
	@GetMapping("/auth/test")
	public String testing(Authentication authentication) {
		return authentication.getName();
	}
	 
	@PostMapping("/auth/login")
	public String generateToken(@RequestBody AuthRequest authRequest) {
		try {
			authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
			);
		} catch(Exception e) {
			return "invalid credentials";
		}
		return jwtUtil.generateToken(authRequest.getUsername());
	}
	
	
	@PostMapping("/auth/register")
	public String createUser(@RequestBody User user) {
		System.out.println("in register...");
		String originalPassword = user.getPassword();
		
		List<User> existingUsers = userRepo.findByUsername(user.getUsername());
		if (existingUsers.isEmpty()) {
			String crypticPassword = passwordEncoder.encode(user.getPassword());
			user.setPassword(crypticPassword);
			userRepo.save(user);
			System.out.println("in here1");
		} else {
			System.out.println("in here1b");
			return "user already exists...";
		}
		System.out.println("in here2");
		try {
			authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(user.getUsername(), originalPassword)
			);
			System.out.println("in here3");
		} catch(Exception e) {
			System.out.println("in here4");
			return "something went wrong with creating a token on registration";
		}
		System.out.println("in here5");
		return jwtUtil.generateToken(user.getUsername());
	}
	
//	@GetMapping("/api/users")
//	public List<User> getAllShelves(Authentication auth) {
//		return userRepo.findAll(); // equivalent to SELECT * FROM students
//	}
	
	@GetMapping("/api/overview/{name}") 
	public List<Map<String, Integer>> findUserInformation(@PathVariable String name) throws Exception {
		
		User user = userRepo.findByUsername(name).get(0);
		validUserAccess(user);
		
		boolean admin = false;
		
		if (name.equals(System.getenv("PLIB_ADMIN"))) 
			admin = true;
		
		List<User> users = userRepo.findAll();
		List<Map<String, Integer>> usersInfo = new ArrayList<>();
		
		for (User usr : users) {
			
			if (!admin && !usr.getUsername().equals(name))
				continue;
			
			Map<String, Integer> res = new HashMap<>();
			res.put(usr.getUsername(), (int) usr.getId());
			res.put("rooms", usr.getRooms().size());
			res.put("books", usr.getBooks().size());
			res.put(usr.getCreated_on().toString(), null);
			
			int totalBkcases = 0; 
			int totalShelves = 0;
			
			for (Room room : usr.getRooms()) {
				totalBkcases += room.getBookcases().size();
				for (Bookcase bkcase : room.getBookcases()) {
					totalShelves += bkcase.getShelves().size();
				}
			}
			res.put("bookcases", totalBkcases);
			res.put("shelves", totalShelves);
			
			usersInfo.add(res);
		}
		

		return usersInfo;
	}
	
	@GetMapping("/api/users/{name}") 
	public User findUserByName(@PathVariable String name) throws Exception {
		User user = userRepo.findByUsername(name).get(0);
		validUserAccess(user);
		return user;
	}
	
	
	@DeleteMapping("/api/users/{id}")
	public Map<String, Boolean> roomFromUser(@PathVariable Long id, Authentication auth) {
		Map<String, Boolean> res = new HashMap<>();
		try {
			User user = userRepo.findById(id).orElseThrow();
			
			if (auth.getName().equals(System.getenv("PLIB_ADMIN"))) {
				res.put("admin", Boolean.TRUE);
			} else {
				validUserAccess(user);
			}
				
			userRepo.delete(user);
			res.put("deleted", Boolean.TRUE);
			return res;
		}
		catch(Exception e) {
			res.put("deleted", Boolean.FALSE);
			return res;
		}
	}
}
