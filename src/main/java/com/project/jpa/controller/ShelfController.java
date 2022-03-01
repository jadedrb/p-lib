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

	
	@GetMapping("/shelves")
	public List<Shelf> getAllShelves() {
		return shelfRepo.findAll(); // equivalent to SELECT * FROM students
	}
	
	
	@GetMapping("/shelves/{bkcase}")
	public List<Shelf> shelvesOfBookcase(@PathVariable int bkcase) {
		try {
			return bkcaseRepo.findById(bkcase).orElseThrow().getShelves();
		}
		catch (Exception e) {
			return new ArrayList<>();
		}
	}
	

	@PostMapping("/shelves/{bkcaseId}")
	public Shelf shelfForBookcase(@PathVariable int bkcaseId, @RequestBody Shelf shelf) {
		Bookcase bookcase = bkcaseRepo.findById(bkcaseId).orElseThrow();
		bookcase.addShelf(shelf);
		shelf.setBookcase(bookcase);
		return shelfRepo.save(shelf);
	}
	
	@DeleteMapping("/shelves/{shelfId}/bookcases/{bkcaseId}")
	public Map<String, Boolean> shelfFromBookcase(@PathVariable Integer shelfId, @PathVariable Integer bkcaseId) {
		Map<String, Boolean> res = new HashMap<>();
		try {
			Bookcase bookcase = bkcaseRepo.findById(bkcaseId).orElseThrow();
			Shelf shelf = shelfRepo.findById(shelfId).orElseThrow();
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
	public Shelf updateShelfForBookcase(@PathVariable int shelfId, @RequestBody Shelf newShelf) {
		
		Shelf oldShelf = shelfRepo.findById(shelfId).orElseThrow();
		
		return shelfRepo.save(oldShelf);
	}
	

}
