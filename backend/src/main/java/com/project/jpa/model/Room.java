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
	private long id;
	private String name;
	private String perspective;
	private int height;
	private int width;
	private int tile;
	
	@OneToMany(cascade = CascadeType.ALL, mappedBy = "room")
	private List<Book> books = new ArrayList<>();

	@OneToMany(cascade = CascadeType.ALL, mappedBy = "room")
	private List<Bookcase> bookcases = new ArrayList<>();
	
	@ManyToOne
	@JsonIgnore
	private User user;
	
	public Room() {}

	public Room(String name, int height, int width, int tile, String perspective) {
		super();
		this.name = name;
		this.height = height;
		this.width = width;
		this.tile = tile;
		this.perspective = perspective;
	}
	
	public void addBook(Book book) {
		this.books.add(book);
	}
	
	public void removeBook(Book book) {
		this.books.remove(book);
	}
	
	public List<Book> getBooks() {
		return books;
	}

	public void setBooks(List<Book> books) {
		this.books = books;
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

	public long getId() {
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

	public String getPerspective() {
		return perspective;
	}

	public void setPerspective(String perspective) {
		this.perspective = perspective;
	}

	
}
