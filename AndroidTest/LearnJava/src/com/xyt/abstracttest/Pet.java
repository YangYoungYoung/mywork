package com.xyt.abstracttest;

/***
 * 抽象类
 * @author Young
 *
 */
public abstract class Pet {
	private String name ;
	private String color;

	//构造方法
	public Pet(String name, String color) {
		super();
		this.name = name;
		this.color = color;
	}
	public Pet() {
		super();
		
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getColor() {
		return color;
	}
	public void setColor(String color) {
		this.color = color;
	}
	//编写宠物吃的方法
	public abstract void eat();
}
