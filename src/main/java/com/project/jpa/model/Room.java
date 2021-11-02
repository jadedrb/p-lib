package com.project.jpa.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name="rooms")
public class Room {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public int id;
	public String name;
	public int height;
	public int width;
	
	@OneToMany
	private List<Bookcase> bookcases = new ArrayList<>();
	
	public Room() {}

	public Room(String name, int height, int weight) {
		super();
		this.name = name;
		this.height = height;
		this.width = weight;
	}

	public int getId() {
		return id;
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

	public int getWeight() {
		return width;
	}

	public void setWeight(int weight) {
		this.width = weight;
	}
	
}
