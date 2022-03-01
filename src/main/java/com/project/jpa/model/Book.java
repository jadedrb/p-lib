package com.project.jpa.model;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name="books")
public class Book {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;
	private String title;
	private String author;
	private String genre;
	private int pages;
	private int pdate;
	private String color;
	private String more;
	
	@CreationTimestamp
	private Date recorded_on;
	
	@ManyToOne
	@JsonIgnore
	private User user;
	
	@ManyToOne
	@JsonIgnore
	private Shelf shelf;
	
	public Book() {}

	public Book(String title, String author, String genre, int pages, int pdate, String color, String more) {
		super();
		this.title = title;
		this.author = author;
		this.genre = genre;
		this.pages = pages;
		this.pdate = pdate;
		this.color = color;
		this.more = more;
	}

	public Shelf getShelf() {
		return shelf;
	}

	public void setShelf(Shelf shelf) {
		this.shelf = shelf;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getAuthor() {
		return author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}

	public String getGenre() {
		return genre;
	}

	public void setGenre(String genre) {
		this.genre = genre;
	}

	public int getPages() {
		return pages;
	}

	public void setPages(int pages) {
		this.pages = pages;
	}

	public int getPdate() {
		return pdate;
	}

	public void setPdate(int pdate) {
		this.pdate = pdate;
	}

	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	public String getMore() {
		return more;
	}

	public void setMore(String more) {
		this.more = more;
	}

	public Date getRecorded_on() {
		return recorded_on;
	}

	public void setRecorded_on(Date recorded_on) {
		this.recorded_on = recorded_on;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	
	
}
