package com.xyt.abstracttest;

/***
 * Dog����̳�Pet������
 * 	������д����ĳ��󷽷�
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
		System.out.println("���ڳԹ�ͷ������");
	}



}
