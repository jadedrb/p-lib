package com.project.jpa.model;

import java.util.ArrayList;
import java.util.List;

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
@Table(name="shelves")
public class Shelf {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	public int id;
	
	@OneToMany(cascade = CascadeType.ALL, mappedBy = "shelf")
	private List<Book> books = new ArrayList<>();
	
	@ManyToOne
	@JsonIgnore
	private Bookcase bookcase;
	
	public Shelf() {}
	

	public Bookcase getBookcase() {
		return bookcase;
	}

	public void setBookcase(Bookcase bookcase) {
		this.bookcase = bookcase;
	}

	public int getId() {
		return id;
	}
	
	public List<Book> getBooks() {
		return this.books;
	}


	public void setBooks(List<Book> books) {
		this.books = books;
	}


	public void addBook(Book book) {
		this.books.add(book);
	}
	
	public void removeBook(Book book) {
		this.books.remove(book);
	}
	
	
}
