package com.project.jpa.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.project.jpa.model.Book;

public interface BookRepository extends JpaRepository<Book,Integer> {
	
	List<Book> findByTitle(String name);
	Book findOneByTitle(String name);
	//void findOneByNameAndDelete(String name);

	@Modifying
	@Query("delete from Book s where s.title = ?1")
	void deleteByTitle(String title);
	
	List<Book> findByTitleContainingIgnoreCase(String piece);
	List<Book> findByTitleAndAuthorContaining(String title, String author);
	
}

// helps us communicate with hibernate, which communicates with the database
// this repository provides us with methods that will do the work for us

// https://docs.spring.io/spring-data/jpa/docs/1.5.0.RELEASE/reference/html/jpa.repositories.html#jpa.query-methods.named-queries