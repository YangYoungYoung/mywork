package com.xyt.login_regist;

/****
 * 
 * ����û����в����Ľӿ�
 * @author Young
 *
 */

public interface UserDao {
	
	//��¼����
	public abstract boolean isLogin( String userName,String passWord);
	//ע�Ṧ��
	public abstract void regist(User user);
}
