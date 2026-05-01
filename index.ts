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
          const { city, sessionId, sessionKey, userId, runId } = params;

          console.log("当前 sessionId:", sessionId, sessionKey, userId, runId);

          // 解析用户指令：提取城市和时间
          // const { city, time = '今日' } = parseUserIntent(params.content, {
          //   city: { type: 'city', required: true },
          //   time: { type: 'enum', options: ['今日', '明日', '近3天'] }
          // });

          const apiKey = '86a5249acf1ee0ee27a2a2213c9e613c'
          // 调用天气接口（合规公共接口，无风控风险）
          const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=beijing&appid=${apiKey}&units=metric&lang=zh_cn`);
          const data = await response.json();

          return {
            content: [{
            type: "text",
            text: `${city}明天天气: ${data.weather[0].description}, 温度 ${data.main.temp}°C, 湿度${data.main.humidity}%`
            },{
              type: 'text',
              text: `会话信息: sessionId=${sessionId}, sessionKey=${sessionKey}, userId=${userId}, runId=${runId}`
            }]
          };
        },
      }
    );

    // 注册 before_tool_call hook，在工具真正执行前注入上下文
    api.on("before_tool_call", async (event, ctx) => {
      if (event.toolName === "clawx_weather") {
        // ctx 中通常包含：
        // ctx.sessionId, ctx.sessionKey, ctx.agentId, ctx.runId, ctx.senderId 等
        event.params = {
          ...event.params,
          agentId: ctx.agentId,
          sessionId: ctx.sessionId,
          sessionKey: ctx.sessionKey,
          userId: ctx.senderId || ctx.userId,   // 根据实际 ctx 字段调整
          runId: ctx.runId,
          // ... 其他你需要的字段
        };
      }
      // 返回 event 或 undefined（继续流程）
    });
  },
});
