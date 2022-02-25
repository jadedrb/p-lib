package com.project.jpa.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project.jpa.model.Room;
import com.project.jpa.model.User;

public interface RoomRepository extends JpaRepository<Room,Integer> {
	
	@Query("select u from User u JOIN u.rooms r WHERE u.username = :n")
	List<User> joinUserAndRoom(@Param("n") String username);

}
