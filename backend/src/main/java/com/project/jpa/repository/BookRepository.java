package com.project.jpa.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project.jpa.model.Book;

public interface BookRepository extends JpaRepository<Book,Long> {
	
	List<Book> findByTitle(String name);
	Book findOneByTitle(String name);
	//void findOneByNameAndDelete(String name);

	@Modifying
	@Query("delete from Book s where s.title = ?1")
	void deleteByTitle(String title);
	
	List<Book> findByTitleContainingIgnoreCase(String piece);
	List<Book> findByTitleAndAuthorContaining(String title, String author);
	
	// Find for user
	
	@Query("select b from User u JOIN u.books b WHERE u.username = :un AND lower(b.title) LIKE lower(concat('%', :t,'%'))")
	List<Book> findTitleForUser(@Param("t") String title, @Param("un") String username);
	
	@Query("select b from User u JOIN u.books b WHERE u.username = :un AND lower(b.genre) LIKE lower(concat('%', :g,'%'))")
	List<Book> findGenreForUser(@Param("g") String genre, @Param("un") String username);
	
	@Query("select b from User u JOIN u.books b WHERE u.username = :un AND lower(b.more) LIKE lower(concat('%', :m,'%'))")
	List<Book> findMoreForUser(@Param("m") String more, @Param("un") String username);
	
	@Query("select b from User u JOIN u.books b WHERE u.username = :un AND lower(b.title) LIKE lower(concat('%', :gt,'%')) OR lower(b.genre) LIKE lower(concat('%', :gt,'%'))")
	List<Book> findTitleAndGenreForUser(@Param("gt") String genretitle, @Param("un") String username);
	
	@Query("select b from User u JOIN u.books b WHERE u.username = :un AND lower(b.more) LIKE lower(concat('%', :a,'%')) OR lower(b.title) LIKE lower(concat('%', :a,'%')) OR lower(b.genre) LIKE lower(concat('%', :a,'%')) OR lower(b.author) LIKE lower(concat('%', :a,'%')) OR lower(b.color) LIKE lower(concat('%', :a,'%'))")
	List<Book> findAllForUser(@Param("a") String all, @Param("un") String username);
	
	@Query("select b from User u JOIN u.books b WHERE u.username = :un AND b.pdate < :low AND b.pdate > :high")
	List<Book> findPublishDateForUser(@Param("low") int low, @Param("high") int high, @Param("un") String username);
	
	@Query("select b from User u JOIN u.books b WHERE u.username = :un AND b.pages < :low AND b.pages > :high")
	List<Book> findPagesForUser(@Param("low") int low, @Param("high") int high, @Param("un") String username);
	
	@Query("select b from User u JOIN u.books b WHERE u.username = :un AND lower(b.color) LIKE lower(concat('%', :c,'%'))")
	List<Book> findColorForUser(@Param("c") String color, @Param("un") String username);
	
	@Query("select b from User u JOIN u.books b WHERE u.username = :un AND lower(b.author) LIKE lower(concat('%', :a,'%'))")
	List<Book> findAuthorForUser(@Param("a") String author, @Param("un") String username);
	
	// u.books is a collection and books is a property of the user object
	
	// Find within a room ("...WHERE r.id = :id" would also work, but I did it the other way just to prove to myself I could)
	
	@Query("select b from Room r JOIN r.books b WHERE b.room.id = :id AND lower(b.title) LIKE lower(concat('%', :t,'%'))")
	List<Book> findTitleInRoom(@Param("t") String title, @Param("id") long id);
	
	@Query("select b from Room r JOIN r.books b WHERE b.room.id = :id AND lower(b.genre) LIKE lower(concat('%', :g,'%'))")
	List<Book> findGenreInRoom(@Param("g") String genre, @Param("id") long id);
	
	@Query("select b from Room r JOIN r.books b WHERE b.room.id = :id AND lower(b.title) LIKE lower(concat('%', :gt,'%')) OR lower(b.genre) LIKE lower(concat('%', :gt,'%'))")
	List<Book> findGenreAndTitleInRoom(@Param("gt") String genretitle, @Param("id") long id);
	
