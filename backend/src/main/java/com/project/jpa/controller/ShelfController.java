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
import com.project.jpa.model.Shelf;
import com.project.jpa.repository.BookcaseRepository;
import com.project.jpa.repository.ShelfRepository;

@CrossOrigin//(origins="http://localhost:3000")
@RestController
@RequestMapping("/api")
public class ShelfController {

	@Autowired
	private ShelfRepository shelfRepo;
	
	@Autowired
	private BookcaseRepository bkcaseRepo;
	
	public void validUserAccess(Shelf shelf) throws Exception {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		String incomingUser = auth.getName();
		String outgoingUser = shelf.getBookcase().getRoom().getUser().getUsername();
		if (!incomingUser.equals(outgoingUser)) 
			throw new Exception("improper relationship with requested data");
	}

	
//	@GetMapping("/shelves")
//	public List<Shelf> getAllShelves() {
//		return shelfRepo.findAll(); // equivalent to SELECT * FROM students
//	}
	
	
	@GetMapping("/shelves/{bkcase}")
	public List<Shelf> shelvesOfBookcase(@PathVariable long bkcase) throws Exception {
		List<Shelf> shelves = bkcaseRepo.findById(bkcase).orElseThrow().getShelves();
		if (!shelves.isEmpty())
			validUserAccess(shelves.get(0));
		return shelves;
	}

	@PostMapping("/shelves/{bkcaseId}")
	public List<Shelf> shelfForBookcase(@PathVariable long bkcaseId, @RequestBody List<Shelf> shelves) throws Exception {
		Bookcase bookcase = bkcaseRepo.findById(bkcaseId).orElseThrow();
		for (Shelf shelf : shelves) {
			shelf.setBookcase(bookcase);
			validUserAccess(shelf);
			bookcase.addShelf(shelf);
		}
		return shelfRepo.saveAll(shelves);
	}
	
	@DeleteMapping("/shelves/{shelfId}/bookcases/{bkcaseId}")
	public Map<String, Boolean> shelfFromBookcase(@PathVariable Long shelfId, @PathVariable Long bkcaseId) {
		Map<String, Boolean> res = new HashMap<>();
		try {
			Shelf shelf = shelfRepo.findById(shelfId).orElseThrow();
			validUserAccess(shelf);
			Bookcase bookcase = bkcaseRepo.findById(bkcaseId).orElseThrow();
			bookcase.removeShelf(shelf);
			shelfRepo.delete(shelf);
			res.put("deleted", Boolean.TRUE);
		}
		catch(Exception e) {
			res.put("deleted", Boolean.FALSE);
		}
		return res;
	}


	@PutMapping("/shelves/{shelfId}")
	public Shelf updateShelfForBookcase(@PathVariable long shelfId, @RequestBody Shelf newShelf) throws Exception {
		
		Shelf oldShelf = shelfRepo.findById(shelfId).orElseThrow();
		validUserAccess(oldShelf);
		oldShelf.setOrganize(newShelf.getOrganize());
		
		return shelfRepo.save(oldShelf);
	}
	

}
