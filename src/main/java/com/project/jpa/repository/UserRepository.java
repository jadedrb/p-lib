package com.project.jpa.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import com.project.jpa.model.User;

public interface UserRepository extends JpaRepository<User,Long> {

	List<User> findByUsername(String name);
	
}
