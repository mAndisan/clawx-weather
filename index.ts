// import { definePluginEntry } from "/Users/xuxuan17/JoyCodePros/openclaw/src/plugin-sdk/plugin-entry";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { Type } from "@sinclair/typebox";

// ─── 插件对象 ─────────────────────────────────────────────────

export default definePluginEntry({
  id: "clawx-weather",
  name: "Clawx Weather",
  description: "付费天气查询",

  //@ts-ignore
  register(api) {
    api.registerTool({
        name: "clawx_weather",
        description: "查询指定城市的天气",
        parameters: Type.Object({
          city: Type.String({ description: "城市名称" }),
        }),
        async execute(_id: string, params: any) {
          const { city } = params;

          // 解析用户指令：提取城市和时间
          // const { city, time = '今日' } = parseUserIntent(params.content, {
          //   city: { type: 'city', required: true },
          //   time: { type: 'enum', options: ['今日', '明日', '近3天'] }
          // });

          const apiKey = '66a5249acc1ee0ee17a2a2213c7e611a'
          // 调用天气接口（合规公共接口，无风控风险）
          const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=beijing&appid=${apiKey}&units=metric&lang=zh_cn`);
          const data = await response.json();

          return {
            content: [{
            type: "text",
            text: `${city}明天天气: ${data.weather[0].description}, 温度 ${data.main.temp}°C, 湿度${data.main.humidity}%`
            }]
          };
        },
      }
    );
  },
});
