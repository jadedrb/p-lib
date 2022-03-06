package com.project.jpa.model;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "bookcases")
public class Bookcase {
	
	@Id
	@GeneratedValue
	private int id;
	private String location;
	private int height;
	private int width;
	
	private String color;
	private int rowLow;
	private int rowHigh;
	private int colLow;
	private int colHigh;
	
	@OneToMany(cascade = CascadeType.ALL, mappedBy = "bookcase")
	private List<Shelf> shelves = new ArrayList<>();
	
	@ManyToOne
	@JsonIgnore
	private Room room;
	
	public Bookcase() {}
	
	
	public Bookcase(String location, int height, int width) {
		super();
		this.location = location;
		this.height = height;
		this.width = width;
	}
	
	
	public Room getRoom() {
		return room;
	}


	public void setRoom(Room room) {
		this.room = room;
	}


	public List<Shelf> getShelves() {
		return shelves;
	}


	public void setShelves(List<Shelf> shelves) {
		this.shelves = shelves;
	}


	public void addShelf(Shelf shelf) {
		this.shelves.add(shelf);
	}
	
	public void removeShelf(Shelf shelf) {
		this.shelves.remove(shelf);
	}
	
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getLocation() {
		return location;
	}
	public void setLocation(String location) {
		this.location = location;
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


	public String getColor() {
		return color;
	}


	public void setColor(String color) {
		this.color = color;
	}


	public int getRowLow() {
		return rowLow;
	}


	public void setRowLow(int rowLow) {
		this.rowLow = rowLow;
	}


	public int getRowHigh() {
		return rowHigh;
	}


	public void setRowHigh(int rowHigh) {
		this.rowHigh = rowHigh;
	}


	public int getColLow() {
		return colLow;
	}


	public void setColLow(int colLow) {
		this.colLow = colLow;
	}


	public int getColHigh() {
		return colHigh;
	}


	public void setColHigh(int colHigh) {
		this.colHigh = colHigh;
	}
	
	
	
	
}
