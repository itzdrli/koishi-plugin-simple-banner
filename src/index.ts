import { Context, Schema, h } from 'koishi'
import { } from "koishi-plugin-skia-canvas";

export const name = 'simple-banner'

export const inject = ['canvas']

export interface Config {
  backgroundColor: string;
  textColor: string;
  font: string;
}

export const Config: Schema<Config> = Schema.object({
  backgroundColor: Schema.string().default("#1e1e2e").description("背景颜色"),
  textColor: Schema.string().default("#cdd6f4").description("字体颜色"),
  font: Schema.string().default("bold 50px LXGW WenKai Mono Lite").description("字体 格式: '样式 大小 字体'"),
}).description("Simple Banner")

export const usage = `
## 本插件需要配合 koishi-plugin-skia-canvas 使用
## 更改字体前请确定 skia-canvas 已经加载了你所用的字体 (可以使用指令 "canvas" 查看)
## 字体选项的格式: '样式 大小 字体'
## 如 "bold 114px LXGW WenKai Mono Lite"
## 如遇使用问题可以前往QQ群: 957500313 讨论
`

export function apply(ctx: Context, config: Config) {
  ctx.command("banner <text:text>", "制作一个横幅")
    .action(({ session }, text) => {
      const fontSize = 50;
      const font = config.font || `bold ${fontSize}px LXGW WenKai Mono Lite`;

      let tempCanvas = ctx.canvas.createCanvas(1, 1);
      let tempContext = tempCanvas.getContext("2d");
      tempContext.font = font;
      const textWidth = tempContext.measureText(text).width;

      const padding = 20;
      const bannerHeight = fontSize + 2 * padding;
      const canvasWidth = textWidth + 2 * padding;

      let canvas = ctx.canvas.createCanvas(canvasWidth, bannerHeight);
      let context = canvas.getContext("2d");

      context.fillStyle = config.backgroundColor || "#1e1e2e";
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.font = font;
      context.fillStyle = config.textColor || "#cdd6f4";

      context.fillText(text, padding, fontSize + padding / 2);

      return h.image(context.canvas.toBuffer("image/png"), "image/png");
    });
}
