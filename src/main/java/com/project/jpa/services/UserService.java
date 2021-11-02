package com.project.jpa.services;

import com.project.jpa.exception.AuthException;
import com.project.jpa.model.User;

public interface UserService {
	
	User validateUser(String email, String password) throws AuthException;
	
	User registerUser(String email, String password) throws AuthException;

}
