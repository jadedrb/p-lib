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

@Entity
@Table(name="books")
public class Book {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;
	private String title;
	private String author;
	private String publish_date;
	private int pages;
	private String type;
	
	@CreationTimestamp
	private Date recorded_on;
	
	@ManyToOne
	private Shelf shelf;
	
	@ManyToOne
	private User user;
	
	public Book() {}

	public Book(int id, String title, String author, String publish_date, int pages, String type, Date recorded_on) {
		super();
		this.id = id;
		this.title = title;
		this.author = author;
		this.publish_date = publish_date;
		this.pages = pages;
		this.type = type;
		this.recorded_on = recorded_on;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
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

	public String getPublish_date() {
		return publish_date;
	}

	public void setPublish_date(String publish_date) {
		this.publish_date = publish_date;
	}

	public int getPages() {
		return pages;
	}

	public void setPages(int pages) {
		this.pages = pages;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Date getRecorded_on() {
		return recorded_on;
	}

	public void setRecorded_on(Date recorded_on) {
		this.recorded_on = recorded_on;
	}
	
}
