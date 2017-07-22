package comet4j;

import net.sf.json.JSONArray;
import org.comet4j.core.CometContext;
import org.comet4j.core.CometEngine;
import org.comet4j.core.event.ConnectEvent;
import org.comet4j.core.listener.ConnectListener;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.Executors;

/**
 * @author yu hongxi
 * 
 */
public class CometUtil extends ConnectListener implements ServletContextListener {
	private static final String CHANNEL = "socket";
	private static final String CHANNELORDER = "socket_for_order";
	public CometUtil() {}
	@Override
	public boolean handleEvent(ConnectEvent connectEvent) {
		return false;
	}
	public static CometUtil getInstance() {
		return new CometUtil();
	}
	public void contextInitialized(ServletContextEvent arg0) {
		System.out.println("contex");
		System.out.println("1111");
		// 开启comet4j
		CometContext cc = CometContext.getInstance();
		// 注册应用的channel
		cc.registChannel(CHANNEL);
		// 注册应用的channel
		cc.registChannel(CHANNELORDER);

		CometEngine engine = CometContext.getInstance().getEngine();
		engine.addConnectListener(this);
	}
	/**
	 * 推送给所有的客户端
	 * @param
	 */
	public void broadcastMsg(int number, String msg){
		try {
			CometEngine engine = CometContext.getInstance().getEngine();
			JSONArray obj = JSONArray.fromObject(msg);
			System.out.println("send msg for RMS:"+msg);
			//推送到所有客户端
			if(number ==1){
				engine.sendToAll(CHANNEL,obj);
			}
			if(number ==2){
				engine.sendToAll(CHANNELORDER,obj);
			}
		} catch (Exception e) {
			// TODO: handle exception
			System.out.println(e.getMessage());
		}
	}
	public void contextDestroyed(ServletContextEvent arg0) {
	}
	public void startSendMsgTo1(){
		Executors.newSingleThreadExecutor().execute(()->{
			BlockingQueue<String> agvInfos;
			while (true){
				agvInfos= AgvOperator.getInstance().getAgvinfos();
				try {
					broadcastMsg(1,agvInfos.take());
					Thread.sleep(50);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		});
	}
	public void startSendMsgTo2(){
		Executors.newSingleThreadExecutor().execute(()->{
			BlockingQueue<String> agvTaskInfos;
			while (true){
				agvTaskInfos= AgvOperator.getInstance().getAgvTaskInfos();
				try {
					broadcastMsg(2,agvTaskInfos.take());
					Thread.sleep(50);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		});
	}
}