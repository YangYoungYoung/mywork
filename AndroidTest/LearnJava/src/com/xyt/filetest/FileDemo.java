package com.xyt.filetest;

import java.io.File;
import java.io.FilenameFilter;

public class FileDemo {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		File file = new File("e:\\");
//		String[] strArry = file.list();
//		for(String str:strArry){
//			System.out.println(str);
//		}
//		File[] fileArry = file.listFiles();
//		for(File f:fileArry){
//			if(f.isFile()){
//				
//				if(f.getName().endsWith(".rar")){
//					System.out.println(f.getName());
//				}
//			}else{
//				
//			}
//		}
		
		String[] strArry = file.list(new FilenameFilter() {
			
			public boolean accept(File dir, String name) {
				File f = new File(dir,name);
				boolean flag = f.isFile();
				boolean flag1 = name.endsWith(".rar");
				
				return flag&&flag1;
			}
		});
		
		for(String s : strArry){
			System.out.println(s);
		}
	}

}
