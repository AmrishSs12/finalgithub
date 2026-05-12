package com.bmtest.finalgithub.base.model;

import java.util.HashMap;
import java.util.Map;

public enum Roles {
	APP_ADMIN(1,"App Admin","71e98db4-12ee-473c-bfa7-ead6159ac3ce");

	private static final Map<String, Roles> roleNameMap = new HashMap<String, Roles>();
	static {
		for (Roles roleNameEnum : Roles.values()) {
			roleNameMap.put(roleNameEnum.getRoleName(), roleNameEnum);
		}
	}
	
	private Integer roleId;
	private String roleName;
	private String roleSid;

	Roles(Integer roleId,String roleName,String roleSid) {
		this.setRoleId(roleId);
		this.setRoleName(roleName);
		this.setRoleSid(roleSid);
	}

	public static Roles getRoleNameEnum(String roleName) {
		return roleNameMap.get(roleName);
	}

	public String getRoleName() {
		return roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}

	public String getRoleSid() {
		return roleSid;
	}

	public void setRoleSid(String roleSid) {
		this.roleSid = roleSid;
	}
	
	public Integer getRoleId() {
		return roleId;
	}

	public void setRoleId(Integer roleId) {
		this.roleId = roleId;
	}
}
