package com.dasun.rds.tools.dataSourceUtil;

import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;

/**
 * Created by yuhongxi on 2017-05-24.
 */
public class DynamicDataSource extends AbstractRoutingDataSource {
    @Override
    protected Object determineCurrentLookupKey() {
        return DynamicDataSourceHandler.getDataSource();
    }
}
