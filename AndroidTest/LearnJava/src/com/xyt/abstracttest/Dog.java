package com.xyt.abstracttest;

/***
 * Dog子类继承Pet抽象父类
 * 	必须重写父类的抽象方法
 * @author Young
 *
 */
public class Dog extends Pet {
	private String strain;
	
	public Dog() {
		super();
		
	}

	public String getStrain() {
		return strain;
	}

	public void setStrain(String strain) {
		this.strain = strain;
	}

	public Dog(String name, String color) {
		super(name, color);
		
	}

	@Override
	public void eat() {
		System.out.println("狗在吃骨头。。。");
	}



}
