package com.project.jpa.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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
	
	@Query("select b from User u JOIN u.books b WHERE u.username = :un AND lower(b.title) LIKE lower(concat('%', :t,'%'))")
	List<Book> findTitleForUser(@Param("t") String title, @Param("un") String username);
	
	@Query("select b from User u JOIN u.books b WHERE u.username = :un AND lower(b.genre) LIKE lower(concat('%', :g,'%'))")
	List<Book> findGenreForUser(@Param("g") String genre, @Param("un") String username);
	
	@Query("select b from User u JOIN u.books b WHERE u.username = :un AND lower(b.more) LIKE lower(concat('%', :m,'%'))")
	List<Book> findMoreForUser(@Param("m") String more, @Param("un") String username);
	
	@Query("select b from User u JOIN u.books b WHERE u.username = :un AND lower(b.more) LIKE lower(concat('%', :a,'%')) OR lower(b.title) LIKE lower(concat('%', :a,'%')) OR lower(b.genre) LIKE lower(concat('%', :a,'%'))")
	List<Book> findAllForUser(@Param("a") String more, @Param("un") String username);
	
	// u.books is a collection and books is a property of the user object
	
}

//	@Query("select b from Book b WHERE b.user.username = :un AND b.title = :t")
// List<Book> joinUserAndBooks(@Param("un") String username, @Param("t") String title);

// helps us communicate with hibernate, which communicates with the database
// this repository provides us with methods that will do the work for us

// https://docs.spring.io/spring-data/jpa/docs/1.5.0.RELEASE/reference/html/jpa.repositories.html#jpa.query-methods.named-queries