	@Query("select b from Room r JOIN r.books b WHERE b.room.id = :id AND lower(b.more) LIKE lower(concat('%', :a,'%')) OR lower(b.title) LIKE lower(concat('%', :a,'%')) OR lower(b.genre) LIKE lower(concat('%', :a,'%')) OR lower(b.author) LIKE lower(concat('%', :a,'%')) OR lower(b.color) LIKE lower(concat('%', :a,'%'))")
	List<Book> findAllInRoom(@Param("a") String all, @Param("id") long id);
	
	@Query("select b from Room r JOIN r.books b WHERE b.room.id = :id AND lower(b.color) LIKE lower(concat('%', :c,'%'))")
	List<Book> findColorInRoom(@Param("c") String color, @Param("id") long id);
	
	@Query("select b from Room r JOIN r.books b WHERE b.room.id = :id AND lower(b.author) LIKE lower(concat('%', :a,'%'))")
	List<Book> findAuthorInRoom(@Param("a") String author, @Param("id") long id);
	
	@Query("select b from Room r JOIN r.books b WHERE b.room.id = :id AND lower(b.more) LIKE lower(concat('%', :m,'%'))")
	List<Book> findMoreInRoom(@Param("m") String more, @Param("id") long id);
	
	@Query("select b from Room r JOIN r.books b WHERE b.room.id = :id AND b.pdate < :low AND b.pdate > :high")
	List<Book> findPublishDateInRoom(@Param("low") int low, @Param("high") int high, @Param("id") long id);
	
	@Query("select b from Room r JOIN r.books b WHERE b.room.id = :id AND b.pages < :low AND b.pages > :high")
	List<Book> findPagesInRoom(@Param("low") int low, @Param("high") int high, @Param("id") long id);
	
	// Find within a bookcase
	
	@Query("select b from Bookcase bk JOIN bk.books b WHERE b.bookcase.id = :id AND lower(b.title) LIKE lower(concat('%', :t,'%'))")
	List<Book> findTitleInBookcase(@Param("t") String title, @Param("id") long id);
	
	@Query("select b from Bookcase bk JOIN bk.books b WHERE b.bookcase.id = :id AND lower(b.title) LIKE lower(concat('%', :g,'%'))")
	List<Book> findGenreInBookcase(@Param("g") String genre, @Param("id") long id);
	
	@Query("select b from Bookcase bk JOIN bk.books b WHERE b.bookcase.id = :id AND lower(b.title) LIKE lower(concat('%', :gt,'%')) OR lower(b.genre) LIKE lower(concat('%', :gt,'%'))")
	List<Book> findGenreAndTitleInBookcase(@Param("gt") String genretitle, @Param("id") long id);
	
	@Query("select b from Bookcase bk JOIN bk.books b WHERE b.bookcase.id = :id AND lower(b.more) LIKE lower(concat('%', :a,'%')) OR lower(b.title) LIKE lower(concat('%', :a,'%')) OR lower(b.genre) LIKE lower(concat('%', :a,'%')) OR lower(b.author) LIKE lower(concat('%', :a,'%')) OR lower(b.color) LIKE lower(concat('%', :a,'%'))")
	List<Book> findAllInBookcase(@Param("a") String all, @Param("id") long id);
	
	@Query("select b from Bookcase bk JOIN bk.books b WHERE b.bookcase.id = :id AND lower(b.color) LIKE lower(concat('%', :c,'%'))")
	List<Book> findColorInBookcase(@Param("c") String color, @Param("id") long id);
	
	@Query("select b from Bookcase bk JOIN bk.books b WHERE b.bookcase.id = :id AND lower(b.author) LIKE lower(concat('%', :a,'%'))")
	List<Book> findAuthorInBookcase(@Param("a") String author, @Param("id") long id);
	
	@Query("select b from Bookcase bk JOIN bk.books b WHERE b.bookcase.id = :id AND lower(b.more) LIKE lower(concat('%', :m,'%'))")
	List<Book> findMoreInBookcase(@Param("m") String more, @Param("id") long id);
	
