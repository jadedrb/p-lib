package com.project.jpa.model;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.springframework.beans.factory.annotation.Autowired;

@Entity
@Table(name="users")
public class User {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	private String email;
	private String password;
	private String username;
	
	@OneToMany
	private List<Room> rooms = new ArrayList<>();


	@OneToMany
	private List<Book> books = new ArrayList<>();
	
	public User() {}
	
	public User(String email, String password, String username) {
		super();
		this.email = email;
		this.password = password;
		this.username = username;
	}

	public int getUserId() {
		return id;
	}

	public void setUserId(int userId) {
		this.id = userId;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}
	
	// 
	
	public List<Room> getRooms() {
		return rooms;
	}

	public void addRoom(Room room) {
		this.rooms.add(room);
	}
	
	public void removeRoom(Room room) {
		this.rooms.remove(room);
	}

	public List<Book> getBooks() {
		return books;
	}

	public void addBook(Book book) {
		this.books.add(book);
	}
	
	public void removeBook(Book book) {
		this.books.remove(book);
	}

	@Override
	public String toString() {
		return "User [id=" + id + ", email=" + email + ", password=" + password + ", username=" + username + "]";
	}

}
