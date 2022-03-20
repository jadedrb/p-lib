package com.project.jpa.model;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;

@Entity
@Table(name="users")
public class User {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	private String email;
	private String password;
	private String username;
	private String other;
	
	@CreationTimestamp
	private Date created_on;
	
	@OneToMany(cascade = CascadeType.ALL, mappedBy = "user") // , orphanRemoval = true
	private List<Room> rooms = new ArrayList<>();

	@OneToMany(cascade = CascadeType.ALL, mappedBy = "user") 		// books is the owning side of relationship
	private List<Book> books = new ArrayList<>();		   			// which means the book table is in charge 
														   			// of keeping a column called "user_id"
	public User() {}									   			// and therefore needs the mappedBy
															
	public User(String email, String password, String username, String other) {
		super();
		this.email = email;
		this.password = password;
		this.username = username;
		this.other = other;
	}
	
//	public User(String name, User user, ArrayList<GrantedAuthority> authorities) {
//
//	}


	public String getOther() {
		return other;
	}

	public Date getCreated_on() {
		return created_on;
	}

	public void setCreated_on(Date created_on) {
		this.created_on = created_on;
	}

	public void setOther(String other) {
		this.other = other;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
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
