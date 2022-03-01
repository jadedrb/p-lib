package com.project.jpa.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name="rooms")
public class Room {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public int id;
	public String name;
	public int height;
	public int width;
	public int tile;

	@OneToMany(cascade = CascadeType.ALL, mappedBy = "room")
	private List<Bookcase> bookcases = new ArrayList<>();
	
	@ManyToOne
	@JsonIgnore
	private User user;
	
	public Room() {}

	public Room(String name, int height, int width, int tile) {
		super();
		this.name = name;
		this.height = height;
		this.width = width;
		this.tile = tile;
	}
	
	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}
	
	public void addBookcase(Bookcase bookcase) {
		this.bookcases.add(bookcase);
	}
	
	public void removeBookcase(Bookcase bookcase) {
		this.bookcases.remove(bookcase);
	}
	
	public List<Bookcase> getBookcases() {
		return bookcases;
	}

	public void setBookcases(List<Bookcase> bookcases) {
		this.bookcases = bookcases;
	}

	public int getId() {
		return id;
	}
	
	public int getTile() {
		return tile;
	}

	public void setTile(int tile) {
		this.tile = tile;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getHeight() {
		return height;
	}

	public void setHeight(int height) {
		this.height = height;
	}

	public int getWidth() {
		return width;
	}

	public void setWidth(int width) {
		this.width = width;
	}
	
}
