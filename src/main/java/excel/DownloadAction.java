package excel;

import com.dasun.rds.bean.AgvInfo;
import com.dasun.rds.tools.ExcelUtil;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

/**
 * 用于从数据库读取数据并生成excel.xlsx文件
 * @author ken
 *
 */
@Controller
@RequestMapping("/ula")
public class DownloadAction {
	public static final String[] RECORES_COLUMNS = new String[]{"Agv_ID","X坐标","Y坐标","电量"};
	 public static final String[] RECORES_FIELDS = new String[]{"id","x","y","power"};
	@RequestMapping(value="/download",method = RequestMethod.POST)
	public void download(
			@RequestParam("starttime") String starttime,
			@RequestParam("endtime") String endtime,
			@RequestParam("AGVno") String AGVno,
			HttpServletResponse response) throws IOException{

		System.out.println("下载文件:");
		System.out.println("开始的时间："+starttime);
		System.out.println("结束的时间："+endtime);
		System.out.println("AGV编号："+AGVno);
	
		List<AgvInfo> list=new ArrayList<>();
		for(int i=0;i<10000;i++){
			list.add(new AgvInfo(1+i*999,10+i*5,20+i*5,80+i));
		}
		try {
			SXSSFWorkbook workbook = new SXSSFWorkbook();
		        ExcelUtil<AgvInfo> userSheet = new ExcelUtil<AgvInfo>();
					userSheet.creatAuditSheet(workbook, "Agv任务记录", 
					        list, RECORES_COLUMNS, RECORES_FIELDS);
			response.reset();
			response.setContentType("APPLICATION/DOWNLOAD");
			String filename = "temp.xlsx";
			filename = URLEncoder.encode(filename,"UTF-8");
			response.setCharacterEncoding("UTF-8");
			response.addHeader("Content-Disposition","attachment;filename=" + filename);
			OutputStream os=response.getOutputStream();
			workbook.write(os);
			os.close();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			throw new RuntimeException("文件导出失败！"+e.getMessage());
		}
	}

}