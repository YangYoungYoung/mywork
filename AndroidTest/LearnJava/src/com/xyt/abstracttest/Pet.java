package com.xyt.abstracttest;

/***
 * ������
 * @author Young
 *
 */
public abstract class Pet {
	private String name ;
	private String color;

	//���췽��
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
	//��д����Եķ���
	public abstract void eat();
}
