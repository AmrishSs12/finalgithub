package com.bmtest.finalgithub.base.model;

import java.util.HashMap;
import java.util.Map;

public enum DataModelTables {
	TABLE1("Table1"),
	APPLICATIONUSER("ApplicationUser");

	private static final Map<String, DataModelTables> displayNameMap = new HashMap<String, DataModelTables>();
	static {
		for (DataModelTables displayNameEnum : DataModelTables.values()) {
			displayNameMap.put(displayNameEnum.getDisplayName(), displayNameEnum);
		}
	}
	private String displayName;

	DataModelTables(String displayName) {
		this.displayName = displayName;
	}

	public static DataModelTables getDisplayNameEnum(String displayName) {
		return displayNameMap.get(displayName);
	}

	public String getDisplayName() {
		return displayName;
	}
}
