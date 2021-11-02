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

@Entity
@Table(name="shelves")
public class Shelf {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	public int id;
	public String position;
	public int width;
	
	@OneToMany
	private List<Book> books = new ArrayList<>();
	
	public Shelf() {}

	public Shelf(String position, int width) {
		super();
		this.position = position;
		this.width = width;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getPosition() {
		return position;
	}

	public void setPosition(String position) {
		this.position = position;
	}

	public int getWidth() {
		return width;
	}

	public void setWidth(int width) {
		this.width = width;
	}

	
}
