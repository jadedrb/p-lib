package com.project.jpa.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project.jpa.model.Book;
import com.project.jpa.model.Room;
import com.project.jpa.model.User;

public interface RoomRepository extends JpaRepository<Room,Integer> {
	
	@Query("select r from User u JOIN u.rooms r WHERE u.username = :n ORDER BY r.id")
	List<Room> joinUserAndRoom(@Param("n") String username);

//	@Query("select b from User u JOIN u.books b WHERE u.username = :un AND lower(b.title) LIKE lower(concat('%', :t,'%'))")
//	List<Book> findTitleForUser(@Param("t") String title, @Param("un") String username);
//	List<Room> findByUsernameOrderByIdDesc(String name);
}
