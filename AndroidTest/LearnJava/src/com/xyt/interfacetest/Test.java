package com.xyt.interfacetest;

public class Test {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		USB mouse = new Mouse();//构成了多态
		mouse.service();
		
		USB keyboard = new KeyBoard();
		keyboard.service();
	}

}
