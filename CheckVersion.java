import java.io.BufferedReader;
import java.io.InputStreamReader;

/**
 * 自动检测redis最新版本
 */
public class CheckVersion{
	/**
	 * 获取指定Url里面的html内容
	 * @param domain
	 * @return
	 */
	public static String getWebCon(String domain,String encoding) {
		// System.out.println("开始读取内容...("+domain+")");
		StringBuffer sb = new StringBuffer();
		try {
			java.net.URL url = new java.net.URL(domain);
			BufferedReader in = new BufferedReader(new InputStreamReader(url
					.openStream(),encoding));
			String line;
			while ((line = in.readLine()) != null) {
				sb.append(line + "\n\r");
			}
			in.close();
		} catch (Exception e) { // Report any errors that arise
			sb.append(e.toString());
			System.err.println(e);
			System.err.println("Usage:   java   HttpClient   <URL>   [<filename>]");
		}
		return sb.toString();
	}
	
	/**
	 * 解析html里面下载地址url
	 * @param html
	 * @return
	 */
	public static String getVersion(String html){
		String ver = "";
		
		String startTag = "http://download.redis.io";
		String endTag = ".tar.gz";
		
		if(html!=null && !html.isEmpty()){
			int index = html.indexOf(startTag);
			
			if(index>0){
				ver = html.substring(index);
				
				if(ver.indexOf(endTag)>0){
					ver = ver.substring(0, ver.indexOf(endTag)+endTag.length());
				}
			}
		}
		
		return ver;
	}
	
	public static String getRedisVersion(String domain){
		String html = getWebCon(domain,"UTF-8");
		return getVersion(html);
	}
	
	public static void main(String[] args) {
		String redisioVer = getRedisVersion("http://redis.io");
		String rediscnVer = getRedisVersion("http://redis.cn");
		System.out.println("redisioVer:"+redisioVer);
		System.out.println("rediscnVer:"+rediscnVer);
		
		if(!redisioVer.equals(rediscnVer)){
			
		}
	}
}

