package com.project.jpa.model;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "bookcases")
public class Bookcase {
	
	@Id
	@GeneratedValue
	private int id;
	private int position;
	private int height;
	private int width;
	
	@OneToMany
	private List<Shelf> shelves = new ArrayList<>();
	
	public Bookcase() {}
	
	
	public Bookcase(int position, int height, int width) {
		super();
		this.position = position;
		this.height = height;
		this.width = width;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getPosition() {
		return position;
	}
	public void setPosition(int position) {
		this.position = position;
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
