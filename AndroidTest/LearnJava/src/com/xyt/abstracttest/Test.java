package com.xyt.abstracttest;

public class Test {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
//		Dog dog = new Dog();
//		dog.eat();
		Pet pet = new Dog();
		pet.eat();
		Pet pet2 = new Cat();
		pet2.eat();
	}

}
