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
//import com.project.jpa.config.JwtUtil;
//import com.project.jpa.exception.AuthException;
//import com.project.jpa.model.Book;
//import com.project.jpa.model.Room;
//import com.project.jpa.model.Shelf;
import com.project.jpa.model.User;
import com.project.jpa.repository.RoomRepository;
import com.project.jpa.repository.UserRepository;

@CrossOrigin(origins="http://localhost:3000")
@RestController
@RequestMapping("/api")
public class UserController {
	
	@Autowired
	private JwtUtil jwtUtil;
//	
	@Autowired
    BCryptPasswordEncoder passwordEncoder;

	@Autowired
	private AuthenticationManager authenticationManager;
	
	@Autowired
	UserRepository userRepo;
	
	@Autowired
	RoomRepository roomRepo;
	
	@GetMapping("/")
	public String welcome() {
		return "hello!";
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

	
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User request) {
   
    	System.out.println("here");
//System.out.println(request);
//System.out.println(request.getUsername());
//System.out.println(request.getPassword());
//        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword());
//        System.out.println(token);
//        System.out.println(token.getCredentials());
//
//        Authentication test = authenticationManager.authenticate(token);
//        System.out.println(test);
//        System.out.println(test.toString());
//
//        String jwt = jwtUtil.generate(request.getUsername());
        return ResponseEntity.ok("wow");
    }
	
	@GetMapping("/users")
	public List<User> getAllShelves(Authentication authentication) {
		return userRepo.findAll(); // equivalent to SELECT * FROM students
	}
	
	@GetMapping("/users/add/{user}")
	public void addTest(@PathVariable String user) {
		User userE = new User(user + "@gmail.com", user + "123", user, "");
		userRepo.save(userE);
	}
	
	@GetMapping("/users/{name}") 
	public User findUserByName(@PathVariable String name)
	{
		try {
			return userRepo.findByUsername(name).get(0);
		} 
		catch(Exception e) {
			return null;
		}
	}
	
	
	@DeleteMapping("/users/{id}")
	public Map<String, Boolean> roomFromUser(@PathVariable Long id) {
		try {
			User user = userRepo.findById(id).orElseThrow();
			userRepo.delete(user);
			Map<String, Boolean> res = new HashMap<>();
			res.put("deleted", Boolean.TRUE);
			return res;
		}
		catch(Exception e) {
			return null;
		}
	}

	
//	@GetMapping("/users/{user}/rooms")
//	public List<Room> findRoomsForUser(@PathVariable String user) {
//		//User userE = new User(user + "@gmail.com", user + "123", user);
//		
//		List<Room> l = null;
//	
//		try {
//			List<User> u = userRepo.findByUsername(user);
//			
//			return u.get(0).getRooms();
//			
//		} catch(Exception e) {
//			
//			return l;
//		}
//	}
//	
//	@GetMapping("/test/{user}")
//	public List<Room> test(@PathVariable String user) {
//		List<User> ul = userRepo.joinUserAndRoom(user);
//
//		try {
//			return ul.get(0).getRooms();
//		}
//		catch (Exception e) {
//			return new ArrayList<>();
//		}
//	
//	}
	
	
	

}






//		for (User o : ul) {
//			System.out.println("start");
//			System.out.println(o.getUsername().equals(user));
//			System.out.println(o.getUsername());
//			System.out.println(user);
//			System.out.println("end");
//			if (o.getUsername().equals(user)) {
//				System.out.println("ye");
//			}
//		}
		// List<MyType> myList = new ArrayList<>()
		// IndexOutOfBoundsException e
