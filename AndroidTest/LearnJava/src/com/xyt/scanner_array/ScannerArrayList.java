package com.xyt.scanner_array;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Scanner;

/****
 * 
 * @author Young
 * 
 */

public class ScannerArrayList {

	public static void main(String[] args) {
		Scanner scanner = new Scanner(System.in);
		ArrayList<Integer> list = new ArrayList<Integer>();
		while (true) {
			System.out.println("请输入数字：");
			int number = scanner.nextInt();
			if (number != 0) {
				list.add(number);
			} else {
				break;
			}
		}
		Integer[] i = new Integer[list.size()];
		list.toArray(i);
		
		Arrays.sort(i);
		System.out.println("数组是："+i+"数组最大值是："+i[i.length-1]);
	}
}
