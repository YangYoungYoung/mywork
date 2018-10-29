package com.xyt.login_regist;

/****
 * 
 * 针对用户进行操作的接口
 * @author Young
 *
 */

public interface UserDao {
	
	//登录功能
	public abstract boolean isLogin( String userName,String passWord);
	//注册功能
	public abstract void regist(User user);
}
