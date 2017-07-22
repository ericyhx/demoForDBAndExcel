package com.dasun.rds.tools.dataSourceUtil;

import java.lang.annotation.*;

/**
 * Created by yuhongxi on 2017-05-24.
 */
@Target({ ElementType.METHOD, ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface DataSource {
    String value();
}