	@Query("select b from Bookcase bk JOIN bk.books b WHERE b.bookcase.id = :id AND b.pdate < :low AND b.pdate > :high")
	List<Book> findPublishDateInBookcase(@Param("low") int low, @Param("high") int high, @Param("id") long id);
	
	@Query("select b from Bookcase bk JOIN bk.books b WHERE b.bookcase.id = :id AND b.pages < :low AND b.pages > :high")
	List<Book> findPagesInBookcase(@Param("low") int low, @Param("high") int high, @Param("id") long id);
	
	// Find within a shelf
	
	@Query("select b from Shelf sh JOIN sh.books b WHERE b.shelf.id = :id AND lower(b.title) LIKE lower(concat('%', :t,'%'))")
	List<Book> findTitleInShelf(@Param("t") String title, @Param("id") long id);
	
	@Query("select b from Shelf sh JOIN sh.books b WHERE b.shelf.id = :id AND lower(b.title) LIKE lower(concat('%', :g,'%'))")
	List<Book> findGenreInShelf(@Param("g") String genre, @Param("id") long id);
	
	@Query("select b from Shelf sh JOIN sh.books b WHERE b.shelf.id = :id AND lower(b.title) LIKE lower(concat('%', :gt,'%')) OR lower(b.genre) LIKE lower(concat('%', :gt,'%'))")
	List<Book> findGenreAndTitleInShelf(@Param("gt") String genretitle, @Param("id") long id);
	
	@Query("select b from Shelf sh JOIN sh.books b WHERE b.shelf.id = :id AND lower(b.more) LIKE lower(concat('%', :a,'%')) OR lower(b.title) LIKE lower(concat('%', :a,'%')) OR lower(b.genre) LIKE lower(concat('%', :a,'%')) OR lower(b.author) LIKE lower(concat('%', :a,'%')) OR lower(b.color) LIKE lower(concat('%', :a,'%'))")
	List<Book> findAllInShelf(@Param("a") String all, @Param("id") long id);
	
	@Query("select b from Shelf sh JOIN sh.books b WHERE b.shelf.id = :id AND lower(b.color) LIKE lower(concat('%', :c,'%'))")
	List<Book> findColorInShelf(@Param("c") String color, @Param("id") long id);
	
	@Query("select b from Shelf sh JOIN sh.books b WHERE b.shelf.id = :id AND lower(b.author) LIKE lower(concat('%', :a,'%'))")
	List<Book> findAuthorInShelf(@Param("a") String author, @Param("id") long id);
	
	@Query("select b from Shelf sh JOIN sh.books b WHERE b.shelf.id = :id AND lower(b.more) LIKE lower(concat('%', :m,'%'))")
	List<Book> findMoreInShelf(@Param("m") String more, @Param("id") long id);
	
	@Query("select b from Shelf sh JOIN sh.books b WHERE b.shelf.id = :id AND b.pdate < :low AND b.pdate > :high")
	List<Book> findPublishDateInShelf(@Param("low") int low, @Param("high") int high, @Param("id") long id);
	
	@Query("select b from Shelf sh JOIN sh.books b WHERE b.shelf.id = :id AND b.pages < :low AND b.pages > :high")
	List<Book> findPagesInShelf(@Param("low") int low, @Param("high") int high, @Param("id") long id);
	
}

//	@Query("select b from Room r JOIN r.books b WHERE b.room.id = (:id) AND lower(b.more) LIKE lower(concat('%', :t,'%'))")

//	@Query("select b from Book b WHERE b.user.username = :un AND b.title = :t")
// List<Book> joinUserAndBooks(@Param("un") String username, @Param("t") String title);

// helps us communicate with hibernate, which communicates with the database
// this repository provides us with methods that will do the work for us

// https://docs.spring.io/spring-data/jpa/docs/1.5.0.RELEASE/reference/html/jpa.repositories.html#jpa.query-methods.named-queries