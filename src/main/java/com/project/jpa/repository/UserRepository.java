package com.project.jpa.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project.jpa.exception.AuthException;
import com.project.jpa.model.Book;
import com.project.jpa.model.User;

public interface UserRepository extends JpaRepository<User,Integer> {

	//Integer create(String email, String password) throws AuthException;
	
	//User findByEmailAndPassword(String email, String password) throws AuthException;
	
	//Integer getCountByEmail(String email);

	//User findById(Integer userId);
	
	// Collection<User> findByUsernameName(String username);
	
//	@Query("SELECT u.username, ur.name FROM User u JOIN u.rooms ur")
//			List<User> joinUserAndRoom();
	
//	@Query("select u.username, r.name from User u JOIN u.rooms r")
//	@Query("select u from User u JOIN u.rooms r WHERE u.username = :n")
//	List<User> joinUserAndRoom(@Param("n") String username);
	List<User> findByUsername(String name);
	List<User> findByUsernameOrderByIdDesc(String name);
	
	
	
}
