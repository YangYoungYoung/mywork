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
			System.out.println("���������֣�");
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
		System.out.println("�����ǣ�"+i+"�������ֵ�ǣ�"+i[i.length-1]);
	}
}
