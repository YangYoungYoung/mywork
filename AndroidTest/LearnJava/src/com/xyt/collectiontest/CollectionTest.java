package com.xyt.collectiontest;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;

public class CollectionTest {

	/**Collection集合的联系
	 * @param args
	 */
	public static void main(String[] args) {
		Collection c = new ArrayList();
		c.add("123");
		c.add("456");
		c.add("789");
		c.add("654");
		c.add("987");
		
		Iterator iterator = c.iterator();
		while(iterator.hasNext()){
			System.out.println(iterator.next());
		}

	}

}
