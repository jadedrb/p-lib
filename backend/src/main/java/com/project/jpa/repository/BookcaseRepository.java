package com.project.jpa.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project.jpa.model.Bookcase;
import com.project.jpa.model.User;

public interface BookcaseRepository extends JpaRepository<Bookcase,Long>{

	@Query("select r from Room r JOIN r.bookcases k")
	List<User> joinRoomAndBookcases(@Param("n") String username);
}
